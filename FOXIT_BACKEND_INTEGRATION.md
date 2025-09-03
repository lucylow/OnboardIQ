# Foxit Backend Integration Guide

## Overview

This guide explains how to integrate the new Foxit backend API with the existing OnboardIQ frontend. The backend provides a complete Node.js Express server that handles Foxit Document Generation API and PDF Services API requests, with comprehensive mock responses for development.

## 🚀 Backend Features

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

## 📁 Backend Structure

```
backend/
├── routes/
│   └── foxit.js              # Foxit API routes
├── integrations/
│   └── foxitIntegration.js   # Existing Foxit integration
├── server.js                 # Main server file
└── package.json             # Dependencies
```

## 🔧 Setup Instructions

### 1. Backend Dependencies

The backend already includes all necessary dependencies:

```json
{
  "express": "^4.18.2",
  "body-parser": "^1.20.2",
  "axios": "^1.6.0",
  "cors": "^2.8.5",
  "helmet": "^7.1.0",
  "dotenv": "^16.3.1"
}
```

### 2. Environment Configuration

Add these to your `backend/config.env` file:

```bash
# Foxit API Configuration
FOXIT_API_KEY=your_foxit_api_key_here
FOXIT_API_BASE_URL=https://api.foxit.com

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 3. Frontend Environment Variables

Update your frontend `.env` file:

```bash
# Foxit API Configuration
VITE_FOXIT_API_BASE_URL=http://localhost:3000/api/foxit
VITE_FOXIT_API_KEY=your_foxit_api_key_here
VITE_USE_MOCK_FOXIT=false

# Backend API URL
VITE_BACKEND_API_URL=http://localhost:3000/api
```

## 🛠️ API Endpoints

### Health Check
```http
GET /api/foxit/health
Headers: x-api-key: your_api_key
```

### Get Templates
```http
GET /api/foxit/templates
Headers: x-api-key: your_api_key
```

### Generate Document
```http
POST /api/foxit/generate-document
Headers: x-api-key: your_api_key
Content-Type: application/json

{
  "template_id": "welcome_packet",
  "data": {
    "customer_name": "John Smith",
    "company_name": "TechCorp Inc",
    "start_date": "2024-01-15",
    "welcome_message": "Welcome to our platform!"
  },
  "output_format": "pdf",
  "options": {
    "include_metadata": true,
    "watermark": false,
    "compression_level": "high"
  }
}
```

### Process PDF Workflow
```http
POST /api/foxit/process-pdf-workflow
Headers: x-api-key: your_api_key
Content-Type: application/json

{
  "workflow_id": "secure_delivery",
  "document_ids": ["doc_123", "doc_456"],
  "operations": ["encrypt", "watermark", "compress"],
  "options": {
    "watermark_text": "OnboardIQ - Confidential",
    "password_protection": true,
    "compression_level": "high"
  }
}
```

### Get Document Metadata
```http
GET /api/foxit/documents/:id/metadata
Headers: x-api-key: your_api_key
```

### Download Document
```http
GET /api/foxit/documents/:id/download
Headers: x-api-key: your_api_key
```

### Batch Generate Documents
```http
POST /api/foxit/batch-generate
Headers: x-api-key: your_api_key
Content-Type: application/json

{
  "requests": [
    {
      "template_id": "welcome_packet",
      "data": { "customer_name": "John Smith" }
    },
    {
      "template_id": "contract",
      "data": { "client_name": "TechCorp Inc" }
    }
  ]
}
```

### Get Job Status
```http
GET /api/foxit/jobs/:id/status
Headers: x-api-key: your_api_key
```

## 🎯 Usage Examples

### 1. Starting the Backend

```bash
cd backend
npm install
npm start
```

The server will start on `http://localhost:3000` with these endpoints available:
- `http://localhost:3000/api/foxit/*` - Foxit API endpoints
- `http://localhost:3000/health` - Main health check

### 2. Frontend Integration

The frontend is already configured to use the backend. The `foxitApiService.ts` will automatically connect to the backend endpoints.

```tsx
import { foxitApiService } from '../services/foxitApiService';

// Generate a document
const response = await foxitApiService.generateDocument({
  template_id: 'welcome_packet',
  data: {
    customer_name: 'John Smith',
    company_name: 'TechCorp Inc',
    start_date: '2024-01-15',
    welcome_message: 'Welcome to our platform!'
  },
  output_format: 'pdf'
});

console.log('Document generated:', response.document_url);
```

### 3. Using the FoxitPDFGenerator Component

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

### 4. Using the FoxitDocumentWorkflow Component

```tsx
import { FoxitDocumentWorkflow } from './components/FoxitDocumentWorkflow';

function WorkflowApp() {
  return (
    <FoxitDocumentWorkflow
      userId="user_123"
      onWorkflowComplete={(result) => {
        console.log('Workflow completed:', result);
      }}
      onWorkflowFailed={(error) => {
        console.error('Workflow failed:', error);
      }}
    />
  );
}
```

## 🔒 Authentication

