#!/usr/bin/env python3
"""
Vonage API Key Configuration Verification Script
This script verifies that the VONAGE_API_KEY is properly configured and used throughout the application.
"""

import os
import sys
import requests
import json
from datetime import datetime

def print_header(message):
    """Print a formatted header"""
    print(f"\n{'='*60}")
    print(f"  {message}")
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

def check_environment_variables():
    """Check if Vonage environment variables are properly set"""
    print_header("Environment Variables Check")
    
    # Expected API key from Lovable/Supabase
    expected_api_key = "09bf89e3"
    
    # Check VONAGE_API_KEY
    api_key = os.getenv('VONAGE_API_KEY')
    if api_key:
        if api_key == expected_api_key:
            print_success(f"VONAGE_API_KEY is set correctly: {api_key}")
        else:
            print_error(f"VONAGE_API_KEY mismatch. Expected: {expected_api_key}, Got: {api_key}")
    else:
        print_error("VONAGE_API_KEY is not set")
    
    # Check VONAGE_API_SECRET
    api_secret = os.getenv('VONAGE_API_SECRET')
    if api_secret:
        if api_secret != "your-vonage-api-secret-here":
            print_success("VONAGE_API_SECRET is set")
        else:
            print_error("VONAGE_API_SECRET is using placeholder value")
    else:
        print_error("VONAGE_API_SECRET is not set")
    
    # Check other Vonage-related variables
    vonage_vars = [
        'VONAGE_VIDEO_API_KEY',
        'VONAGE_VIDEO_API_SECRET',
        'VONAGE_BRAND_NAME',
        'VONAGE_SENDER_ID'
    ]
    
    for var in vonage_vars:
        value = os.getenv(var)
        if value:
            print_info(f"{var}: {value}")
        else:
            print_info(f"{var}: Not set (optional)")

def check_config_files():
    """Check configuration files for proper Vonage API key usage"""
    print_header("Configuration Files Check")
    
    config_files = [
        'backend/config.env',
        'backend/config.env.example',
        'backend/src/config/enhanced_config.py',
        'backend/src/routes/auth.py',
        'backend/src/services/enhanced_vonage_service.py',
        'backend/src/services/vonage_service.py'
    ]
    
    expected_api_key = "09bf89e3"
    
    for config_file in config_files:
        if os.path.exists(config_file):
            try:
                with open(config_file, 'r') as f:
                    content = f.read()
                    if expected_api_key in content:
                        print_success(f"{config_file}: Contains correct API key")
                    elif 'VONAGE_API_KEY' in content:
                        print_error(f"{config_file}: Contains VONAGE_API_KEY but may not have correct value")
                    else:
                        print_info(f"{config_file}: No VONAGE_API_KEY reference found")
            except Exception as e:
                print_error(f"{config_file}: Error reading file - {e}")
        else:
            print_error(f"{config_file}: File not found")

def check_backend_health():
    """Check if the backend is running and properly configured"""
    print_header("Backend Health Check")
    
    try:
        # Check if backend is running
        response = requests.get("http://localhost:5000/health", timeout=5)
        if response.status_code == 200:
            print_success("Backend server is running")
            
            # Check health response for Vonage integration status
            health_data = response.json()
            integrations = health_data.get('integrations', {})
            vonage_status = integrations.get('vonage', False)
            
            if vonage_status:
                print_success("Vonage integration is connected")
            else:
                print_error("Vonage integration is not connected")
                
        else:
            print_error(f"Backend server responded with status: {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print_error("Backend server is not running")
    except requests.exceptions.Timeout:
        print_error("Backend server request timed out")
    except Exception as e:
        print_error(f"Backend health check failed: {e}")

def test_vonage_api_endpoints():
    """Test Vonage API endpoints to verify API key usage"""
    print_header("Vonage API Endpoints Test")
    
    base_url = "http://localhost:5000/api/vonage"
    endpoints = [
        "/start-verification",
        "/check-verification", 
        "/send-sms",
        "/account-balance"
    ]
    
    for endpoint in endpoints:
        try:
            response = requests.get(f"{base_url}{endpoint}", timeout=5)
            if response.status_code in [200, 405]:  # 405 is Method Not Allowed (expected for GET on POST endpoints)
                print_success(f"{endpoint}: Endpoint accessible")
            else:
                print_error(f"{endpoint}: Endpoint returned status {response.status_code}")
        except requests.exceptions.RequestException as e:
            print_error(f"{endpoint}: Endpoint not accessible - {e}")

def check_frontend_integration():
    """Check if frontend is properly configured to use Vonage API"""
    print_header("Frontend Integration Check")
    
    frontend_files = [
        'src/services/vonageApi.ts',
        'src/services/smsVerificationService.ts'
    ]
    
    for file_path in frontend_files:
        if os.path.exists(file_path):
            try:
                with open(file_path, 'r') as f:
                    content = f.read()
                    if 'localhost:5000/api/vonage' in content:
                        print_success(f"{file_path}: Properly configured to use backend Vonage API")
                    else:
                        print_error(f"{file_path}: May not be properly configured for Vonage API")
            except Exception as e:
                print_error(f"{file_path}: Error reading file - {e}")
        else:
            print_error(f"{file_path}: File not found")

def generate_summary():
    """Generate a summary of the verification results"""
    print_header("Verification Summary")
    
    print_info("This verification script checks that:")
    print_info("1. VONAGE_API_KEY is set to '09bf89e3' (from Lovable/Supabase)")
    print_info("2. Configuration files contain the correct API key")
    print_info("3. Backend server is running and Vonage integration is connected")
    print_info("4. Frontend is properly configured to use the backend Vonage API")
    
    print_info("\nNext steps:")
    print_info("1. Ensure VONAGE_API_SECRET is set to your actual Vonage API secret")
    print_info("2. Test the Vonage integration with real phone numbers")
    print_info("3. Monitor the backend logs for any Vonage API errors")
    print_info("4. Verify that SMS verification and other Vonage features work correctly")

def main():
    """Main verification function"""
    print_header("Vonage API Key Configuration Verification")
    print_info(f"Verification started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Run all verification checks
    check_environment_variables()
    check_config_files()
    check_backend_health()
    test_vonage_api_endpoints()
    check_frontend_integration()
    generate_summary()
    
    print_header("Verification Complete")
    print_info("Review the results above to ensure proper Vonage API key configuration")

if __name__ == "__main__":
    main()
