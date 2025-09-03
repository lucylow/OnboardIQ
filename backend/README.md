# OnboardIQ AI-Powered Backend

A comprehensive Node.js backend for OnboardIQ, featuring AI-powered multi-channel customer onboarding and security suite with intelligent personalization, automation, security, and decision-making capabilities.

## 🚀 Features

### AI-Powered Components

1. **User Profiling & Segmentation Engine**
   - Automatic user classification into segments (premium, enterprise, free-tier)
   - Personalized onboarding workflow generation
   - Success prediction and recommendations

2. **Conversational AI Engine**
   - Multi-channel chatbot support (SMS, WhatsApp, Voice, Email)
   - Sentiment analysis and human escalation
   - Context-aware responses

3. **Security AI Engine**
   - Behavioral anomaly detection
   - Adaptive authentication with real-time risk scoring
   - Step-up authentication via Vonage Verify

4. **Document AI Engine**
   - AI-assisted document customization
   - Content validation and compliance checking
   - Smart document workflow orchestration

5. **Churn Prediction Engine**
   - Predictive analytics for onboarding success
   - Proactive intervention recommendations
   - Engagement monitoring

6. **Multi-Agent Orchestration**
   - Coordinated AI agents for workflow management
   - MuleSoft integration for enterprise workflows
   - Real-time decision making

### API Integrations

- **Vonage**: SMS, Voice, Video, Verify, WhatsApp
- **Foxit**: Document generation, processing, validation
- **MuleSoft**: API orchestration, workflow management

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Environment variables configured

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd onboardiq-connect/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the backend directory:
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   JWT_SECRET=your-super-secret-jwt-key

   # Vonage Configuration
   VONAGE_API_KEY=your-vonage-api-key
   VONAGE_API_SECRET=your-vonage-api-secret

   # Foxit Configuration
   FOXIT_API_KEY=your-foxit-api-key
   FOXIT_API_BASE_URL=https://api.foxit.com

   # MuleSoft Configuration
   MULESOFT_BASE_URL=https://your-mulesoft-instance.com
   MULESOFT_CLIENT_ID=your-mulesoft-client-id
   MULESOFT_CLIENT_SECRET=your-mulesoft-client-secret

   # OpenAI Configuration (for AI-assisted development)
   OPENAI_API_KEY=your-openai-api-key
   ```

4. **Start the server**
   ```bash
   npm start
   ```

## 🏗️ Architecture

```
backend/
├── server.js                 # Main server entry point
├── package.json             # Dependencies and scripts
├── ai/                      # AI Engine Modules
│   ├── userProfilingEngine.js
│   ├── conversationalAIEngine.js
│   ├── securityAIEngine.js
│   ├── documentAIEngine.js
│   ├── churnPredictor.js
│   └── multiAgentOrchestrator.js
├── integrations/           # External API Integrations
│   ├── vonageIntegration.js
│   ├── foxitIntegration.js
│   └── muleSoftIntegration.js
└── routes/                  # API Routes
    ├── auth.js
    ├── onboarding.js
    ├── ai.js
    └── documents.js
```

## 🔌 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signup` | User registration with AI profiling |
| POST | `/verify` | Phone number verification |
| POST | `/login` | User authentication with security assessment |
| POST | `/step-up-verify` | Step-up authentication verification |
| POST | `/resend-verification` | Resend verification code |
| GET | `/profile` | Get user profile with AI insights |
| PUT | `/profile` | Update user profile |

### Onboarding (`/api/onboarding`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/start` | Start AI-powered onboarding workflow |
| GET | `/progress` | Get onboarding progress |
| POST | `/step/complete` | Complete onboarding step |
| GET | `/recommendations` | Get personalized recommendations |
| POST | `/communication/initiate` | Initiate multi-channel communication |
| POST | `/call/schedule` | Schedule onboarding video call |
| POST | `/documents/generate` | Generate personalized documents |
| GET | `/analytics` | Get onboarding analytics |
| POST | `/complete` | Complete onboarding process |
| GET | `/status` | Get comprehensive onboarding status |

### AI Engines (`/api/ai`)

#### User Profiling
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/profiling/classify` | Classify user and generate workflow |
| GET | `/profiling/analytics` | Get segment analytics |

#### Conversational AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/conversational/process` | Process chatbot message |
| POST | `/conversational/multi-channel` | Send multi-channel message |
| GET | `/conversational/analytics` | Get conversation analytics |

