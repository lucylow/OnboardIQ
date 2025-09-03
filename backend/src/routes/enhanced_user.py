from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import Schema, fields, ValidationError
from datetime import datetime

from src.models.enhanced_models import db, User
from src.services.enhanced_logging_service import LoggingService

user_bp = Blueprint('users', __name__)
logging_service = LoggingService()

# Validation schemas
class UpdateProfileSchema(Schema):
    first_name = fields.Str(missing=None, validate=lambda x: len(x) <= 50 if x else True)
    last_name = fields.Str(missing=None, validate=lambda x: len(x) <= 50 if x else True)
    email = fields.Email(missing=None)

@user_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """
    Get current user profile
    """
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'success': True,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error fetching user profile: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@user_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """
    Update current user profile
    """
    try:
        # Validate request
        schema = UpdateProfileSchema()
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
        
        # Update user profile
        if data.get('first_name') is not None:
            user.first_name = data['first_name']
        if data.get('last_name') is not None:
            user.last_name = data['last_name']
        if data.get('email') is not None:
            user.email = data['email']
        
        user.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        logging_service.log_auth_event(
            'profile_updated',
            user_id=user.id,
            updated_fields=list(data.keys()),
            ip_address=request.remote_addr
        )
        
        return jsonify({
            'success': True,
            'message': 'Profile updated successfully',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error updating user profile: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

