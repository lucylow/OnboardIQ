import os
import openai
import json
from datetime import datetime
from typing import Dict, List, Optional, Any
from flask import current_app

from src.models.enhanced_models import db, User, OnboardingSession, AIInteraction

class AIPersonalizationService:
    def __init__(self):
        self.client = openai.OpenAI()
        self.model = os.getenv('OPENAI_MODEL', 'gpt-4')
    
    def generate_personalized_onboarding_flow(self, user: User, plan_type: str = 'basic') -> Dict[str, Any]:
        """
        Generate a personalized onboarding flow based on user profile and AI analysis
        """
        start_time = datetime.utcnow()
        
        try:
            # Prepare user context
            user_context = {
                'phone_number': user.phone_number,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'plan_type': plan_type,
                'registration_date': user.created_at.isoformat() if user.created_at else None,
                'is_verified': user.is_verified
            }
            
            # Create AI prompt for personalization
            prompt = f"""
            You are an AI onboarding specialist for OnboardIQ, a multi-channel customer onboarding platform.
            
            User Profile:
            {json.dumps(user_context, indent=2)}
            
            Based on this user profile, create a personalized onboarding experience that includes:
            
            1. Recommended onboarding steps (prioritized list)
            2. Communication preferences (SMS, email, video call timing)
            3. Document templates that would be most relevant
            4. Personalization score (0-100) indicating how customized this flow is
            5. Estimated completion time
            6. Success probability prediction
            
            Consider factors like:
            - Plan type (basic vs premium features)
            - User engagement patterns
            - Optimal communication channels
            - Time-sensitive steps
            
            Respond with a JSON object containing these recommendations.
            """
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an expert AI onboarding specialist. Always respond with valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1000
            )
            
            # Parse AI response
            ai_response = response.choices[0].message.content
            try:
                personalization_data = json.loads(ai_response)
            except json.JSONDecodeError:
                # Fallback to structured response if JSON parsing fails
                personalization_data = self._generate_fallback_personalization(user, plan_type)
            
            # Calculate processing metrics
            processing_time = (datetime.utcnow() - start_time).total_seconds() * 1000
            token_usage = {
                'prompt_tokens': response.usage.prompt_tokens,
                'completion_tokens': response.usage.completion_tokens,
                'total_tokens': response.usage.total_tokens
            }
            
            # Log AI interaction
            ai_interaction = AIInteraction(
                user_id=user.id,
                interaction_type='personalization',
                input_data=user_context,
                output_data=personalization_data,
                model_used=self.model,
                confidence_score=personalization_data.get('personalization_score', 0) / 100,
                processing_time_ms=int(processing_time),
                token_usage=token_usage,
                cost_usd=self._calculate_cost(token_usage),
                context={'plan_type': plan_type, 'feature': 'onboarding_flow'}
            )
            
            db.session.add(ai_interaction)
            db.session.commit()
            
            current_app.logger.info(f"Generated personalized onboarding for user {user.user_id}")
            
            return {
                'success': True,
                'personalization_data': personalization_data,
                'processing_time_ms': int(processing_time),
                'interaction_id': ai_interaction.interaction_id
            }
            
        except Exception as e:
            current_app.logger.error(f"AI personalization error: {e}")
            # Return fallback personalization
            fallback_data = self._generate_fallback_personalization(user, plan_type)
            return {
                'success': False,
                'error': str(e),
                'fallback_data': fallback_data
            }
    
    def generate_smart_communication_content(self, user: User, communication_type: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate AI-optimized communication content (SMS, email, etc.)
        """
        start_time = datetime.utcnow()
        
        try:
            # Prepare context for AI
            user_context = {
                'first_name': user.first_name or 'there',
                'plan_type': context.get('plan_type', 'basic'),
                'current_step': context.get('current_step', 0),
                'communication_type': communication_type,
                'previous_interactions': context.get('previous_interactions', [])
            }
            
            prompt = f"""
            Create personalized {communication_type} content for OnboardIQ customer onboarding.
            
            User Context:
            {json.dumps(user_context, indent=2)}
            
            Requirements:
            - Tone: Professional but friendly
            - Length: Appropriate for {communication_type}
            - Include clear next steps
            - Personalize with user's name when available
            - Add urgency if appropriate
            - Include OnboardIQ branding
            
            For SMS: Keep under 160 characters
            For Email: Include subject line and body
            For Push: Include title and message
            
            Respond with JSON containing the optimized content and metadata.
            """
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an expert copywriter specializing in customer onboarding communications."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.8,
                max_tokens=500
            )
            
            ai_response = response.choices[0].message.content
            try:
                content_data = json.loads(ai_response)
            except json.JSONDecodeError:
                content_data = self._generate_fallback_content(user, communication_type, context)
            
            # Calculate metrics
            processing_time = (datetime.utcnow() - start_time).total_seconds() * 1000
            token_usage = {
                'prompt_tokens': response.usage.prompt_tokens,
                'completion_tokens': response.usage.completion_tokens,
                'total_tokens': response.usage.total_tokens
            }
            
            # Log interaction
            ai_interaction = AIInteraction(
                user_id=user.id,
                interaction_type='communication_optimization',
                input_data=user_context,
                output_data=content_data,
                model_used=self.model,
                processing_time_ms=int(processing_time),
                token_usage=token_usage,
                cost_usd=self._calculate_cost(token_usage),
                context={'communication_type': communication_type}
            )
            
            db.session.add(ai_interaction)
            db.session.commit()
            
            return {
                'success': True,
                'content': content_data,
                'processing_time_ms': int(processing_time),
                'interaction_id': ai_interaction.interaction_id
            }
            
        except Exception as e:
            current_app.logger.error(f"AI communication generation error: {e}")
            fallback_content = self._generate_fallback_content(user, communication_type, context)
            return {
                'success': False,
                'error': str(e),
                'fallback_content': fallback_content
            }
    
    def analyze_user_behavior(self, user: User, onboarding_session: OnboardingSession) -> Dict[str, Any]:
        """
        Analyze user behavior patterns and predict success probability
        """
        start_time = datetime.utcnow()
        
        try:
            # Gather behavioral data
            behavior_data = {
                'user_id': user.user_id,
                'session_duration': self._calculate_session_duration(onboarding_session),
                'steps_completed': len(onboarding_session.steps_completed or []),
                'total_steps': onboarding_session.total_steps,
                'progress_percentage': onboarding_session.get_progress_percentage(),
                'plan_type': onboarding_session.plan_type,
                'verification_attempts': user.verification_attempts,
                'time_since_registration': self._calculate_time_since_registration(user)
            }
            
            prompt = f"""
            Analyze user onboarding behavior and provide insights:
            
            Behavior Data:
            {json.dumps(behavior_data, indent=2)}
            
            Provide analysis including:
            1. Success probability (0-100)
            2. Risk factors for abandonment
            3. Recommended interventions
            4. Optimal next communication timing
            5. Engagement score (0-100)
            6. Predicted completion time
            
            Consider patterns like:
            - Completion rate vs time taken
            - Verification attempts vs success
            - Plan type correlation with completion
            
            Respond with JSON containing the analysis and recommendations.
            """
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a data analyst specializing in user behavior and onboarding optimization."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=800
            )
            
            ai_response = response.choices[0].message.content
            try:
                analysis_data = json.loads(ai_response)
            except json.JSONDecodeError:
                analysis_data = self._generate_fallback_analysis(behavior_data)
            
            # Calculate metrics
            processing_time = (datetime.utcnow() - start_time).total_seconds() * 1000
            token_usage = {
                'prompt_tokens': response.usage.prompt_tokens,
                'completion_tokens': response.usage.completion_tokens,
                'total_tokens': response.usage.total_tokens
            }
            
            # Log interaction
            ai_interaction = AIInteraction(
                user_id=user.id,
                interaction_type='behavior_analysis',
                input_data=behavior_data,
                output_data=analysis_data,
                model_used=self.model,
                processing_time_ms=int(processing_time),
                token_usage=token_usage,
                cost_usd=self._calculate_cost(token_usage),
                context={'session_id': onboarding_session.session_id}
            )
            
            db.session.add(ai_interaction)
            db.session.commit()
            
            return {
                'success': True,
                'analysis': analysis_data,
                'processing_time_ms': int(processing_time),
                'interaction_id': ai_interaction.interaction_id
            }
            
        except Exception as e:
            current_app.logger.error(f"AI behavior analysis error: {e}")
            fallback_analysis = self._generate_fallback_analysis(behavior_data)
            return {
                'success': False,
                'error': str(e),
                'fallback_analysis': fallback_analysis
            }
    
    def detect_fraud_risk(self, user: User, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        AI-powered fraud detection for onboarding process
        """
        start_time = datetime.utcnow()
        
        try:
            # Prepare fraud detection context
            fraud_context = {
                'phone_number': user.phone_number,
                'verification_attempts': user.verification_attempts,
                'registration_time': user.created_at.isoformat() if user.created_at else None,
                'ip_address': context.get('ip_address'),
                'user_agent': context.get('user_agent'),
                'device_fingerprint': context.get('device_fingerprint'),
                'location_data': context.get('location_data'),
                'behavioral_patterns': context.get('behavioral_patterns', {})
            }
            
            prompt = f"""
            Analyze potential fraud risk for user onboarding:
            
            Context Data:
            {json.dumps(fraud_context, indent=2)}
            
            Evaluate risk factors:
            1. Phone number patterns
            2. Verification behavior
            3. Registration timing patterns
            4. Device/location inconsistencies
            5. Behavioral anomalies
            
            Provide:
            - Risk score (0-100, where 100 is highest risk)
            - Risk factors identified
            - Confidence level (0-100)
            - Recommended actions
            - Additional verification steps if needed
            
            Respond with JSON containing the fraud risk assessment.
            """
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a fraud detection specialist with expertise in onboarding security."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1,  # Low temperature for consistent fraud detection
                max_tokens=600
            )
            
            ai_response = response.choices[0].message.content
            try:
                fraud_data = json.loads(ai_response)
            except json.JSONDecodeError:
                fraud_data = self._generate_fallback_fraud_analysis(fraud_context)
            
            # Calculate metrics
            processing_time = (datetime.utcnow() - start_time).total_seconds() * 1000
            token_usage = {
                'prompt_tokens': response.usage.prompt_tokens,
                'completion_tokens': response.usage.completion_tokens,
                'total_tokens': response.usage.total_tokens
            }
            
            # Log interaction
            ai_interaction = AIInteraction(
                user_id=user.id,
                interaction_type='fraud_detection',
                input_data=fraud_context,
                output_data=fraud_data,
                model_used=self.model,
                confidence_score=fraud_data.get('confidence_level', 0) / 100,
                processing_time_ms=int(processing_time),
                token_usage=token_usage,
                cost_usd=self._calculate_cost(token_usage),
                context={'feature': 'fraud_detection'}
            )
            
            db.session.add(ai_interaction)
            db.session.commit()
            
            return {
                'success': True,
                'fraud_assessment': fraud_data,
                'processing_time_ms': int(processing_time),
                'interaction_id': ai_interaction.interaction_id
            }
            
        except Exception as e:
            current_app.logger.error(f"AI fraud detection error: {e}")
            fallback_assessment = self._generate_fallback_fraud_analysis(fraud_context)
            return {
                'success': False,
                'error': str(e),
                'fallback_assessment': fallback_assessment
            }
    
    # Helper methods
    def _generate_fallback_personalization(self, user: User, plan_type: str) -> Dict[str, Any]:
        """Generate fallback personalization when AI is unavailable"""
        if plan_type == 'premium':
            steps = ['welcome_video_call', 'personalized_tour', 'document_generation', 'follow_up_sms']
        else:
            steps = ['welcome_sms', 'basic_tour', 'document_generation']
        
        return {
            'recommended_steps': steps,
            'communication_preferences': {
                'primary_channel': 'sms',
                'optimal_time': '10:00-16:00',
                'frequency': 'daily'
            },
            'document_templates': ['welcome_packet', 'user_guide'],
            'personalization_score': 60,
            'estimated_completion_time': '15-30 minutes',
            'success_probability': 85
        }
    
    def _generate_fallback_content(self, user: User, communication_type: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate fallback communication content"""
        name = user.first_name or 'there'
        
        if communication_type == 'sms':
            return {
                'message': f"Hi {name}! Welcome to OnboardIQ. Complete your setup to get started. Reply STOP to opt out.",
                'character_count': 95,
                'urgency_level': 'medium'
            }
        elif communication_type == 'email':
            return {
                'subject': f"Welcome to OnboardIQ, {name}!",
                'body': f"Hi {name},\n\nWelcome to OnboardIQ! We're excited to help you get started.\n\nBest regards,\nThe OnboardIQ Team",
                'urgency_level': 'low'
            }
        else:
            return {
                'title': 'Welcome to OnboardIQ',
                'message': f'Hi {name}! Complete your onboarding to get started.',
                'urgency_level': 'medium'
            }
    
    def _generate_fallback_analysis(self, behavior_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate fallback behavior analysis"""
        progress = behavior_data.get('progress_percentage', 0)
        
        if progress > 75:
            success_probability = 90
            engagement_score = 85
        elif progress > 50:
            success_probability = 70
            engagement_score = 65
        else:
            success_probability = 45
            engagement_score = 40
        
        return {
            'success_probability': success_probability,
            'engagement_score': engagement_score,
            'risk_factors': ['slow_progress'] if progress < 50 else [],
            'recommended_interventions': ['follow_up_sms'] if progress < 50 else [],
            'optimal_next_contact': '2 hours',
            'predicted_completion_time': '1-2 days'
        }
    
    def _generate_fallback_fraud_analysis(self, fraud_context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate fallback fraud analysis"""
        verification_attempts = fraud_context.get('verification_attempts', 0)
        
        if verification_attempts > 3:
            risk_score = 75
            risk_factors = ['excessive_verification_attempts']
        else:
            risk_score = 25
            risk_factors = []
        
        return {
            'risk_score': risk_score,
            'risk_factors': risk_factors,
            'confidence_level': 60,
            'recommended_actions': ['additional_verification'] if risk_score > 50 else ['proceed_normal'],
            'additional_verification_needed': risk_score > 50
        }
    
    def _calculate_cost(self, token_usage: Dict[str, int]) -> float:
        """Calculate estimated cost based on token usage"""
        # GPT-4 pricing (approximate)
        input_cost_per_token = 0.00003
        output_cost_per_token = 0.00006
        
        input_cost = token_usage.get('prompt_tokens', 0) * input_cost_per_token
        output_cost = token_usage.get('completion_tokens', 0) * output_cost_per_token
        
        return round(input_cost + output_cost, 6)
    
    def _calculate_session_duration(self, session: OnboardingSession) -> int:
        """Calculate session duration in minutes"""
        if session.completed_at:
            duration = session.completed_at - session.created_at
        else:
            duration = datetime.utcnow() - session.created_at
        
        return int(duration.total_seconds() / 60)
    
    def _calculate_time_since_registration(self, user: User) -> int:
        """Calculate time since registration in hours"""
        if user.created_at:
            duration = datetime.utcnow() - user.created_at
            return int(duration.total_seconds() / 3600)
        return 0

