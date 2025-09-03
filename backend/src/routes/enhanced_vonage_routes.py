from flask import Blueprint, request, jsonify, current_app, g
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import Schema, fields, ValidationError
from datetime import datetime, timedelta
import re

from src.models.enhanced_models import db, User, SystemLog
from src.services.enhanced_vonage_service import EnhancedVonageService
from src.services.enhanced_logging_service import LoggingService

vonage_bp = Blueprint('vonage', __name__)

# Initialize services
vonage_service = EnhancedVonageService()
logging_service = LoggingService()

# Validation schemas
class StartVerificationSchema(Schema):
    phone_number = fields.Str(required=True, validate=lambda x: len(x) >= 10 and len(x) <= 15)
    brand = fields.Str(missing='OnboardIQ')
    code_length = fields.Int(missing=6, validate=lambda x: 4 <= x <= 10)
    workflow_id = fields.Int(missing=6)

class CheckVerificationSchema(Schema):
    request_id = fields.Str(required=True)
    code = fields.Str(required=True, validate=lambda x: len(x) >= 4 and len(x) <= 10 and x.isdigit())

class SendSMSSchema(Schema):
    to = fields.Str(required=True, validate=lambda x: len(x) >= 10 and len(x) <= 15)
    text = fields.Str(required=True, validate=lambda x: len(x) <= 160)
    from_number = fields.Str(missing='OnboardIQ')

class CreateVideoSessionSchema(Schema):
    user_id = fields.Str(required=True)
    session_type = fields.Str(missing='routed')
    media_mode = fields.Str(missing='routed')

class CheckSimSwapSchema(Schema):
    phone_number = fields.Str(required=True, validate=lambda x: len(x) >= 10 and len(x) <= 15)
    max_age = fields.Int(missing=240)

# Helper functions
def validate_phone_number(phone_number):
    """Validate phone number format"""
    # Remove any non-digit characters except +
    cleaned = re.sub(r'[^\d+]', '', phone_number)
    
    # Check if it's a valid international format
    if not re.match(r'^\+?[1-9]\d{1,14}$', cleaned):
        return False, "Invalid phone number format"
    
    return True, cleaned

# ============ Vonage Verify API Routes ============

