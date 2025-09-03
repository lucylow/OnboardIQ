from flask import Blueprint, request, jsonify
from marshmallow import Schema, fields, validate
from functools import wraps
import asyncio
from datetime import datetime
import logging

# Import the Foxit service
from ..services.foxit_service import foxit_service

# Configure logging
logger = logging.getLogger(__name__)

# Create Blueprint
foxit_bp = Blueprint('foxit', __name__)

# Validation Schemas
class DocumentGenerationSchema(Schema):
    template_id = fields.Str(required=True, validate=validate.Length(min=1))
    data = fields.Dict(required=True)
    output_format = fields.Str(validate=validate.OneOf(['pdf', 'docx', 'html']), missing='pdf')

class PDFWorkflowSchema(Schema):
    document_urls = fields.List(fields.Url(), required=True, validate=validate.Length(min=1))
    workflow_config = fields.Dict(missing={})

class WelcomePacketSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=1))
    company = fields.Str(required=True, validate=validate.Length(min=1))
    plan = fields.Str(required=True, validate=validate.Length(min=1))
    email = fields.Email(required=True)
    phone = fields.Str(required=True, validate=validate.Length(min=1))
    account_id = fields.Str(missing='')
    signup_date = fields.Date(missing=None)

class OnboardingGuideSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=1))
    company = fields.Str(required=True, validate=validate.Length(min=1))
    plan = fields.Str(required=True, validate=validate.Length(min=1))
    features = fields.List(fields.Str(), missing=[])

class InvoiceSchema(Schema):
    invoice_number = fields.Str(required=True, validate=validate.Length(min=1))
    customer_name = fields.Str(required=True, validate=validate.Length(min=1))
    company_name = fields.Str(required=True, validate=validate.Length(min=1))
    plan_name = fields.Str(required=True, validate=validate.Length(min=1))
    amount = fields.Float(required=True, validate=validate.Range(min=0))
    currency = fields.Str(validate=validate.OneOf(['USD', 'EUR', 'GBP']), missing='USD')
    due_date = fields.Date(missing=None)
    items = fields.List(fields.Dict(), missing=[])

