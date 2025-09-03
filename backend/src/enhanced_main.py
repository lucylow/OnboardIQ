import os
import sys
import logging
from logging.handlers import RotatingFileHandler
from datetime import datetime
import traceback

# Add the parent directory to the path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory, request, jsonify, g
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import redis

# Import enhanced models and configuration
from src.models.enhanced_models import db
from src.config.enhanced_config import get_config

# Import enhanced routes
from src.routes.enhanced_auth import auth_bp
from src.routes.enhanced_onboarding import onboarding_bp
from src.routes.enhanced_documents import documents_bp
from src.routes.enhanced_admin import admin_bp
from src.routes.enhanced_user import user_bp
from src.routes.enhanced_ai import ai_bp
from src.routes.enhanced_vonage_routes import vonage_bp
from src.routes.foxit_routes import foxit_bp

# Import services
from src.services.enhanced_logging_service import LoggingService
from src.services.enhanced_monitoring_service import MonitoringService

def create_app(config_name=None):
    """Application factory pattern"""
    app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
    
    # Load configuration
    config = get_config(config_name)
    app.config.from_object(config)
    
    # Initialize extensions
    db.init_app(app)
    
    # Initialize JWT
    jwt = JWTManager(app)
    
    # Initialize CORS
    CORS(app, origins=app.config['CORS_ORIGINS'])
    
    # Initialize rate limiter
    try:
        limiter = Limiter(
            app,
            key_func=get_remote_address,
            default_limits=[app.config['RATELIMIT_DEFAULT']],
            storage_uri=app.config['RATELIMIT_STORAGE_URL']
        )
    except Exception as e:
        print(f"Warning: Could not initialize rate limiter: {e}")
        limiter = None
    
    # Initialize logging
    setup_logging(app)
    
    # Initialize monitoring
    monitoring = MonitoringService(app)
    
    # Create database tables
    with app.app_context():
        try:
            db.create_all()
            app.logger.info("Database tables created successfully")
        except Exception as e:
            app.logger.error(f"Error creating database tables: {e}")
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(onboarding_bp, url_prefix='/api/onboarding')
    app.register_blueprint(documents_bp, url_prefix='/api/documents')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(ai_bp, url_prefix='/api/ai')
    app.register_blueprint(vonage_bp, url_prefix='/api/vonage')
