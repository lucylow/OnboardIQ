# OnboardIQ MuleSoft Connectors Integration Guide

## DALL-E Prompt for MuleSoft Connector Visualization

### **Main Integration Flow Visualization**

```
Create a professional technical diagram showing a MuleSoft Anypoint Studio integration flow for a customer onboarding platform called "OnboardIQ". The diagram should display:

**Central Hub**: A large, modern "OnboardIQ Platform" hub in the center with a blue gradient background and white text.

**Connector Flow**: Show 8 key MuleSoft connectors arranged in a circular pattern around the central hub, each connected by flowing blue lines:

1. **HTTP Connector** (top) - REST API endpoints for user registration and verification
2. **Email Connector** (top-right) - Automated welcome emails and notifications
3. **Database Connector** (right) - PostgreSQL for user data storage
4. **Salesforce Connector** (bottom-right) - CRM lead management and customer tracking
5. **File Connector** (bottom) - Document generation and PDF processing
6. **SFTP Connector** (bottom-left) - Secure file transfers for compliance documents
7. **Validation Module** (left) - Data quality and input validation
8. **OAuth Module** (top-left) - Secure authentication and authorization

**Data Flow**: Show colorful data packets flowing between connectors with labels like "User Data", "Documents", "Verification Codes", "CRM Records".

**Visual Style**: Modern, clean, professional with a dark blue and white color scheme. Include small icons for each connector type. Add subtle animations or flow indicators showing data movement.

**Text Elements**: Include labels like "User Registration", "Document Generation", "Verification Process", "CRM Integration" around the flow.

**Background**: Subtle grid pattern with gradient overlay. Professional business presentation style.
```

### **Detailed Connector Usage Guide**

#### **1. HTTP Connector - API Gateway**
```
Create a technical diagram showing the HTTP Connector setup for OnboardIQ API endpoints:

**Main Components**:
- HTTP Listener on port 8081
- REST API endpoints: /api/onboardiq/users, /api/onboardiq/verification, /api/onboardiq/documents
- Request/Response flow with JSON payloads
- Error handling and validation

**Visual Elements**:
- Blue HTTP connector icon
- Green "200 OK" responses
- Red "400/500" error responses
- JSON data structure examples
- API documentation snippets

**Style**: Clean, technical, with code snippets and flow arrows.
```

#### **2. Email Connector - Communication Hub**
```
Create a visual flow diagram showing email automation for OnboardIQ:

**Email Flow**:
1. Welcome Email (user registration)
2. Verification Email (2FA codes)
3. Document Delivery (PDF attachments)
4. Completion Email (onboarding success)

**Technical Details**:
- SMTP configuration (Gmail/SendGrid)
- HTML email templates
- Attachment handling
- Delivery tracking

**Visual Style**: Email icons, envelope graphics, flow arrows, success/failure indicators.
```

#### **3. Database Connector - Data Persistence**
```
Create a database schema visualization for OnboardIQ:

**Database Structure**:
- Users table (id, email, phone, status, timestamps)
- Documents table (user_id, file_path, type, created_at)
- Verification table (user_id, code, expires_at)
- Audit table (user_id, action, timestamp)

**Connector Setup**:
- PostgreSQL connection
- CRUD operations
- Transaction handling
- Data validation

**Visual Elements**: Database icon, table schemas, relationship lines, data flow arrows.
```

#### **4. Salesforce Connector - CRM Integration**
```
Create a CRM integration diagram for OnboardIQ:

**Salesforce Objects**:
- Lead creation (new user registration)
- Contact management (verified users)
- Opportunity tracking (onboarding progress)
- Custom fields (onboarding status, document links)

**Integration Flow**:
- Real-time lead creation
- Contact updates
- Opportunity progression
- Custom field mapping

**Visual Style**: Salesforce logo, object relationships, data mapping arrows, success indicators.
```

