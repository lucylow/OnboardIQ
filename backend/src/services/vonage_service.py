import os
import requests
import json
from datetime import datetime

class VonageService:
    def __init__(self):
        self.api_key = os.getenv('VONAGE_API_KEY', '09bf89e3')
        self.api_secret = os.getenv('VONAGE_API_SECRET')
        self.video_api_key = os.getenv('VONAGE_VIDEO_API_KEY')
        self.base_url = 'https://api.nexmo.com'
        
    def send_verification(self, phone_number, brand='OnboardIQ'):
        """
        Send SMS verification code using Vonage Verify API
        """
        url = f"{self.base_url}/verify/json"
        
        payload = {
            'api_key': self.api_key,
            'api_secret': self.api_secret,
            'number': phone_number,
            'brand': brand,
            'code_length': 6
        }
        
        try:
            response = requests.post(url, data=payload)
            result = response.json()
            
            if result.get('status') == '0':
                return {
                    'success': True,
                    'request_id': result.get('request_id'),
                    'message': 'Verification code sent successfully'
                }
            else:
                return {
                    'success': False,
                    'error': result.get('error_text', 'Failed to send verification code')
                }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def verify_code(self, request_id, code):
        """
        Verify the SMS code using Vonage Verify API
        """
        url = f"{self.base_url}/verify/check/json"
        
        payload = {
            'api_key': self.api_key,
            'api_secret': self.api_secret,
            'request_id': request_id,
            'code': code
        }
        
        try:
            response = requests.post(url, data=payload)
            result = response.json()
            
            if result.get('status') == '0':
                return {
                    'success': True,
                    'message': 'Code verified successfully'
                }
            else:
                return {
                    'success': False,
                    'error': result.get('error_text', 'Invalid verification code')
                }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def send_sms(self, phone_number, message):
        """
        Send SMS message using Vonage SMS API
        """
        url = f"{self.base_url}/sms/json"
        
        payload = {
            'api_key': self.api_key,
            'api_secret': self.api_secret,
            'to': phone_number,
            'from': 'OnboardIQ',
            'text': message
        }
        
        try:
            response = requests.post(url, data=payload)
            result = response.json()
            
            messages = result.get('messages', [])
            if messages and messages[0].get('status') == '0':
                return {
                    'success': True,
                    'message_id': messages[0].get('message-id'),
                    'message': 'SMS sent successfully'
                }
            else:
                error_text = messages[0].get('error-text') if messages else 'Failed to send SMS'
                return {
                    'success': False,
                    'error': error_text
                }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def create_video_session(self, user_id):
        """
        Create a Vonage Video session for onboarding
        """
        # This would integrate with Vonage Video API
        # For now, return mock data
        session_id = f"session_{user_id}_{int(datetime.now().timestamp())}"
        token = f"token_{user_id}_{int(datetime.now().timestamp())}"
        
        return {
            'success': True,
            'session_id': session_id,
            'token': token,
            'api_key': self.video_api_key,
            'message': 'Video session created successfully'
        }
    
    def get_sim_swap_status(self, phone_number):
        """
        Check SIM swap status using Vonage Network API
        """
        # This would integrate with Vonage Network API
        # For now, return mock data
        return {
            'success': True,
            'sim_swap_detected': False,
            'last_swap_date': None,
            'message': 'No recent SIM swap detected'
        }
    
    def get_phone_insights(self, phone_number):
        """
        Get phone number insights using Vonage Insights API
        """
        # This would integrate with Vonage Number Insights API
        # For now, return mock data
        return {
            'success': True,
            'country_code': 'US',
            'country_name': 'United States',
            'carrier': 'Verizon',
            'type': 'mobile',
            'valid': True,
            'reachable': True
        }