app.register_blueprint(foxit_bp, url_prefix='/api/foxit')
    
    # Request logging middleware
    @app.before_request
    def log_request_info():
        g.start_time = datetime.utcnow()
        g.request_id = f"req_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}_{os.urandom(4).hex()}"
        
        # Log request details
        app.logger.info(f"Request {g.request_id}: {request.method} {request.url}")
        
        # Security headers
        if request.endpoint and not request.endpoint.startswith('static'):
            # Add security headers for API endpoints
            pass
    
    @app.after_request
    def log_response_info(response):
        if hasattr(g, 'start_time'):
            duration = (datetime.utcnow() - g.start_time).total_seconds() * 1000
            app.logger.info(f"Response {g.request_id}: {response.status_code} ({duration:.2f}ms)")
        
        # Add security headers
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'DENY'
        response.headers['X-XSS-Protection'] = '1; mode=block'
        response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
        
        return response
    
    # Error handlers
    @app.errorhandler(400)
    def bad_request(error):
        app.logger.warning(f"Bad request: {error}")
        return jsonify({
            'error': 'Bad request',
            'message': 'The request could not be understood by the server',
            'request_id': getattr(g, 'request_id', None)
        }), 400
    
    @app.errorhandler(401)
    def unauthorized(error):
        app.logger.warning(f"Unauthorized access: {error}")
        return jsonify({
            'error': 'Unauthorized',
            'message': 'Authentication required',
            'request_id': getattr(g, 'request_id', None)
        }), 401
    
    @app.errorhandler(403)
    def forbidden(error):
        app.logger.warning(f"Forbidden access: {error}")
        return jsonify({
            'error': 'Forbidden',
            'message': 'Access denied',
            'request_id': getattr(g, 'request_id', None)
        }), 403
    
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'error': 'Not found',
            'message': 'The requested resource was not found',
            'request_id': getattr(g, 'request_id', None)
        }), 404
    
    @app.errorhandler(429)
    def rate_limit_exceeded(error):
        app.logger.warning(f"Rate limit exceeded: {error}")
        return jsonify({
            'error': 'Rate limit exceeded',
            'message': 'Too many requests. Please try again later.',
            'request_id': getattr(g, 'request_id', None)
        }), 429
    
    @app.errorhandler(500)
    def internal_error(error):
        app.logger.error(f"Internal server error: {error}")
        app.logger.error(f"Traceback: {traceback.format_exc()}")
        db.session.rollback()
        return jsonify({
            'error': 'Internal server error',
            'message': 'An unexpected error occurred',
            'request_id': getattr(g, 'request_id', None)
        }), 500
    
    # Health check endpoint
    @app.route('/health')
    def health_check():
        """Health check endpoint for monitoring"""
        try:
            # Check database connection
            db.session.execute('SELECT 1')
            db_status = 'healthy'
        except Exception as e:
            db_status = f'unhealthy: {str(e)}'
        
        # Check Redis connection (if configured)
        redis_status = 'not_configured'
        if app.config.get('REDIS_URL') and app.config['REDIS_URL'] != 'memory://':
            try:
                r = redis.from_url(app.config['REDIS_URL'])
                r.ping()
                redis_status = 'healthy'
            except Exception as e:
                redis_status = f'unhealthy: {str(e)}'
        
        health_data = {
            'status': 'healthy' if db_status == 'healthy' else 'degraded',
            'timestamp': datetime.utcnow().isoformat(),
            'version': '2.0.0',
            'services': {
                'database': db_status,
                'redis': redis_status
            }
        }
        
        status_code = 200 if health_data['status'] == 'healthy' else 503
        return jsonify(health_data), status_code
    
    # API info endpoint
    @app.route('/api/info')
    def api_info():
        """API information endpoint"""
        return jsonify({
            'name': 'OnboardIQ Enhanced API',
            'version': '2.0.0',
            'description': 'AI-Powered Multi-Channel Customer Onboarding Platform',
            'endpoints': {
                'auth': '/api/auth',
                'users': '/api/users',
                'onboarding': '/api/onboarding',
                'documents': '/api/documents',
                'admin': '/api/admin',
                'ai': '/api/ai'
            },
            'features': [
                'JWT Authentication',
                'Rate Limiting',
                'AI Personalization',
                'Multi-channel Communication',
                'Document Generation',
                'Real-time Analytics'
            ]
        })
    
    # Static file serving
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_static(path):
        """Serve static files and SPA routing"""
        static_folder_path = app.static_folder
        if static_folder_path is None:
            return jsonify({'error': 'Static folder not configured'}), 404
        
        # Try to serve the requested file
        if path and os.path.exists(os.path.join(static_folder_path, path)):
            return send_from_directory(static_folder_path, path)
        
        # Fall back to index.html for SPA routing
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        
        return jsonify({'error': 'Static files not found'}), 404
    
    return app

def setup_logging(app):
    """Setup application logging"""
    if not app.debug and not app.testing:
        # Create logs directory if it doesn't exist
        logs_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'logs')
        os.makedirs(logs_dir, exist_ok=True)
        
        # Setup file handler
        file_handler = RotatingFileHandler(
            os.path.join(logs_dir, app.config['LOG_FILE']),
            maxBytes=app.config['LOG_MAX_BYTES'],
            backupCount=app.config['LOG_BACKUP_COUNT']
        )
        
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
        ))
        
        file_handler.setLevel(getattr(logging, app.config['LOG_LEVEL']))
        app.logger.addHandler(file_handler)
        app.logger.setLevel(getattr(logging, app.config['LOG_LEVEL']))
        
        app.logger.info('OnboardIQ Enhanced startup')

# Create the application instance
app = create_app()

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_ENV') == 'development'
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug,
        threaded=True
    )