#### Security AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/security/assess` | Assess security risk |
| POST | `/security/step-up-auth` | Initiate step-up authentication |
| GET | `/security/analytics` | Get security analytics |

#### Document AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/documents/generate` | Generate AI-powered document |
| POST | `/documents/validate` | Validate document content |
| GET | `/documents/analytics` | Get document analytics |

#### Churn Prediction
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/churn/predict` | Predict churn risk |
| POST | `/churn/intervene` | Execute intervention |
| GET | `/churn/analytics` | Get churn analytics |

#### Multi-Agent Orchestration
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/orchestrator/execute` | Execute workflow |
| GET | `/orchestrator/status` | Get orchestrator status |

#### AI-Assisted Development
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/development/generate-dataweave` | Generate DataWeave transformations |
| POST | `/development/generate-tests` | Generate integration tests |

#### System Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | AI engine health check |
| GET | `/performance` | Model performance metrics |

### Documents (`/api/documents`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/generate` | Generate document using Foxit |
| POST | `/generate-personalized` | Generate AI-personalized document |
| POST | `/compress` | Compress document |
| POST | `/watermark` | Add watermark to document |
| POST | `/merge` | Merge multiple documents |
| POST | `/convert` | Convert document format |
| POST | `/workflow` | Execute document workflow |
| POST | `/validate` | Validate document |
| GET | `/templates` | Get document templates |
| POST | `/templates` | Create document template |
| PUT | `/templates/:id` | Update document template |
| GET | `/analytics` | Get document analytics |
| GET | `/workflow-history` | Get workflow history |
| POST | `/retry` | Retry failed operation |
| GET | `/health` | Document service health |
| POST | `/cleanup` | Cleanup old documents |
| GET | `/:id` | Get document by ID |
| DELETE | `/:id` | Delete document |

## 🤖 AI Engine Details

### User Profiling Engine
- **Purpose**: Classify users and create personalized onboarding experiences
- **Features**: 
  - K-means clustering for user segmentation
  - Rule-based classification for immediate results
  - Personalized workflow generation
  - Success prediction models

### Conversational AI Engine
- **Purpose**: Handle multi-channel customer interactions
- **Features**:
  - Natural language processing
  - Sentiment analysis
  - Multi-channel message routing
  - Human escalation triggers

### Security AI Engine
- **Purpose**: Detect threats and manage authentication
- **Features**:
  - Behavioral biometrics
  - Risk assessment algorithms
  - Adaptive authentication
  - Threat detection

### Document AI Engine
- **Purpose**: Generate and validate personalized documents
- **Features**:
  - AI-powered content generation
  - Compliance validation
  - Document workflow orchestration
  - Content optimization

### Churn Predictor
- **Purpose**: Predict and prevent user churn
- **Features**:
  - Machine learning models
  - Engagement monitoring
  - Proactive interventions
  - Success factor analysis

### Multi-Agent Orchestrator
- **Purpose**: Coordinate AI agents for complex workflows
- **Features**:
  - Agent communication protocols
  - Workflow orchestration
  - Real-time decision making
  - MuleSoft integration

## 🔧 Development

### Running in Development Mode
```bash
npm run dev
```

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

### Building for Production
```bash
npm run build
```

## 📊 Monitoring & Analytics

The backend provides comprehensive monitoring through:

- **Health Checks**: `/health` endpoint for system status
- **Performance Metrics**: `/api/ai/performance` for AI model metrics
- **Analytics Endpoints**: Each AI engine provides analytics
- **Logging**: Structured logging with emojis for easy identification

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- Input validation
- CORS configuration
- Helmet security headers
- Request compression

## 🚀 Deployment

### Docker Deployment
```bash
# Build the image
docker build -t onboardiq-backend .

# Run the container
docker run -p 3000:3000 --env-file .env onboardiq-backend
```

### Environment Variables for Production
Ensure all environment variables are properly configured for production deployment.

## 📝 API Documentation

For detailed API documentation, see the individual route files or use tools like Swagger/OpenAPI.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

---

**OnboardIQ Backend** - AI-Powered Multi-Channel Customer Onboarding Suite
