import os
import openai
import json
import uuid
from datetime import datetime
from typing import Dict, List, Optional, Any
from flask import current_app

from src.models.enhanced_models import db, User, AIInteraction

class AIChatbotService:
    def __init__(self):
        self.client = openai.OpenAI()
        self.model = os.getenv('OPENAI_MODEL', 'gpt-4')
        self.conversation_memory = {}  # In production, this would be stored in Redis
    
    def process_message(self, user: User, message: str, conversation_id: Optional[str] = None, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Process a chatbot message and generate an AI response
        """
        start_time = datetime.utcnow()
        context = context or {}
        
        try:
            # Generate or use existing conversation ID
            if not conversation_id:
                conversation_id = f"conv_{user.user_id}_{uuid.uuid4().hex[:8]}"
            
            # Get conversation history
            conversation_history = self._get_conversation_history(conversation_id)
            
            # Prepare system context
            system_context = self._build_system_context(user, context)
            
            # Build conversation messages
            messages = [
                {"role": "system", "content": system_context}
            ]
            
            # Add conversation history
            messages.extend(conversation_history)
            
            # Add current user message
            messages.append({"role": "user", "content": message})
            
            # Generate AI response
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.7,
                max_tokens=500,
                presence_penalty=0.1,
                frequency_penalty=0.1
            )
            
            ai_response = response.choices[0].message.content
            
            # Update conversation history
            self._update_conversation_history(conversation_id, message, ai_response)
            
            # Calculate metrics
            processing_time = (datetime.utcnow() - start_time).total_seconds() * 1000
            token_usage = {
                'prompt_tokens': response.usage.prompt_tokens,
                'completion_tokens': response.usage.completion_tokens,
                'total_tokens': response.usage.total_tokens
            }
            
            # Analyze response sentiment and intent
            response_analysis = self._analyze_response(ai_response)
            
            # Log AI interaction
            ai_interaction = AIInteraction(
                user_id=user.id,
                interaction_type='chatbot',
                input_data={'message': message, 'conversation_id': conversation_id},
                output_data={
                    'response': ai_response,
                    'analysis': response_analysis,
                    'conversation_id': conversation_id
                },
                model_used=self.model,
                confidence_score=response_analysis.get('confidence', 0.8),
                processing_time_ms=int(processing_time),
                token_usage=token_usage,
                cost_usd=self._calculate_cost(token_usage),
                context={'conversation_id': conversation_id, 'user_message_length': len(message)}
            )
            
            db.session.add(ai_interaction)
            db.session.commit()
            
            current_app.logger.info(f"Chatbot response generated for user {user.user_id}")
            
            return {
                'success': True,
                'response': ai_response,
                'conversation_id': conversation_id,
                'analysis': response_analysis,
                'processing_time_ms': int(processing_time),
                'interaction_id': ai_interaction.interaction_id
            }
            
        except Exception as e:
            current_app.logger.error(f"AI chatbot error: {e}")
            fallback_response = self._generate_fallback_response(message, context)
            return {
                'success': False,
                'error': str(e),
                'fallback_response': fallback_response,
                'conversation_id': conversation_id or f"fallback_{uuid.uuid4().hex[:8]}"
            }
    
    def _build_system_context(self, user: User, context: Dict[str, Any]) -> str:
        """
        Build system context for the chatbot
        """
        user_name = user.first_name or "there"
        plan_type = context.get('plan_type', 'basic')
        current_step = context.get('current_step', 'unknown')
        
        system_context = f"""
        You are OnboardIQ Assistant, a helpful AI customer support agent for OnboardIQ, an AI-powered multi-channel customer onboarding platform.
        
        User Information:
        - Name: {user_name}
        - Plan: {plan_type}
        - Current onboarding step: {current_step}
        - Phone verified: {user.is_verified}
        - Registration date: {user.created_at.strftime('%Y-%m-%d') if user.created_at else 'Unknown'}
        
        Your role:
        - Provide helpful, accurate information about OnboardIQ services
        - Guide users through the onboarding process
        - Answer questions about features, billing, and technical issues
        - Escalate complex issues to human support when needed
        - Maintain a friendly, professional tone
        - Keep responses concise but informative
        
        OnboardIQ Features:
        - Phone verification via SMS
        - Multi-channel communication (SMS, email, video calls)
        - AI-powered personalization
        - Document generation and processing
        - Admin dashboard and analytics
        - Fraud detection and security
        
        Guidelines:
        - Always address the user by name when possible
        - Provide step-by-step instructions when needed
        - Offer to escalate to human support for complex issues
        - Never share sensitive user data or system internals
        - If you don't know something, admit it and offer to find help
        - Use emojis sparingly and appropriately
        
        Current conversation context: {json.dumps(context, indent=2)}
        """
        
        return system_context
    
    def _get_conversation_history(self, conversation_id: str) -> List[Dict[str, str]]:
        """
        Get conversation history for context
        """
        # In production, this would fetch from Redis or database
        return self.conversation_memory.get(conversation_id, [])
    
    def _update_conversation_history(self, conversation_id: str, user_message: str, ai_response: str):
        """
        Update conversation history
        """
        if conversation_id not in self.conversation_memory:
            self.conversation_memory[conversation_id] = []
        
        # Add user message and AI response
        self.conversation_memory[conversation_id].extend([
            {"role": "user", "content": user_message},
            {"role": "assistant", "content": ai_response}
        ])
        
        # Keep only last 10 exchanges (20 messages) to manage context length
        if len(self.conversation_memory[conversation_id]) > 20:
            self.conversation_memory[conversation_id] = self.conversation_memory[conversation_id][-20:]
    
    def _analyze_response(self, response: str) -> Dict[str, Any]:
        """
        Analyze the AI response for sentiment and intent
        """
        try:
            # Simple analysis - in production, this could use additional AI models
            analysis_prompt = f"""
            Analyze this customer support response for:
            1. Sentiment (positive, neutral, negative)
            2. Intent category (information, troubleshooting, escalation, greeting, goodbye)
            3. Confidence level (0-100)
            4. Contains actionable steps (true/false)
            5. Requires follow-up (true/false)
            
            Response: "{response}"
            
            Respond with JSON only.
            """
            
            analysis_response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",  # Use faster model for analysis
                messages=[
                    {"role": "system", "content": "You are a response analyzer. Always respond with valid JSON."},
                    {"role": "user", "content": analysis_prompt}
                ],
                temperature=0.1,
                max_tokens=200
            )
            
            analysis_result = json.loads(analysis_response.choices[0].message.content)
            return analysis_result
            
        except Exception as e:
            current_app.logger.warning(f"Response analysis failed: {e}")
            return {
                'sentiment': 'neutral',
                'intent': 'information',
                'confidence': 70,
                'contains_actionable_steps': False,
                'requires_follow_up': False
            }
    
    def _generate_fallback_response(self, message: str, context: Dict[str, Any]) -> str:
        """
        Generate a fallback response when AI is unavailable
        """
        message_lower = message.lower()
        
        # Simple keyword-based responses
        if any(word in message_lower for word in ['hello', 'hi', 'hey', 'start']):
            return "Hello! I'm OnboardIQ Assistant. How can I help you with your onboarding today?"
        
        elif any(word in message_lower for word in ['verify', 'verification', 'code', 'sms']):
            return "For phone verification issues, please check that you've entered the correct phone number and that you can receive SMS messages. The verification code expires after 5 minutes."
        
        elif any(word in message_lower for word in ['document', 'pdf', 'download']):
            return "You can generate and download your onboarding documents from the Documents section. If you're having trouble, please check your email for download links."
        
        elif any(word in message_lower for word in ['video', 'call', 'meeting']):
            return "Video onboarding sessions are available for Premium plan users. You can schedule a session from your onboarding dashboard."
        
        elif any(word in message_lower for word in ['help', 'support', 'problem', 'issue']):
            return "I'm here to help! Can you please describe the specific issue you're experiencing? If it's urgent, you can also contact our support team directly."
        
        elif any(word in message_lower for word in ['thank', 'thanks', 'bye', 'goodbye']):
            return "You're welcome! Feel free to reach out if you need any more help with your onboarding. Have a great day!"
        
        else:
            return "I understand you need assistance. While I'm currently experiencing technical difficulties, I'd be happy to help you. Could you please rephrase your question or contact our support team for immediate assistance?"
    
    def _calculate_cost(self, token_usage: Dict[str, int]) -> float:
        """
        Calculate estimated cost based on token usage
        """
        # GPT-4 pricing (approximate)
        input_cost_per_token = 0.00003
        output_cost_per_token = 0.00006
        
        input_cost = token_usage.get('prompt_tokens', 0) * input_cost_per_token
        output_cost = token_usage.get('completion_tokens', 0) * output_cost_per_token
        
        return round(input_cost + output_cost, 6)
    
    def get_conversation_summary(self, conversation_id: str) -> Dict[str, Any]:
        """
        Generate a summary of the conversation
        """
        try:
            conversation_history = self._get_conversation_history(conversation_id)
            
            if not conversation_history:
                return {
                    'success': False,
                    'error': 'No conversation history found'
                }
            
            # Create summary prompt
            conversation_text = "\n".join([
                f"{msg['role']}: {msg['content']}" for msg in conversation_history
            ])
            
            summary_prompt = f"""
            Summarize this customer support conversation:
            
            {conversation_text}
            
            Provide:
            1. Main topics discussed
            2. Issues resolved
            3. Outstanding issues
            4. Customer satisfaction level
            5. Recommended follow-up actions
            
            Respond with JSON.
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a conversation summarizer. Always respond with valid JSON."},
                    {"role": "user", "content": summary_prompt}
                ],
                temperature=0.3,
                max_tokens=400
            )
            
            summary_data = json.loads(response.choices[0].message.content)
            
            return {
                'success': True,
                'summary': summary_data,
                'conversation_id': conversation_id,
                'message_count': len(conversation_history)
            }
            
        except Exception as e:
            current_app.logger.error(f"Conversation summary error: {e}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def clear_conversation(self, conversation_id: str) -> bool:
        """
        Clear conversation history
        """
        try:
            if conversation_id in self.conversation_memory:
                del self.conversation_memory[conversation_id]
            return True
        except Exception as e:
            current_app.logger.error(f"Error clearing conversation: {e}")
            return False

