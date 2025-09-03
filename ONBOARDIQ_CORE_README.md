# OnboardIQ Core Component

This is the core OnboardIQ frontend component that demonstrates the complete user journey for AI-powered multi-channel customer onboarding, integrating Vonage APIs for verification and communication, and Foxit APIs for automated document generation.

## Overview

The OnboardIQ core component implements a seamless onboarding flow with the following steps:

1. **Phone Verification** - User enters phone number, triggers Vonage Verify API
2. **Code Verification** - User enters SMS verification code
3. **Video Onboarding** - Personalized video tour using Vonage Video API
4. **Document Generation** - Dynamic PDF welcome document via Foxit Embed API

## Files Created

### Frontend Components
- `src/components/OnboardIQCore.tsx` - Main component implementing the core user journey
- `src/services/onboardiqService.ts` - Service layer for API calls

### Demo Assets
- `public/welcome-tour.html` - Demo video session page (simulates Vonage Video API)
- `public/demo-welcome-document.html` - Demo welcome document (simulates Foxit-generated PDF)

### Routes
- `/onboardiq-core` - Access the core OnboardIQ component

## How to Use

### 1. Access the Component
Navigate to `/onboardiq-core` in your browser to see the core OnboardIQ flow.

### 2. Demo Flow
1. **Enter Phone Number**: Enter any phone number in E.164 format (e.g., +1 123 456 7890)
2. **Verification Code**: Enter any 6-digit code (demo accepts any code)
3. **Video Session**: View the simulated Vonage video session
4. **Welcome Document**: View the simulated Foxit-generated welcome document

### 3. API Integration
The component is designed to work with the existing backend routes:
- `/api/auth/signup` - Phone verification (Vonage Verify API)
- `/api/auth/verify` - Code verification (Vonage Verify API)
- `/api/onboarding/resources` - Fetch video session and PDF URL

## Technical Implementation

### State Management
```typescript
const [phoneNumber, setPhoneNumber] = useState("");
const [verificationSent, setVerificationSent] = useState(false);
const [requestId, setRequestId] = useState(null);
const [verificationCode, setVerificationCode] = useState("");
const [isVerified, setIsVerified] = useState(false);
const [sessionId, setSessionId] = useState(null);
const [token, setToken] = useState(null);
const [pdfUrl, setPdfUrl] = useState(null);
```

### API Service
The `onboardiqService` handles all API calls with proper error handling and fallback to demo data:

- `sendVerification(phoneNumber)` - Initiates Vonage Verify
- `verifyCode(requestId, code)` - Verifies SMS code
- `fetchOnboardingResources()` - Gets video session and PDF URL

### Vonage Integration
- **Verify API**: SMS verification for secure signup
- **Video API**: Personalized video onboarding sessions
- **Demo Mode**: Simulated video session with controls

### Foxit Integration
- **Document Generation**: AI-powered personalized welcome documents
- **PDF Embed**: Inline PDF viewing with Foxit Embed API
- **Demo Mode**: HTML-based document simulation

## Demo Features

### Video Session Demo
- Interactive video controls (play, pause, stop, mute)
- Session ID and token display
- Realistic video session simulation
- What to expect information

### Welcome Document Demo
- Personalized welcome message
- Feature overview with icons
- Next steps checklist
- Contact information
- Dynamic document ID generation

## Production Integration

### Backend Requirements
Ensure your backend has the following endpoints:
- `POST /api/auth/signup` - Phone verification
- `POST /api/auth/verify` - Code verification  
- `GET /api/onboarding/resources` - Fetch resources

### Environment Variables
```env
VITE_API_URL=http://localhost:3000
```

### Vonage API Keys
Configure Vonage API keys in your backend:
- Vonage Verify API
- Vonage Video API (OpenTok)

### Foxit API Keys
Configure Foxit API keys in your backend:
- Foxit Document API
- Foxit Embed API

## Customization

### Styling
The component uses inline styles for simplicity. You can customize by:
- Adding CSS classes
- Using your design system components
- Implementing responsive design

### API Endpoints
Modify the service layer to match your backend API structure:
- Update endpoint URLs
- Adjust request/response formats
- Add authentication headers

### Demo Content
Customize demo content in:
- `public/welcome-tour.html` - Video session content
- `public/demo-welcome-document.html` - Welcome document content

## Security Considerations

### Frontend Security
- No sensitive data stored in frontend state
- API keys handled securely on backend
- Input validation and sanitization

### Backend Security
- Vonage API keys stored securely
- Foxit API keys stored securely
- JWT token management
- Rate limiting on verification endpoints

## Troubleshooting

### Common Issues
1. **API Connection**: Check backend server is running
2. **CORS**: Ensure backend allows frontend domain
3. **API Keys**: Verify Vonage and Foxit keys are configured
4. **Demo Mode**: Component falls back to demo data if APIs fail

### Debug Mode
Enable console logging in the service layer to debug API calls:
```typescript
console.log('API Response:', data);
```

## Next Steps

1. **Real API Integration**: Replace demo data with actual Vonage and Foxit API calls
2. **Enhanced UI**: Add loading states, animations, and better error handling
3. **Analytics**: Track user progress through onboarding flow
4. **A/B Testing**: Test different onboarding flows
5. **Mobile Optimization**: Ensure responsive design works on mobile devices

## Support

For questions or issues with the OnboardIQ core component, refer to:
- Vonage API documentation
- Foxit API documentation
- Backend integration guides
- Project documentation
