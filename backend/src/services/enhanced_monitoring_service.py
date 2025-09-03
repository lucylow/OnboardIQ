import os
import time
import psutil
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
from flask import Flask, current_app
import threading

from src.models.enhanced_models import db, SystemLog, User, OnboardingSession, AIInteraction

class MonitoringService:
    def __init__(self, app: Optional[Flask] = None):
        self.app = app
        self.metrics = {}
        self.start_time = datetime.utcnow()
        self.monitoring_enabled = True
        
        if app:
            self.init_app(app)
    
    def init_app(self, app: Flask):
        """
        Initialize monitoring service with Flask app
        """
        self.app = app
        
        # Start background monitoring thread
        if self.monitoring_enabled:
            monitoring_thread = threading.Thread(target=self._background_monitoring, daemon=True)
            monitoring_thread.start()
    
    def _background_monitoring(self):
        """
        Background thread for continuous monitoring
        """
        while self.monitoring_enabled:
            try:
                with self.app.app_context():
                    self._collect_system_metrics()
                    self._collect_application_metrics()
                
                # Sleep for 60 seconds before next collection
                time.sleep(60)
                
            except Exception as e:
                if current_app:
                    current_app.logger.error(f"Background monitoring error: {e}")
                time.sleep(60)  # Continue monitoring even if there's an error
    
    def _collect_system_metrics(self):
        """
        Collect system-level metrics
        """
        try:
            # CPU usage
            cpu_percent = psutil.cpu_percent(interval=1)
            
            # Memory usage
            memory = psutil.virtual_memory()
            memory_percent = memory.percent
            memory_available_gb = memory.available / (1024**3)
            
            # Disk usage
            disk = psutil.disk_usage('/')
            disk_percent = disk.percent
            disk_free_gb = disk.free / (1024**3)
            
            # Network I/O
            network = psutil.net_io_counters()
            
            # Process info
            process = psutil.Process()
            process_memory_mb = process.memory_info().rss / (1024**2)
            process_cpu_percent = process.cpu_percent()
            
            self.metrics['system'] = {
                'timestamp': datetime.utcnow().isoformat(),
                'cpu_percent': cpu_percent,
                'memory_percent': memory_percent,
                'memory_available_gb': round(memory_available_gb, 2),
                'disk_percent': disk_percent,
                'disk_free_gb': round(disk_free_gb, 2),
                'network_bytes_sent': network.bytes_sent,
                'network_bytes_recv': network.bytes_recv,
                'process_memory_mb': round(process_memory_mb, 2),
                'process_cpu_percent': process_cpu_percent
            }
            
            # Log critical system issues
            if cpu_percent > 90:
                current_app.logger.warning(f"High CPU usage: {cpu_percent}%")
            
            if memory_percent > 90:
                current_app.logger.warning(f"High memory usage: {memory_percent}%")
            
            if disk_percent > 90:
                current_app.logger.warning(f"High disk usage: {disk_percent}%")
        
        except Exception as e:
            current_app.logger.error(f"Error collecting system metrics: {e}")
    
    def _collect_application_metrics(self):
        """
        Collect application-level metrics
        """
        try:
            # Database metrics
            total_users = User.query.count()
            verified_users = User.query.filter_by(is_verified=True).count()
            active_sessions = OnboardingSession.query.filter_by(status='in_progress').count()
            
            # Recent activity (last 24 hours)
            yesterday = datetime.utcnow() - timedelta(days=1)
            new_users_24h = User.query.filter(User.created_at >= yesterday).count()
            completed_sessions_24h = OnboardingSession.query.filter(
                OnboardingSession.completed_at >= yesterday
            ).count()
            
            # AI metrics
            ai_interactions_24h = AIInteraction.query.filter(
                AIInteraction.created_at >= yesterday
            ).count()
            
            avg_ai_processing_time = db.session.query(
                db.func.avg(AIInteraction.processing_time_ms)
            ).filter(AIInteraction.created_at >= yesterday).scalar() or 0
            
            total_ai_cost_24h = db.session.query(
                db.func.sum(AIInteraction.cost_usd)
            ).filter(AIInteraction.created_at >= yesterday).scalar() or 0
            
            # Error metrics
            error_logs_24h = SystemLog.query.filter(
                SystemLog.created_at >= yesterday,
                SystemLog.level.in_(['ERROR', 'CRITICAL'])
            ).count()
            
            total_logs_24h = SystemLog.query.filter(
                SystemLog.created_at >= yesterday
            ).count()
            
            error_rate = (error_logs_24h / total_logs_24h * 100) if total_logs_24h > 0 else 0
            
            self.metrics['application'] = {
                'timestamp': datetime.utcnow().isoformat(),
                'uptime_hours': self._get_uptime_hours(),
                'total_users': total_users,
                'verified_users': verified_users,
                'verification_rate': round((verified_users / total_users * 100) if total_users > 0 else 0, 2),
                'active_sessions': active_sessions,
                'new_users_24h': new_users_24h,
                'completed_sessions_24h': completed_sessions_24h,
                'ai_interactions_24h': ai_interactions_24h,
                'avg_ai_processing_time_ms': round(avg_ai_processing_time, 2),
                'total_ai_cost_24h_usd': round(total_ai_cost_24h, 6),
                'error_logs_24h': error_logs_24h,
                'error_rate_24h': round(error_rate, 2)
            }
        
        except Exception as e:
            current_app.logger.error(f"Error collecting application metrics: {e}")
    
    def get_health_status(self) -> Dict[str, Any]:
        """
        Get overall health status
        """
        try:
            # Check database connectivity
            try:
                db.session.execute('SELECT 1')
                db_healthy = True
                db_error = None
            except Exception as e:
                db_healthy = False
                db_error = str(e)
            
            # Check system resources
            system_metrics = self.metrics.get('system', {})
            cpu_healthy = system_metrics.get('cpu_percent', 0) < 90
            memory_healthy = system_metrics.get('memory_percent', 0) < 90
            disk_healthy = system_metrics.get('disk_percent', 0) < 90
            
            # Check application metrics
            app_metrics = self.metrics.get('application', {})
            error_rate = app_metrics.get('error_rate_24h', 0)
            error_rate_healthy = error_rate < 5  # Less than 5% error rate
            
            # Overall health
            all_healthy = all([
                db_healthy,
                cpu_healthy,
                memory_healthy,
                disk_healthy,
                error_rate_healthy
            ])
            
            health_status = {
                'status': 'healthy' if all_healthy else 'degraded',
                'timestamp': datetime.utcnow().isoformat(),
                'uptime_hours': self._get_uptime_hours(),
                'checks': {
                    'database': {
                        'healthy': db_healthy,
                        'error': db_error
                    },
                    'cpu': {
                        'healthy': cpu_healthy,
                        'usage_percent': system_metrics.get('cpu_percent', 0)
                    },
                    'memory': {
                        'healthy': memory_healthy,
                        'usage_percent': system_metrics.get('memory_percent', 0)
                    },
                    'disk': {
                        'healthy': disk_healthy,
                        'usage_percent': system_metrics.get('disk_percent', 0)
                    },
                    'error_rate': {
                        'healthy': error_rate_healthy,
                        'rate_percent': error_rate
                    }
                }
            }
            
            return health_status
        
        except Exception as e:
            return {
                'status': 'unhealthy',
                'timestamp': datetime.utcnow().isoformat(),
                'error': str(e)
            }
    
    def get_metrics(self) -> Dict[str, Any]:
        """
        Get all current metrics
        """
        return {
            'system': self.metrics.get('system', {}),
            'application': self.metrics.get('application', {}),
            'health': self.get_health_status()
        }
    
    def get_performance_summary(self, hours: int = 24) -> Dict[str, Any]:
        """
        Get performance summary for the specified time period
        """
        try:
            start_time = datetime.utcnow() - timedelta(hours=hours)
            
            # AI performance metrics
            ai_interactions = AIInteraction.query.filter(
                AIInteraction.created_at >= start_time
            ).all()
            
            if ai_interactions:
                processing_times = [ai.processing_time_ms for ai in ai_interactions if ai.processing_time_ms]
                total_cost = sum(ai.cost_usd for ai in ai_interactions if ai.cost_usd)
                
                avg_processing_time = sum(processing_times) / len(processing_times) if processing_times else 0
                max_processing_time = max(processing_times) if processing_times else 0
                min_processing_time = min(processing_times) if processing_times else 0
                
                # Interactions by type
                interaction_types = {}
                for ai in ai_interactions:
                    interaction_types[ai.interaction_type] = interaction_types.get(ai.interaction_type, 0) + 1
            else:
                avg_processing_time = 0
                max_processing_time = 0
                min_processing_time = 0
                total_cost = 0
                interaction_types = {}
            
            # User activity metrics
            new_users = User.query.filter(User.created_at >= start_time).count()
            new_verifications = User.query.filter(
                User.created_at >= start_time,
                User.is_verified == True
            ).count()
            
            # Session metrics
            completed_sessions = OnboardingSession.query.filter(
                OnboardingSession.completed_at >= start_time
            ).count()
            
            # Error metrics
            error_count = SystemLog.query.filter(
                SystemLog.created_at >= start_time,
                SystemLog.level.in_(['ERROR', 'CRITICAL'])
            ).count()
            
            total_logs = SystemLog.query.filter(
                SystemLog.created_at >= start_time
            ).count()
            
            performance_summary = {
                'period_hours': hours,
                'timestamp': datetime.utcnow().isoformat(),
                'ai_performance': {
                    'total_interactions': len(ai_interactions),
                    'avg_processing_time_ms': round(avg_processing_time, 2),
                    'max_processing_time_ms': max_processing_time,
                    'min_processing_time_ms': min_processing_time,
                    'total_cost_usd': round(total_cost, 6),
                    'interactions_by_type': interaction_types
                },
                'user_activity': {
                    'new_users': new_users,
                    'new_verifications': new_verifications,
                    'completed_sessions': completed_sessions
                },
                'system_health': {
                    'error_count': error_count,
                    'total_logs': total_logs,
                    'error_rate_percent': round((error_count / total_logs * 100) if total_logs > 0 else 0, 2)
                }
            }
            
            return performance_summary
        
        except Exception as e:
            current_app.logger.error(f"Error generating performance summary: {e}")
            return {
                'error': str(e),
                'timestamp': datetime.utcnow().isoformat()
            }
    
    def _get_uptime_hours(self) -> float:
        """
        Get application uptime in hours
        """
        uptime_delta = datetime.utcnow() - self.start_time
        return round(uptime_delta.total_seconds() / 3600, 2)
    
    def create_alert(self, alert_type: str, message: str, severity: str = 'warning', metadata: Dict[str, Any] = None):
        """
        Create a monitoring alert
        """
        try:
            alert_log = SystemLog(
                level=severity.upper(),
                category='monitoring',
                message=f"ALERT [{alert_type}]: {message}",
                metadata={
                    'alert_type': alert_type,
                    'severity': severity,
                    'alert_timestamp': datetime.utcnow().isoformat(),
                    **(metadata or {})
                }
            )
            
            db.session.add(alert_log)
            db.session.commit()
            
            # Also log to application logger
            if current_app:
                if severity == 'critical':
                    current_app.logger.critical(f"MONITORING ALERT: {message}")
                elif severity == 'error':
                    current_app.logger.error(f"MONITORING ALERT: {message}")
                else:
                    current_app.logger.warning(f"MONITORING ALERT: {message}")
        
        except Exception as e:
            if current_app:
                current_app.logger.error(f"Failed to create monitoring alert: {e}")
    
    def stop_monitoring(self):
        """
        Stop background monitoring
        """
        self.monitoring_enabled = False

