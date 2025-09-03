from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
import json
import uuid

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(100), unique=True, nullable=False, default=lambda: str(uuid.uuid4()))
    phone_number = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=True)
    username = db.Column(db.String(80), unique=True, nullable=True)
    password_hash = db.Column(db.String(255), nullable=True)
    
    # Profile information
    first_name = db.Column(db.String(50), nullable=True)
    last_name = db.Column(db.String(50), nullable=True)
    date_of_birth = db.Column(db.Date, nullable=True)
    address = db.Column(db.Text, nullable=True)
    
    # Account status
    is_verified = db.Column(db.Boolean, default=False, nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    verification_attempts = db.Column(db.Integer, default=0, nullable=False)
    last_verification_attempt = db.Column(db.DateTime, nullable=True)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    last_login = db.Column(db.DateTime, nullable=True)
    
    # Relationships
    onboarding_sessions = db.relationship('OnboardingSession', backref='user', lazy=True, cascade='all, delete-orphan')
    documents = db.relationship('Document', backref='user', lazy=True, cascade='all, delete-orphan')
    communications = db.relationship('Communication', backref='user', lazy=True, cascade='all, delete-orphan')
    ai_interactions = db.relationship('AIInteraction', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def can_attempt_verification(self):
        if self.verification_attempts >= 5:
            if self.last_verification_attempt:
                time_diff = datetime.utcnow() - self.last_verification_attempt
                return time_diff > timedelta(hours=1)
            return False
        return True
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'phone_number': self.phone_number,
            'email': self.email,
            'username': self.username,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'is_verified': self.is_verified,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None
        }

class OnboardingSession(db.Model):
    __tablename__ = 'onboarding_sessions'
    
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String(100), unique=True, nullable=False, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Session details
    plan_type = db.Column(db.String(20), default='basic', nullable=False)
    status = db.Column(db.String(20), default='initiated', nullable=False)  # initiated, in_progress, completed, failed
    current_step = db.Column(db.Integer, default=0, nullable=False)
    total_steps = db.Column(db.Integer, default=4, nullable=False)
    steps_completed = db.Column(db.JSON, default=list, nullable=False)
    
    # External service IDs
    verification_request_id = db.Column(db.String(100), nullable=True)
    video_session_id = db.Column(db.String(100), nullable=True)
    video_token = db.Column(db.String(255), nullable=True)
    
    # AI personalization
    ai_recommendations = db.Column(db.JSON, default=dict, nullable=False)
    personalization_score = db.Column(db.Float, default=0.0, nullable=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    completed_at = db.Column(db.DateTime, nullable=True)
    
    def get_progress_percentage(self):
        if self.total_steps == 0:
            return 0
        return (len(self.steps_completed or []) / self.total_steps) * 100
    
    def add_completed_step(self, step_name):
        if not self.steps_completed:
            self.steps_completed = []
        if step_name not in self.steps_completed:
            self.steps_completed.append(step_name)
            self.current_step = len(self.steps_completed)
            if self.current_step >= self.total_steps:
                self.status = 'completed'
                self.completed_at = datetime.utcnow()
    
    def to_dict(self):
        return {
            'id': self.id,
            'session_id': self.session_id,
            'user_id': self.user_id,
            'plan_type': self.plan_type,
            'status': self.status,
            'current_step': self.current_step,
            'total_steps': self.total_steps,
            'steps_completed': self.steps_completed or [],
            'progress_percentage': self.get_progress_percentage(),
            'verification_request_id': self.verification_request_id,
            'video_session_id': self.video_session_id,
            'ai_recommendations': self.ai_recommendations or {},
            'personalization_score': self.personalization_score,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }

class Document(db.Model):
    __tablename__ = 'documents'
    
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.String(100), unique=True, nullable=False, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Document details
    template_type = db.Column(db.String(50), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    status = db.Column(db.String(20), default='pending', nullable=False)  # pending, generated, processed, delivered, failed
    
    # File information
    file_path = db.Column(db.String(255), nullable=True)
    file_size = db.Column(db.Integer, nullable=True)
    file_hash = db.Column(db.String(64), nullable=True)
    download_url = db.Column(db.String(255), nullable=True)
    
    # Processing details
    operations_applied = db.Column(db.JSON, default=list, nullable=False)
    processing_metadata = db.Column(db.JSON, default=dict, nullable=False)
    
    # Delivery information
    email_sent = db.Column(db.Boolean, default=False, nullable=False)
    email_recipient = db.Column(db.String(120), nullable=True)
    delivery_attempts = db.Column(db.Integer, default=0, nullable=False)
    
    # AI enhancement
    ai_generated_content = db.Column(db.JSON, default=dict, nullable=False)
    personalization_applied = db.Column(db.Boolean, default=False, nullable=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    processed_at = db.Column(db.DateTime, nullable=True)
    delivered_at = db.Column(db.DateTime, nullable=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'document_id': self.document_id,
            'user_id': self.user_id,
            'template_type': self.template_type,
            'title': self.title,
            'status': self.status,
            'file_path': self.file_path,
            'file_size': self.file_size,
            'download_url': self.download_url,
            'operations_applied': self.operations_applied or [],
            'email_sent': self.email_sent,
            'email_recipient': self.email_recipient,
            'delivery_attempts': self.delivery_attempts,
            'ai_generated_content': self.ai_generated_content or {},
            'personalization_applied': self.personalization_applied,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'processed_at': self.processed_at.isoformat() if self.processed_at else None,
            'delivered_at': self.delivered_at.isoformat() if self.delivered_at else None
        }

class Communication(db.Model):
    __tablename__ = 'communications'
    
    id = db.Column(db.Integer, primary_key=True)
    communication_id = db.Column(db.String(100), unique=True, nullable=False, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Communication details
    type = db.Column(db.String(20), nullable=False)  # sms, email, video, voice, push
    channel = db.Column(db.String(50), nullable=False)  # vonage_sms, vonage_video, sendgrid, etc.
    recipient = db.Column(db.String(100), nullable=False)
    subject = db.Column(db.String(200), nullable=True)
    message = db.Column(db.Text, nullable=True)
    
    # Status tracking
    status = db.Column(db.String(20), default='pending', nullable=False)  # pending, sent, delivered, failed, read
    external_id = db.Column(db.String(100), nullable=True)
    error_message = db.Column(db.Text, nullable=True)
    retry_count = db.Column(db.Integer, default=0, nullable=False)
    
    # AI optimization
    ai_optimized = db.Column(db.Boolean, default=False, nullable=False)
    sentiment_score = db.Column(db.Float, nullable=True)
    personalization_data = db.Column(db.JSON, default=dict, nullable=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    sent_at = db.Column(db.DateTime, nullable=True)
    delivered_at = db.Column(db.DateTime, nullable=True)
    read_at = db.Column(db.DateTime, nullable=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'communication_id': self.communication_id,
            'user_id': self.user_id,
            'type': self.type,
            'channel': self.channel,
            'recipient': self.recipient,
            'subject': self.subject,
            'message': self.message,
            'status': self.status,
            'external_id': self.external_id,
            'error_message': self.error_message,
            'retry_count': self.retry_count,
            'ai_optimized': self.ai_optimized,
            'sentiment_score': self.sentiment_score,
            'personalization_data': self.personalization_data or {},
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'sent_at': self.sent_at.isoformat() if self.sent_at else None,
            'delivered_at': self.delivered_at.isoformat() if self.delivered_at else None,
            'read_at': self.read_at.isoformat() if self.read_at else None
        }

class AIInteraction(db.Model):
    __tablename__ = 'ai_interactions'
    
    id = db.Column(db.Integer, primary_key=True)
    interaction_id = db.Column(db.String(100), unique=True, nullable=False, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Interaction details
    interaction_type = db.Column(db.String(50), nullable=False)  # personalization, recommendation, chatbot, analysis
    input_data = db.Column(db.JSON, nullable=False)
    output_data = db.Column(db.JSON, nullable=False)
    
    # AI model information
    model_used = db.Column(db.String(100), nullable=False)
    model_version = db.Column(db.String(50), nullable=True)
    confidence_score = db.Column(db.Float, nullable=True)
    
    # Performance metrics
    processing_time_ms = db.Column(db.Integer, nullable=True)
    token_usage = db.Column(db.JSON, default=dict, nullable=False)
    cost_usd = db.Column(db.Float, nullable=True)
    
    # Context and feedback
    context = db.Column(db.JSON, default=dict, nullable=False)
    user_feedback = db.Column(db.String(20), nullable=True)  # positive, negative, neutral
    feedback_details = db.Column(db.Text, nullable=True)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    completed_at = db.Column(db.DateTime, nullable=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'interaction_id': self.interaction_id,
            'user_id': self.user_id,
            'interaction_type': self.interaction_type,
            'input_data': self.input_data,
            'output_data': self.output_data,
            'model_used': self.model_used,
            'model_version': self.model_version,
            'confidence_score': self.confidence_score,
            'processing_time_ms': self.processing_time_ms,
            'token_usage': self.token_usage or {},
            'cost_usd': self.cost_usd,
            'context': self.context or {},
            'user_feedback': self.user_feedback,
            'feedback_details': self.feedback_details,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }

class SystemLog(db.Model):
    __tablename__ = 'system_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    log_id = db.Column(db.String(100), unique=True, nullable=False, default=lambda: str(uuid.uuid4()))
    
    # Log details
    level = db.Column(db.String(20), nullable=False)  # DEBUG, INFO, WARNING, ERROR, CRITICAL
    category = db.Column(db.String(50), nullable=False)  # auth, onboarding, document, communication, ai, system
    message = db.Column(db.Text, nullable=False)
    
    # Context information
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    session_id = db.Column(db.String(100), nullable=True)
    request_id = db.Column(db.String(100), nullable=True)
    ip_address = db.Column(db.String(45), nullable=True)
    user_agent = db.Column(db.Text, nullable=True)
    
    # Additional data
    metadata_json = db.Column(db.JSON, default=dict, nullable=False)
    stack_trace = db.Column(db.Text, nullable=True)
    
    # Timestamp
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'log_id': self.log_id,
            'level': self.level,
            'category': self.category,
            'message': self.message,
            'user_id': self.user_id,
            'session_id': self.session_id,
            'request_id': self.request_id,
            'ip_address': self.ip_address,
            'metadata': self.metadata_json or {},
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

