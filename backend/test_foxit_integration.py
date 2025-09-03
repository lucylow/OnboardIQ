#!/usr/bin/env python3
"""
Foxit API Integration Test Script
Tests the complete Foxit document generation and PDF processing workflow
"""

import requests
import json
import time
import os
from datetime import datetime
from typing import Dict, Any

# Configuration
BASE_URL = "http://localhost:5000"
FOXIT_BASE_URL = f"{BASE_URL}/api/foxit"

# Test data
TEST_USER = {
    "name": "Sarah Connor",
    "company": "Cyberdyne Systems",
    "plan": "Premium Team Plan",
    "email": "sarah@cyberdyne.com",
    "phone": "+1234567890",
    "account_id": "test_acc_123"
}

TEST_DOCUMENT_DATA = {
    "customer_name": "Sarah Connor",
    "company_name": "Cyberdyne Systems",
    "plan_name": "Premium Team Plan",
    "signup_date": datetime.now().strftime('%Y-%m-%d'),
    "welcome_message": "Welcome to OnboardIQ, Sarah Connor!"
}

TEST_BILLING_DATA = {
    "customer_name": "Sarah Connor",
    "company_name": "Cyberdyne Systems",
    "plan_name": "Premium Team Plan",
    "amount": 299.99,
    "currency": "USD",
    "due_date": "2024-02-15",
    "items": [
        {
            "description": "Premium Team Plan - Monthly",
            "quantity": 1,
            "unit_price": 299.99,
            "total": 299.99
        }
    ]
}

def print_test_header(test_name: str):
    """Print a formatted test header"""
    print(f"\n{'='*60}")
    print(f"🧪 TESTING: {test_name}")
    print(f"{'='*60}")

def print_test_result(test_name: str, success: bool, details: str = ""):
    """Print a formatted test result"""
    status = "✅ PASSED" if success else "❌ FAILED"
    print(f"{status}: {test_name}")
    if details:
        print(f"   Details: {details}")

def make_request(method: str, endpoint: str, data: Dict[str, Any] = None) -> Dict[str, Any]:
    """Make a request to the Foxit API"""
    url = f"{FOXIT_BASE_URL}{endpoint}"
    headers = {"Content-Type": "application/json"}
    
    try:
        if method.upper() == "GET":
            response = requests.get(url, headers=headers, timeout=30)
        elif method.upper() == "POST":
            response = requests.post(url, headers=headers, json=data, timeout=60)
        else:
            raise ValueError(f"Unsupported method: {method}")
        
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        return {
            "success": False,
            "error": f"Request failed: {str(e)}",
            "status_code": getattr(e.response, 'status_code', None) if hasattr(e, 'response') else None
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Unexpected error: {str(e)}"
        }

def test_health_check():
    """Test Foxit API health check"""
    print_test_header("Health Check")
    
    result = make_request("GET", "/health")
    
    if result.get("success"):
        print_test_result("Health Check", True, f"Status: {result.get('status')}")
        print(f"   API Key Configured: {result.get('api_key_configured')}")
        print(f"   Templates Configured: {result.get('templates_configured')}")
        if result.get('response_time'):
            print(f"   Response Time: {result.get('response_time')}s")
    else:
        print_test_result("Health Check", False, result.get('error', 'Unknown error'))
    
    return result.get("success", False)

def test_get_templates():
    """Test getting available templates"""
    print_test_header("Get Templates")
    
    result = make_request("GET", "/templates")
    
    if result.get("success"):
        templates = result.get("templates", {})
        print_test_result("Get Templates", True, f"Found {len(templates)} templates")
        for template_name, template_id in templates.items():
            print(f"   {template_name}: {template_id}")
    else:
        print_test_result("Get Templates", False, result.get('error', 'Unknown error'))
    
    return result.get("success", False)

def test_generate_document():
    """Test document generation"""
    print_test_header("Document Generation")
    
    data = {
        "template_id": "template-welcome-123",
        "data": TEST_DOCUMENT_DATA,
        "output_format": "pdf"
    }
    
    result = make_request("POST", "/generate-document", data)
    
    if result.get("success"):
        print_test_result("Document Generation", True, f"Document ID: {result.get('document_id')}")
        print(f"   Document URL: {result.get('document_url')}")
        print(f"   File Size: {result.get('file_size', 'Unknown')} bytes")
        return result.get("document_url")
    else:
        print_test_result("Document Generation", False, result.get('error', 'Unknown error'))
        return None

