from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db

class OnboardingSession(db.Model):
    __tablename__ = 'onboarding_sessions'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    plan_type = db.Column(db.String(20), default='basic')
    status = db.Column(db.String(20), default='in_progress')
    current_step = db.Column(db.Integer, default=0)
    steps_completed = db.Column(db.JSON, default=list)
    verification_request_id = db.Column(db.String(100))
    video_session_id = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    completed_at = db.Column(db.DateTime)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'phone_number': self.phone_number,
            'plan_type': self.plan_type,
            'status': self.status,
            'current_step': self.current_step,
            'steps_completed': self.steps_completed or [],
            'verification_request_id': self.verification_request_id,
            'video_session_id': self.video_session_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }

class Document(db.Model):
    __tablename__ = 'documents'
    
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.String(100), unique=True, nullable=False)
    user_id = db.Column(db.String(100), nullable=False)
    template_type = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(20), default='pending')
    file_path = db.Column(db.String(255))
    download_url = db.Column(db.String(255))
    email_sent = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    processed_at = db.Column(db.DateTime)
    
    def to_dict(self):
        return {
            'id': self.id,
            'document_id': self.document_id,
            'user_id': self.user_id,
            'template_type': self.template_type,
            'status': self.status,
            'file_path': self.file_path,
            'download_url': self.download_url,
            'email_sent': self.email_sent,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'processed_at': self.processed_at.isoformat() if self.processed_at else None
        }

class Communication(db.Model):
    __tablename__ = 'communications'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(20), nullable=False)  # 'sms', 'email', 'video'
    message = db.Column(db.Text)
    recipient = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(20), default='pending')
    external_id = db.Column(db.String(100))  # ID from external service
    sent_at = db.Column(db.DateTime)
    delivered_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'type': self.type,
            'message': self.message,
            'recipient': self.recipient,
            'status': self.status,
            'external_id': self.external_id,
            'sent_at': self.sent_at.isoformat() if self.sent_at else None,
            'delivered_at': self.delivered_at.isoformat() if self.delivered_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