# Helper function to run async functions
def run_async(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        return asyncio.run(func(*args, **kwargs))
    return wrapper

# Routes
@foxit_bp.route('/health', methods=['GET'])
def health_check():
    """Check Foxit API connectivity and configuration"""
    try:
        health_info = foxit_service.health_check()
        return jsonify({
            'success': True,
            'service': 'foxit',
            'status': health_info['status'],
            'api_key_configured': health_info['api_key_configured'],
            'templates_configured': health_info['templates_configured'],
            'response_time': health_info.get('response_time'),
            'timestamp': datetime.utcnow().isoformat()
        })
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return jsonify({
            'success': False,
            'service': 'foxit',
            'error': 'Health check failed',
            'details': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500

@foxit_bp.route('/templates', methods=['GET'])
def get_templates():
    """Get available Foxit templates and configuration"""
    try:
        template_info = foxit_service.get_template_info()
        return jsonify({
            'success': True,
            'templates': template_info['templates'],
            'api_base_url': template_info['api_base_url'],
            'endpoints': template_info['endpoints'],
            'status': template_info['status'],
            'timestamp': datetime.utcnow().isoformat()
        })
    except Exception as e:
        logger.error(f"Failed to get templates: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to get templates',
            'details': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500

@foxit_bp.route('/generate-document', methods=['POST'])
@run_async
async def generate_document():
    """Generate a personalized document using Foxit Document Generation API"""
    try:
        # Validate request data
        schema = DocumentGenerationSchema()
        data = schema.load(request.json)
        
        # Generate document
        result = await foxit_service.generate_document(
            template_id=data['template_id'],
            data=data['data'],
            output_format=data.get('output_format', 'pdf')
        )
        
        if result['success']:
            return jsonify({
                'success': True,
                'document_url': result['document_url'],
                'document_id': result['document_id'],
                'file_size': result['file_size'],
                'generated_at': result['generated_at'],
                'timestamp': datetime.utcnow().isoformat()
            })
        else:
            return jsonify(result), 400
            
    except Exception as e:
        logger.error(f"Document generation failed: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Document generation failed',
            'details': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500

@foxit_bp.route('/process-pdf-workflow', methods=['POST'])
@run_async
async def process_pdf_workflow():
    """Execute chained PDF processing workflow using Foxit PDF Services API"""
    try:
        # Validate request data
        schema = PDFWorkflowSchema()
        data = schema.load(request.json)
        
        # Process PDF workflow
        result = await foxit_service.process_pdf_workflow(
            document_urls=data['document_urls'],
            workflow_config=data.get('workflow_config', {})
        )
        
        if result['success']:
            return jsonify({
                'success': True,
                'final_document_url': result['final_document_url'],
                'workflow_id': result['workflow_id'],
                'processing_time': result['processing_time'],
                'file_size': result['file_size'],
                'completed_at': result['completed_at'],
                'timestamp': datetime.utcnow().isoformat()
            })
        else:
            return jsonify(result), 400
            
    except Exception as e:
        logger.error(f"PDF workflow processing failed: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'PDF workflow processing failed',
            'details': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500

@foxit_bp.route('/create-welcome-packet', methods=['POST'])
@run_async
async def create_welcome_packet():
    """Create a complete personalized welcome packet with chained document processing"""
    try:
        # Validate request data
        schema = WelcomePacketSchema()
        data = schema.load(request.json)
        
        # Prepare user data
        user_data = {
            'name': data['name'],
            'company': data['company'],
            'plan': data['plan'],
            'email': data['email'],
            'phone': data['phone'],
            'account_id': data.get('account_id', ''),
            'signup_date': data.get('signup_date', datetime.now().strftime('%Y-%m-%d'))
        }
        
        # Create welcome packet
        result = await foxit_service.create_welcome_packet(user_data)
        
        if result['success']:
            return jsonify({
                'success': True,
                'final_document_url': result['final_document_url'],
                'welcome_document_url': result['welcome_document_url'],
                'contract_document_url': result['contract_document_url'],
                'workflow_id': result['workflow_id'],
                'user_data': result['user_data'],
                'created_at': result['created_at'],
                'timestamp': datetime.utcnow().isoformat()
            })
        else:
            return jsonify(result), 400
            
    except Exception as e:
        logger.error(f"Welcome packet creation failed: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Welcome packet creation failed',
            'details': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500

@foxit_bp.route('/create-onboarding-guide', methods=['POST'])
@run_async
async def create_onboarding_guide():
    """Create a personalized onboarding guide"""
    try:
        # Validate request data
        schema = OnboardingGuideSchema()
        data = schema.load(request.json)
        
        # Prepare user data
        user_data = {
            'name': data['name'],
            'company': data['company'],
            'plan': data['plan'],
            'features': data.get('features', [])
        }
        
        # Create onboarding guide
        result = await foxit_service.create_onboarding_guide(user_data)
        
        if result['success']:
            return jsonify({
                'success': True,
                'document_url': result['document_url'],
                'document_id': result['document_id'],
                'file_size': result['file_size'],
                'generated_at': result['generated_at'],
                'timestamp': datetime.utcnow().isoformat()
            })
        else:
            return jsonify(result), 400
            
    except Exception as e:
        logger.error(f"Onboarding guide creation failed: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Onboarding guide creation failed',
            'details': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500

@foxit_bp.route('/create-invoice', methods=['POST'])
@run_async
async def create_invoice():
    """Create a professional invoice"""
    try:
        # Validate request data
        schema = InvoiceSchema()
        data = schema.load(request.json)
        
        # Prepare billing data
        billing_data = {
            'invoice_number': data['invoice_number'],
            'customer_name': data['customer_name'],
            'company_name': data['company_name'],
            'plan_name': data['plan_name'],
            'amount': data['amount'],
            'currency': data.get('currency', 'USD'),
            'due_date': data.get('due_date', ''),
            'items': data.get('items', [])
        }
        
        # Create invoice
        result = await foxit_service.create_invoice(billing_data)
        
        if result['success']:
            return jsonify({
                'success': True,
                'document_url': result['document_url'],
                'document_id': result['document_id'],
                'file_size': result['file_size'],
                'generated_at': result['generated_at'],
                'timestamp': datetime.utcnow().isoformat()
            })
        else:
            return jsonify(result), 400
            
    except Exception as e:
        logger.error(f"Invoice creation failed: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Invoice creation failed',
            'details': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500

@foxit_bp.route('/batch-generate', methods=['POST'])
@run_async
async def batch_generate_documents():
    """Generate multiple documents in batch"""
    try:
        request_data = request.json
        documents = request_data.get('documents', [])
        
        if not documents:
            return jsonify({
                'success': False,
                'error': 'No documents specified for batch generation',
                'timestamp': datetime.utcnow().isoformat()
            }), 400
        
        results = []
        
        for doc_request in documents:
            try:
                # Validate each document request
                schema = DocumentGenerationSchema()
                data = schema.load(doc_request)
                
                # Generate document
                result = await foxit_service.generate_document(
                    template_id=data['template_id'],
                    data=data['data'],
                    output_format=data.get('output_format', 'pdf')
                )
                
                results.append({
                    'request_id': doc_request.get('request_id', 'unknown'),
                    'success': result['success'],
                    'document_url': result.get('document_url'),
                    'error': result.get('error'),
                    'details': result.get('details')
                })
                
            except Exception as e:
                results.append({
                    'request_id': doc_request.get('request_id', 'unknown'),
                    'success': False,
                    'error': 'Document generation failed',
                    'details': str(e)
                })
        
        return jsonify({
            'success': True,
            'batch_results': results,
            'total_documents': len(documents),
            'successful_documents': len([r for r in results if r['success']]),
            'failed_documents': len([r for r in results if not r['success']]),
            'timestamp': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Batch document generation failed: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Batch document generation failed',
            'details': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500

@foxit_bp.route('/workflow-templates', methods=['GET'])
def get_workflow_templates():
    """Get predefined workflow templates for common document processing tasks"""
    try:
        workflow_templates = {
            'welcome_packet': {
                'name': 'Welcome Packet',
                'description': 'Generate welcome letter and contract, merge, compress, and watermark',
                'steps': ['merge', 'compress', 'watermark'],
                'config': {
                    'compress': True,
                    'compression_level': 'high',
                    'watermark': {
                        'type': 'text',
                        'text': 'Prepared for {{customer_name}}',
                        'opacity': 0.3,
                        'rotation': 45,
                        'position': 'center'
                    }
                }
            },
            'contract_package': {
                'name': 'Contract Package',
                'description': 'Generate contract with terms, compress and secure',
                'steps': ['compress', 'secure'],
                'config': {
                    'compress': True,
                    'compression_level': 'medium',
                    'add_security': {
                        'permissions': ['print'],
                        'encryption_level': '256'
                    }
                }
            },
            'invoice_package': {
                'name': 'Invoice Package',
                'description': 'Generate invoice with watermark and compression',
                'steps': ['watermark', 'compress'],
                'config': {
                    'compress': True,
                    'compression_level': 'high',
                    'watermark': {
                        'type': 'text',
                        'text': 'INVOICE',
                        'opacity': 0.2,
                        'rotation': 0,
                        'position': 'top-right'
                    }
                }
            }
        }
        
        return jsonify({
            'success': True,
            'workflow_templates': workflow_templates,
            'timestamp': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Failed to get workflow templates: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to get workflow templates',
            'details': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500

# Error handlers
@foxit_bp.errorhandler(400)
def bad_request(error):
    return jsonify({
        'success': False,
        'error': 'Bad request',
        'details': 'Invalid request data',
        'timestamp': datetime.utcnow().isoformat()
    }), 400

@foxit_bp.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'error': 'Not found',
        'details': 'The requested resource was not found',
        'timestamp': datetime.utcnow().isoformat()
    }), 404

@foxit_bp.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'error': 'Internal server error',
        'details': 'An unexpected error occurred',
        'timestamp': datetime.utcnow().isoformat()
    }), 500
