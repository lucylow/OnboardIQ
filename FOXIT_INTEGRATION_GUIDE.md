# Foxit PDF Integration Guide

## Overview

This guide covers the comprehensive Foxit API integration for OnboardIQ, enabling automated document generation and PDF processing workflows. The integration includes both **Foxit Document Generation API** and **Foxit PDF Services API** for complete document lifecycle management.

## 🚀 Features

### Document Generation API
- **Template-based generation** with dynamic content insertion
- **Personalized documents** (welcome packets, contracts, invoices)
- **Multiple output formats** (PDF, DOCX, HTML)
- **Batch processing** for multiple documents
- **Real-time progress tracking**

### PDF Services API
- **Document merging and splitting**
- **Compression and optimization**
- **Watermark and security features**
- **Password protection and encryption**
- **Workflow automation**

## 📁 File Structure

```
src/
├── components/
│   ├── FoxitPDFGenerator.tsx      # Main PDF generation component
│   ├── FoxitDemoPage.tsx          # Demo page showcasing features
│   └── DocumentGeneration.tsx     # Original document component
├── services/
│   ├── foxitApiService.ts         # Enhanced Foxit API service
│   └── foxitApi.ts                # Original API service
└── ...
```

## 🔧 Setup & Configuration

### 1. Environment Variables

Add these to your `.env` file:

```bash
# Foxit API Configuration
VITE_FOXIT_API_BASE_URL=https://api.foxit.com
VITE_FOXIT_API_KEY=your_foxit_api_key_here
VITE_USE_MOCK_FOXIT=false

# Backend API (if using proxy)
VITE_BACKEND_API_URL=http://localhost:5000/api
```

### 2. API Key Setup

1. Sign up for a Foxit developer account
2. Obtain your API key from the Foxit dashboard
3. Configure templates in your Foxit account:
   - Welcome Packet Template
   - Service Contract Template
   - Onboarding Guide Template
   - Invoice Template

### 3. Backend Integration

The backend should have these endpoints:

```python
# backend/src/routes/foxit_routes.py
@foxit_bp.route('/generate-document', methods=['POST'])
@foxit_bp.route('/process-pdf-workflow', methods=['POST'])
@foxit_bp.route('/templates', methods=['GET'])
@foxit_bp.route('/documents/<id>/metadata', methods=['GET'])
@foxit_bp.route('/documents/<id>/download', methods=['GET'])
@foxit_bp.route('/health', methods=['GET'])
```

## 🎯 Usage Examples

### 1. Basic Document Generation

```tsx
import { FoxitPDFGenerator } from './components/FoxitPDFGenerator';

function App() {
  return (
    <FoxitPDFGenerator
      userId="user_123"
      onDocumentGenerated={(document) => {
        console.log('Document generated:', document);
      }}
      onDocumentFailed={(error) => {
        console.error('Generation failed:', error);
      }}
    />
  );
}
```

### 2. Using the API Service Directly

```tsx
import { foxitApiService } from './services/foxitApiService';

// Generate a document
const response = await foxitApiService.generateDocument({
  template_id: 'welcome_packet',
  data: {
    customer_name: 'John Smith',
    company_name: 'TechCorp Inc',
    start_date: '2024-01-15',
    welcome_message: 'Welcome to our platform!'
  },
  output_format: 'pdf',
  options: {
    include_metadata: true,
    watermark: false,
    compression_level: 'high'
  }
});

// Process PDF workflow
const workflowResponse = await foxitApiService.processPdfWorkflow({
  workflow_id: 'secure_delivery',
  document_ids: ['doc_123', 'doc_456'],
  operations: ['encrypt', 'watermark', 'compress'],
  options: {
    watermark_text: 'OnboardIQ - Confidential',
    password_protection: true,
    compression_level: 'high'
  }
});
```

### 3. Demo Page Integration

```tsx
import { FoxitDemoPage } from './components/FoxitDemoPage';

function DemoApp() {
  return (
    <div>
      <FoxitDemoPage />
    </div>
  );
}
```

## 📋 Available Templates

### 1. Welcome Packet
- **ID**: `welcome_packet`
- **Fields**: `customer_name`, `company_name`, `start_date`, `welcome_message`
- **Use Case**: New customer onboarding

### 2. Service Contract
- **ID**: `contract`
- **Fields**: `client_name`, `service_type`, `contract_value`, `start_date`, `end_date`
- **Use Case**: Legal agreements

### 3. Onboarding Guide
- **ID**: `onboarding_guide`
- **Fields**: `customer_name`, `product_name`, `onboarding_steps`, `support_contact`
- **Use Case**: Customer education

### 4. Invoice
- **ID**: `invoice`
- **Fields**: `client_name`, `invoice_number`, `amount`, `due_date`, `services`
- **Use Case**: Billing documents

## 🔄 PDF Processing Workflows

### 1. Secure Delivery
- **Operations**: `encrypt`, `watermark`, `compress`
- **Use Case**: Sensitive document delivery

