import requests
import json
import os
from typing import Dict, List, Optional, Any
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class FoxitService:
    """
    Foxit Document Generation API and PDF Services API integration
    Handles personalized document generation and chained PDF processing workflows
    """
    
    def __init__(self):
        # Foxit API Configuration
        self.api_base_url = os.getenv('FOXIT_API_BASE_URL', 'https://api.foxit.com')
        self.doc_gen_endpoint = f"{self.api_base_url}/docgen/v1/generate"
        self.pdf_services_endpoint = f"{self.api_base_url}/pdfservices/v1/workflow"
        
        # Authentication
        self.api_key = os.getenv('FOXIT_API_KEY', 'your_foxit_api_key')
        self.api_secret = os.getenv('FOXIT_API_SECRET', 'your_foxit_api_secret')
        
        # Template IDs (configure these in your Foxit dashboard)
        self.templates = {
            'welcome_packet': os.getenv('FOXIT_WELCOME_TEMPLATE_ID', 'template-welcome-123'),
            'contract': os.getenv('FOXIT_CONTRACT_TEMPLATE_ID', 'template-contract-456'),
            'onboarding_guide': os.getenv('FOXIT_GUIDE_TEMPLATE_ID', 'template-guide-789'),
            'invoice': os.getenv('FOXIT_INVOICE_TEMPLATE_ID', 'template-invoice-101')
        }
        
        # Session for connection pooling
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json',
            'User-Agent': 'OnboardIQ-Foxit-Integration/1.0'
        })
    
    def _get_auth_headers(self) -> Dict[str, str]:
        """Generate authentication headers for Foxit API requests"""
        return {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json',
            'X-API-Version': 'v1'
        }
    
    def _handle_api_error(self, response: requests.Response, context: str) -> Dict[str, Any]:
        """Handle API errors and return structured error information"""
        try:
            error_data = response.json()
        except json.JSONDecodeError:
            error_data = {'message': response.text}
        
        logger.error(f"Foxit API error in {context}: {response.status_code} - {error_data}")
        
        return {
            'success': False,
            'error': f"Foxit API {context} failed",
            'status_code': response.status_code,
            'details': error_data,
            'timestamp': datetime.utcnow().isoformat()
        }
    
    async def generate_document(self, template_id: str, data: Dict[str, Any], 
                               output_format: str = 'pdf') -> Dict[str, Any]:
        """
        Generate a personalized document using Foxit Document Generation API
        
        Args:
            template_id: Foxit template identifier
            data: User data to merge into template
            output_format: Output format (pdf, docx, etc.)
        
        Returns:
            Dict containing success status and document URL
        """
        try:
            payload = {
                'templateId': template_id,
                'outputFormat': output_format,
                'data': data,
                'options': {
                    'includeMetadata': True,
                    'watermark': False  # We'll add watermark in PDF processing
                }
            }
            
            logger.info(f"Generating document with template {template_id}")
            
            response = self.session.post(
                self.doc_gen_endpoint,
                json=payload,
                headers=self._get_auth_headers(),
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                logger.info(f"Document generated successfully: {result.get('documentUrl', 'No URL')}")
                
                return {
                    'success': True,
                    'document_url': result.get('documentUrl'),
                    'document_id': result.get('documentId'),
                    'file_size': result.get('fileSize'),
                    'generated_at': datetime.utcnow().isoformat()
                }
            else:
                return self._handle_api_error(response, 'document generation')
                
        except requests.exceptions.RequestException as e:
            logger.error(f"Network error during document generation: {str(e)}")
            return {
                'success': False,
                'error': 'Network error during document generation',
                'details': str(e),
                'timestamp': datetime.utcnow().isoformat()
            }
        except Exception as e:
            logger.error(f"Unexpected error during document generation: {str(e)}")
            return {
                'success': False,
                'error': 'Unexpected error during document generation',
                'details': str(e),
                'timestamp': datetime.utcnow().isoformat()
            }
    
    async def process_pdf_workflow(self, document_urls: List[str], 
                                  workflow_config: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute chained PDF processing workflow using Foxit PDF Services API
        
        Args:
            document_urls: List of PDF URLs to process
            workflow_config: Configuration for the workflow steps
        
        Returns:
            Dict containing success status and final document URL
        """
        try:
            # Build workflow payload based on configuration
            workflow_payload = {
                'workflow': [],
                'inputFiles': document_urls,
                'outputFormat': 'pdf'
            }
            
            # Add merge step if multiple documents
            if len(document_urls) > 1:
                workflow_payload['workflow'].append({
                    'action': 'merge',
                    'inputFiles': document_urls,
                    'outputFile': 'merged.pdf'
                })
            
            # Add compression step
            if workflow_config.get('compress', True):
                input_file = 'merged.pdf' if len(document_urls) > 1 else document_urls[0]
                workflow_payload['workflow'].append({
                    'action': 'compress',
                    'inputFile': input_file,
                    'outputFile': 'compressed.pdf',
                    'options': {
                        'compressionLevel': workflow_config.get('compression_level', 'high'),
                        'imageQuality': workflow_config.get('image_quality', 0.8)
                    }
                })
            
            # Add watermark step
            if workflow_config.get('watermark'):
                watermark_config = workflow_config['watermark']
                input_file = 'compressed.pdf' if workflow_config.get('compress', True) else (
                    'merged.pdf' if len(document_urls) > 1 else document_urls[0]
                )
                
                workflow_payload['workflow'].append({
                    'action': 'watermark',
                    'inputFile': input_file,
                    'outputFile': 'watermarked.pdf',
                    'options': {
                        'type': watermark_config.get('type', 'text'),
                        'text': watermark_config.get('text', 'OnboardIQ'),
                        'opacity': watermark_config.get('opacity', 0.3),
                        'rotation': watermark_config.get('rotation', 45),
                        'position': watermark_config.get('position', 'center'),
                        'fontSize': watermark_config.get('font_size', 24),
                        'color': watermark_config.get('color', '#000000')
                    }
                })
            
            # Add security step (optional)
            if workflow_config.get('add_security'):
                security_config = workflow_config['add_security']
                input_file = 'watermarked.pdf' if workflow_config.get('watermark') else (
                    'compressed.pdf' if workflow_config.get('compress', True) else (
                        'merged.pdf' if len(document_urls) > 1 else document_urls[0]
                    )
                )
                
                workflow_payload['workflow'].append({
                    'action': 'secure',
                    'inputFile': input_file,
                    'outputFile': 'secured.pdf',
                    'options': {
                        'password': security_config.get('password'),
                        'permissions': security_config.get('permissions', ['print', 'copy']),
                        'encryptionLevel': security_config.get('encryption_level', '128')
                    }
                })
            
            logger.info(f"Executing PDF workflow with {len(workflow_payload['workflow'])} steps")
            
            response = self.session.post(
                self.pdf_services_endpoint,
                json=workflow_payload,
                headers=self._get_auth_headers(),
                timeout=60
            )
            
            if response.status_code == 200:
                result = response.json()
                logger.info(f"PDF workflow completed successfully: {result.get('finalDocumentUrl', 'No URL')}")
                
                return {
                    'success': True,
                    'final_document_url': result.get('finalDocumentUrl'),
                    'workflow_id': result.get('workflowId'),
                    'processing_time': result.get('processingTime'),
                    'file_size': result.get('fileSize'),
                    'completed_at': datetime.utcnow().isoformat()
                }
            else:
                return self._handle_api_error(response, 'PDF workflow processing')
                
        except requests.exceptions.RequestException as e:
            logger.error(f"Network error during PDF workflow: {str(e)}")
            return {
                'success': False,
                'error': 'Network error during PDF workflow processing',
                'details': str(e),
                'timestamp': datetime.utcnow().isoformat()
            }
        except Exception as e:
            logger.error(f"Unexpected error during PDF workflow: {str(e)}")
            return {
                'success': False,
                'error': 'Unexpected error during PDF workflow processing',
                'details': str(e),
                'timestamp': datetime.utcnow().isoformat()
            }
    
    async def create_welcome_packet(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a complete personalized welcome packet with chained document processing
        
        Args:
            user_data: User information for personalization
        
        Returns:
            Dict containing success status and final document URL
        """
        try:
            # Prepare data for document generation
            doc_data = {
                'customer_name': user_data.get('name', 'Valued Customer'),
                'company_name': user_data.get('company', 'Your Company'),
                'plan_name': user_data.get('plan', 'Standard Plan'),
                'signup_date': user_data.get('signup_date', datetime.now().strftime('%Y-%m-%d')),
                'email': user_data.get('email', ''),
                'phone': user_data.get('phone', ''),
                'account_id': user_data.get('account_id', ''),
                'welcome_message': f"Welcome to OnboardIQ, {user_data.get('name', 'Valued Customer')}!",
                'generated_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }
            
            # Step 1: Generate welcome document
            welcome_result = await self.generate_document(
                template_id=self.templates['welcome_packet'],
                data=doc_data
            )
            
            if not welcome_result['success']:
                return welcome_result
            
            # Step 2: Generate contract document
            contract_result = await self.generate_document(
                template_id=self.templates['contract'],
                data=doc_data
            )
            
            if not contract_result['success']:
                return contract_result
            
            # Step 3: Process documents through workflow
            document_urls = [
                welcome_result['document_url'],
                contract_result['document_url']
            ]
            
            workflow_config = {
                'compress': True,
                'compression_level': 'high',
                'watermark': {
                    'type': 'text',
                    'text': f"Prepared for {user_data.get('name', 'Customer')}",
                    'opacity': 0.3,
                    'rotation': 45,
                    'position': 'center',
                    'font_size': 20,
                    'color': '#666666'
                },
                'add_security': {
                    'password': None,  # No password for welcome packets
                    'permissions': ['print', 'copy'],
                    'encryption_level': '128'
                }
            }
            
            workflow_result = await self.process_pdf_workflow(document_urls, workflow_config)
            
            if workflow_result['success']:
                logger.info(f"Welcome packet created successfully for {user_data.get('name')}")
                
                return {
                    'success': True,
                    'final_document_url': workflow_result['final_document_url'],
                    'welcome_document_url': welcome_result['document_url'],
                    'contract_document_url': contract_result['document_url'],
                    'workflow_id': workflow_result['workflow_id'],
                    'user_data': doc_data,
                    'created_at': datetime.utcnow().isoformat()
                }
            else:
                return workflow_result
                
        except Exception as e:
            logger.error(f"Error creating welcome packet: {str(e)}")
            return {
                'success': False,
                'error': 'Failed to create welcome packet',
                'details': str(e),
                'timestamp': datetime.utcnow().isoformat()
            }
    
    async def create_onboarding_guide(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a personalized onboarding guide
        
        Args:
            user_data: User information for personalization
        
        Returns:
            Dict containing success status and document URL
        """
        try:
            doc_data = {
                'customer_name': user_data.get('name', 'Valued Customer'),
                'company_name': user_data.get('company', 'Your Company'),
                'plan_name': user_data.get('plan', 'Standard Plan'),
                'step_by_step_guide': True,
                'custom_features': user_data.get('features', []),
                'support_contact': 'support@onboardiq.com',
                'generated_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }
            
            result = await self.generate_document(
                template_id=self.templates['onboarding_guide'],
                data=doc_data
            )
            
            if result['success']:
                logger.info(f"Onboarding guide created for {user_data.get('name')}")
            
            return result
            
        except Exception as e:
            logger.error(f"Error creating onboarding guide: {str(e)}")
            return {
                'success': False,
                'error': 'Failed to create onboarding guide',
                'details': str(e),
                'timestamp': datetime.utcnow().isoformat()
            }
    
    async def create_invoice(self, billing_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a professional invoice
        
        Args:
            billing_data: Billing information
        
        Returns:
            Dict containing success status and document URL
        """
        try:
            doc_data = {
                'invoice_number': billing_data.get('invoice_number', 'INV-001'),
                'customer_name': billing_data.get('customer_name', 'Customer'),
                'company_name': billing_data.get('company_name', 'Company'),
                'plan_name': billing_data.get('plan_name', 'Plan'),
                'amount': billing_data.get('amount', 0),
                'currency': billing_data.get('currency', 'USD'),
                'due_date': billing_data.get('due_date', ''),
                'items': billing_data.get('items', []),
                'generated_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }
            
            result = await self.generate_document(
                template_id=self.templates['invoice'],
                data=doc_data
            )
            
            if result['success']:
                logger.info(f"Invoice created: {doc_data['invoice_number']}")
            
            return result
            
        except Exception as e:
            logger.error(f"Error creating invoice: {str(e)}")
            return {
                'success': False,
                'error': 'Failed to create invoice',
                'details': str(e),
                'timestamp': datetime.utcnow().isoformat()
            }
    
    def get_template_info(self) -> Dict[str, Any]:
        """Get information about available templates"""
        return {
            'templates': self.templates,
            'api_base_url': self.api_base_url,
            'endpoints': {
                'document_generation': self.doc_gen_endpoint,
                'pdf_services': self.pdf_services_endpoint
            },
            'status': 'configured' if self.api_key != 'your_foxit_api_key' else 'not_configured'
        }
    
    def health_check(self) -> Dict[str, Any]:
        """Check Foxit API connectivity and configuration"""
        try:
            # Simple health check endpoint (adjust based on Foxit API)
            health_url = f"{self.api_base_url}/health"
            response = self.session.get(health_url, timeout=10)
            
            return {
                'success': response.status_code == 200,
                'status': 'healthy' if response.status_code == 200 else 'unhealthy',
                'response_time': response.elapsed.total_seconds(),
                'api_key_configured': self.api_key != 'your_foxit_api_key',
                'templates_configured': len([v for v in self.templates.values() if v != 'template-123']) > 0
            }
        except Exception as e:
            return {
                'success': False,
                'status': 'error',
                'error': str(e),
                'api_key_configured': self.api_key != 'your_foxit_api_key',
                'templates_configured': len([v for v in self.templates.values() if v != 'template-123']) > 0
            }

# Global instance
foxit_service = FoxitService()

