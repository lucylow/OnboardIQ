from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import Schema, fields, ValidationError
from datetime import datetime

from src.models.enhanced_models import db, User, OnboardingSession, AIInteraction
from src.services.ai_personalization_service import AIPersonalizationService
from src.services.ai_chatbot_service import AIChatbotService
from src.services.enhanced_logging_service import LoggingService

ai_bp = Blueprint('ai', __name__)

# Initialize services
ai_personalization = AIPersonalizationService()
ai_chatbot = AIChatbotService()
logging_service = LoggingService()

# Validation schemas
class PersonalizationRequestSchema(Schema):
    plan_type = fields.Str(missing='basic', validate=lambda x: x in ['basic', 'premium'])
    context = fields.Dict(missing=dict)

class CommunicationOptimizationSchema(Schema):
    communication_type = fields.Str(required=True, validate=lambda x: x in ['sms', 'email', 'push', 'voice'])
    context = fields.Dict(missing=dict)

class BehaviorAnalysisSchema(Schema):
    session_id = fields.Str(required=True)
    additional_context = fields.Dict(missing=dict)

class FraudDetectionSchema(Schema):
    context = fields.Dict(required=True)

class ChatbotRequestSchema(Schema):
    message = fields.Str(required=True, validate=lambda x: len(x) <= 1000)
    conversation_id = fields.Str(missing=None)
    context = fields.Dict(missing=dict)

