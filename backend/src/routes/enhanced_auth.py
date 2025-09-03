from flask import Blueprint, request, jsonify, current_app, g
from flask_jwt_extended import (
    create_access_token, create_refresh_token, jwt_required, 
    get_jwt_identity, get_jwt
)
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from marshmallow import Schema, fields, ValidationError
from datetime import datetime, timedelta
import re
import secrets

from src.models.enhanced_models import db, User, SystemLog
from src.services.enhanced_vonage_service import EnhancedVonageService
from src.services.enhanced_logging_service import LoggingService

auth_bp = Blueprint('auth', __name__)

# Initialize services
vonage_service = EnhancedVonageService()
logging_service = LoggingService()

# Validation schemas
class SignupSchema(Schema):
    phone_number = fields.Str(required=True, validate=lambda x: len(x) >= 10 and len(x) <= 15)
    plan_type = fields.Str(missing='basic', validate=lambda x: x in ['basic', 'premium'])
    email = fields.Email(missing=None)
    first_name = fields.Str(missing=None, validate=lambda x: len(x) <= 50 if x else True)
    last_name = fields.Str(missing=None, validate=lambda x: len(x) <= 50 if x else True)

class VerifyCodeSchema(Schema):
    verification_request_id = fields.Str(required=True)
    code = fields.Str(required=True, validate=lambda x: len(x) == 6 and x.isdigit())
    phone_number = fields.Str(required=True)

class LoginSchema(Schema):
    phone_number = fields.Str(required=True)
    password = fields.Str(missing=None)

# Helper functions
def validate_phone_number(phone_number):
    """Validate phone number format"""
    # Remove any non-digit characters except +
    cleaned = re.sub(r'[^\d+]', '', phone_number)
    
    # Check if it's a valid international format
    if not re.match(r'^\+?[1-9]\d{1,14}$', cleaned):
        return False, "Invalid phone number format"
    
    return True, cleaned

def create_tokens(user):
    """Create access and refresh tokens for user"""
    additional_claims = {
        'user_id': user.user_id,
        'phone_number': user.phone_number,
        'is_verified': user.is_verified,
        'plan_type': 'basic'  # This could come from user profile or onboarding session
    }
    
    access_token = create_access_token(
        identity=user.id,
        additional_claims=additional_claims
    )
    
    refresh_token = create_refresh_token(
        identity=user.id,
        additional_claims={'user_id': user.user_id}
    )
    
    return access_token, refresh_token

# Rate limiting decorators
def auth_rate_limit():
    """Rate limiting for authentication endpoints"""
    return "10 per minute"

