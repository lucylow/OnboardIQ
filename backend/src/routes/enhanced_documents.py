from flask import Blueprint, request, jsonify, send_file, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import Schema, fields, ValidationError
from datetime import datetime
import os

from src.models.enhanced_models import db, User, Document
from src.services.enhanced_foxit_service import EnhancedFoxitService
from src.services.ai_personalization_service import AIPersonalizationService
from src.services.enhanced_logging_service import LoggingService

documents_bp = Blueprint('documents', __name__)

# Initialize services
foxit_service = EnhancedFoxitService()
ai_service = AIPersonalizationService()
logging_service = LoggingService()

# Validation schemas
class GenerateDocumentSchema(Schema):
    template_type = fields.Str(required=True, validate=lambda x: x in ['welcome_packet', 'contract', 'user_guide'])
    user_data = fields.Dict(missing=dict)
    ai_personalization = fields.Bool(missing=True)

@documents_bp.route('/generate', methods=['POST'])
@jwt_required()
def generate_document():
    """
    Generate personalized documents with AI enhancement
    """
    try:
        # Validate request
        schema = GenerateDocumentSchema()
        try:
            data = schema.load(request.get_json() or {})
        except ValidationError as err:
            return jsonify({
                'error': 'Validation failed',
                'details': err.messages
            }), 400
        
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Prepare user data for document generation
        user_data = {
            'user_id': user.user_id,
            'phone_number': user.phone_number,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            **data.get('user_data', {})
        }
        
        # Generate AI-enhanced content if requested
        ai_content = {}
        if data.get('ai_personalization', True):
            ai_result = ai_service.generate_smart_communication_content(
                user=user,
                communication_type='document',
                context={
                    'template_type': data['template_type'],
                    'user_data': user_data
                }
            )
            
            if ai_result['success']:
                ai_content = ai_result['content']
        
        # Generate document using Foxit service
        generation_result = foxit_service.generate_document(
            template_type=data['template_type'],
            user_data=user_data,
            ai_content=ai_content
        )
        
        if generation_result['success']:
            # Create document record
            document = Document(
                user_id=user.id,
                template_type=data['template_type'],
                title=f"{data['template_type'].replace('_', ' ').title()} - {user.first_name or user.user_id}",
                status='generated',
                file_path=generation_result.get('file_path'),
                ai_generated_content=ai_content,
                personalization_applied=bool(ai_content)
            )
            
            db.session.add(document)
            db.session.commit()
            
            logging_service.log_document_event(
                'document_generated',
                user_id=user.id,
                document_id=document.document_id,
                template_type=data['template_type'],
                ai_personalization=data.get('ai_personalization', True),
                ip_address=request.remote_addr
            )
            
            return jsonify({
                'success': True,
                'document': document.to_dict(),
                'download_url': f'/api/documents/download/{document.document_id}',
                'message': 'Document generated successfully'
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': generation_result.get('error', 'Document generation failed')
            }), 500
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error generating document: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@documents_bp.route('/download/<document_id>', methods=['GET'])
@jwt_required()
def download_document(document_id):
    """
    Download a generated document
    """
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Find document
        document = Document.query.filter_by(
            document_id=document_id,
            user_id=user.id
        ).first()
        
        if not document:
            return jsonify({'error': 'Document not found'}), 404
        
        if not document.file_path or not os.path.exists(document.file_path):
            return jsonify({'error': 'Document file not found'}), 404
        
        logging_service.log_document_event(
            'document_downloaded',
            user_id=user.id,
            document_id=document.document_id,
            ip_address=request.remote_addr
        )
        
        return send_file(
            document.file_path,
            as_attachment=True,
            download_name=f'{document.title}.pdf',
            mimetype='application/pdf'
        )
        
    except Exception as e:
        current_app.logger.error(f"Error downloading document: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@documents_bp.route('/list', methods=['GET'])
@jwt_required()
def list_documents():
    """
    List user's documents
    """
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get pagination parameters
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 10, type=int), 50)
        
        # Get user's documents
        documents = Document.query.filter_by(user_id=user.id).order_by(
            Document.created_at.desc()
        ).paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )
        
        return jsonify({
            'success': True,
            'documents': [doc.to_dict() for doc in documents.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': documents.total,
                'pages': documents.pages,
                'has_next': documents.has_next,
                'has_prev': documents.has_prev
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error listing documents: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@documents_bp.route('/templates', methods=['GET'])
def get_templates():
    """
    Get available document templates
    """
    try:
        templates = [
            {
                'id': 'welcome_packet',
                'name': 'Welcome Packet',
                'description': 'Personalized welcome packet for new users',
                'ai_enhanced': True
            },
            {
                'id': 'contract',
                'name': 'Service Contract',
                'description': 'Service agreement contract',
                'ai_enhanced': True
            },
            {
                'id': 'user_guide',
                'name': 'User Guide',
                'description': 'Personalized user guide and instructions',
                'ai_enhanced': True
            }
        ]
        
        return jsonify({
            'success': True,
            'templates': templates
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error fetching templates: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

