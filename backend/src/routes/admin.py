from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/dashboard', methods=['GET'])
def get_dashboard_data():
    """
    Get admin dashboard data
    """
    try:
        # TODO: Retrieve real data from database
        # For now, return mock data
        
        dashboard_data = {
            'total_users': 1247,
            'active_onboarding': 23,
            'completed_today': 15,
            'verification_success_rate': 94.2,
            'recent_activities': [
                {
                    'id': 1,
                    'user_id': 'user_123',
                    'action': 'signup_initiated',
                    'timestamp': datetime.now().isoformat(),
                    'status': 'success'
                },
                {
                    'id': 2,
                    'user_id': 'user_124',
                    'action': 'verification_completed',
                    'timestamp': (datetime.now() - timedelta(minutes=5)).isoformat(),
                    'status': 'success'
                },
                {
                    'id': 3,
                    'user_id': 'user_125',
                    'action': 'document_generated',
                    'timestamp': (datetime.now() - timedelta(minutes=10)).isoformat(),
                    'status': 'success'
                }
            ],
            'onboarding_stats': {
                'in_progress': 23,
                'completed': 1224,
                'failed': 12
            }
        }
        
        return jsonify({
            'success': True,
            'data': dashboard_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/users', methods=['GET'])
def get_users():
    """
    Get list of users with pagination
    """
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        status = request.args.get('status', 'all')
        
        # TODO: Retrieve real data from database with pagination
        # For now, return mock data
        
        users = []
        for i in range(per_page):
            user_id = f"user_{(page-1)*per_page + i + 1}"
            users.append({
                'id': user_id,
                'phone_number': f"+1555000{str(i).zfill(4)}",
                'status': 'completed' if i % 3 == 0 else 'in_progress',
                'plan_type': 'premium' if i % 4 == 0 else 'basic',
                'created_at': (datetime.now() - timedelta(days=i)).isoformat(),
                'last_activity': (datetime.now() - timedelta(hours=i)).isoformat()
            })
        
        return jsonify({
            'success': True,
            'users': users,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': 1247,
                'pages': 125
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/users/<user_id>', methods=['GET'])
def get_user_details(user_id):
    """
    Get detailed information about a specific user
    """
    try:
        # TODO: Retrieve real data from database
        # For now, return mock data
        
        user_details = {
            'id': user_id,
            'phone_number': '+15551234567',
            'status': 'completed',
            'plan_type': 'premium',
            'created_at': datetime.now().isoformat(),
            'verification_status': 'verified',
            'onboarding_progress': {
                'current_step': 'completed',
                'completed_steps': [
                    'welcome_video_call',
                    'personalized_tour',
                    'document_generation',
                    'follow_up_sms'
                ],
                'progress_percentage': 100
            },
            'documents': [
                {
                    'id': f'doc_{user_id}_welcome_packet',
                    'type': 'welcome_packet',
                    'status': 'generated',
                    'created_at': datetime.now().isoformat()
                }
            ],
            'communications': [
                {
                    'type': 'sms',
                    'message': 'Welcome to OnboardIQ!',
                    'sent_at': datetime.now().isoformat(),
                    'status': 'delivered'
                },
                {
                    'type': 'video_call',
                    'duration': '15 minutes',
                    'completed_at': datetime.now().isoformat(),
                    'status': 'completed'
                }
            ]
        }
        
        return jsonify({
            'success': True,
            'user': user_details
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/analytics', methods=['GET'])
def get_analytics():
    """
    Get analytics data for the admin dashboard
    """
    try:
        # TODO: Calculate real analytics from database
        # For now, return mock data
        
        analytics = {
            'signup_trends': [
                {'date': '2025-08-25', 'signups': 45},
                {'date': '2025-08-26', 'signups': 52},
                {'date': '2025-08-27', 'signups': 38},
                {'date': '2025-08-28', 'signups': 61},
                {'date': '2025-08-29', 'signups': 47},
                {'date': '2025-08-30', 'signups': 55},
                {'date': '2025-08-31', 'signups': 42}
            ],
            'verification_rates': {
                'success': 94.2,
                'failed': 5.8
            },
            'onboarding_completion': {
                'completed': 87.3,
                'in_progress': 9.2,
                'abandoned': 3.5
            },
            'plan_distribution': {
                'basic': 73.2,
                'premium': 26.8
            }
        }
        
        return jsonify({
            'success': True,
            'analytics': analytics
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

