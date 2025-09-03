# OnboardIQ Mock Demo Data Guide

This guide explains how to use the comprehensive mock demo data system for the OnboardIQ AI-Powered Multi-Channel Customer Onboarding & Security Suite project when real APIs don't work.

## Overview

The mock demo data system provides realistic fallback scenarios for all sponsor APIs:
- **Vonage APIs** (SMS, Voice, Video, Verify)
- **Foxit APIs** (Document Generation, PDF Services)
- **MuleSoft APIs** (Workflow Orchestration, AI Features)

## Quick Start

### 1. Enable Mock Mode

```typescript
import { enableMockMode } from './src/services/apiFallbackService';

// Enable mock mode globally
enableMockMode();
```

### 2. Use Mock APIs

```typescript
import { 
  vonageVerifyWithFallback,
  foxitGenerateDocumentWithFallback,
  muleSoftExecuteWorkflowWithFallback 
} from './src/services/apiFallbackService';

// Vonage SMS Verification
const verifyResult = await vonageVerifyWithFallback('+15551234567');
if (verifyResult.success) {
  console.log('Verification code sent:', verifyResult.data?.requestId);
}

// Foxit Document Generation
const documentResult = await foxitGenerateDocumentWithFallback('welcome_packet', {
  customer_name: 'John Doe',
  company_name: 'Tech Corp',
  plan_name: 'Premium'
});

// MuleSoft Workflow Execution
const workflowResult = await muleSoftExecuteWorkflowWithFallback('onboarding_workflow', {
  userId: 'user_123',
  company: 'Tech Corp'
});
```

## Demo Scenarios

### High-Value Enterprise Customer

Complete onboarding with video session and personalized documents:

```typescript
import { setupDemoEnvironment, getDemoScenario } from './src/services/demoConfig';

const scenario = setupDemoEnvironment('high_value_enterprise');
console.log('Demo user:', scenario.userProfile);
// Output: Michael Chen from Global Finance Corp. (Enterprise plan)

// This scenario uses all APIs:
// - Vonage Verify API (Phone verification)
// - Vonage Video API (Video onboarding)
// - Vonage SMS API (Follow-up messages)
// - Foxit Document Generation API (Welcome packet)
// - MuleSoft Workflow API (AI profiling)
```

### Medium-Risk Customer

Standard onboarding with enhanced monitoring:

```typescript
const scenario = setupDemoEnvironment('medium_risk_customer');
// Output: David Thompson from Retail Chain Corp. (Free plan, High churn risk)

// This scenario uses:
// - Vonage Verify API
// - Foxit Document Generation API
// - Vonage SMS API
// - No MuleSoft (simplified workflow)
```

### Quick Setup Customer

Fast-track onboarding for immediate value:

```typescript
const scenario = setupDemoEnvironment('quick_setup_customer');
// Output: Sarah Johnson from TechStartup Inc. (Premium plan, Low churn risk)

// This scenario uses:
// - Vonage Verify API
// - Foxit Document Generation API
// - Email welcome (no SMS)
```

## API Integration Examples

### Vonage SMS Verification

```typescript
import { vonageVerifyWithFallback, vonageVerifyCodeWithFallback } from './src/services/apiFallbackService';

// Step 1: Send verification code
const sendResult = await vonageVerifyWithFallback('+15551234567');
if (sendResult.success) {
  const requestId = sendResult.data?.requestId;
  
  // Step 2: Verify the code (any 6-digit code works in mock mode)
  const verifyResult = await vonageVerifyCodeWithFallback(requestId!, '123456');
  if (verifyResult.success) {
    console.log('Phone number verified successfully!');
  }
}
```

### Foxit Document Generation

```typescript
import { foxitGenerateDocumentWithFallback } from './src/services/apiFallbackService';

// Generate welcome packet
const welcomeDoc = await foxitGenerateDocumentWithFallback('welcome_packet', {
  customer_name: 'Sarah Johnson',
  company_name: 'TechStartup Inc.',
  plan_name: 'Premium',
  signup_date: new Date().toISOString()
});

if (welcomeDoc.success) {
  console.log('Document generated:', welcomeDoc.data?.downloadUrl);
  console.log('File size:', welcomeDoc.data?.fileSize);
  console.log('Pages:', welcomeDoc.data?.pages);
}

// Generate contract
const contractDoc = await foxitGenerateDocumentWithFallback('contract', {
  customer_name: 'Sarah Johnson',
  company_name: 'TechStartup Inc.',
  terms: 'Standard terms and conditions apply',
  effective_date: new Date().toISOString()
});
```

### MuleSoft Workflow Execution

```typescript
import { muleSoftExecuteWorkflowWithFallback } from './src/services/apiFallbackService';

// Execute onboarding workflow
const workflowResult = await muleSoftExecuteWorkflowWithFallback('onboarding_workflow', {
  userId: 'user_123',
  company: 'Tech Corp',
  industry: 'Technology',
  plan: 'premium'
});

if (workflowResult.success) {
  console.log('Workflow executed:', workflowResult.data?.executionId);
  console.log('Results:', workflowResult.data?.results);
}
```

## Error Simulation

Test how your application handles API failures:

```typescript
import { apiFallbackService } from './src/services/apiFallbackService';

// Simulate network error
const networkError = await apiFallbackService.simulateErrorWithFallback('network');
console.log('Network error handled:', networkError.isMockData);

// Simulate timeout error
const timeoutError = await apiFallbackService.simulateErrorWithFallback('timeout');
console.log('Timeout error handled:', timeoutError.isMockData);

// Simulate rate limit error
const rateLimitError = await apiFallbackService.simulateErrorWithFallback('rateLimit');
console.log('Rate limit error handled:', rateLimitError.isMockData);
```