def test_process_pdf_workflow():
    """Test PDF workflow processing"""
    print_test_header("PDF Workflow Processing")
    
    # First generate a document to use in the workflow
    document_url = test_generate_document()
    if not document_url:
        print_test_result("PDF Workflow", False, "No document URL available")
        return False
    
    data = {
        "document_urls": [document_url],
        "workflow_config": {
            "compress": True,
            "compression_level": "high",
            "watermark": {
                "type": "text",
                "text": "Processed by OnboardIQ",
                "opacity": 0.3,
                "rotation": 45,
                "position": "center"
            }
        }
    }
    
    result = make_request("POST", "/process-pdf-workflow", data)
    
    if result.get("success"):
        print_test_result("PDF Workflow", True, f"Workflow ID: {result.get('workflow_id')}")
        print(f"   Final Document URL: {result.get('final_document_url')}")
        print(f"   Processing Time: {result.get('processing_time', 'Unknown')}s")
        return result.get("final_document_url")
    else:
        print_test_result("PDF Workflow", False, result.get('error', 'Unknown error'))
        return None

def test_create_welcome_packet():
    """Test welcome packet creation"""
    print_test_header("Welcome Packet Creation")
    
    result = make_request("POST", "/create-welcome-packet", TEST_USER)
    
    if result.get("success"):
        print_test_result("Welcome Packet", True, f"Workflow ID: {result.get('workflow_id')}")
        print(f"   Final Document URL: {result.get('final_document_url')}")
        print(f"   Welcome Document URL: {result.get('welcome_document_url')}")
        print(f"   Contract Document URL: {result.get('contract_document_url')}")
        return result.get("final_document_url")
    else:
        print_test_result("Welcome Packet", False, result.get('error', 'Unknown error'))
        return None

def test_create_onboarding_guide():
    """Test onboarding guide creation"""
    print_test_header("Onboarding Guide Creation")
    
    data = {
        "name": TEST_USER["name"],
        "company": TEST_USER["company"],
        "plan": TEST_USER["plan"],
        "features": ["AI Personalization", "Multi-Channel Support", "Advanced Analytics"]
    }
    
    result = make_request("POST", "/create-onboarding-guide", data)
    
    if result.get("success"):
        print_test_result("Onboarding Guide", True, f"Document ID: {result.get('document_id')}")
        print(f"   Document URL: {result.get('document_url')}")
        return result.get("document_url")
    else:
        print_test_result("Onboarding Guide", False, result.get('error', 'Unknown error'))
        return None

def test_create_invoice():
    """Test invoice creation"""
    print_test_header("Invoice Creation")
    
    data = {
        "invoice_number": f"INV-{int(time.time())}",
        **TEST_BILLING_DATA
    }
    
    result = make_request("POST", "/create-invoice", data)
    
    if result.get("success"):
        print_test_result("Invoice Creation", True, f"Document ID: {result.get('document_id')}")
        print(f"   Document URL: {result.get('document_url')}")
        return result.get("document_url")
    else:
        print_test_result("Invoice Creation", False, result.get('error', 'Unknown error'))
        return None

def test_batch_generate():
    """Test batch document generation"""
    print_test_header("Batch Document Generation")
    
    data = {
        "documents": [
            {
                "request_id": "req1",
                "template_id": "template-welcome-123",
                "data": {
                    "customer_name": "Sarah Connor",
                    "company_name": "Cyberdyne Systems"
                }
            },
            {
                "request_id": "req2",
                "template_id": "template-contract-456",
                "data": {
                    "customer_name": "John Doe",
                    "company_name": "Acme Corp"
                }
            }
        ]
    }
    
    result = make_request("POST", "/batch-generate", data)
    
    if result.get("success"):
        batch_results = result.get("batch_results", [])
        successful = result.get("successful_documents", 0)
        total = result.get("total_documents", 0)
        print_test_result("Batch Generation", True, f"{successful}/{total} documents generated")
        
        for doc_result in batch_results:
            status = "✅" if doc_result.get("success") else "❌"
            print(f"   {status} {doc_result.get('request_id')}: {doc_result.get('document_url', 'Failed')}")
    else:
        print_test_result("Batch Generation", False, result.get('error', 'Unknown error'))
    
    return result.get("success", False)

