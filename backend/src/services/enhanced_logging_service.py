import os
import json
from datetime import datetime
from typing import Dict, Any, Optional
from flask import current_app, request, g

from src.models.enhanced_models import db, SystemLog

class LoggingService:
    def __init__(self):
        self.enabled = True
    
    def log_auth_event(self, event_type: str, user_id: Optional[int] = None, **kwargs):
        """
        Log authentication-related events
        """
        self._log_event(
            level='INFO',
            category='auth',
            message=f"Authentication event: {event_type}",
            user_id=user_id,
            metadata={
                'event_type': event_type,
                **kwargs
            }
        )
    
    def log_onboarding_event(self, event_type: str, user_id: Optional[int] = None, session_id: Optional[str] = None, **kwargs):
        """
        Log onboarding-related events
        """
        self._log_event(
            level='INFO',
            category='onboarding',
            message=f"Onboarding event: {event_type}",
            user_id=user_id,
            session_id=session_id,
            metadata={
                'event_type': event_type,
                **kwargs
            }
        )
    
    def log_document_event(self, event_type: str, user_id: Optional[int] = None, document_id: Optional[str] = None, **kwargs):
        """
        Log document-related events
        """
        self._log_event(
            level='INFO',
            category='document',
            message=f"Document event: {event_type}",
            user_id=user_id,
            metadata={
                'event_type': event_type,
                'document_id': document_id,
                **kwargs
            }
        )
    
    def log_communication_event(self, event_type: str, user_id: Optional[int] = None, communication_type: Optional[str] = None, **kwargs):
        """
        Log communication-related events
        """
        self._log_event(
            level='INFO',
            category='communication',
            message=f"Communication event: {event_type}",
            user_id=user_id,
            metadata={
                'event_type': event_type,
                'communication_type': communication_type,
                **kwargs
            }
        )
    
    def log_ai_event(self, event_type: str, user_id: Optional[int] = None, interaction_id: Optional[str] = None, **kwargs):
        """
        Log AI-related events
        """
        self._log_event(
            level='INFO',
            category='ai',
            message=f"AI event: {event_type}",
            user_id=user_id,
            metadata={
                'event_type': event_type,
                'interaction_id': interaction_id,
                **kwargs
            }
        )
    
    def log_system_event(self, event_type: str, level: str = 'INFO', **kwargs):
        """
        Log system-related events
        """
        self._log_event(
            level=level,
            category='system',
            message=f"System event: {event_type}",
            metadata={
                'event_type': event_type,
                **kwargs
            }
        )
    
    def log_security_event(self, event_type: str, level: str = 'WARNING', user_id: Optional[int] = None, **kwargs):
        """
        Log security-related events
        """
        self._log_event(
            level=level,
            category='security',
            message=f"Security event: {event_type}",
            user_id=user_id,
            metadata={
                'event_type': event_type,
                **kwargs
            }
        )
    
    def log_error(self, error_message: str, category: str = 'system', user_id: Optional[int] = None, **kwargs):
        """
        Log error events
        """
        self._log_event(
            level='ERROR',
            category=category,
            message=error_message,
            user_id=user_id,
            metadata=kwargs
        )
    
    def log_warning(self, warning_message: str, category: str = 'system', user_id: Optional[int] = None, **kwargs):
        """
        Log warning events
        """
        self._log_event(
            level='WARNING',
            category=category,
            message=warning_message,
            user_id=user_id,
            metadata=kwargs
        )
    
    def _log_event(self, level: str, category: str, message: str, user_id: Optional[int] = None, 
                   session_id: Optional[str] = None, metadata: Optional[Dict[str, Any]] = None):
        """
        Internal method to log events to database and application logger
        """
        if not self.enabled:
            return
        
        try:
            # Get request context if available
            ip_address = None
            user_agent = None
            request_id = None
            
            if request:
                ip_address = request.remote_addr
                user_agent = request.headers.get('User-Agent')
                request_id = getattr(g, 'request_id', None)
            
            # Create system log entry
            system_log = SystemLog(
                level=level,
                category=category,
                message=message,
                user_id=user_id,
                session_id=session_id,
                request_id=request_id,
                ip_address=ip_address,
                user_agent=user_agent,
                metadata_json=metadata or {}
            )
            
            db.session.add(system_log)
            db.session.commit()
            
            # Also log to application logger
            if current_app:
                log_message = f"[{category.upper()}] {message}"
                if user_id:
                    log_message += f" (user_id: {user_id})"
                if session_id:
                    log_message += f" (session_id: {session_id})"
                if metadata:
                    log_message += f" (metadata: {json.dumps(metadata)})"
                
                if level == 'DEBUG':
                    current_app.logger.debug(log_message)
                elif level == 'INFO':
                    current_app.logger.info(log_message)
                elif level == 'WARNING':
                    current_app.logger.warning(log_message)
                elif level == 'ERROR':
                    current_app.logger.error(log_message)
                elif level == 'CRITICAL':
                    current_app.logger.critical(log_message)
        
        except Exception as e:
            # Fallback to application logger if database logging fails
            if current_app:
                current_app.logger.error(f"Failed to log event to database: {e}")
                current_app.logger.error(f"Original event - Level: {level}, Category: {category}, Message: {message}")
    
    def get_logs(self, category: Optional[str] = None, level: Optional[str] = None, 
                 user_id: Optional[int] = None, limit: int = 100, offset: int = 0) -> Dict[str, Any]:
        """
        Retrieve logs with filtering
        """
        try:
            query = SystemLog.query
            
            if category:
                query = query.filter_by(category=category)
            
            if level:
                query = query.filter_by(level=level)
            
            if user_id:
                query = query.filter_by(user_id=user_id)
            
            # Order by most recent first
            query = query.order_by(SystemLog.created_at.desc())
            
            # Apply pagination
            total_count = query.count()
            logs = query.offset(offset).limit(limit).all()
            
            return {
                'success': True,
                'logs': [log.to_dict() for log in logs],
                'total_count': total_count,
                'limit': limit,
                'offset': offset
            }
        
        except Exception as e:
            current_app.logger.error(f"Error retrieving logs: {e}")
            return {
                'success': False,
                'error': str(e),
                'logs': [],
                'total_count': 0
            }
    
    def get_log_analytics(self, days: int = 7) -> Dict[str, Any]:
        """
        Get log analytics for the specified number of days
        """
        try:
            from datetime import timedelta
            
            start_date = datetime.utcnow() - timedelta(days=days)
            
            # Total logs by level
            level_counts = db.session.query(
                SystemLog.level,
                db.func.count(SystemLog.id).label('count')
            ).filter(
                SystemLog.created_at >= start_date
            ).group_by(SystemLog.level).all()
            
            # Total logs by category
            category_counts = db.session.query(
                SystemLog.category,
                db.func.count(SystemLog.id).label('count')
            ).filter(
                SystemLog.created_at >= start_date
            ).group_by(SystemLog.category).all()
            
            # Daily log counts
            daily_counts = db.session.query(
                db.func.date(SystemLog.created_at).label('date'),
                db.func.count(SystemLog.id).label('count')
            ).filter(
                SystemLog.created_at >= start_date
            ).group_by(db.func.date(SystemLog.created_at)).all()
            
            # Error rate
            total_logs = SystemLog.query.filter(SystemLog.created_at >= start_date).count()
            error_logs = SystemLog.query.filter(
                SystemLog.created_at >= start_date,
                SystemLog.level.in_(['ERROR', 'CRITICAL'])
            ).count()
            
            error_rate = (error_logs / total_logs * 100) if total_logs > 0 else 0
            
            # Top error messages
            top_errors = db.session.query(
                SystemLog.message,
                db.func.count(SystemLog.id).label('count')
            ).filter(
                SystemLog.created_at >= start_date,
                SystemLog.level.in_(['ERROR', 'CRITICAL'])
            ).group_by(SystemLog.message).order_by(
                db.func.count(SystemLog.id).desc()
            ).limit(10).all()
            
            analytics_data = {
                'period_days': days,
                'total_logs': total_logs,
                'error_rate_percentage': round(error_rate, 2),
                'logs_by_level': {item.level: item.count for item in level_counts},
                'logs_by_category': {item.category: item.count for item in category_counts},
                'daily_counts': [
                    {
                        'date': item.date.isoformat(),
                        'count': item.count
                    } for item in daily_counts
                ],
                'top_errors': [
                    {
                        'message': item.message,
                        'count': item.count
                    } for item in top_errors
                ]
            }
            
            return {
                'success': True,
                'analytics': analytics_data
            }
        
        except Exception as e:
            current_app.logger.error(f"Error generating log analytics: {e}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def cleanup_old_logs(self, days_to_keep: int = 30) -> Dict[str, Any]:
        """
        Clean up old log entries
        """
        try:
            from datetime import timedelta
            
            cutoff_date = datetime.utcnow() - timedelta(days=days_to_keep)
            
            # Count logs to be deleted
            logs_to_delete = SystemLog.query.filter(SystemLog.created_at < cutoff_date).count()
            
            # Delete old logs
            SystemLog.query.filter(SystemLog.created_at < cutoff_date).delete()
            db.session.commit()
            
            self.log_system_event(
                'log_cleanup_completed',
                logs_deleted=logs_to_delete,
                cutoff_date=cutoff_date.isoformat()
            )
            
            return {
                'success': True,
                'logs_deleted': logs_to_delete,
                'cutoff_date': cutoff_date.isoformat()
            }
        
        except Exception as e:
            current_app.logger.error(f"Error cleaning up logs: {e}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def disable_logging(self):
        """
        Disable database logging (application logging continues)
        """
        self.enabled = False
        if current_app:
            current_app.logger.warning("Database logging has been disabled")
    
    def enable_logging(self):
        """
        Enable database logging
        """
        self.enabled = True
        if current_app:
            current_app.logger.info("Database logging has been enabled")

