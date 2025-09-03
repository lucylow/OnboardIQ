# Vonage API Integration Guide for OnboardIQ

This document provides comprehensive guidance on integrating Vonage APIs into the OnboardIQ AI-Powered Multi-Channel Customer Onboarding Platform.

## 🚀 Overview

OnboardIQ leverages Vonage's powerful APIs to provide:
- **Secure 2FA Authentication** via Verify API
- **Personalized Video Onboarding** via Video API  
- **Multi-Channel Communication** via SMS API
- **Enhanced Security** via Number Insights & SIM Swap Detection

## 📋 Prerequisites

### 1. Vonage Account Setup
- Create account at [Vonage Dashboard](https://dashboard.vonage.com/)
- Get your API credentials:
  - **API Key**: `09bf89e3` (from your dashboard)
  - **API Secret**: Get from API Settings page
  - **Video API Key**: For video sessions
  - **Application ID**: For advanced features

### 2. Environment Configuration
Copy `backend/config.env.example` to `backend/.env` and configure:

```bash
# Vonage API Configuration
VONAGE_API_KEY=09bf89e3
VONAGE_API_SECRET=your-vonage-api-secret-here
VONAGE_VIDEO_API_KEY=your-video-api-key
VONAGE_VIDEO_API_SECRET=your-video-api-secret
VONAGE_APPLICATION_ID=your-application-id
VONAGE_PRIVATE_KEY_PATH=path/to/your/private.key

# Vonage Account Settings
VONAGE_BRAND_NAME=OnboardIQ
VONAGE_SENDER_ID=OnboardIQ
```

## 🔧 Installation & Setup

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
# Vonage SDK is already included in requirements.txt
```

### Frontend Setup
```bash
cd frontend
npm install
# Vonage API service is already configured
```

## 📡 API Endpoints

### Base URL
- **Development**: `http://localhost:5000/api/vonage`
- **Production**: `https://yourdomain.com/api/vonage`

### Authentication
All endpoints require JWT authentication except `/start-verification` and `/check-verification`.

## 🔐 Vonage Verify API

### 1. Start Verification
**Endpoint**: `POST /start-verification`

**Purpose**: Send SMS verification code to user's phone

**Request**:
```json
{
  "phone_number": "+14155550101",
  "brand": "OnboardIQ",
  "code_length": 6,
  "workflow_id": 6
}
```

**Response**:
```json
{
  "requestId": "a1b2c3d4e5f6",
  "status": "0",
  "estimated_cost": "0.05",
  "remaining_balance": "100.00",
  "message": "Verification code sent successfully"
}
```

### 2. Check Verification
**Endpoint**: `POST /check-verification`

**Purpose**: Verify the PIN entered by user

**Request**:
```json
{
  "request_id": "a1b2c3d4e5f6",
  "code": "123456"
}
```

**Response**:
```json
{
  "verified": true,
  "status": "0",
  "event_id": "evt_123456",
  "price": "0.05",
  "currency": "EUR",
  "message": "Verification successful"
}
```

### 3. Cancel Verification
**Endpoint**: `POST /cancel-verification`

**Purpose**: Cancel ongoing verification request

**Request**:
```json
{
  "request_id": "a1b2c3d4e5f6"
}
```

## 🎥 Vonage Video API

### Create Video Session
**Endpoint**: `POST /create-video-session`

**Purpose**: Create video session for personalized onboarding

**Request**:
```json
{
  "user_id": "user_123",
  "session_type": "routed",
  "media_mode": "routed"
}
```

**Response**:
```json
{
  "sessionId": "2_MX40NjMwODJ-fjE1MTY4Nzg2MjY0NDJ-fjE1MTY4Nzg1MjY0NDJ-fg",
  "token": "T1==cGFydG5lcl9pZD00NjMwODImc2RrPXRjLXZ0YWNlLXhvdGEtY2xpZW50LXNkayZzaWc9ZWU3MGU0NmEzOWM4OTBhM2E3ZGE1M2E1M2E1M2E1M2E1",
  "api_key": "your-video-api-key",
  "message": "Video session created successfully"
}
```

## 📱 Vonage SMS API

### 1. Send SMS
**Endpoint**: `POST /send-sms`

**Purpose**: Send follow-up SMS messages

**Request**:
```json
{
  "to": "+14155550101",
  "text": "Hi Sarah! Need help setting up your team?",
  "from_number": "OnboardIQ"
}
```

**Response**:
```json
{
  "message": "SMS sent",
  "data": {
    "message_id": "msg_123456",
    "remaining_balance": "99.95",
    "message_price": "0.05",
    "status": "0"
  }
}
```

### 2. Send Onboarding SMS
**Endpoint**: `POST /send-onboarding-sms`

**Purpose**: Send personalized onboarding messages

**Request**:
```json
{
  "phone_number": "+14155550101",
  "user_name": "Sarah",
  "step_number": 2,
  "total_steps": 5
}
```

### 3. Send Video Invite
**Endpoint**: `POST /send-welcome-video-invite`

**Purpose**: Send SMS invitation for video call

**Request**:
```json
{
  "phone_number": "+14155550101",
  "user_name": "Sarah",
  "session_id": "session_123"
}
```

## 🔍 Vonage Number Insights & SIM Swap API

### 1. Check SIM Swap
**Endpoint**: `POST /check-sim-swap`

**Purpose**: Detect SIM swap for enhanced security

**Request**:
```json
{
  "phone_number": "+14155550101",
  "max_age": 240
}
```

**Response**:
```json
{
  "numberInfo": {
    "sim_swap_detected": false,
    "last_swap_date": null,
    "carrier_info": "Verizon Wireless",
    "roaming_status": "not_roaming",
    "max_age_hours": 240
  },
  "isSimSwapped": false
}
```

### 2. Get Number Insights
**Endpoint**: `POST /number-insights`

**Purpose**: Get detailed phone number information

**Request**:
```json
{
  "phone_number": "+14155550101",
  "insight_level": "advanced"
}
```

## 💰 Account Management

### 1. Get Account Balance
**Endpoint**: `GET /account-balance`

**Response**:
```json
{
  "success": true,
  "balance": 100.00,
  "currency": "EUR",
  "auto_reload": false,
  "message": "Account balance retrieved successfully"
}
```

### 2. Get Pricing
**Endpoint**: `POST /pricing`

**Request**:
```json
{
  "country_code": "US",
  "service_type": "sms"
}
```

**Response**:
```json
{
  "success": true,
  "pricing": {
    "country_code": "US",
    "country_name": "United States",
    "service_type": "sms",
    "price": 0.0075,
    "currency": "USD",
    "message": "Pricing information retrieved successfully"
  }
}
```

## 🎯 Frontend Integration

### Using the Vonage API Service

```typescript
import { vonageApi } from '@/services/vonageApi';

// Start verification
const startVerification = async (phoneNumber: string) => {
  try {
    const response = await vonageApi.startVerification({
      phone_number: phoneNumber,
      brand: 'OnboardIQ'
    });
    return response.requestId;
  } catch (error) {
    console.error('Verification failed:', error);
  }
};

// Check verification
const checkVerification = async (requestId: string, code: string) => {
  try {
    const response = await vonageApi.checkVerification({
      request_id: requestId,
      code: code
    });
    return response.verified;
  } catch (error) {
    console.error('Verification check failed:', error);
  }
};

// Create video session
const createVideoSession = async (userId: string) => {
  try {
    const response = await vonageApi.createVideoSession({
      user_id: userId
    });
    return {
      sessionId: response.sessionId,
      token: response.token,
      apiKey: response.api_key
    };
  } catch (error) {
    console.error('Video session creation failed:', error);
  }
};

// Send onboarding SMS
const sendOnboardingSMS = async (phoneNumber: string, userName: string, step: number) => {
  try {
    const response = await vonageApi.sendOnboardingSMS({
      phone_number: phoneNumber,
      user_name: userName,
      step_number: step,
      total_steps: 5
    });
    return response.success;
  } catch (error) {
    console.error('Onboarding SMS failed:', error);
  }
};
```

## 🔄 Complete Workflow Example

### 1. User Signup Flow
```typescript
// 1. User submits phone number
const phoneNumber = "+14155550101";

// 2. Start verification
const requestId = await vonageApi.startVerification({
  phone_number: phoneNumber,
  brand: 'OnboardIQ'
});

// 3. User enters code
const code = "123456";

// 4. Verify code
const verified = await vonageApi.checkVerification({
  request_id: requestId,
  code: code
});

if (verified) {
  // 5. Create user account
  // 6. Send welcome SMS
  await vonageApi.sendOnboardingSMS({
    phone_number: phoneNumber,
    user_name: "Sarah",
    step_number: 1,
    total_steps: 5
  });
}
```

### 2. Video Onboarding Flow
```typescript
// 1. Create video session
const videoSession = await vonageApi.createVideoSession({
  user_id: "user_123"
});

// 2. Send video invite SMS
await vonageApi.sendWelcomeVideoInvite({
  phone_number: "+14155550101",
  user_name: "Sarah",
  session_id: videoSession.sessionId
});

// 3. Frontend connects to video session
// Using OpenTok/Vonage Video SDK
```

### 3. Security Check Flow
```typescript
// 1. Check for SIM swap
const simSwapCheck = await vonageApi.checkSimSwap({
  phone_number: "+14155550101"
});

if (simSwapCheck.isSimSwapped) {
  // Require additional verification
  // Log security event
}

// 2. Get number insights
const insights = await vonageApi.getNumberInsights(
  "+14155550101",
  'advanced'
);
```

## 🛠️ Development & Testing

### Mock Mode
When Vonage credentials are not configured, the system runs in mock mode:
- Verification codes: `123456` (always valid)
- Mock session IDs and tokens
- Mock SMS responses
- No actual API calls

### Testing Endpoints
```bash
# Test verification
curl -X POST http://localhost:5000/api/vonage/start-verification \
  -H "Content-Type: application/json" \
  -d '{"phone_number": "+14155550101"}'

# Test verification check
curl -X POST http://localhost:5000/api/vonage/check-verification \
  -H "Content-Type: application/json" \
  -d '{"request_id": "mock_verify_123", "code": "123456"}'
```

## 🔒 Security Considerations

### 1. API Key Security
- Never expose API secrets in frontend code
- Use environment variables
- Rotate keys regularly
- Monitor API usage

### 2. Rate Limiting
- Implement rate limiting on verification endpoints
- Monitor for abuse
- Use Vonage's built-in rate limiting

### 3. Phone Number Validation
- Validate phone numbers before API calls
- Use E.164 format
- Check for valid country codes

### 4. Error Handling
- Handle API failures gracefully
- Log errors for debugging
- Provide user-friendly error messages

## 📊 Monitoring & Analytics

### Logging
All Vonage API calls are logged with:
- Request/response data
- User information
- Error details
- Performance metrics

### Metrics to Track
- Verification success rate
- SMS delivery rate
- Video session completion rate
- API response times
- Error rates by endpoint

## 🚀 Production Deployment

### 1. Environment Setup
```bash
# Production environment variables
VONAGE_API_KEY=your-production-api-key
VONAGE_API_SECRET=your-production-api-secret
VONAGE_VIDEO_API_KEY=your-production-video-key
VONAGE_VIDEO_API_SECRET=your-production-video-secret
VONAGE_APPLICATION_ID=your-production-app-id
VONAGE_PRIVATE_KEY_PATH=/path/to/production/private.key
```

### 2. SSL/TLS
- Use HTTPS for all API calls
- Configure proper SSL certificates
- Enable HSTS headers

### 3. Load Balancing
- Use load balancers for high availability
- Configure health checks
- Monitor server performance

## 📞 Support & Troubleshooting

### Common Issues

1. **Verification Failed**
   - Check API credentials
   - Verify phone number format
   - Check account balance
   - Review error logs

2. **Video Session Issues**
   - Verify Video API credentials
   - Check JWT token generation
   - Ensure proper CORS configuration

3. **SMS Delivery Issues**
   - Check sender ID configuration
   - Verify phone number format
   - Review SMS content guidelines

### Debug Mode
Enable debug logging:
```bash
LOG_LEVEL=DEBUG
```

### Vonage Support
- [Vonage Documentation](https://developer.vonage.com/)
- [API Status Page](https://status.vonage.com/)
- [Support Portal](https://help.vonage.com/)

## 🎯 Best Practices

### 1. User Experience
- Provide clear error messages
- Show verification progress
- Offer alternative verification methods
- Implement retry logic

### 2. Performance
- Cache API responses where appropriate
- Use async/await for API calls
- Implement request timeouts
- Monitor response times

### 3. Reliability
- Implement retry mechanisms
- Use circuit breakers for API calls
- Monitor API health
- Have fallback options

### 4. Security
- Validate all inputs
- Sanitize phone numbers
- Log security events
- Monitor for suspicious activity

## 📈 Scaling Considerations

### 1. High Volume
- Use connection pooling
- Implement caching
- Consider async processing
- Monitor rate limits

### 2. Geographic Distribution
- Use regional API endpoints
- Consider local phone number formats
- Implement timezone handling
- Optimize for latency

### 3. Cost Optimization
- Monitor API usage
- Implement usage quotas
- Use appropriate service tiers
- Optimize message content

---

This integration provides a robust foundation for multi-channel customer onboarding with Vonage's powerful APIs. The system is designed to be scalable, secure, and user-friendly while providing comprehensive monitoring and analytics capabilities.