The backend uses API key authentication:

```javascript
// Frontend service automatically includes the API key
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${this.apiKey}`,
  'X-API-Version': 'v1',
};
```

## 📊 Mock Responses

For development, the backend provides realistic mock responses:

### Document Generation Response
```json
{
  "success": true,
  "document_id": "doc_1703123456789_abc123def",
  "document_url": "https://mock-foxit.com/documents/doc_1703123456789.pdf",
  "file_size": "2.3 MB",
  "generated_at": "2024-01-15T10:30:45.123Z",
  "template_used": "welcome_packet",
  "data_fields": ["customer_name", "company_name", "start_date", "welcome_message"]
}
```

### PDF Workflow Response
```json
{
  "success": true,
  "processed_document_id": "processed_1703123456789_xyz789ghi",
  "processed_document_url": "https://mock-foxit.com/processed/processed_1703123456789.pdf",
  "file_size": "1.8 MB",
  "processed_at": "2024-01-15T10:31:15.456Z",
  "workflow_applied": "secure_delivery",
  "operations_performed": ["encrypt", "watermark", "compress"]
}
```

## 🚨 Error Handling

The backend provides comprehensive error handling:

### Missing API Key
```json
{
  "success": false,
  "error": "API key is required",
  "code": "MISSING_API_KEY"
}
```

### Invalid Request
```json
{
  "success": false,
  "error": "template_id is required",
  "code": "MISSING_TEMPLATE_ID"
}
```

### Server Error
```json
{
  "success": false,
  "error": "Document generation failed",
  "details": "Internal server error"
}
```

## 🔄 Production Deployment

### 1. Environment Setup
```bash
# Production environment variables
NODE_ENV=production
PORT=3000
FOXIT_API_KEY=your_production_api_key
FOXIT_API_BASE_URL=https://api.foxit.com
```

### 2. Enable Real API Calls
Uncomment the actual Foxit API calls in `backend/routes/foxit.js`:

```javascript
// Replace mock responses with real API calls
const response = await axios.post(`${process.env.FOXIT_API_BASE_URL}/documents/generate`, foxitRequest, {
  headers: { 'x-api-key': req.foxitApiKey }
});
```

### 3. Frontend Configuration
```bash
# Production frontend environment
VITE_FOXIT_API_BASE_URL=https://your-backend.com/api/foxit
VITE_FOXIT_API_KEY=your_production_api_key
VITE_USE_MOCK_FOXIT=false
```

## 🧪 Testing

### 1. Test Backend Endpoints
```bash
# Health check
curl -H "x-api-key: test_key" http://localhost:3000/api/foxit/health

# Get templates
curl -H "x-api-key: test_key" http://localhost:3000/api/foxit/templates

# Generate document
curl -X POST -H "x-api-key: test_key" -H "Content-Type: application/json" \
  -d '{"template_id":"welcome_packet","data":{"customer_name":"Test User"}}' \
  http://localhost:3000/api/foxit/generate-document
```

### 2. Test Frontend Integration
```bash
# Start frontend
npm run dev

# Navigate to Foxit components
# - /foxit-demo - FoxitDemoPage
# - /foxit-workflow - FoxitDocumentWorkflow
# - /foxit-generator - FoxitPDFGenerator
```

## 📈 Monitoring

### Backend Logs
The backend provides detailed logging:

```
🔍 Foxit health check requested
📄 Fetching Foxit templates
📝 Generating document with template: welcome_packet
✅ Document generated successfully: doc_1703123456789_abc123def
⚙️ Processing PDF workflow: secure_delivery
✅ PDF workflow completed: processed_1703123456789_xyz789ghi
```

### Health Check Endpoint
```http
GET /health
```

Returns comprehensive system status:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:45.123Z",
  "ai": {
    "userProfiling": true,
    "conversational": true,
    "security": true,
    "document": true,
    "churnPredictor": true
  },
  "integrations": {
    "vonage": true,
    "foxit": true,
    "muleSoft": true
  }
}
```

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend CORS is configured correctly
   - Check frontend URL matches backend CORS settings

2. **API Key Issues**
   - Verify API key is set in environment variables
   - Check API key format in requests

3. **Connection Errors**
   - Ensure backend is running on correct port
   - Check firewall settings
   - Verify network connectivity

4. **Mock vs Real API**
   - Set `VITE_USE_MOCK_FOXIT=false` for real API calls
   - Ensure production API key is configured

### Debug Mode

Enable debug logging:

```bash
# Backend debug
DEBUG=foxit:* npm start

# Frontend debug
VITE_DEBUG=true npm run dev
```

## 📚 Additional Resources

- [Foxit API Documentation](https://developers.foxit.com)
- [Express.js Documentation](https://expressjs.com)
- [Frontend Integration Guide](./FOXIT_API_INTEGRATION.md)
- [Backend Architecture](./BACKEND_SUMMARY.md)

---

**Note**: This backend integration provides a complete solution for Foxit API integration with comprehensive error handling, mock responses for development, and production-ready deployment capabilities.