# Routes
@ai_bp.route('/personalize-onboarding', methods=['POST'])
@jwt_required()
def personalize_onboarding():
    """
    Generate AI-powered personalized onboarding flow for the current user
    """
    try:
        # Validate request
        schema = PersonalizationRequestSchema()
        try:
            data = schema.load(request.get_json() or {})
        except ValidationError as err:
            return jsonify({
                'error': 'Validation failed',
                'details': err.messages
            }), 400
        
        # Get current user
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Generate personalized onboarding flow
        result = ai_personalization.generate_personalized_onboarding_flow(
            user=user,
            plan_type=data['plan_type']
        )
        
        if result['success']:
            logging_service.log_ai_event(
                'personalization_generated',
                user_id=user.id,
                interaction_id=result.get('interaction_id'),
                processing_time_ms=result.get('processing_time_ms'),
                ip_address=request.remote_addr
            )
            
            return jsonify({
                'success': True,
                'personalization': result['personalization_data'],
                'processing_time_ms': result['processing_time_ms'],
                'interaction_id': result['interaction_id']
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': result.get('error'),
                'fallback_data': result.get('fallback_data')
            }), 500
        
    except Exception as e:
        current_app.logger.error(f"AI personalization error: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@ai_bp.route('/optimize-communication', methods=['POST'])
@jwt_required()
def optimize_communication():
    """
    Generate AI-optimized communication content
    """
    try:
        # Validate request
        schema = CommunicationOptimizationSchema()
        try:
            data = schema.load(request.get_json() or {})
        except ValidationError as err:
            return jsonify({
                'error': 'Validation failed',
                'details': err.messages
            }), 400
        
        # Get current user
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Generate optimized communication content
        result = ai_personalization.generate_smart_communication_content(
            user=user,
            communication_type=data['communication_type'],
            context=data['context']
        )
        
        if result['success']:
            logging_service.log_ai_event(
                'communication_optimized',
                user_id=user.id,
                interaction_id=result.get('interaction_id'),
                processing_time_ms=result.get('processing_time_ms'),
                communication_type=data['communication_type'],
                ip_address=request.remote_addr
            )
            
            return jsonify({
                'success': True,
                'content': result['content'],
                'processing_time_ms': result['processing_time_ms'],
                'interaction_id': result['interaction_id']
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': result.get('error'),
                'fallback_content': result.get('fallback_content')
            }), 500
        
    except Exception as e:
        current_app.logger.error(f"AI communication optimization error: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@ai_bp.route('/analyze-behavior', methods=['POST'])
@jwt_required()
def analyze_behavior():
    """
    Analyze user behavior patterns using AI
    """
    try:
        # Validate request
        schema = BehaviorAnalysisSchema()
        try:
            data = schema.load(request.get_json() or {})
        except ValidationError as err:
            return jsonify({
                'error': 'Validation failed',
                'details': err.messages
            }), 400
        
        # Get current user
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get onboarding session
        onboarding_session = OnboardingSession.query.filter_by(
            session_id=data['session_id'],
            user_id=user.id
        ).first()
        
        if not onboarding_session:
            return jsonify({'error': 'Onboarding session not found'}), 404
        
        # Analyze behavior
        result = ai_personalization.analyze_user_behavior(
            user=user,
            onboarding_session=onboarding_session
        )
        
        if result['success']:
            logging_service.log_ai_event(
                'behavior_analyzed',
                user_id=user.id,
                interaction_id=result.get('interaction_id'),
                processing_time_ms=result.get('processing_time_ms'),
                session_id=data['session_id'],
                ip_address=request.remote_addr
            )
            
            return jsonify({
                'success': True,
                'analysis': result['analysis'],
                'processing_time_ms': result['processing_time_ms'],
                'interaction_id': result['interaction_id']
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': result.get('error'),
                'fallback_analysis': result.get('fallback_analysis')
            }), 500
        
    except Exception as e:
        current_app.logger.error(f"AI behavior analysis error: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@ai_bp.route('/detect-fraud', methods=['POST'])
@jwt_required()
def detect_fraud():
    """
    Perform AI-powered fraud detection
    """
    try:
        # Validate request
        schema = FraudDetectionSchema()
        try:
            data = schema.load(request.get_json() or {})
        except ValidationError as err:
            return jsonify({
                'error': 'Validation failed',
                'details': err.messages
            }), 400
        
        # Get current user
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Add request context
        fraud_context = data['context']
        fraud_context.update({
            'ip_address': request.remote_addr,
            'user_agent': request.headers.get('User-Agent'),
            'timestamp': datetime.utcnow().isoformat()
        })
        
        # Perform fraud detection
        result = ai_personalization.detect_fraud_risk(
            user=user,
            context=fraud_context
        )
        
        if result['success']:
            logging_service.log_ai_event(
                'fraud_detection_performed',
                user_id=user.id,
                interaction_id=result.get('interaction_id'),
                processing_time_ms=result.get('processing_time_ms'),
                risk_score=result['fraud_assessment'].get('risk_score'),
                ip_address=request.remote_addr
            )
            
            return jsonify({
                'success': True,
                'fraud_assessment': result['fraud_assessment'],
                'processing_time_ms': result['processing_time_ms'],
                'interaction_id': result['interaction_id']
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': result.get('error'),
                'fallback_assessment': result.get('fallback_assessment')
            }), 500
        
    except Exception as e:
        current_app.logger.error(f"AI fraud detection error: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@ai_bp.route('/chatbot', methods=['POST'])
@jwt_required()
def chatbot_interaction():
    """
    Interact with AI-powered customer support chatbot
    """
    try:
        # Validate request
        schema = ChatbotRequestSchema()
        try:
            data = schema.load(request.get_json() or {})
        except ValidationError as err:
            return jsonify({
                'error': 'Validation failed',
                'details': err.messages
            }), 400
        
        # Get current user
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Process chatbot interaction
        result = ai_chatbot.process_message(
            user=user,
            message=data['message'],
            conversation_id=data.get('conversation_id'),
            context=data['context']
        )
        
        if result['success']:
            logging_service.log_ai_event(
                'chatbot_interaction',
                user_id=user.id,
                interaction_id=result.get('interaction_id'),
                processing_time_ms=result.get('processing_time_ms'),
                conversation_id=result.get('conversation_id'),
                ip_address=request.remote_addr
            )
            
            return jsonify({
                'success': True,
                'response': result['response'],
                'conversation_id': result['conversation_id'],
                'processing_time_ms': result['processing_time_ms'],
                'interaction_id': result['interaction_id']
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': result.get('error'),
                'fallback_response': result.get('fallback_response')
            }), 500
        
    except Exception as e:
        current_app.logger.error(f"AI chatbot error: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@ai_bp.route('/interactions', methods=['GET'])
@jwt_required()
def get_ai_interactions():
    """
    Get AI interaction history for the current user
    """
    try:
        # Get current user
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get pagination parameters
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 10, type=int), 50)
        interaction_type = request.args.get('type')
        
        # Build query
        query = AIInteraction.query.filter_by(user_id=user.id)
        
        if interaction_type:
            query = query.filter_by(interaction_type=interaction_type)
        
        # Order by most recent first
        query = query.order_by(AIInteraction.created_at.desc())
        
        # Paginate
        interactions = query.paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )
        
        return jsonify({
            'success': True,
            'interactions': [interaction.to_dict() for interaction in interactions.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': interactions.total,
                'pages': interactions.pages,
                'has_next': interactions.has_next,
                'has_prev': interactions.has_prev
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error fetching AI interactions: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@ai_bp.route('/analytics', methods=['GET'])
@jwt_required()
def get_ai_analytics():
    """
    Get AI usage analytics for the current user
    """
    try:
        # Get current user
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Calculate analytics
        total_interactions = AIInteraction.query.filter_by(user_id=user.id).count()
        
        # Interactions by type
        interaction_types = db.session.query(
            AIInteraction.interaction_type,
            db.func.count(AIInteraction.id).label('count')
        ).filter_by(user_id=user.id).group_by(AIInteraction.interaction_type).all()
        
        # Average processing time
        avg_processing_time = db.session.query(
            db.func.avg(AIInteraction.processing_time_ms)
        ).filter_by(user_id=user.id).scalar() or 0
        
        # Total cost
        total_cost = db.session.query(
            db.func.sum(AIInteraction.cost_usd)
        ).filter_by(user_id=user.id).scalar() or 0
        
        # Recent interactions (last 7 days)
        from datetime import timedelta
        week_ago = datetime.utcnow() - timedelta(days=7)
        recent_interactions = AIInteraction.query.filter(
            AIInteraction.user_id == user.id,
            AIInteraction.created_at >= week_ago
        ).count()
        
        analytics_data = {
            'total_interactions': total_interactions,
            'interactions_by_type': {item.interaction_type: item.count for item in interaction_types},
            'average_processing_time_ms': round(avg_processing_time, 2),
            'total_cost_usd': round(total_cost, 6),
            'recent_interactions_7d': recent_interactions,
            'user_id': user.user_id
        }
        
        return jsonify({
            'success': True,
            'analytics': analytics_data
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error fetching AI analytics: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@ai_bp.route('/feedback', methods=['POST'])
@jwt_required()
def submit_ai_feedback():
    """
    Submit feedback for an AI interaction
    """
    try:
        data = request.get_json() or {}
        interaction_id = data.get('interaction_id')
        feedback = data.get('feedback')  # 'positive', 'negative', 'neutral'
        feedback_details = data.get('details')
        
        if not interaction_id or not feedback:
            return jsonify({
                'error': 'Interaction ID and feedback are required'
            }), 400
        
        if feedback not in ['positive', 'negative', 'neutral']:
            return jsonify({
                'error': 'Invalid feedback value'
            }), 400
        
        # Get current user
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Find the AI interaction
        ai_interaction = AIInteraction.query.filter_by(
            interaction_id=interaction_id,
            user_id=user.id
        ).first()
        
        if not ai_interaction:
            return jsonify({'error': 'AI interaction not found'}), 404
        
        # Update feedback
        ai_interaction.user_feedback = feedback
        ai_interaction.feedback_details = feedback_details
        
        db.session.commit()
        
        logging_service.log_ai_event(
            'feedback_submitted',
            user_id=user.id,
            interaction_id=interaction_id,
            feedback=feedback,
            ip_address=request.remote_addr
        )
        
        return jsonify({
            'success': True,
            'message': 'Feedback submitted successfully'
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error submitting AI feedback: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