# Routes
@auth_bp.route('/signup', methods=['POST'])
def signup():
    """
    Initiate user signup with phone verification
    Enhanced with proper validation, rate limiting, and real API integration
    """
    try:
        # Validate request data
        schema = SignupSchema()
        try:
            data = schema.load(request.get_json() or {})
        except ValidationError as err:
            logging_service.log_auth_event(
                'signup_validation_failed',
                error=str(err.messages),
                ip_address=request.remote_addr
            )
            return jsonify({
                'error': 'Validation failed',
                'details': err.messages
            }), 400
        
        # Validate and normalize phone number
        is_valid, phone_result = validate_phone_number(data['phone_number'])
        if not is_valid:
            return jsonify({'error': phone_result}), 400
        
        data['phone_number'] = phone_result
        
        # Check if user already exists
        existing_user = User.query.filter_by(phone_number=data['phone_number']).first()
        if existing_user:
            if existing_user.is_verified:
                logging_service.log_auth_event(
                    'signup_duplicate_verified',
                    user_id=existing_user.id,
                    phone_number=data['phone_number'],
                    ip_address=request.remote_addr
                )
                return jsonify({
                    'error': 'User already exists',
                    'message': 'This phone number is already registered and verified'
                }), 409
            else:
                # User exists but not verified, allow re-verification
                user = existing_user
        else:
            # Create new user
            user = User(
                phone_number=data['phone_number'],
                email=data.get('email'),
                first_name=data.get('first_name'),
                last_name=data.get('last_name')
            )
            db.session.add(user)
        
        # Check verification attempt limits
        if not user.can_attempt_verification():
            logging_service.log_auth_event(
                'signup_rate_limited',
                user_id=user.id,
                phone_number=data['phone_number'],
                ip_address=request.remote_addr
            )
            return jsonify({
                'error': 'Too many verification attempts',
                'message': 'Please wait before requesting another verification code'
            }), 429
        
        # Send verification code via Vonage
        verification_result = vonage_service.send_verification(
            phone_number=data['phone_number'],
            brand='OnboardIQ Enhanced'
        )
        
        if not verification_result['success']:
            logging_service.log_auth_event(
                'signup_verification_send_failed',
                user_id=user.id,
                phone_number=data['phone_number'],
                error=verification_result.get('error'),
                ip_address=request.remote_addr
            )
            return jsonify({
                'error': 'Verification failed',
                'message': verification_result.get('error', 'Could not send verification code')
            }), 500
        
        # Update user verification tracking
        user.verification_attempts += 1
        user.last_verification_attempt = datetime.utcnow()
        
        try:
            db.session.commit()
            
            logging_service.log_auth_event(
                'signup_verification_sent',
                user_id=user.id,
                phone_number=data['phone_number'],
                verification_request_id=verification_result.get('request_id'),
                ip_address=request.remote_addr
            )
            
            return jsonify({
                'success': True,
                'verification_request_id': verification_result.get('request_id'),
                'user_id': user.user_id,
                'message': 'Verification code sent to your phone',
                'expires_in': 300  # 5 minutes
            }), 200
            
        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f"Database error during signup: {e}")
            return jsonify({'error': 'Database error occurred'}), 500
        
    except Exception as e:
        current_app.logger.error(f"Unexpected error during signup: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@auth_bp.route('/verify-code', methods=['POST'])
def verify_code():
    """
    Verify the SMS code and complete user registration
    Enhanced with proper validation and token generation
    """
    try:
        # Validate request data
        schema = VerifyCodeSchema()
        try:
            data = schema.load(request.get_json() or {})
        except ValidationError as err:
            return jsonify({
                'error': 'Validation failed',
                'details': err.messages
            }), 400
        
        # Find user by phone number
        user = User.query.filter_by(phone_number=data['phone_number']).first()
        if not user:
            logging_service.log_auth_event(
                'verify_code_user_not_found',
                phone_number=data['phone_number'],
                ip_address=request.remote_addr
            )
            return jsonify({'error': 'User not found'}), 404
        
        # Verify code with Vonage
        verification_result = vonage_service.verify_code(
            request_id=data['verification_request_id'],
            code=data['code']
        )
        
        if not verification_result['success']:
            logging_service.log_auth_event(
                'verify_code_failed',
                user_id=user.id,
                phone_number=data['phone_number'],
                error=verification_result.get('error'),
                ip_address=request.remote_addr
            )
            return jsonify({
                'success': False,
                'error': 'Invalid verification code',
                'message': verification_result.get('error', 'The verification code is incorrect or expired')
            }), 400
        
        # Update user as verified
        user.is_verified = True
        user.verification_attempts = 0  # Reset attempts after successful verification
        user.last_login = datetime.utcnow()
        
        try:
            db.session.commit()
            
            # Create JWT tokens
            access_token, refresh_token = create_tokens(user)
            
            logging_service.log_auth_event(
                'verify_code_success',
                user_id=user.id,
                phone_number=data['phone_number'],
                ip_address=request.remote_addr
            )
            
            return jsonify({
                'success': True,
                'message': 'Phone number verified successfully',
                'user': user.to_dict(),
                'tokens': {
                    'access_token': access_token,
                    'refresh_token': refresh_token,
                    'token_type': 'Bearer',
                    'expires_in': int(current_app.config['JWT_ACCESS_TOKEN_EXPIRES'].total_seconds())
                }
            }), 200
            
        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f"Database error during verification: {e}")
            return jsonify({'error': 'Database error occurred'}), 500
        
    except Exception as e:
        current_app.logger.error(f"Unexpected error during verification: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Login with phone number (and optional password for future use)
    """
    try:
        # Validate request data
        schema = LoginSchema()
        try:
            data = schema.load(request.get_json() or {})
        except ValidationError as err:
            return jsonify({
                'error': 'Validation failed',
                'details': err.messages
            }), 400
        
        # Find user by phone number
        user = User.query.filter_by(phone_number=data['phone_number']).first()
        if not user or not user.is_verified:
            logging_service.log_auth_event(
                'login_failed_user_not_found',
                phone_number=data['phone_number'],
                ip_address=request.remote_addr
            )
            return jsonify({
                'error': 'Authentication failed',
                'message': 'Invalid phone number or user not verified'
            }), 401
        
        if not user.is_active:
            logging_service.log_auth_event(
                'login_failed_account_disabled',
                user_id=user.id,
                phone_number=data['phone_number'],
                ip_address=request.remote_addr
            )
            return jsonify({
                'error': 'Account disabled',
                'message': 'Your account has been disabled. Please contact support.'
            }), 403
        
        # For now, we'll allow login with just phone number verification
        # In the future, password authentication can be added here
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        # Create JWT tokens
        access_token, refresh_token = create_tokens(user)
        
        logging_service.log_auth_event(
            'login_success',
            user_id=user.id,
            phone_number=data['phone_number'],
            ip_address=request.remote_addr
        )
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'user': user.to_dict(),
            'tokens': {
                'access_token': access_token,
                'refresh_token': refresh_token,
                'token_type': 'Bearer',
                'expires_in': int(current_app.config['JWT_ACCESS_TOKEN_EXPIRES'].total_seconds())
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Unexpected error during login: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """
    Refresh access token using refresh token
    """
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or not user.is_active:
            return jsonify({'error': 'User not found or inactive'}), 404
        
        # Create new access token
        access_token, _ = create_tokens(user)
        
        logging_service.log_auth_event(
            'token_refreshed',
            user_id=user.id,
            ip_address=request.remote_addr
        )
        
        return jsonify({
            'access_token': access_token,
            'token_type': 'Bearer',
            'expires_in': int(current_app.config['JWT_ACCESS_TOKEN_EXPIRES'].total_seconds())
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error refreshing token: {e}")
        return jsonify({'error': 'Token refresh failed'}), 500

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """
    Logout user (in a full implementation, this would blacklist the token)
    """
    try:
        current_user_id = get_jwt_identity()
        
        logging_service.log_auth_event(
            'logout',
            user_id=current_user_id,
            ip_address=request.remote_addr
        )
        
        return jsonify({
            'success': True,
            'message': 'Logged out successfully'
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error during logout: {e}")
        return jsonify({'error': 'Logout failed'}), 500

@auth_bp.route('/status', methods=['GET'])
@jwt_required()
def auth_status():
    """
    Get current authentication status
    """
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        jwt_claims = get_jwt()
        
        return jsonify({
            'authenticated': True,
            'user': user.to_dict(),
            'token_info': {
                'expires_at': jwt_claims.get('exp'),
                'issued_at': jwt_claims.get('iat'),
                'user_id': jwt_claims.get('user_id'),
                'is_verified': jwt_claims.get('is_verified')
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error checking auth status: {e}")
        return jsonify({'error': 'Status check failed'}), 500

@auth_bp.route('/resend-verification', methods=['POST'])
def resend_verification():
    """
    Resend verification code for unverified users
    """
    try:
        data = request.get_json() or {}
        phone_number = data.get('phone_number')
        
        if not phone_number:
            return jsonify({'error': 'Phone number is required'}), 400
        
        # Validate phone number
        is_valid, phone_result = validate_phone_number(phone_number)
        if not is_valid:
            return jsonify({'error': phone_result}), 400
        
        # Find user
        user = User.query.filter_by(phone_number=phone_result).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        if user.is_verified:
            return jsonify({'error': 'User already verified'}), 400
        
        # Check rate limiting
        if not user.can_attempt_verification():
            return jsonify({
                'error': 'Too many attempts',
                'message': 'Please wait before requesting another verification code'
            }), 429
        
        # Send new verification code
        verification_result = vonage_service.send_verification(
            phone_number=phone_result,
            brand='OnboardIQ Enhanced'
        )
        
        if not verification_result['success']:
            return jsonify({
                'error': 'Verification failed',
                'message': verification_result.get('error', 'Could not send verification code')
            }), 500
        
        # Update user
        user.verification_attempts += 1
        user.last_verification_attempt = datetime.utcnow()
        db.session.commit()
        
        logging_service.log_auth_event(
            'verification_resent',
            user_id=user.id,
            phone_number=phone_result,
            verification_request_id=verification_result.get('request_id'),
            ip_address=request.remote_addr
        )
        
        return jsonify({
            'success': True,
            'verification_request_id': verification_result.get('request_id'),
            'message': 'Verification code resent',
            'expires_in': 300
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error resending verification: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

