# Foxit API Integration for OnboardIQ

## Overview

This document describes the comprehensive integration of Foxit's Document Generation API and PDF Services API into the OnboardIQ customer onboarding platform. The integration enables automated, personalized document creation and processing workflows.

## Features

- **Document Generation**: Create personalized documents from templates
- **PDF Processing Workflows**: Chain multiple PDF operations (merge, compress, watermark, secure)
- **Welcome Packets**: Automated generation of welcome letters and contracts
- **Onboarding Guides**: Personalized step-by-step guides
- **Invoice Generation**: Professional billing documents
- **Batch Processing**: Generate multiple documents simultaneously

## Architecture

```
Frontend (React) → Backend (Flask) → Foxit APIs → Document Delivery
```

### Components

1. **Foxit Service** (`backend/src/services/foxit_service.py`)
   - Handles API communication with Foxit
   - Manages authentication and error handling
   - Implements document generation and processing workflows

2. **Foxit Routes** (`backend/src/routes/foxit_routes.py`)
   - RESTful API endpoints for document operations
   - Request validation using Marshmallow schemas
   - Async support for long-running operations

3. **Frontend Service** (`src/services/foxitApi.ts`)
   - TypeScript service for frontend integration
   - Type-safe API calls with comprehensive interfaces
   - Utility methods for document handling

## Setup

### 1. Foxit Account Setup

1. Sign up for a Foxit developer account
2. Obtain API credentials from the Foxit dashboard
3. Create document templates for:
   - Welcome packets
   - Contracts
   - Onboarding guides
   - Invoices

### 2. Environment Configuration

Add the following to your `.env` file:

```bash
# Foxit Configuration
FOXIT_API_BASE_URL=https://api.foxit.com
FOXIT_API_KEY=your_foxit_api_key
FOXIT_API_SECRET=your_foxit_api_secret
FOXIT_WELCOME_TEMPLATE_ID=template-welcome-123
FOXIT_CONTRACT_TEMPLATE_ID=template-contract-456
FOXIT_GUIDE_TEMPLATE_ID=template-guide-789
FOXIT_INVOICE_TEMPLATE_ID=template-invoice-101
```

### 3. Backend Installation

The Foxit service is already integrated into the backend. No additional installation required.

### 4. Frontend Integration

The frontend service is available at `src/services/foxitApi.ts` and can be imported directly.

## API Endpoints

### Health Check
```http
GET /api/foxit/health
```