@vonage_bp.route('/start-verification', methods=['POST'])
def start_verification():
    """
    Start verification: send a PIN to user's phone
    Equivalent to Node.js /start-verification endpoint
    """
    try:
        # Validate request data
        schema = StartVerificationSchema()
        try:
            data = schema.load(request.get_json() or {})
        except ValidationError as err:
            return jsonify({
                'error': 'Validation failed',
                'details': err.messages
            }), 400
        
        # Validate and normalize phone number
        is_valid, phone_result = validate_phone_number(data['phone_number'])
        if not is_valid:
            return jsonify({'error': phone_result}), 400
        
        # Send verification via Vonage
        verification_result = vonage_service.send_verification(
            phone_number=phone_result,
            brand=data['brand'],
            code_length=data['code_length'],
            workflow_id=data['workflow_id']
        )
        
        if not verification_result['success']:
            logging_service.log_auth_event(
                'vonage_verification_start_failed',
                phone_number=phone_result,
                error=verification_result.get('error'),
                ip_address=request.remote_addr
            )
            return jsonify({
                'error': 'Verification request failed',
                'details': verification_result.get('error')
            }), 500
        
        logging_service.log_auth_event(
            'vonage_verification_started',
            phone_number=phone_result,
            request_id=verification_result.get('request_id'),
            ip_address=request.remote_addr
        )
        
        return jsonify({
            'requestId': verification_result.get('request_id'),
            'status': verification_result.get('status'),
            'estimated_cost': verification_result.get('estimated_cost'),
            'remaining_balance': verification_result.get('remaining_balance'),
            'message': 'Verification code sent successfully'
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Unexpected error during verification start: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@vonage_bp.route('/check-verification', methods=['POST'])
def check_verification():
    """
    Check verification code entered by user
    Equivalent to Node.js /check-verification endpoint
    """
    try:
        # Validate request data
        schema = CheckVerificationSchema()
        try:
            data = schema.load(request.get_json() or {})
        except ValidationError as err:
            return jsonify({
                'error': 'Validation failed',
                'details': err.messages
            }), 400
        
        # Verify code with Vonage
        verification_result = vonage_service.verify_code(
            request_id=data['request_id'],
            code=data['code']
        )
        
        if not verification_result['success']:
            logging_service.log_auth_event(
                'vonage_verification_check_failed',
                request_id=data['request_id'],
                error=verification_result.get('error'),
                ip_address=request.remote_addr
            )
            return jsonify({
                'verified': False,
                'status': verification_result.get('status'),
                'errorText': verification_result.get('error')
            }), 400
        
        logging_service.log_auth_event(
            'vonage_verification_successful',
            request_id=data['request_id'],
            event_id=verification_result.get('event_id'),
            ip_address=request.remote_addr
        )
        
        return jsonify({
            'verified': True,
            'status': verification_result.get('status'),
            'event_id': verification_result.get('event_id'),
            'price': verification_result.get('price'),
            'currency': verification_result.get('currency'),
            'message': 'Verification successful'
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Unexpected error during verification check: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@vonage_bp.route('/cancel-verification', methods=['POST'])
def cancel_verification():
    """
    Cancel an ongoing verification request
    """
    try:
        data = request.get_json() or {}
        request_id = data.get('request_id')
        
        if not request_id:
            return jsonify({'error': 'Request ID is required'}), 400
        
        # Cancel verification via Vonage
        cancel_result = vonage_service.cancel_verification(request_id)
        
        if not cancel_result['success']:
            return jsonify({
                'error': 'Verification cancellation failed',
                'details': cancel_result.get('error')
            }), 500
        
        logging_service.log_auth_event(
            'vonage_verification_cancelled',
            request_id=request_id,
            ip_address=request.remote_addr
        )
        
        return jsonify({
            'success': True,
            'status': cancel_result.get('status'),
            'message': 'Verification cancelled successfully'
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Unexpected error during verification cancellation: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

# ============ Vonage Video API Routes ============

@vonage_bp.route('/create-video-session', methods=['POST'])
@jwt_required()
def create_video_session():
    """
    Create video session and generate token for user onboarding
    Equivalent to Node.js /create-video-session endpoint
    """
    try:
        # Validate request data
        schema = CreateVideoSessionSchema()
        try:
            data = schema.load(request.get_json() or {})
        except ValidationError as err:
            return jsonify({
                'error': 'Validation failed',
                'details': err.messages
            }), 400
        
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Create video session via Vonage
        session_result = vonage_service.create_video_session(
            user_id=data['user_id'],
            session_type=data['session_type'],
            media_mode=data['media_mode']
        )
        
        if not session_result['success']:
            logging_service.log_auth_event(
                'vonage_video_session_creation_failed',
                user_id=current_user_id,
                error=session_result.get('error'),
                ip_address=request.remote_addr
            )
            return jsonify({
                'error': 'Could not create video session',
                'details': session_result.get('error')
            }), 500
        
        logging_service.log_auth_event(
            'vonage_video_session_created',
            user_id=current_user_id,
            session_id=session_result.get('session_id'),
            ip_address=request.remote_addr
        )
        
        return jsonify({
            'sessionId': session_result.get('session_id'),
            'token': session_result.get('token'),
            'api_key': session_result.get('api_key'),
            'message': 'Video session created successfully'
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Unexpected error during video session creation: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

# ============ Vonage SMS API Routes ============

@vonage_bp.route('/send-sms', methods=['POST'])
@jwt_required()
def send_sms():
    """
    Send follow-up SMS message to user
    Equivalent to Node.js /send-sms endpoint
    """
    try:
        # Validate request data
        schema = SendSMSSchema()
        try:
            data = schema.load(request.get_json() or {})
        except ValidationError as err:
            return jsonify({
                'error': 'Validation failed',
                'details': err.messages
            }), 400
        
        # Validate and normalize phone number
        is_valid, phone_result = validate_phone_number(data['to'])
        if not is_valid:
            return jsonify({'error': phone_result}), 400
        
        # Send SMS via Vonage
        sms_result = vonage_service.send_sms(
            phone_number=phone_result,
            message=data['text'],
            sender_id=data['from_number']
        )
        
        if not sms_result['success']:
            logging_service.log_auth_event(
                'vonage_sms_send_failed',
                phone_number=phone_result,
                error=sms_result.get('error'),
                ip_address=request.remote_addr
            )
            return jsonify({
                'error': 'SMS sending failed',
                'details': sms_result.get('error')
            }), 500
        
        logging_service.log_auth_event(
            'vonage_sms_sent',
            phone_number=phone_result,
            message_id=sms_result.get('message_id'),
            ip_address=request.remote_addr
        )
        
        return jsonify({
            'message': 'SMS sent',
            'data': {
                'message_id': sms_result.get('message_id'),
                'remaining_balance': sms_result.get('remaining_balance'),
                'message_price': sms_result.get('message_price'),
                'status': sms_result.get('status')
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Unexpected error during SMS sending: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

# ============ Vonage Number Insights & SIM Swap API Routes ============

@vonage_bp.route('/check-sim-swap', methods=['POST'])
@jwt_required()
def check_sim_swap():
    """
    Check if phone number SIM swapped
    Equivalent to Node.js /check-sim-swap endpoint
    """
    try:
        # Validate request data
        schema = CheckSimSwapSchema()
        try:
            data = schema.load(request.get_json() or {})
        except ValidationError as err:
            return jsonify({
                'error': 'Validation failed',
                'details': err.messages
            }), 400
        
        # Validate and normalize phone number
        is_valid, phone_result = validate_phone_number(data['phone_number'])
        if not is_valid:
            return jsonify({'error': phone_result}), 400
        
        # Check SIM swap via Vonage
        sim_swap_result = vonage_service.check_sim_swap(
            phone_number=phone_result,
            max_age=data['max_age']
        )
        
        if not sim_swap_result['success']:
            logging_service.log_auth_event(
                'vonage_sim_swap_check_failed',
                phone_number=phone_result,
                error=sim_swap_result.get('error'),
                ip_address=request.remote_addr
            )
            return jsonify({
                'error': 'Number insights failed',
                'details': sim_swap_result.get('error')
            }), 500
        
        logging_service.log_auth_event(
            'vonage_sim_swap_checked',
            phone_number=phone_result,
            sim_swap_detected=sim_swap_result.get('sim_swap_detected'),
            ip_address=request.remote_addr
        )
        
        return jsonify({
            'numberInfo': {
                'sim_swap_detected': sim_swap_result.get('sim_swap_detected'),
                'last_swap_date': sim_swap_result.get('last_swap_date'),
                'carrier_info': sim_swap_result.get('carrier_info'),
                'roaming_status': sim_swap_result.get('roaming_status'),
                'max_age_hours': sim_swap_result.get('max_age_hours')
            },
            'isSimSwapped': sim_swap_result.get('sim_swap_detected', False)
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Unexpected error during SIM swap check: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@vonage_bp.route('/number-insights', methods=['POST'])
@jwt_required()
def get_number_insights():
    """
    Get detailed phone number insights
    """
    try:
        data = request.get_json() or {}
        phone_number = data.get('phone_number')
        insight_level = data.get('insight_level', 'basic')
        
        if not phone_number:
            return jsonify({'error': 'Phone number is required'}), 400
        
        # Validate and normalize phone number
        is_valid, phone_result = validate_phone_number(phone_number)
        if not is_valid:
            return jsonify({'error': phone_result}), 400
        
        # Get number insights via Vonage
        insights_result = vonage_service.get_number_insights(
            phone_number=phone_result,
            insight_level=insight_level
        )
        
        if not insights_result['success']:
            return jsonify({
                'error': 'Number insights failed',
                'details': insights_result.get('error')
            }), 500
        
        return jsonify({
            'success': True,
            'insights': insights_result,
            'message': 'Number insights retrieved successfully'
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Unexpected error during number insights: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

# ============ Enhanced Onboarding SMS Routes ============

@vonage_bp.route('/send-onboarding-sms', methods=['POST'])
@jwt_required()
def send_onboarding_sms():
    """
    Send personalized onboarding SMS messages
    """
    try:
        data = request.get_json() or {}
        phone_number = data.get('phone_number')
        user_name = data.get('user_name', 'User')
        step_number = data.get('step_number', 1)
        total_steps = data.get('total_steps', 5)
        
        if not phone_number:
            return jsonify({'error': 'Phone number is required'}), 400
        
        # Validate and normalize phone number
        is_valid, phone_result = validate_phone_number(phone_number)
        if not is_valid:
            return jsonify({'error': phone_result}), 400
        
        # Send onboarding SMS via Vonage
        sms_result = vonage_service.send_onboarding_sms(
            phone_number=phone_result,
            user_name=user_name,
            step_number=step_number,
            total_steps=total_steps
        )
        
        if not sms_result['success']:
            return jsonify({
                'error': 'Onboarding SMS failed',
                'details': sms_result.get('error')
            }), 500
        
        logging_service.log_auth_event(
            'vonage_onboarding_sms_sent',
            phone_number=phone_result,
            user_name=user_name,
            step_number=step_number,
            ip_address=request.remote_addr
        )
        
        return jsonify({
            'success': True,
            'message': 'Onboarding SMS sent successfully',
            'step_number': step_number,
            'total_steps': total_steps
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Unexpected error during onboarding SMS: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@vonage_bp.route('/send-welcome-video-invite', methods=['POST'])
@jwt_required()
def send_welcome_video_invite():
    """
    Send SMS invitation for welcome video call
    """
    try:
        data = request.get_json() or {}
        phone_number = data.get('phone_number')
        user_name = data.get('user_name', 'User')
        session_id = data.get('session_id')
        
        if not phone_number or not session_id:
            return jsonify({'error': 'Phone number and session ID are required'}), 400
        
        # Validate and normalize phone number
        is_valid, phone_result = validate_phone_number(phone_number)
        if not is_valid:
            return jsonify({'error': phone_result}), 400
        
        # Send video invite SMS via Vonage
        sms_result = vonage_service.send_welcome_video_invite(
            phone_number=phone_result,
            user_name=user_name,
            session_id=session_id
        )
        
        if not sms_result['success']:
            return jsonify({
                'error': 'Video invite SMS failed',
                'details': sms_result.get('error')
            }), 500
        
        logging_service.log_auth_event(
            'vonage_video_invite_sent',
            phone_number=phone_result,
            user_name=user_name,
            session_id=session_id,
            ip_address=request.remote_addr
        )
        
        return jsonify({
            'success': True,
            'message': 'Video invite SMS sent successfully',
            'session_id': session_id
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Unexpected error during video invite SMS: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

# ============ Account Management Routes ============

@vonage_bp.route('/account-balance', methods=['GET'])
@jwt_required()
def get_account_balance():
    """
    Get Vonage account balance
    """
    try:
        balance_result = vonage_service.get_account_balance()
        
        if not balance_result['success']:
            return jsonify({
                'error': 'Failed to get account balance',
                'details': balance_result.get('error')
            }), 500
        
        return jsonify({
            'success': True,
            'balance': balance_result.get('balance'),
            'currency': balance_result.get('currency'),
            'auto_reload': balance_result.get('auto_reload'),
            'message': 'Account balance retrieved successfully'
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Unexpected error during balance check: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@vonage_bp.route('/pricing', methods=['POST'])
@jwt_required()
def get_pricing():
    """
    Get pricing information for services
    """
    try:
        data = request.get_json() or {}
        country_code = data.get('country_code', 'US')
        service_type = data.get('service_type', 'sms')
        
        pricing_result = vonage_service.get_pricing(
            country_code=country_code,
            service_type=service_type
        )
        
        if not pricing_result['success']:
            return jsonify({
                'error': 'Failed to get pricing information',
                'details': pricing_result.get('error')
            }), 500
        
        return jsonify({
            'success': True,
            'pricing': pricing_result,
            'message': 'Pricing information retrieved successfully'
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Unexpected error during pricing check: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500