### 2. Batch Processing
- **Operations**: `merge`, `compress`, `optimize`
- **Use Case**: Multiple document consolidation

### 3. Branded Delivery
- **Operations**: `watermark`, `brand`, `compress`
- **Use Case**: Company-branded documents

## 🛠️ API Methods

### Document Generation
```tsx
// Generate single document
foxitApiService.generateDocument(request: DocumentGenerationRequest)

// Batch generate documents
foxitApiService.batchGenerateDocuments(requests: DocumentGenerationRequest[])

// Get available templates
foxitApiService.getTemplates()
```

### PDF Processing
```tsx
// Process PDF workflow
foxitApiService.processPdfWorkflow(request: PDFWorkflowRequest)

// Get processing status
foxitApiService.getProcessingStatus(jobId: string)
```

### Document Management
```tsx
// Get document metadata
foxitApiService.getDocumentMetadata(documentId: string)

// Download document
foxitApiService.downloadDocument(documentId: string)
```

### Utility Methods
```tsx
// Validate template data
foxitApiService.validateTemplateData(templateId: string, data: Record<string, any>)

// Check connection status
foxitApiService.getConnectionStatus()

// Handle API errors
foxitApiService.handleApiError(error: any)
```

## 🎨 Component Features

### FoxitPDFGenerator
- **Template Selection**: Visual template picker with descriptions
- **Dynamic Forms**: Auto-generated forms based on template fields
- **Progress Tracking**: Real-time generation progress
- **Document Management**: View and download generated documents
- **Workflow Processing**: Apply PDF processing workflows

### FoxitDemoPage
- **Overview**: Feature showcase and use cases
- **Interactive Demo**: Live document generation
- **Document Gallery**: View generated documents
- **Technical Details**: API features and benefits

## 🔒 Security Features

### Authentication
- Bearer token authentication
- API key validation
- Rate limiting support

### Document Security
- 256-bit AES encryption
- Password protection
- Digital signatures
- Access control lists
- Audit logging

### Data Protection
- Secure API communication (HTTPS)
- Input validation and sanitization
- Error handling without data exposure

## 🚨 Error Handling

### Common Error Scenarios
```tsx
// Authentication errors
if (error.message?.includes('401')) {
  // Handle invalid API key
}

// Rate limiting
if (error.message?.includes('429')) {
  // Handle rate limit exceeded
}

// Server errors
if (error.message?.includes('500')) {
  // Handle server errors
}
```

### Error Recovery
- Automatic retry with exponential backoff
- Fallback to mock mode for development
- User-friendly error messages
- Graceful degradation

## 📊 Performance Optimization

### Best Practices
1. **Batch Processing**: Use batch APIs for multiple documents
2. **Async Operations**: Handle long-running operations asynchronously
3. **Caching**: Cache templates and metadata
4. **Compression**: Use appropriate compression levels
5. **Progress Tracking**: Show real-time progress to users

### Monitoring
- API response times
- Success/failure rates
- Document generation metrics
- User interaction analytics

## 🔧 Development

### Mock Mode
For development without API access:
```bash
VITE_USE_MOCK_FOXIT=true
```

### Testing
```tsx
// Test document generation
const mockRequest = {
  template_id: 'welcome_packet',
  data: { customer_name: 'Test User' }
};

const response = await foxitApiService.generateDocument(mockRequest);
expect(response.success).toBe(true);
```

### Debugging
- Enable console logging for API calls
- Use browser dev tools for network inspection
- Check API response structure
- Validate request payloads

## 📈 Production Deployment

### Environment Setup
1. Configure production API endpoints
2. Set up proper error monitoring
3. Implement logging and analytics
4. Configure backup and recovery

### Performance Monitoring
- Monitor API response times
- Track document generation success rates
- Monitor user engagement metrics
- Set up alerts for failures

### Security Checklist
- [ ] API keys are securely stored
- [ ] HTTPS is enforced
- [ ] Input validation is implemented
- [ ] Error messages don't expose sensitive data
- [ ] Rate limiting is configured
- [ ] Audit logging is enabled

## 🤝 Support & Troubleshooting

### Common Issues
1. **API Connection Failed**
   - Check API key validity
   - Verify network connectivity
   - Check API endpoint configuration

2. **Document Generation Failed**
   - Validate template data
   - Check required fields
   - Verify template exists

3. **PDF Processing Errors**
   - Check document format compatibility
   - Verify workflow configuration
   - Monitor file size limits

### Getting Help
- Check the Foxit API documentation
- Review error logs and console output
- Test with mock mode first
- Contact support with detailed error information

## 📚 Additional Resources

- [Foxit API Documentation](https://developers.foxit.com)
- [OnboardIQ Integration Guide](./ONBOARDIQ_INTEGRATION.md)
- [API Reference](./API_REFERENCE.md)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)

---

**Note**: This integration is designed to work seamlessly with the OnboardIQ platform. For custom implementations, refer to the Foxit API documentation for detailed endpoint specifications.
