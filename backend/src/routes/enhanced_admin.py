from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import Schema, fields, ValidationError
from datetime import datetime, timedelta
from functools import wraps

from src.models.enhanced_models import db, User, OnboardingSession, AIInteraction, SystemLog, Document
from src.services.enhanced_logging_service import LoggingService
from src.services.enhanced_monitoring_service import MonitoringService

admin_bp = Blueprint('admin', __name__)

# Initialize services
logging_service = LoggingService()
monitoring_service = MonitoringService()

def admin_required(f):
    """
    Decorator to require admin privileges
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or not user.is_admin:
            return jsonify({'error': 'Admin privileges required'}), 403
        
        return f(*args, **kwargs)
    return decorated_function

@admin_bp.route('/dashboard', methods=['GET'])
@jwt_required()
@admin_required
def get_dashboard():
    """
    Get comprehensive admin dashboard data
    """
    try:
        # Get time range from query params
        days = request.args.get('days', 7, type=int)
        start_date = datetime.utcnow() - timedelta(days=days)
        
        # User statistics
        total_users = User.query.count()
        verified_users = User.query.filter_by(is_verified=True).count()
        new_users = User.query.filter(User.created_at >= start_date).count()
        
        # Onboarding statistics
        total_sessions = OnboardingSession.query.count()
        active_sessions = OnboardingSession.query.filter_by(status='in_progress').count()
        completed_sessions = OnboardingSession.query.filter_by(status='completed').count()
        recent_sessions = OnboardingSession.query.filter(OnboardingSession.created_at >= start_date).count()
        
        # AI statistics
        total_ai_interactions = AIInteraction.query.count()
        recent_ai_interactions = AIInteraction.query.filter(AIInteraction.created_at >= start_date).count()
        
        # AI interactions by type
        ai_by_type = db.session.query(
            AIInteraction.interaction_type,
            db.func.count(AIInteraction.id).label('count')
        ).filter(AIInteraction.created_at >= start_date).group_by(AIInteraction.interaction_type).all()
        
        # Average AI processing time
        avg_ai_processing = db.session.query(
            db.func.avg(AIInteraction.processing_time_ms)
        ).filter(AIInteraction.created_at >= start_date).scalar() or 0
        
        # Total AI cost
        total_ai_cost = db.session.query(
            db.func.sum(AIInteraction.cost_usd)
        ).filter(AIInteraction.created_at >= start_date).scalar() or 0
        
        # Document statistics
        total_documents = Document.query.count()
        recent_documents = Document.query.filter(Document.created_at >= start_date).count()
        
        # System health
        health_status = monitoring_service.get_health_status()
        
        # Error statistics
        error_logs = SystemLog.query.filter(
            SystemLog.created_at >= start_date,
            SystemLog.level.in_(['ERROR', 'CRITICAL'])
        ).count()
        
        total_logs = SystemLog.query.filter(SystemLog.created_at >= start_date).count()
        error_rate = (error_logs / total_logs * 100) if total_logs > 0 else 0
        
        dashboard_data = {
            'period_days': days,
            'timestamp': datetime.utcnow().isoformat(),
            'users': {
                'total': total_users,
                'verified': verified_users,
                'verification_rate': round((verified_users / total_users * 100) if total_users > 0 else 0, 2),
                'new_users': new_users
            },
            'onboarding': {
                'total_sessions': total_sessions,
                'active_sessions': active_sessions,
                'completed_sessions': completed_sessions,
                'completion_rate': round((completed_sessions / total_sessions * 100) if total_sessions > 0 else 0, 2),
                'recent_sessions': recent_sessions
            },
            'ai_analytics': {
                'total_interactions': total_ai_interactions,
                'recent_interactions': recent_ai_interactions,
                'interactions_by_type': {item.interaction_type: item.count for item in ai_by_type},
                'avg_processing_time_ms': round(avg_ai_processing, 2),
                'total_cost_usd': round(total_ai_cost, 6)
            },
            'documents': {
                'total_generated': total_documents,
                'recent_generated': recent_documents
            },
            'system_health': health_status,
            'error_metrics': {
                'error_count': error_logs,
                'total_logs': total_logs,
                'error_rate_percent': round(error_rate, 2)
            }
        }
        
        return jsonify({
            'success': True,
            'dashboard': dashboard_data
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error fetching admin dashboard: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@admin_bp.route('/users', methods=['GET'])
@jwt_required()
@admin_required
def get_users():
    """
    Get paginated list of users with filtering
    """
    try:
        # Get query parameters
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        verified_only = request.args.get('verified', type=bool)
        search = request.args.get('search', '').strip()
        
        # Build query
        query = User.query
        
        if verified_only is not None:
            query = query.filter_by(is_verified=verified_only)
        
        if search:
            search_filter = f"%{search}%"
            query = query.filter(db.or_(
                User.phone_number.like(search_filter),
                User.email.like(search_filter),
                User.first_name.like(search_filter),
                User.last_name.like(search_filter),
                User.user_id.like(search_filter)
            ))
        
        # Order by most recent first
        query = query.order_by(User.created_at.desc())
        
        # Paginate
        users = query.paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )
        
        return jsonify({
            'success': True,
            'users': [user.to_dict() for user in users.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': users.total,
                'pages': users.pages,
                'has_next': users.has_next,
                'has_prev': users.has_prev
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error fetching users: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@admin_bp.route('/users/<user_id>/details', methods=['GET'])
@jwt_required()
@admin_required
def get_user_details(user_id):
    """
    Get detailed information about a specific user
    """
    try:
        user = User.query.filter_by(user_id=user_id).first()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get user's onboarding sessions
        sessions = OnboardingSession.query.filter_by(user_id=user.id).order_by(
            OnboardingSession.created_at.desc()
        ).all()
        
        # Get user's AI interactions
        ai_interactions = AIInteraction.query.filter_by(user_id=user.id).order_by(
            AIInteraction.created_at.desc()
        ).limit(10).all()
        
        # Get user's documents
        documents = Document.query.filter_by(user_id=user.id).order_by(
            Document.created_at.desc()
        ).all()
        
        # Get user's recent logs
        recent_logs = SystemLog.query.filter_by(user_id=user.id).order_by(
            SystemLog.created_at.desc()
        ).limit(20).all()
        
        user_details = {
            'user': user.to_dict(),
            'onboarding_sessions': [session.to_dict() for session in sessions],
            'ai_interactions': [interaction.to_dict() for interaction in ai_interactions],
            'documents': [doc.to_dict() for doc in documents],
            'recent_logs': [log.to_dict() for log in recent_logs],
            'statistics': {
                'total_sessions': len(sessions),
                'total_ai_interactions': AIInteraction.query.filter_by(user_id=user.id).count(),
                'total_documents': len(documents),
                'total_ai_cost': db.session.query(
                    db.func.sum(AIInteraction.cost_usd)
                ).filter_by(user_id=user.id).scalar() or 0
            }
        }
        
        return jsonify({
            'success': True,
            'user_details': user_details
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error fetching user details: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@admin_bp.route('/monitoring/health', methods=['GET'])
@jwt_required()
@admin_required
def get_system_health():
    """
    Get comprehensive system health status
    """
    try:
        health_status = monitoring_service.get_health_status()
        metrics = monitoring_service.get_metrics()
        
        return jsonify({
            'success': True,
            'health_status': health_status,
            'metrics': metrics
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error fetching system health: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@admin_bp.route('/monitoring/performance', methods=['GET'])
@jwt_required()
@admin_required
def get_performance_metrics():
    """
    Get performance metrics for specified time period
    """
    try:
        hours = request.args.get('hours', 24, type=int)
        performance_summary = monitoring_service.get_performance_summary(hours)
        
        return jsonify({
            'success': True,
            'performance': performance_summary
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error fetching performance metrics: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@admin_bp.route('/logs', methods=['GET'])
@jwt_required()
@admin_required
def get_logs():
    """
    Get system logs with filtering
    """
    try:
        category = request.args.get('category')
        level = request.args.get('level')
        user_id = request.args.get('user_id', type=int)
        limit = min(request.args.get('limit', 100, type=int), 1000)
        offset = request.args.get('offset', 0, type=int)
        
        logs_result = logging_service.get_logs(
            category=category,
            level=level,
            user_id=user_id,
            limit=limit,
            offset=offset
        )
        
        return jsonify(logs_result), 200
        
    except Exception as e:
        current_app.logger.error(f"Error fetching logs: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@admin_bp.route('/logs/analytics', methods=['GET'])
@jwt_required()
@admin_required
def get_log_analytics():
    """
    Get log analytics for specified time period
    """
    try:
        days = request.args.get('days', 7, type=int)
        analytics_result = logging_service.get_log_analytics(days)
        
        return jsonify(analytics_result), 200
        
    except Exception as e:
        current_app.logger.error(f"Error fetching log analytics: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@admin_bp.route('/ai/analytics', methods=['GET'])
@jwt_required()
@admin_required
def get_ai_analytics():
    """
    Get comprehensive AI analytics
    """
    try:
        days = request.args.get('days', 7, type=int)
        start_date = datetime.utcnow() - timedelta(days=days)
        
        # AI interaction statistics
        total_interactions = AIInteraction.query.filter(AIInteraction.created_at >= start_date).count()
        
        # Interactions by type
        interactions_by_type = db.session.query(
            AIInteraction.interaction_type,
            db.func.count(AIInteraction.id).label('count'),
            db.func.avg(AIInteraction.processing_time_ms).label('avg_time'),
            db.func.sum(AIInteraction.cost_usd).label('total_cost')
        ).filter(AIInteraction.created_at >= start_date).group_by(AIInteraction.interaction_type).all()
        
        # Daily interaction counts
        daily_interactions = db.session.query(
            db.func.date(AIInteraction.created_at).label('date'),
            db.func.count(AIInteraction.id).label('count'),
            db.func.sum(AIInteraction.cost_usd).label('daily_cost')
        ).filter(AIInteraction.created_at >= start_date).group_by(
            db.func.date(AIInteraction.created_at)
        ).all()
        
        # Top users by AI usage
        top_users = db.session.query(
            User.user_id,
            User.first_name,
            User.last_name,
            db.func.count(AIInteraction.id).label('interaction_count'),
            db.func.sum(AIInteraction.cost_usd).label('total_cost')
        ).join(AIInteraction).filter(
            AIInteraction.created_at >= start_date
        ).group_by(User.id).order_by(
            db.func.count(AIInteraction.id).desc()
        ).limit(10).all()
        
        # Model usage statistics
        model_usage = db.session.query(
            AIInteraction.model_used,
            db.func.count(AIInteraction.id).label('count'),
            db.func.avg(AIInteraction.processing_time_ms).label('avg_time')
        ).filter(AIInteraction.created_at >= start_date).group_by(AIInteraction.model_used).all()
        
        ai_analytics = {
            'period_days': days,
            'total_interactions': total_interactions,
            'interactions_by_type': [
                {
                    'type': item.interaction_type,
                    'count': item.count,
                    'avg_processing_time_ms': round(item.avg_time or 0, 2),
                    'total_cost_usd': round(item.total_cost or 0, 6)
                } for item in interactions_by_type
            ],
            'daily_interactions': [
                {
                    'date': item.date.isoformat(),
                    'count': item.count,
                    'cost_usd': round(item.daily_cost or 0, 6)
                } for item in daily_interactions
            ],
            'top_users': [
                {
                    'user_id': item.user_id,
                    'name': f"{item.first_name or ''} {item.last_name or ''}".strip() or item.user_id,
                    'interaction_count': item.interaction_count,
                    'total_cost_usd': round(item.total_cost or 0, 6)
                } for item in top_users
            ],
            'model_usage': [
                {
                    'model': item.model_used,
                    'count': item.count,
                    'avg_processing_time_ms': round(item.avg_time or 0, 2)
                } for item in model_usage
            ]
        }
        
        return jsonify({
            'success': True,
            'ai_analytics': ai_analytics
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error fetching AI analytics: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@admin_bp.route('/maintenance/cleanup-logs', methods=['POST'])
@jwt_required()
@admin_required
def cleanup_logs():
    """
    Clean up old log entries
    """
    try:
        data = request.get_json() or {}
        days_to_keep = data.get('days_to_keep', 30)
        
        if days_to_keep < 1:
            return jsonify({'error': 'days_to_keep must be at least 1'}), 400
        
        cleanup_result = logging_service.cleanup_old_logs(days_to_keep)
        
        return jsonify(cleanup_result), 200
        
    except Exception as e:
        current_app.logger.error(f"Error cleaning up logs: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

