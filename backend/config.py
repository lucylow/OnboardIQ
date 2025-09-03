import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    """Base configuration class"""
    SECRET_KEY = os.getenv('SECRET_KEY', 'asdf#FGSgvasgf$5$WGT')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Vonage Configuration
    VONAGE_API_KEY = os.getenv('VONAGE_API_KEY')
    VONAGE_API_SECRET = os.getenv('VONAGE_API_SECRET')
    VONAGE_VIDEO_API_KEY = os.getenv('VONAGE_VIDEO_API_KEY')
    
    # Foxit Configuration
    FOXIT_API_KEY = os.getenv('FOXIT_API_KEY')
    
    # Email Configuration
    SENDGRID_API_KEY = os.getenv('SENDGRID_API_KEY')
    SMTP_SERVER = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
    SMTP_PORT = int(os.getenv('SMTP_PORT', '587'))
    SMTP_USERNAME = os.getenv('SMTP_USERNAME')
    SMTP_PASSWORD = os.getenv('SMTP_PASSWORD')
    FROM_EMAIL = os.getenv('FROM_EMAIL', 'noreply@onboardiq.com')

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///onboardiq_dev.db')

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'postgresql://user:pass@localhost/onboardiq')

class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}

