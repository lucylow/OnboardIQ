# OnboardIQ Demo Guide

## 🚀 Overview

OnboardIQ is a comprehensive AI-powered onboarding platform featuring four core product features, comprehensive failure testing, and multiple demo modes. This guide will walk you through all the features and how to use them effectively.

## 📋 Table of Contents

1. [Getting Started](#getting-started)
2. [Product Features](#product-features)
3. [Failure Testing](#failure-testing)
4. [Demo Modes](#demo-modes)
5. [API Integration](#api-integration)
6. [Mock Data](#mock-data)
7. [Troubleshooting](#troubleshooting)

## 🎯 Getting Started

### Accessing the Demo

1. **Live Demo**: Navigate to `/demo` in your browser
2. **Direct URL**: `http://localhost:5173/demo` (when running locally)
3. **Navigation**: Click "Live Demo" in the main navigation

### Demo Structure

The demo is organized into three main sections:
- **Product Features**: Test the four core features
- **Failure Testing**: Simulate various error scenarios
- **Demo Mode**: Configure demo behavior

## 🔧 Product Features

### 1. SMS Verification

**Purpose**: Secure phone number verification with real-time SMS delivery

**Features**:
- Phone number validation
- SMS code generation and delivery
- Verification with countdown timer
- Resend functionality
- Session management
- Analytics tracking

**How to Test**:
1. Enter a phone number (format: +1234567890)
2. Click "Send Verification Code"
3. Wait for the code to be generated
4. Enter the verification code
5. Click "Verify Code"

**Mock Data**:
- Phone numbers: Various international formats
- Verification codes: 6-digit numeric codes
- Session tracking: Request IDs and timestamps

### 2. Video Onboarding

**Purpose**: Personalized video sessions for seamless customer onboarding

**Features**:
- Session scheduling with calendar
- Template selection (Welcome Call, Product Demo, Training)
- Host assignment
- Session management (start, end, cancel)
- Satisfaction tracking
- Meeting link generation

**How to Test**:
1. Select a video template
2. Enter participant name
3. Choose scheduled date/time
4. Optionally enter host name
5. Click "Schedule Session"
6. Use session management buttons (Start, End, Cancel)

**Mock Data**:
- Templates: Welcome Call, Product Demo, Training
- Sessions: Various statuses (scheduled, in-progress, completed)
- Analytics: Duration, satisfaction scores, completion rates

### 3. Document Generation

**Purpose**: AI-powered document creation with personalization

**Features**:
- Template selection (Welcome Letter, Terms of Service, Privacy Policy)
- Variable substitution
- Personalization options (industry-specific, company branding, custom content)
- Document generation with progress tracking
- Download and archive functionality
- Quality metrics

**How to Test**:
1. Select a document template
2. Fill in required variables
3. Choose personalization options
4. Click "Generate Document"
5. Monitor generation progress
6. Download or archive the document

**Mock Data**:
- Templates: Various document types with different variables
- Generated documents: PDF files with realistic content
- Quality metrics: Scores and improvement suggestions

### 4. Team Management

**Purpose**: Collaborative team management with role-based permissions

**Features**:
- Team creation with different plans (free, pro, enterprise)
- Member invitations with roles (admin, member, viewer)
- Invitation management (accept, decline)
- Role management
- Team activity tracking
- Analytics and statistics

**How to Test**:
1. Create a new team
2. Invite members with different roles
3. Accept/decline invitations
4. Manage team members and roles
5. View team activities and analytics

**Mock Data**:
- Teams: Various sizes and plans
- Members: Different roles and permissions
- Activities: Invitations, role changes, team updates

## 🐛 Failure Testing

### Purpose

The Failure Testing module allows you to simulate various error scenarios to test error handling and user experience during failures.

### Categories

1. **SMS Failures**
   - Send failures
   - Verification failures
   - Network timeouts
   - Invalid phone numbers

2. **Video Failures**
   - Scheduling failures
   - Session start failures
   - Connection issues
   - Recording failures

3. **Document Failures**
   - Generation failures
   - Template errors
   - Processing timeouts
   - Download failures

4. **Team Failures**
   - Creation failures
   - Invitation failures
   - Permission errors
   - Member removal failures

5. **Security Failures**
   - Authentication failures
   - Authorization errors
   - Session timeouts
   - Security violations

6. **Analytics Failures**
   - Data collection failures
   - Processing errors
   - Export failures
   - Dashboard loading issues

7. **Documentation Failures**
   - API doc generation failures
   - Content processing errors
   - Search failures
   - Update failures

### How to Use

1. **Random Failures**: Click "Trigger Random Failure" to simulate a random error
2. **Specific Failures**: Select a specific failure type from the dropdown
3. **Failure History**: View previously triggered failures
4. **Network Simulation**: Experience realistic delays and timeouts

## 🎮 Demo Modes

### Success Mode
- All features work perfectly
- No simulated failures
- Ideal for showcasing functionality

### Failure Mode
- Simulates error scenarios
- Tests error handling
- Demonstrates resilience

### Mixed Mode
- Random success/failure patterns
- Realistic simulation
- Tests both success and error paths

## 🔌 API Integration

### Vonage API (SMS & Video)
- **SMS**: Phone number verification and messaging
- **Video**: Video session management and recording
- **Mock Implementation**: `src/services/vonageApi.ts`

### Foxit API (Documents)
- **Document Generation**: PDF creation and processing
- **Template Management**: Document template handling
- **Mock Implementation**: `src/services/foxitApi.ts`

### Email Service
- **Notifications**: Email notifications and alerts
- **Mock Implementation**: `backend/services/emailService.js`

## 📊 Mock Data

### Structure
All mock data is centralized in `src/services/mockData.ts` and includes:

- **User Data**: Realistic user profiles and information
- **Feature Data**: SMS, video, document, and team data
- **Analytics**: Performance metrics and statistics
- **Failure Data**: Comprehensive error scenarios

### Key Files
- `src/services/mockData.ts`: Main mock data exports
- `src/services/mockFailureData.ts`: Failure scenario data
- `backend/mockApi.js`: Backend API mocking

### Data Generation
Uses `faker-js` for realistic data generation:
```typescript
import { faker } from '@faker-js/faker';
```

## 🛠️ Troubleshooting

### Common Issues

1. **Component Not Loading**
   - Check browser console for errors
   - Verify all dependencies are installed
   - Ensure TypeScript compilation is successful

2. **Mock Data Not Displaying**
   - Verify mock data files are properly imported
   - Check for TypeScript type errors
   - Ensure faker-js is installed

3. **API Calls Failing**
   - Check network connectivity
   - Verify API endpoints are correct
   - Review mock API implementations

4. **UI Components Not Rendering**
   - Ensure all UI components are properly imported
   - Check for missing CSS classes
   - Verify component props are correct

### Debug Mode

Enable debug logging by setting:
```typescript
localStorage.setItem('debug', 'true');
```

### Performance Monitoring

Monitor performance using:
- Browser DevTools
- React DevTools
- Network tab for API calls

## 📈 Analytics & Metrics

### Success Rates
- SMS Verification: 98.5%
- Video Onboarding: 95.2%
- Document Generation: 97.8%
- Team Management: 99.1%

### Performance Metrics
- Average response time: < 500ms
- Error rate: < 2%
- User satisfaction: > 95%

## 🔒 Security Features

### Authentication
- Multi-factor authentication
- Secure session management
- Role-based access control

### Data Protection
- Encrypted data transmission
- Secure storage practices
- Privacy compliance

## 📚 Additional Resources

### Documentation
- API Documentation: `/docs`
- Help Center: `/help`
- Tutorials: `/tutorials`

### Support
- Contact: `/contact`
- Email: support@onboardiq.com
- Phone: +1-800-ONBOARD

## 🚀 Deployment

### Local Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Docker Deployment
```bash
docker-compose up -d
```

---

**Note**: This is a demo application with mock data and simulated API calls. For production use, replace mock implementations with real API integrations.
