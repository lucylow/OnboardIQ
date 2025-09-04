# OpenAI Integration - OnboardIQ

## Overview
OnboardIQ now features comprehensive OpenAI (ChatGPT API) integration that powers intelligent, personalized experiences across the entire platform. This integration provides AI-powered recommendations, conversational assistance, behavior analysis, and content generation.

## 🔧 Configuration

### Environment Variables
Add your OpenAI API key to `backend/config.env`:

```bash
# OpenAI Configuration
OPENAI_API_KEY=your_actual_openai_api_key_here
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=2000
OPENAI_TEMPERATURE=0.7
```

### API Key Setup
1. **Get OpenAI API Key**: Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. **Create API Key**: Generate a new secret key
3. **Add to Environment**: Update `backend/config.env` with your key
4. **Test Connection**: Use the `/api/ai/test` endpoint to verify

## 🚀 Features

### 1. **Adaptive Onboarding Engine**
- **Personalized Recommendations**: AI-generated onboarding paths based on user behavior
- **Behavior Analysis**: Intelligent analysis of user interactions and preferences
- **Learning Style Detection**: Identifies visual, auditory, kinesthetic, or mixed learning preferences
- **Pace Optimization**: Determines optimal learning speed (fast, moderate, slow)
- **Complexity Matching**: Adapts content complexity to user skill level

### 2. **Conversational AI Assistant**
- **Context-Aware Responses**: Maintains conversation context across interactions
- **Sentiment Analysis**: Detects user emotions and adjusts responses accordingly
- **Multi-Channel Support**: Works across chat, SMS, email, and voice channels
- **Escalation Intelligence**: Automatically escalates complex issues to human agents
- **Personalized Interactions**: Uses user profile data for tailored responses

### 3. **Document Generation**
- **AI-Powered Content**: Generates professional documents and contracts
- **Industry Customization**: Tailors content to specific industries and company types
- **Multi-Language Support**: Creates localized content for global users
- **Compliance Integration**: Ensures documents meet regulatory requirements

### 4. **Security Recommendations**
- **Risk Assessment**: Analyzes security posture and identifies vulnerabilities
- **Personalized Security**: Provides company-size and industry-specific recommendations
- **Implementation Guidance**: Step-by-step security improvement plans
- **Compliance Mapping**: Maps recommendations to regulatory requirements

### 5. **Learning Path Generation**
- **Personalized Curricula**: Creates custom learning paths based on user goals
- **Progress Tracking**: Monitors completion and adjusts recommendations
- **Resource Optimization**: Suggests the most effective learning materials
- **Success Metrics**: Defines clear success criteria for each milestone

## 📡 API Endpoints

### Core AI Endpoints

#### Test Connection
```http
GET /api/ai/test
```
**Response:**
```json
{
  "success": true,
  "configured": true,
  "connection": {
    "success": true,
    "models": ["gpt-4", "gpt-3.5-turbo"]
  },
  "cacheStats": {
    "size": 5,
    "keys": ["recommendations", "behavior_analysis"]
  }
}
```

#### Generate Recommendations
```http
POST /api/ai/recommendations
Content-Type: application/json

{
  "userData": {
    "companyName": "Tech Corp",
    "role": "Manager",
    "industry": "Technology",
    "teamSize": "10-50"
  },
  "behaviorAnalysis": {
    "learningStyle": "visual",
    "pace": "moderate",
    "complexity": "intermediate"
  }
}
```

#### Analyze User Behavior
```http
POST /api/ai/behavior-analysis
Content-Type: application/json

{
  "interactions": [
    {
      "type": "page_view",
      "timestamp": "2024-01-20T10:00:00Z",
      "duration": 120
    }
  ],
  "featureUsage": {
    "dashboard": 15,
    "analytics": 8,
    "documents": 12
  }
}
```

#### Generate Chat Response
```http
POST /api/ai/chat
Content-Type: application/json

{
  "message": "Help me with onboarding",
  "context": {
    "previousMessages": [...],
    "userState": "new_user"
  },
  "userProfile": {
    "firstName": "John",
    "companyName": "Tech Corp",
    "planTier": "premium"
  }
}
```

#### Analyze Sentiment
```http
POST /api/ai/sentiment
Content-Type: application/json

{
  "text": "I'm having trouble with the setup process",
  "context": {
    "channel": "chat",
    "userType": "new"
  }
}
```

### Adaptive Onboarding Endpoints

#### Analyze Adaptive Behavior
```http
POST /api/ai/adaptive/behavior
Content-Type: application/json

{
  "userId": "user123",
  "userData": {
    "interactions": [...],
    "featureUsage": {...}
  }
}
```

#### Generate Adaptive Recommendations
```http
POST /api/ai/adaptive/recommendations
Content-Type: application/json

{
  "userId": "user123",
  "behaviorAnalysis": {
    "userType": "active",
    "learningStyle": "visual",
    "pace": "moderate"
  }
}
```

### Conversational AI Endpoints

#### Process Message
```http
POST /api/ai/conversational/process
Content-Type: application/json

{
  "message": "I need help with document generation",
  "userId": "user123",
  "channel": "chat"
}
```

#### Multi-Channel Message
```http
POST /api/ai/conversational/multi-channel
Content-Type: application/json

{
  "channel": "sms",
  "message": "Help me reset my password",
  "sender": "+1234567890"
}
```

#### Get Analytics
```http
GET /api/ai/conversational/analytics
```

