# OnboardIQ MuleSoft Integration

## Overview

This MuleSoft application provides comprehensive integration capabilities for the OnboardIQ customer onboarding platform. It orchestrates multi-channel onboarding workflows, document generation, verification processes, and CRM integrations.

## Features

### 🔄 **Core Onboarding Flows**
- **User Registration**: Automated user creation with email/SMS verification
- **Document Generation**: Dynamic PDF creation using Foxit APIs
- **Verification Process**: Multi-factor authentication with Vonage
- **Onboarding Completion**: End-to-end workflow orchestration

### 🔗 **Integration Connectors**
- **HTTP Connector**: REST API endpoints for OnboardIQ
- **Email Connector**: Automated email communications
- **Database Connector**: PostgreSQL integration for user data
- **Salesforce Connector**: CRM lead management
- **ServiceNow Connector**: Support ticket creation
- **File Connector**: Document storage and retrieval
- **SFTP Connector**: Secure file transfers
- **Validation Module**: Data quality assurance

### 📊 **API Management**
- **RAML Specification**: Complete API documentation
- **OAuth 2.0**: Secure authentication
- **Rate Limiting**: API protection
- **Monitoring**: Health checks and metrics

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   MuleSoft      │    │   External      │
│   (React)       │◄──►│   Integration   │◄──►│   Services      │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Database      │
                       │   (PostgreSQL)  │
                       └─────────────────┘
```

## Installation

### Prerequisites
- MuleSoft Anypoint Studio 7.x or higher
- Java 8 or higher
- Maven 3.6+
- PostgreSQL database
- Anypoint Platform account

### Setup Steps

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd mulesoft-onboardiq
   ```

2. **Configure Properties**
   ```bash
   # Edit src/main/resources/mule-app.properties
   # Update database, email, and API credentials
   ```

3. **Build the Project**
   ```bash
   mvn clean install
   ```

4. **Deploy to Runtime**
   ```bash
   mvn mule:deploy
   ```

## Configuration

### Environment Variables
```bash
# Database
export DB_USER=onboardiq_user
export DB_PASSWORD=secure_password
export DB_URL=jdbc:postgresql://localhost:5432/onboardiq

# Email
export EMAIL_USER=onboardiq@gmail.com
export EMAIL_PASSWORD=app_specific_password

# Salesforce
export SALESFORCE_USERNAME=onboardiq@lovable.app
export SALESFORCE_PASSWORD=secure_password
export SALESFORCE_TOKEN=security_token

# Vonage
export VONAGE_API_KEY=your_api_key
export VONAGE_API_SECRET=your_api_secret

# Foxit
export FOXIT_CLIENT_ID=your_client_id
export FOXIT_CLIENT_SECRET=your_client_secret
```

### Database Schema
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    verified_at TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
```

## API Endpoints

### User Management
- `GET /api/onboardiq/users` - Retrieve all users
- `POST /api/onboardiq/users` - Register new user

### Onboarding Operations
- `POST /api/onboardiq/onboarding` - Process onboarding operations
- `POST /api/onboardiq/verification` - Verify user account
- `POST /api/onboardiq/complete` - Complete onboarding

### System Health
- `GET /api/onboardiq/health` - Health check
- `GET /api/onboardiq/metrics` - Application metrics

## Usage Examples

### User Registration
```bash
curl -X POST https://api.onboardiq.lovable.app/api/onboardiq/users \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "user-registration",
    "email": "newuser@example.com",
    "phone": "+1234567890"
  }'
```

### Document Generation
```bash
curl -X POST https://api.onboardiq.lovable.app/api/onboardiq/onboarding \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "document-generation",
    "userId": "user_123",
    "email": "user@example.com"
  }'
```

### User Verification
```bash
curl -X POST https://api.onboardiq.lovable.app/api/onboardiq/verification \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "verification",
    "userId": "user_123",
    "email": "user@example.com"
  }'
```

## Integration with OnboardIQ Frontend

### Frontend Integration
The MuleSoft integration works seamlessly with the OnboardIQ React frontend:

```javascript
// Example API call from React frontend
const registerUser = async (userData) => {
  const response = await fetch('/api/onboardiq/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      operation: 'user-registration',
      email: userData.email,
      phone: userData.phone
    })
  });
  return response.json();
};
```

### Webhook Integration
MuleSoft can send webhooks to the frontend for real-time updates:

```javascript
// Frontend webhook handler
const handleWebhook = (data) => {
  if (data.operation === 'verification-complete') {
    // Update UI to show verification success
    setVerificationStatus('verified');
  }
};
```

## Monitoring and Logging

### Health Checks
- **Endpoint**: `/api/onboardiq/health`
- **Response**: Application status and uptime
- **Frequency**: Every 30 seconds

### Metrics
- **Endpoint**: `/api/onboardiq/metrics`
- **Data**: User counts, processing times, error rates
- **Retention**: 30 days

### Logging
- **Level**: INFO, ERROR, DEBUG
- **Format**: JSON structured logging
- **Destination**: Console and file

## Security

### Authentication
- OAuth 2.0 for API access
- JWT tokens for session management
- API key authentication for external services

### Data Protection
- All sensitive data encrypted at rest
- TLS 1.3 for data in transit
- GDPR compliance for user data

### Rate Limiting
- 1000 requests per hour per API key
- 100 requests per minute per user
- Automatic blocking of suspicious activity

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check PostgreSQL service
   sudo systemctl status postgresql
   
   # Verify connection string
   psql -h localhost -U onboardiq_user -d onboardiq
   ```

2. **Email Not Sending**
   ```bash
   # Check SMTP configuration
   # Verify app-specific password for Gmail
   # Check firewall settings
   ```

3. **Salesforce Integration Error**
   ```bash
   # Verify credentials
   # Check security token
   # Ensure API access is enabled
   ```

### Debug Mode
```bash
# Enable debug logging
export MULE_DEBUG=true
mvn mule:run -Dmule.debug=true
```

## Development

### Local Development
```bash
# Start local MuleSoft runtime
mvn mule:run

# Access API at http://localhost:8081
# Access Anypoint Studio for visual development
```

### Testing
```bash
# Run unit tests
mvn test

# Run integration tests
mvn verify

# Run performance tests
mvn test -Dtest=PerformanceTest
```

## Deployment

### CloudHub Deployment
```bash
# Deploy to CloudHub
mvn mule:deploy -Dmule.artifact=target/onboardiq-mulesoft-integration-1.0.0-mule-application.jar
```

### On-Premises Deployment
```bash
# Deploy to standalone runtime
mvn mule:deploy -Dmule.artifact=target/onboardiq-mulesoft-integration-1.0.0-mule-application.jar
```

## Support

### Documentation
- [MuleSoft Documentation](https://docs.mulesoft.com/)
- [OnboardIQ API Reference](./src/main/resources/api/onboardiq-api.raml)
- [Integration Examples](./examples/)

### Contact
- **Email**: support@onboardiq.lovable.app
- **Slack**: #onboardiq-support
- **Documentation**: https://docs.onboardiq.lovable.app

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

---

**OnboardIQ MuleSoft Integration** - Powering seamless customer onboarding workflows 🚀
