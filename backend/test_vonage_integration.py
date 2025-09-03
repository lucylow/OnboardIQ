#!/usr/bin/env python3
"""
Test script for Vonage API integration
Run this script to verify that all Vonage APIs are working correctly
"""

import os
import sys
import requests
import json
from datetime import datetime

# Add the parent directory to the path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

# Test configuration
API_BASE_URL = "http://localhost:5000/api/vonage"
TEST_PHONE_NUMBER = "+14155550101"  # Test phone number

def print_header(title):
    """Print a formatted header"""
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}")

def print_success(message):
    """Print a success message"""
    print(f"✅ {message}")

def print_error(message):
    """Print an error message"""
    print(f"❌ {message}")

def print_info(message):
    """Print an info message"""
    print(f"ℹ️  {message}")

def test_verification_flow():
    """Test the complete verification flow"""
    print_header("Testing Vonage Verify API")
    
    try:
        # Step 1: Start verification
        print_info("Starting verification...")
        start_response = requests.post(
            f"{API_BASE_URL}/start-verification",
            json={
                "phone_number": TEST_PHONE_NUMBER,
                "brand": "OnboardIQ Test",
                "code_length": 6,
                "workflow_id": 6
            },
            headers={"Content-Type": "application/json"}
        )
        
        if start_response.status_code == 200:
            start_data = start_response.json()
            request_id = start_data.get('requestId')
            print_success(f"Verification started: {request_id}")
            print_info(f"Status: {start_data.get('status')}")
            print_info(f"Estimated cost: {start_data.get('estimated_cost')}")
            print_info(f"Remaining balance: {start_data.get('remaining_balance')}")
            
            # Step 2: Check verification (using mock code for testing)
            print_info("Checking verification code...")
            check_response = requests.post(
                f"{API_BASE_URL}/check-verification",
                json={
                    "request_id": request_id,
                    "code": "123456"  # Mock code for testing
                },
                headers={"Content-Type": "application/json"}
            )
            
            if check_response.status_code == 200:
                check_data = check_response.json()
                if check_data.get('verified'):
                    print_success("Verification successful!")
                    print_info(f"Event ID: {check_data.get('event_id')}")
                    print_info(f"Price: {check_data.get('price')} {check_data.get('currency')}")
                else:
                    print_error(f"Verification failed: {check_data.get('errorText')}")
            else:
                print_error(f"Check verification failed: {check_response.status_code}")
                print_error(check_response.text)
        else:
            print_error(f"Start verification failed: {start_response.status_code}")
            print_error(start_response.text)
            
    except Exception as e:
        print_error(f"Verification flow test failed: {e}")

