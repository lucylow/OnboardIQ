import os
import secrets
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    """Base configuration class"""
    
    # Flask Configuration
    SECRET_KEY = os.getenv('SECRET_KEY', secrets.token_hex(32))
    
    # Database Configuration
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL', 
        f"sqlite:///{os.path.join(os.path.dirname(os.path.dirname(__file__)), 'database', 'app.db')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,
        'pool_recycle': 300,
    }
    
    # JWT Configuration
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', secrets.token_hex(32))
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    JWT_ALGORITHM = 'HS256'
    
    # Rate Limiting Configuration
    RATELIMIT_STORAGE_URL = os.getenv('REDIS_URL', 'memory://')
    RATELIMIT_DEFAULT = "100 per hour"
    
    # CORS Configuration
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', '*').split(',')
    
    # API Keys and External Services
    VONAGE_API_KEY = os.getenv('VONAGE_API_KEY', '09bf89e3')
    VONAGE_API_SECRET = os.getenv('VONAGE_API_SECRET')
    VONAGE_VIDEO_API_KEY = os.getenv('VONAGE_VIDEO_API_KEY')
    VONAGE_VIDEO_API_SECRET = os.getenv('VONAGE_VIDEO_API_SECRET')
    VONAGE_PRIVATE_KEY_PATH = os.getenv('VONAGE_PRIVATE_KEY_PATH')
    
    FOXIT_API_KEY = os.getenv('FOXIT_API_KEY')
    FOXIT_API_SECRET = os.getenv('FOXIT_API_SECRET')
    FOXIT_BASE_URL = os.getenv('FOXIT_BASE_URL', 'https://api.foxit.com')
    
    SENDGRID_API_KEY = os.getenv('SENDGRID_API_KEY')
    SENDGRID_FROM_EMAIL = os.getenv('SENDGRID_FROM_EMAIL', 'noreply@onboardiq.com')
    
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    OPENAI_API_BASE = os.getenv('OPENAI_API_BASE', 'https://api.openai.com/v1')
    OPENAI_MODEL = os.getenv('OPENAI_MODEL', 'gpt-4')
    
    # Redis Configuration
    REDIS_URL = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
    
    # Celery Configuration (for background tasks)
    CELERY_BROKER_URL = os.getenv('CELERY_BROKER_URL', REDIS_URL)
    CELERY_RESULT_BACKEND = os.getenv('CELERY_RESULT_BACKEND', REDIS_URL)
    
    # File Storage Configuration
    UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads'))
    MAX_CONTENT_LENGTH = int(os.getenv('MAX_CONTENT_LENGTH', 16 * 1024 * 1024))  # 16MB
    ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'txt', 'png', 'jpg', 'jpeg'}
    
    # Security Configuration
    BCRYPT_LOG_ROUNDS = int(os.getenv('BCRYPT_LOG_ROUNDS', 12))
    PASSWORD_MIN_LENGTH = int(os.getenv('PASSWORD_MIN_LENGTH', 8))
    MAX_LOGIN_ATTEMPTS = int(os.getenv('MAX_LOGIN_ATTEMPTS', 5))
    ACCOUNT_LOCKOUT_DURATION = int(os.getenv('ACCOUNT_LOCKOUT_DURATION', 3600))  # 1 hour
    
    # Verification Configuration
    VERIFICATION_CODE_LENGTH = int(os.getenv('VERIFICATION_CODE_LENGTH', 6))
    VERIFICATION_CODE_EXPIRY = int(os.getenv('VERIFICATION_CODE_EXPIRY', 300))  # 5 minutes
    MAX_VERIFICATION_ATTEMPTS = int(os.getenv('MAX_VERIFICATION_ATTEMPTS', 5))
    
    # AI Configuration
    AI_PERSONALIZATION_ENABLED = os.getenv('AI_PERSONALIZATION_ENABLED', 'true').lower() == 'true'
    AI_CHATBOT_ENABLED = os.getenv('AI_CHATBOT_ENABLED', 'true').lower() == 'true'
    AI_FRAUD_DETECTION_ENABLED = os.getenv('AI_FRAUD_DETECTION_ENABLED', 'true').lower() == 'true'
    
    # Logging Configuration
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    LOG_FILE = os.getenv('LOG_FILE', 'onboardiq.log')
    LOG_MAX_BYTES = int(os.getenv('LOG_MAX_BYTES', 10485760))  # 10MB
    LOG_BACKUP_COUNT = int(os.getenv('LOG_BACKUP_COUNT', 5))
    
    # Monitoring Configuration
    SENTRY_DSN = os.getenv('SENTRY_DSN')
    ENABLE_METRICS = os.getenv('ENABLE_METRICS', 'true').lower() == 'true'
    
    @staticmethod
    def validate_config():
        """Validate required configuration values"""
        required_vars = []
        
        # Check for required API keys in production
        if os.getenv('FLASK_ENV') == 'production':
            if not Config.VONAGE_API_KEY:
                required_vars.append('VONAGE_API_KEY')
            if not Config.VONAGE_API_SECRET:
                required_vars.append('VONAGE_API_SECRET')
            if not Config.FOXIT_API_KEY:
                required_vars.append('FOXIT_API_KEY')
            if not Config.SENDGRID_API_KEY:
                required_vars.append('SENDGRID_API_KEY')
            if not Config.OPENAI_API_KEY:
                required_vars.append('OPENAI_API_KEY')
        
        if required_vars:
            raise ValueError(f"Missing required environment variables: {', '.join(required_vars)}")
        
        return True

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    TESTING = False
    
    # More lenient rate limiting for development
    RATELIMIT_DEFAULT = "1000 per hour"
    
    # Shorter token expiry for testing
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=30)

class TestingConfig(Config):
    """Testing configuration"""
    DEBUG = True
    TESTING = True
    
    # Use in-memory database for testing
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    
    # Disable rate limiting for tests
    RATELIMIT_ENABLED = False
    
    # Shorter token expiry for testing
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=5)
    
    # Disable external API calls in tests
    VONAGE_API_KEY = 'test_key'
    VONAGE_API_SECRET = 'test_secret'
    FOXIT_API_KEY = 'test_key'
    SENDGRID_API_KEY = 'test_key'
    OPENAI_API_KEY = 'test_key'

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    TESTING = False
    
    # Strict rate limiting for production
    RATELIMIT_DEFAULT = "50 per hour"
    
    # Use PostgreSQL in production
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', '').replace('postgres://', 'postgresql://')
    
    # Enhanced security for production
    BCRYPT_LOG_ROUNDS = 14
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)

# Configuration mapping
config_map = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}

def get_config(config_name=None):
    """Get configuration class based on environment"""
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'default')
    
    config_class = config_map.get(config_name, DevelopmentConfig)
    
    # Validate configuration
    try:
        config_class.validate_config()
    except ValueError as e:
        print(f"Configuration validation error: {e}")
        # In development, continue with warnings
        if config_name == 'development':
            print("Continuing with development configuration...")
        else:
            raise
    
    return config_class