### Cache Management

#### Clear Cache
```http
DELETE /api/ai/cache
```

#### Get Cache Stats
```http
GET /api/ai/cache/stats
```

### Health Check
```http
GET /api/ai/health
```

## 🎯 Frontend Integration

### AI Service Usage

```typescript
import { aiService } from '@/services/aiService';

// Generate recommendations
const recommendations = await aiService.generateRecommendations(
  userData,
  behaviorAnalysis
);

// Analyze behavior
const analysis = await aiService.analyzeUserBehavior(
  interactions,
  featureUsage
);

// Generate chat response
const response = await aiService.generateChatResponse(
  message,
  context,
  userProfile
);

// Analyze sentiment
const sentiment = await aiService.analyzeSentiment(text, context);
```

### Component Integration

#### AdaptiveOnboarding Component
```typescript
// Uses AI service for personalized recommendations
const behaviorAnalysis = await aiService.analyzeUserBehavior(
  userInteractions,
  featureUsage
);

const recommendations = await aiService.generateRecommendations(
  userData,
  behaviorAnalysis
);
```

#### AIChatbot Component
```typescript
// Uses AI service for conversational responses
const aiResponse = await aiService.generateChatResponse(
  userMessage,
  conversationContext,
  userProfile
);
```

## 🔄 Caching Strategy

### Intelligent Caching
- **Recommendation Cache**: 10-minute TTL for personalized recommendations
- **Behavior Analysis Cache**: 5-minute TTL for user behavior insights
- **Conversation Cache**: 5-minute TTL for chat responses
- **Document Cache**: 30-minute TTL for generated content

### Cache Management
```typescript
// Clear all caches
await aiService.clearCache();

// Get cache statistics
const stats = await aiService.getCacheStats();
```

## 🛡️ Error Handling

### Graceful Degradation
- **API Unavailable**: Falls back to pre-defined responses
- **Rate Limiting**: Implements exponential backoff
- **Invalid Responses**: Uses fallback content
- **Network Issues**: Retries with increasing delays

### Fallback Responses
```typescript
// Automatic fallback when AI service fails
const fallbackRecommendations = [
  {
    id: 'fallback-1',
    title: 'Complete Security Setup',
    description: 'Set up two-factor authentication',
    priority: 'high',
    estimatedTime: 10,
    actionUrl: '/onboarding/security-setup',
    type: 'security',
    confidence: 0.9,
    completed: false
  }
];
```

## 📊 Monitoring & Analytics

### Health Monitoring
```typescript
// Check AI service health
const health = await aiService.getHealthStatus();
console.log('AI Health:', health);
// {
//   openai: true,
//   adaptive: true,
//   conversational: true,
//   timestamp: "2024-01-20T10:00:00Z"
// }
```

### Performance Metrics
- **Response Time**: Average AI response generation time
- **Success Rate**: Percentage of successful AI calls
- **Cache Hit Rate**: Efficiency of caching system
- **Error Rate**: Frequency of AI service failures

## 🔧 Development

### Local Development
1. **Set API Key**: Add your OpenAI API key to `backend/config.env`
2. **Start Backend**: `cd backend && npm start`
3. **Start Frontend**: `npm run dev`
4. **Test Integration**: Visit `/adaptive-onboarding` or use the AI chatbot

### Testing AI Endpoints
```bash
# Test OpenAI connection
curl http://localhost:3001/api/ai/test

# Generate recommendations
curl -X POST http://localhost:3001/api/ai/recommendations \
  -H "Content-Type: application/json" \
  -d '{"userData":{"companyName":"Test Corp"},"behaviorAnalysis":{"learningStyle":"visual"}}'
```

### Debug Mode
```typescript
// Enable debug logging
localStorage.setItem('aiDebug', 'true');

// Check cache status
const cacheStats = await aiService.getCacheStats();
console.log('Cache Stats:', cacheStats);
```

## 🚀 Production Deployment

### Environment Setup
1. **Production API Key**: Use production OpenAI API key
2. **Rate Limiting**: Implement proper rate limiting
3. **Monitoring**: Set up AI service monitoring
4. **Caching**: Configure Redis for distributed caching

### Security Considerations
- **API Key Security**: Store API keys securely (use environment variables)
- **Rate Limiting**: Implement request rate limiting
- **Input Validation**: Validate all AI service inputs
- **Output Sanitization**: Sanitize AI-generated content

### Performance Optimization
- **Caching**: Implement intelligent caching strategies
- **Connection Pooling**: Reuse OpenAI API connections
- **Batch Processing**: Group similar AI requests
- **Async Processing**: Use background jobs for heavy AI tasks

## 📈 Future Enhancements

### Planned Features
- **Real-time Learning**: Continuous model improvement from user interactions
- **Multi-Modal AI**: Support for image and voice inputs
- **Advanced Analytics**: Deep insights into user behavior patterns
- **Custom Models**: Fine-tuned models for specific use cases
- **A/B Testing**: Test different AI strategies for optimization

### API Enhancements
- **Streaming Responses**: Real-time AI response streaming
- **WebSocket Support**: Live AI conversation updates
- **Batch Processing**: Bulk AI operations for efficiency
- **Model Selection**: Choose optimal AI models per use case

---

**Note**: This OpenAI integration provides a foundation for intelligent, personalized experiences throughout OnboardIQ. The system gracefully handles API failures and provides meaningful fallbacks to ensure a consistent user experience.