#### **5. File Connector - Document Management**
```
Create a document processing flow for OnboardIQ:

**Document Operations**:
- PDF generation (welcome packets)
- File storage (secure document repository)
- File retrieval (user downloads)
- File validation (format checking)

**Technical Setup**:
- Local file system integration
- Cloud storage (AWS S3)
- File compression
- Security encryption

**Visual Elements**: File icons, document types, storage locations, processing steps.
```

#### **6. SFTP Connector - Secure File Transfer**
```
Create a secure file transfer diagram for OnboardIQ:

**SFTP Operations**:
- Secure document uploads
- Compliance file transfers
- Backup file synchronization
- Partner file sharing

**Security Features**:
- SSH key authentication
- Encrypted file transfers
- Access control
- Audit logging

**Visual Style**: Lock icons, secure connection indicators, file transfer arrows, encryption symbols.
```

#### **7. Validation Module - Data Quality**
```
Create a data validation flow for OnboardIQ:

**Validation Rules**:
- Email format validation
- Phone number formatting
- Required field checking
- Data type validation

**Error Handling**:
- Validation error messages
- Retry mechanisms
- Fallback options
- User feedback

**Visual Elements**: Check marks, error symbols, validation flow, success/failure paths.
```

#### **8. OAuth Module - Authentication**
```
Create an authentication flow for OnboardIQ:

**OAuth Flow**:
- User authorization
- Token generation
- API access control
- Session management

**Security Features**:
- JWT tokens
- Refresh tokens
- Scope management
- Token validation

**Visual Style**: Lock icons, token symbols, authentication flow, security indicators.
```

## **Complete Integration Architecture Prompt**

```
Create a comprehensive enterprise architecture diagram for OnboardIQ MuleSoft integration:

**Main Components**:
1. **Frontend Layer**: React application with user interface
2. **API Gateway**: MuleSoft HTTP connector handling requests
3. **Integration Layer**: MuleSoft flows orchestrating business logic
4. **External Services**: Vonage (SMS), Foxit (documents), Salesforce (CRM)
5. **Data Layer**: PostgreSQL database with user and document storage

**Connector Mapping**:
- HTTP Connector → API endpoints and webhooks
- Email Connector → Automated communications
- Database Connector → User data persistence
- Salesforce Connector → CRM lead management
- File Connector → Document storage and retrieval
- SFTP Connector → Secure file transfers
- Validation Module → Data quality assurance
- OAuth Module → Authentication and authorization

**Data Flow**:
- User registration → Database + Email + Salesforce
- Document generation → File system + Email
- Verification → SMS + Database update
- Completion → CRM update + Final email

**Visual Style**: Enterprise-grade, professional, with clear component separation, data flow arrows, and security indicators. Use a modern color palette with blue, green, and orange accents.

**Include**: Component icons, flow direction indicators, security badges, performance metrics, and scalability indicators.
```

## **Step-by-Step Implementation Guide**

### **Phase 1: Core Connectors**
1. **HTTP Connector** - Set up API endpoints
2. **Database Connector** - Configure PostgreSQL connection
3. **Validation Module** - Implement data validation

### **Phase 2: Communication Connectors**
4. **Email Connector** - Configure SMTP settings
5. **SFTP Connector** - Set up secure file transfers

### **Phase 3: Enterprise Integration**
6. **Salesforce Connector** - Configure CRM integration
7. **File Connector** - Set up document management
8. **OAuth Module** - Implement authentication

### **Phase 4: Advanced Features**
9. **ServiceNow Connector** - Support ticket creation
10. **Object Store Connector** - Caching and session management

## **Connector Priority for OnboardIQ**

### **Essential (Must Have)**
- HTTP Connector (API endpoints)
- Database Connector (data persistence)
- Email Connector (communications)
- Validation Module (data quality)

### **Important (Should Have)**
- Salesforce Connector (CRM integration)
- File Connector (document management)
- OAuth Module (security)
- SFTP Connector (secure transfers)

### **Optional (Nice to Have)**
- ServiceNow Connector (support)
- Object Store Connector (caching)
- Scripting Module (custom logic)
- XML Module (data transformation)

---

**Use these DALL-E prompts to create visual guides for implementing MuleSoft connectors in OnboardIQ!** 🚀
