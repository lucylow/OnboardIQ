from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import Schema, fields, ValidationError
from datetime import datetime

from src.models.enhanced_models import db, User, OnboardingSession
from src.services.enhanced_vonage_service import EnhancedVonageService
from src.services.ai_personalization_service import AIPersonalizationService
from src.services.enhanced_logging_service import LoggingService

onboarding_bp = Blueprint('onboarding', __name__)

# Initialize services
vonage_service = EnhancedVonageService()
ai_service = AIPersonalizationService()
logging_service = LoggingService()

# Validation schemas
class StartOnboardingSchema(Schema):
    plan_type = fields.Str(missing='basic', validate=lambda x: x in ['basic', 'premium'])

@onboarding_bp.route('/start', methods=['POST'])
@jwt_required()
def start_onboarding():
    """
    Start the onboarding process for a verified user with AI personalization
    """
    try:
        # Validate request
        schema = StartOnboardingSchema()
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
        
        if not user.is_verified:
            return jsonify({'error': 'User must be verified to start onboarding'}), 400
        
        # Check if user already has an active onboarding session
        existing_session = OnboardingSession.query.filter_by(
            user_id=user.id,
            status='in_progress'
        ).first()
        
        if existing_session:
            return jsonify({
                'success': True,
                'session': existing_session.to_dict(),
                'message': 'Existing onboarding session found'
            }), 200
        
        # Generate AI-powered personalized onboarding flow
        personalization_result = ai_service.generate_personalized_onboarding_flow(
            user=user,
            plan_type=data['plan_type']
        )
        
        # Create new onboarding session
        onboarding_session = OnboardingSession(
            user_id=user.id,
            plan_type=data['plan_type'],
            status='in_progress',
            ai_recommendations=personalization_result.get('personalization_data', {}),
            personalization_score=personalization_result.get('personalization_data', {}).get('personalization_score', 0)
        )
        
        # Set total steps based on AI recommendations
        recommended_steps = personalization_result.get('personalization_data', {}).get('recommended_steps', [])
        onboarding_session.total_steps = len(recommended_steps)
        
        db.session.add(onboarding_session)
        db.session.commit()
        
        logging_service.log_onboarding_event(
            'onboarding_started',
            user_id=user.id,
            session_id=onboarding_session.session_id,
            plan_type=data['plan_type'],
            personalization_score=onboarding_session.personalization_score,
            ip_address=request.remote_addr
        )
        
        return jsonify({
            'success': True,
            'session': onboarding_session.to_dict(),
            'ai_recommendations': personalization_result.get('personalization_data', {}),
            'message': f'Personalized onboarding started for {data["plan_type"]} plan'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error starting onboarding: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@onboarding_bp.route('/video-session', methods=['POST'])
@jwt_required()
def create_video_session():
    """
    Create a Vonage Video session for personalized onboarding
    """
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get active onboarding session
        onboarding_session = OnboardingSession.query.filter_by(
            user_id=user.id,
            status='in_progress'
        ).first()
        
        if not onboarding_session:
            return jsonify({'error': 'No active onboarding session found'}), 404
        
        # Create video session using Vonage
        video_result = vonage_service.create_video_session(user.user_id)
        
        if video_result['success']:
            # Update onboarding session with video details
            onboarding_session.video_session_id = video_result['session_id']
            onboarding_session.video_token = video_result['token']
            onboarding_session.add_completed_step('video_session_created')
            
            db.session.commit()
            
            logging_service.log_onboarding_event(
                'video_session_created',
                user_id=user.id,
                session_id=onboarding_session.session_id,
                video_session_id=video_result['session_id'],
                ip_address=request.remote_addr
            )
            
            return jsonify({
                'success': True,
                'video_session': {
                    'session_id': video_result['session_id'],
                    'token': video_result['token'],
                    'api_key': video_result['api_key']
                },
                'message': 'Video session created successfully'
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': video_result.get('error', 'Failed to create video session')
            }), 500
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error creating video session: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@onboarding_bp.route('/send-sms', methods=['POST'])
@jwt_required()
def send_sms():
    """
    Send AI-optimized SMS notifications during onboarding
    """
    try:
        data = request.get_json() or {}
        message_type = data.get('message_type', 'welcome')
        
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get active onboarding session
        onboarding_session = OnboardingSession.query.filter_by(
            user_id=user.id,
            status='in_progress'
        ).first()
        
        if not onboarding_session:
            return jsonify({'error': 'No active onboarding session found'}), 404
        
        # Generate AI-optimized SMS content
        ai_content_result = ai_service.generate_smart_communication_content(
            user=user,
            communication_type='sms',
            context={
                'plan_type': onboarding_session.plan_type,
                'current_step': onboarding_session.current_step,
                'message_type': message_type
            }
        )
        
        if ai_content_result['success']:
            message_content = ai_content_result['content'].get('message', f'Hi {user.first_name or "there"}! Welcome to OnboardIQ.')
        else:
            message_content = f'Hi {user.first_name or "there"}! Welcome to OnboardIQ.'
        
        # Send SMS using Vonage
        sms_result = vonage_service.send_sms(
            phone_number=user.phone_number,
            message=message_content
        )
        
        if sms_result['success']:
            onboarding_session.add_completed_step('sms_sent')
            db.session.commit()
            
            logging_service.log_communication_event(
                'sms_sent',
                user_id=user.id,
                communication_type='sms',
                message_id=sms_result.get('message_id'),
                message_content=message_content,
                ip_address=request.remote_addr
            )
            
            return jsonify({
                'success': True,
                'message_id': sms_result['message_id'],
                'content': message_content,
                'message': 'SMS sent successfully'
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': sms_result.get('error', 'Failed to send SMS')
            }), 500
        
    except Exception as e:
        current_app.logger.error(f"Error sending SMS: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@onboarding_bp.route('/status', methods=['GET'])
@jwt_required()
def get_onboarding_status():
    """
    Get onboarding status for current user with AI insights
    """
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get most recent onboarding session
        onboarding_session = OnboardingSession.query.filter_by(
            user_id=user.id
        ).order_by(OnboardingSession.created_at.desc()).first()
        
        if not onboarding_session:
            return jsonify({
                'user_id': user.user_id,
                'status': 'not_started',
                'message': 'No onboarding session found'
            }), 200
        
        # Get AI behavior analysis if session is active
        ai_analysis = None
        if onboarding_session.status == 'in_progress':
            analysis_result = ai_service.analyze_user_behavior(user, onboarding_session)
            if analysis_result['success']:
                ai_analysis = analysis_result['analysis']
        
        response_data = {
            'user_id': user.user_id,
            'session': onboarding_session.to_dict(),
            'ai_analysis': ai_analysis
        }
        
        return jsonify(response_data), 200
        
    except Exception as e:
        current_app.logger.error(f"Error fetching onboarding status: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@onboarding_bp.route('/complete-step', methods=['POST'])
@jwt_required()
def complete_step():
    """
    Mark an onboarding step as completed
    """
    try:
        data = request.get_json() or {}
        step_name = data.get('step_name')
        
        if not step_name:
            return jsonify({'error': 'Step name is required'}), 400
        
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get active onboarding session
        onboarding_session = OnboardingSession.query.filter_by(
            user_id=user.id,
            status='in_progress'
        ).first()
        
        if not onboarding_session:
            return jsonify({'error': 'No active onboarding session found'}), 404
        
        # Mark step as completed
        onboarding_session.add_completed_step(step_name)
        db.session.commit()
        
        logging_service.log_onboarding_event(
            'step_completed',
            user_id=user.id,
            session_id=onboarding_session.session_id,
            step_name=step_name,
            progress_percentage=onboarding_session.get_progress_percentage(),
            ip_address=request.remote_addr
        )
        
        return jsonify({
            'success': True,
            'session': onboarding_session.to_dict(),
            'message': f'Step "{step_name}" completed successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error completing step: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