**Response:**
```json
{
  "success": true,
  "service": "foxit",
  "status": "healthy",
  "api_key_configured": true,
  "templates_configured": true,
  "response_time": 0.245,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Get Templates
```http
GET /api/foxit/templates
```

**Response:**
```json
{
  "success": true,
  "templates": {
    "welcome_packet": "template-welcome-123",
    "contract": "template-contract-456",
    "onboarding_guide": "template-guide-789",
    "invoice": "template-invoice-101"
  },
  "api_base_url": "https://api.foxit.com",
  "endpoints": {
    "document_generation": "https://api.foxit.com/docgen/v1/generate",
    "pdf_services": "https://api.foxit.com/pdfservices/v1/workflow"
  },
  "status": "configured"
}
```

### Generate Document
```http
POST /api/foxit/generate-document
```

**Request:**
```json
{
  "template_id": "template-welcome-123",
  "data": {
    "customer_name": "Sarah Connor",
    "company_name": "Cyberdyne Systems",
    "plan_name": "Premium Team Plan",
    "signup_date": "2024-01-15"
  },
  "output_format": "pdf"
}
```

**Response:**
```json
{
  "success": true,
  "document_url": "https://api.foxit.com/documents/abc123/download",
  "document_id": "doc_abc123",
  "file_size": 245760,
  "generated_at": "2024-01-15T10:30:00Z"
}
```

### Process PDF Workflow
```http
POST /api/foxit/process-pdf-workflow
```

**Request:**
```json
{
  "document_urls": [
    "https://api.foxit.com/documents/welcome.pdf",
    "https://api.foxit.com/documents/contract.pdf"
  ],
  "workflow_config": {
    "compress": true,
    "compression_level": "high",
    "watermark": {
      "type": "text",
      "text": "Prepared for Sarah Connor",
      "opacity": 0.3,
      "rotation": 45,
      "position": "center"
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "final_document_url": "https://api.foxit.com/documents/final_abc123.pdf",
  "workflow_id": "workflow_xyz789",
  "processing_time": 2.45,
  "file_size": 184320,
  "completed_at": "2024-01-15T10:32:00Z"
}
```

### Create Welcome Packet
```http
POST /api/foxit/create-welcome-packet
```

**Request:**
```json
{
  "name": "Sarah Connor",
  "company": "Cyberdyne Systems",
  "plan": "Premium Team Plan",
  "email": "sarah@cyberdyne.com",
  "phone": "+1234567890",
  "account_id": "acc_123456"
}
```

**Response:**
```json
{
  "success": true,
  "final_document_url": "https://api.foxit.com/documents/welcome_packet_abc123.pdf",
  "welcome_document_url": "https://api.foxit.com/documents/welcome_abc123.pdf",
  "contract_document_url": "https://api.foxit.com/documents/contract_abc123.pdf",
  "workflow_id": "workflow_xyz789",
  "user_data": {
    "customer_name": "Sarah Connor",
    "company_name": "Cyberdyne Systems",
    "plan_name": "Premium Team Plan"
  },
  "created_at": "2024-01-15T10:30:00Z"
}
```

## Frontend Usage

### Basic Document Generation

```typescript
import { foxitApiService } from '@/services/foxitApi';

// Generate a simple document
const result = await foxitApiService.generateDocument({
  template_id: 'template-welcome-123',
  data: {
    customer_name: 'Sarah Connor',
    company_name: 'Cyberdyne Systems',
    plan_name: 'Premium Team Plan'
  },
  output_format: 'pdf'
});

if (result.success) {
  // Download the document
  await foxitApiService.downloadDocument(result.document_url!, 'welcome.pdf');
}
```

### Create Welcome Packet

```typescript
// Create a complete welcome packet
const welcomePacket = await foxitApiService.createWelcomePacketForUser({
  name: 'Sarah Connor',
  company: 'Cyberdyne Systems',
  plan: 'Premium Team Plan',
  email: 'sarah@cyberdyne.com',
  phone: '+1234567890',
  account_id: 'acc_123456'
});

if (welcomePacket.success) {
  // Open the final document in a new tab
  await foxitApiService.openDocumentInNewTab(welcomePacket.final_document_url!);
}
```

### Process Documents with Workflow

```typescript
// Process multiple documents with a predefined workflow
const workflowResult = await foxitApiService.processDocumentsWithWorkflow(
  [
    'https://api.foxit.com/documents/doc1.pdf',
    'https://api.foxit.com/documents/doc2.pdf'
  ],
  'welcome_packet'
);

if (workflowResult.success) {
  console.log('Workflow completed:', workflowResult.final_document_url);
}
```

### Batch Document Generation

```typescript
// Generate multiple documents in batch
const batchResult = await foxitApiService.batchGenerateDocuments({
  documents: [
    {
      request_id: 'req1',
      template_id: 'template-welcome-123',
      data: { customer_name: 'Sarah Connor' }
    },
    {
      request_id: 'req2',
      template_id: 'template-contract-456',
      data: { customer_name: 'John Doe' }
    }
  ]
});

console.log(`Generated ${batchResult.successful_documents} out of ${batchResult.total_documents} documents`);
```

## Workflow Templates

The system includes predefined workflow templates for common document processing tasks:

### Welcome Packet Workflow
- **Steps**: Merge → Compress → Watermark
- **Purpose**: Combine welcome letter and contract, optimize file size, add personalized watermark

### Contract Package Workflow
- **Steps**: Compress → Secure
- **Purpose**: Optimize contract PDF and add security restrictions

### Invoice Package Workflow
- **Steps**: Watermark → Compress
- **Purpose**: Add invoice watermark and optimize file size

## Error Handling

The integration includes comprehensive error handling:

```typescript
try {
  const result = await foxitApiService.createWelcomePacket(request);
  if (result.success) {
    // Handle success
  } else {
    console.error('Foxit API error:', result.error, result.details);
  }
} catch (error) {
  console.error('Network or unexpected error:', error);
}
```

## Security Considerations

1. **API Key Management**: Store API keys securely in environment variables
2. **Document Access**: Generated documents are accessible via secure URLs
3. **Watermarking**: Add watermarks to prevent unauthorized use
4. **Encryption**: Support for PDF encryption and password protection

## Performance Optimization

1. **Async Processing**: Long-running operations are handled asynchronously
2. **Connection Pooling**: HTTP sessions are reused for better performance
3. **Batch Processing**: Multiple documents can be processed in a single request
4. **Caching**: Document URLs can be cached for repeated access

## Monitoring and Logging

The integration includes comprehensive logging:

```python
# Backend logging
logger.info(f"Document generated successfully: {document_url}")
logger.error(f"Document generation failed: {error}")

# Frontend logging
console.log('Document generation started');
console.error('Document generation failed:', error);
```

## Testing

### Health Check
```bash
curl http://localhost:5000/api/foxit/health
```

### Generate Test Document
```bash
curl -X POST http://localhost:5000/api/foxit/generate-document \
  -H "Content-Type: application/json" \
  -d '{
    "template_id": "template-welcome-123",
    "data": {
      "customer_name": "Test User",
      "company_name": "Test Company"
    }
  }'
```

## Troubleshooting

### Common Issues

1. **API Key Not Configured**
   - Ensure `FOXIT_API_KEY` is set in environment variables
   - Check API key validity in Foxit dashboard

2. **Template Not Found**
   - Verify template IDs are correct
   - Ensure templates exist in your Foxit account

3. **Network Errors**
   - Check internet connectivity
   - Verify Foxit API endpoints are accessible

4. **Document Generation Fails**
   - Validate request data format
   - Check template variable names match data fields

### Debug Mode

Enable debug logging by setting:
```bash
LOG_LEVEL=DEBUG
```

## Integration Examples

### Complete Onboarding Flow

```typescript
// 1. User signs up
const user = await signupUser(userData);

// 2. Generate welcome packet
const welcomePacket = await foxitApiService.createWelcomePacketForUser({
  name: user.name,
  company: user.company,
  plan: user.plan,
  email: user.email,
  phone: user.phone
});

// 3. Send welcome email with document
await sendWelcomeEmail(user.email, welcomePacket.final_document_url);

// 4. Generate onboarding guide
const guide = await foxitApiService.createOnboardingGuideForUser({
  name: user.name,
  company: user.company,
  plan: user.plan,
  features: user.plan_features
});

// 5. Store document references
await saveUserDocuments(user.id, {
  welcome_packet: welcomePacket.final_document_url,
  onboarding_guide: guide.document_url
});
```

This comprehensive Foxit integration provides a robust foundation for automated document generation and processing in the OnboardIQ platform, enabling personalized customer onboarding experiences with professional document workflows.