def test_workflow_templates():
    """Test getting workflow templates"""
    print_test_header("Workflow Templates")
    
    result = make_request("GET", "/workflow-templates")
    
    if result.get("success"):
        templates = result.get("workflow_templates", {})
        print_test_result("Workflow Templates", True, f"Found {len(templates)} templates")
        
        for template_id, template in templates.items():
            print(f"   {template_id}: {template.get('name')}")
            print(f"     Description: {template.get('description')}")
            print(f"     Steps: {', '.join(template.get('steps', []))}")
    else:
        print_test_result("Workflow Templates", False, result.get('error', 'Unknown error'))
    
    return result.get("success", False)

def test_error_handling():
    """Test error handling with invalid requests"""
    print_test_header("Error Handling")
    
    # Test with invalid template ID
    data = {
        "template_id": "invalid-template",
        "data": TEST_DOCUMENT_DATA
    }
    
    result = make_request("POST", "/generate-document", data)
    
    if not result.get("success"):
        print_test_result("Invalid Template", True, "Correctly handled invalid template")
    else:
        print_test_result("Invalid Template", False, "Should have failed with invalid template")
    
    # Test with missing required fields
    data = {
        "template_id": "template-welcome-123"
        # Missing 'data' field
    }
    
    result = make_request("POST", "/generate-document", data)
    
    if not result.get("success"):
        print_test_result("Missing Fields", True, "Correctly handled missing required fields")
    else:
        print_test_result("Missing Fields", False, "Should have failed with missing fields")
    
    return True

def run_all_tests():
    """Run all Foxit integration tests"""
    print("🚀 Starting Foxit API Integration Tests")
    print(f"📅 Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"🌐 Base URL: {BASE_URL}")
    
    test_results = []
    
    # Run tests
    tests = [
        ("Health Check", test_health_check),
        ("Get Templates", test_get_templates),
        ("Document Generation", test_generate_document),
        ("PDF Workflow", test_process_pdf_workflow),
        ("Welcome Packet", test_create_welcome_packet),
        ("Onboarding Guide", test_create_onboarding_guide),
        ("Invoice Creation", test_create_invoice),
        ("Batch Generation", test_batch_generate),
        ("Workflow Templates", test_workflow_templates),
        ("Error Handling", test_error_handling)
    ]
    
    for test_name, test_func in tests:
        try:
            result = test_func()
            test_results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {str(e)}")
            test_results.append((test_name, False))
    
    # Print summary
    print(f"\n{'='*60}")
    print("📊 TEST SUMMARY")
    print(f"{'='*60}")
    
    passed = sum(1 for _, result in test_results if result)
    total = len(test_results)
    
    print(f"Total Tests: {total}")
    print(f"Passed: {passed}")
    print(f"Failed: {total - passed}")
    print(f"Success Rate: {(passed/total)*100:.1f}%")
    
    print(f"\nDetailed Results:")
    for test_name, result in test_results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"  {status} {test_name}")
    
    if passed == total:
        print(f"\n🎉 All tests passed! Foxit integration is working correctly.")
    else:
        print(f"\n⚠️  Some tests failed. Please check the configuration and try again.")
    
    return passed == total

def check_environment():
    """Check if the environment is properly configured"""
    print("🔧 Checking Environment Configuration")
    
    # Check if backend is running
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        if response.status_code == 200:
            print("✅ Backend is running")
        else:
            print("❌ Backend is not responding correctly")
            return False
    except requests.exceptions.RequestException:
        print("❌ Backend is not running. Please start the backend server.")
        return False
    
    # Check environment variables
    env_vars = [
        "FOXIT_API_KEY",
        "FOXIT_API_SECRET",
        "FOXIT_API_BASE_URL"
    ]
    
    missing_vars = []
    for var in env_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print(f"⚠️  Missing environment variables: {', '.join(missing_vars)}")
        print("   Some tests may fail. Please set these variables in your .env file.")
    else:
        print("✅ Environment variables are configured")
    
    return True

if __name__ == "__main__":
    print("🦊 Foxit API Integration Test Suite")
    print("=" * 60)
    
    # Check environment first
    if not check_environment():
        print("\n❌ Environment check failed. Please fix the issues above and try again.")
        exit(1)
    
    # Run tests
    success = run_all_tests()
    
    if success:
        print("\n🎉 All tests completed successfully!")
        exit(0)
    else:
        print("\n❌ Some tests failed. Please review the output above.")
        exit(1)