def test_sms_api():
    """Test SMS API"""
    print_header("Testing Vonage SMS API")
    
    try:
        response = requests.post(
            f"{API_BASE_URL}/send-sms",
            json={
                "to": TEST_PHONE_NUMBER,
                "text": "Test SMS from OnboardIQ API integration",
                "from_number": "OnboardIQ"
            },
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            data = response.json()
            print_success("SMS sent successfully!")
            print_info(f"Message ID: {data.get('data', {}).get('message_id')}")
            print_info(f"Remaining balance: {data.get('data', {}).get('remaining_balance')}")
            print_info(f"Message price: {data.get('data', {}).get('message_price')}")
        else:
            print_error(f"SMS send failed: {response.status_code}")
            print_error(response.text)
            
    except Exception as e:
        print_error(f"SMS API test failed: {e}")

def test_onboarding_sms():
    """Test onboarding SMS API"""
    print_header("Testing Onboarding SMS API")
    
    try:
        response = requests.post(
            f"{API_BASE_URL}/send-onboarding-sms",
            json={
                "phone_number": TEST_PHONE_NUMBER,
                "user_name": "Test User",
                "step_number": 2,
                "total_steps": 5
            },
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            data = response.json()
            print_success("Onboarding SMS sent successfully!")
            print_info(f"Step: {data.get('step_number')}/{data.get('total_steps')}")
        else:
            print_error(f"Onboarding SMS failed: {response.status_code}")
            print_error(response.text)
            
    except Exception as e:
        print_error(f"Onboarding SMS test failed: {e}")

def test_video_session():
    """Test video session creation"""
    print_header("Testing Vonage Video API")
    
    try:
        response = requests.post(
            f"{API_BASE_URL}/create-video-session",
            json={
                "user_id": "test_user_123",
                "session_type": "routed",
                "media_mode": "routed"
            },
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            data = response.json()
            print_success("Video session created successfully!")
            print_info(f"Session ID: {data.get('sessionId')}")
            print_info(f"API Key: {data.get('api_key')}")
            print_info(f"Token: {data.get('token')[:50]}...")
        else:
            print_error(f"Video session creation failed: {response.status_code}")
            print_error(response.text)
            
    except Exception as e:
        print_error(f"Video API test failed: {e}")

def test_sim_swap_check():
    """Test SIM swap detection"""
    print_header("Testing SIM Swap Detection")
    
    try:
        response = requests.post(
            f"{API_BASE_URL}/check-sim-swap",
            json={
                "phone_number": TEST_PHONE_NUMBER,
                "max_age": 240
            },
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            data = response.json()
            print_success("SIM swap check completed!")
            print_info(f"SIM swap detected: {data.get('isSimSwapped')}")
            print_info(f"Carrier: {data.get('numberInfo', {}).get('carrier_info')}")
            print_info(f"Roaming status: {data.get('numberInfo', {}).get('roaming_status')}")
        else:
            print_error(f"SIM swap check failed: {response.status_code}")
            print_error(response.text)
            
    except Exception as e:
        print_error(f"SIM swap test failed: {e}")

def test_account_balance():
    """Test account balance retrieval"""
    print_header("Testing Account Balance")
    
    try:
        response = requests.get(
            f"{API_BASE_URL}/account-balance",
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            data = response.json()
            print_success("Account balance retrieved!")
            print_info(f"Balance: {data.get('balance')} {data.get('currency')}")
            print_info(f"Auto reload: {data.get('auto_reload')}")
        else:
            print_error(f"Account balance failed: {response.status_code}")
            print_error(response.text)
            
    except Exception as e:
        print_error(f"Account balance test failed: {e}")

def test_pricing():
    """Test pricing information"""
    print_header("Testing Pricing Information")
    
    try:
        response = requests.post(
            f"{API_BASE_URL}/pricing",
            json={
                "country_code": "US",
                "service_type": "sms"
            },
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            data = response.json()
            pricing = data.get('pricing', {})
            print_success("Pricing information retrieved!")
            print_info(f"Country: {pricing.get('country_name')}")
            print_info(f"Service: {pricing.get('service_type')}")
            print_info(f"Price: {pricing.get('price')} {pricing.get('currency')}")
        else:
            print_error(f"Pricing failed: {response.status_code}")
            print_error(response.text)
            
    except Exception as e:
        print_error(f"Pricing test failed: {e}")

def check_environment():
    """Check environment configuration"""
    print_header("Environment Configuration Check")
    
    # Check environment variables
    env_vars = [
        'VONAGE_API_KEY',
        'VONAGE_API_SECRET',
        'VONAGE_VIDEO_API_KEY',
        'VONAGE_VIDEO_API_SECRET',
        'VONAGE_BRAND_NAME',
        'VONAGE_SENDER_ID'
    ]
    
    for var in env_vars:
        value = os.getenv(var)
        if value:
            if 'SECRET' in var or 'KEY' in var:
                print_info(f"{var}: {'*' * len(value)}")
            else:
                print_info(f"{var}: {value}")
        else:
            print_error(f"{var}: Not set")
    
    # Check if backend is running
    try:
        response = requests.get("http://localhost:5000/health", timeout=5)
        if response.status_code == 200:
            print_success("Backend server is running")
        else:
            print_error("Backend server is not responding correctly")
    except requests.exceptions.RequestException:
        print_error("Backend server is not running")

def main():
    """Main test function"""
    print_header("Vonage API Integration Test Suite")
    print_info(f"Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print_info(f"API Base URL: {API_BASE_URL}")
    print_info(f"Test Phone Number: {TEST_PHONE_NUMBER}")
    
    # Check environment first
    check_environment()
    
    # Run all tests
    test_verification_flow()
    test_sms_api()
    test_onboarding_sms()
    test_video_session()
    test_sim_swap_check()
    test_account_balance()
    test_pricing()
    
    print_header("Test Suite Complete")
    print_info("Check the results above for any errors or issues")

if __name__ == "__main__":
    main()