## Configuration

### Basic Configuration

```typescript
import { updateDemoConfig } from './src/services/demoConfig';

// Update demo configuration
updateDemoConfig({
  enableMockMode: true,
  showMockIndicators: true,
  simulateFailures: false,
  failureRate: 0.1 // 10% failure rate
});
```

### Advanced Configuration

```typescript
import { configureAPIFallback } from './src/services/apiFallbackService';

// Configure API fallback service
const fallbackService = configureAPIFallback({
  enableMockMode: true,
  mockDelay: 1000, // Simulate 1-second delay
  retryAttempts: 3,
  retryDelay: 1000,
  fallbackTimeout: 5000
});
```

## Mock Data Structure

### User Profiles

```typescript
import { mockDemoDataService } from './src/services/mockDemoData';

const users = mockDemoDataService.getDemoUsers();
// Returns array of mock users with realistic profiles:
// - Sarah Johnson (TechStartup Inc., Premium, Low risk)
// - Michael Chen (Global Finance Corp., Enterprise, Medium risk)
// - Emily Rodriguez (Healthcare Plus, Premium, Low risk)
// - David Thompson (Retail Chain Corp., Free, High risk)
```

### Document Templates

```typescript
const documents = mockDemoDataService.getDemoDocuments();
// Returns array of mock documents:
// - Welcome Packet - Sarah Johnson (completed)
// - Service Agreement - Michael Chen (completed)
// - User Guide - Emily Rodriguez (generating)
```

### Workflow Status

```typescript
const workflows = mockDemoDataService.getDemoWorkflows();
// Returns array of mock workflows:
// - workflow_1: Running (75% complete)
// - workflow_2: Completed (100% complete)
```

## Error Scenarios

The mock system includes realistic error scenarios:

```typescript
const errorScenarios = mockDemoDataService.getErrorScenarios();
// Returns:
// - SMS_DELIVERY_FAILED: Fallback to email verification
// - DOCUMENT_GENERATION_TIMEOUT: Retry with simplified template
// - VIDEO_SESSION_UNAVAILABLE: Schedule for later
// - API_RATE_LIMIT: Automatic retry with exponential backoff
```

## Health Check

Monitor the health of your mock data system:

```typescript
import { apiFallbackService } from './src/services/apiFallbackService';

const health = await apiFallbackService.healthCheck();
console.log('System status:', health.status);
console.log('Details:', health.details);
```

## Demo Statistics

Get insights into your demo configuration:

```typescript
import { getDemoStats } from './src/services/demoConfig';

const stats = getDemoStats();
console.log('Total scenarios:', stats.totalScenarios);
console.log('Mock mode enabled:', stats.mockModeEnabled);
console.log('API configurations:', stats.apiConfigurations);
```

## Integration with Real APIs

When you're ready to use real APIs, simply disable mock mode:

```typescript
import { disableMockMode } from './src/services/apiFallbackService';

// Disable mock mode to use real APIs
disableMockMode();

// The same function calls will now use real APIs
const verifyResult = await vonageVerifyWithFallback('+15551234567');
```

## Backend Integration

The backend also includes mock services:

```javascript
// backend/mockApi.js
const { mockVonageService, mockFoxitService, mockMuleSoftService } = require('./mockApi');

// Use mock services in your backend
const verifyResult = await mockVonageService.sendVerificationCode('+15551234567');
const documentResult = await mockFoxitService.generateDocument('welcome_packet', userData);
const workflowResult = await mockMuleSoftService.executeWorkflow('onboarding_workflow', data);
```

## Troubleshooting

### Common Issues

1. **Mock data not loading**: Ensure `enableMockMode()` is called before API calls
2. **Inconsistent responses**: Mock data includes random variations for realism
3. **Timeout errors**: Mock delays simulate real API response times

### Debug Mode

```typescript
import { apiFallbackService } from './src/services/apiFallbackService';

// Get fallback statistics
const stats = apiFallbackService.getFallbackStats();
console.log('Fallback stats:', stats);

// Reset retry counters
apiFallbackService.resetRetryCounters();
```

## Best Practices

1. **Always use fallback functions**: Use `*WithFallback` functions instead of direct API calls
2. **Handle mock indicators**: Show users when mock data is being used
3. **Test error scenarios**: Regularly test how your app handles API failures
4. **Monitor health**: Use health checks to ensure mock system is working
5. **Document scenarios**: Keep track of which demo scenarios you're using

## API Keys Reference

For reference, here are the API keys mentioned in the project:

### Vonage APIs
- **Verify API Key**: `F7CrPwZ9nXpPHFJt`
- **Video API**: Requires separate API key
- **SMS API**: Uses same API key as Verify
- **SIM Swap API**: Optional for enhanced authentication

### Foxit APIs
- **Document Generation API**: For personalized welcome packets
- **PDF Services API**: For compression, merging, watermarking

### MuleSoft APIs
- **Anypoint Platform**: For AI-driven orchestration
- **MCP Servers**: For AI agent interactions

## Conclusion

The mock demo data system provides a robust foundation for demonstrating the OnboardIQ platform's capabilities without requiring real API credentials. It includes realistic scenarios, error handling, and seamless fallback mechanisms that ensure your demo always works, regardless of API availability.

For production use, simply disable mock mode and configure your real API credentials to switch to live APIs seamlessly.
