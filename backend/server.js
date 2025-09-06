// OnboardIQ AI-Powered Multi-Channel Customer Onboarding Backend
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const winston = require('winston');

// Load environment variables
require('dotenv').config({ path: './config.env' });

// Configure logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'onboardiq-backend' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Import AI modules
const UserProfilingEngine = require('./ai/userProfilingEngine');
const ConversationalAIEngine = require('./ai/conversationalAIEngine');
const SecurityAIEngine = require('./ai/securityAIEngine');
const DocumentAIEngine = require('./ai/documentAIEngine');
const ChurnPredictor = require('./ai/churnPredictor');
const MultiAgentOrchestrator = require('./ai/multiAgentOrchestrator');
const mcpRoutes = require('./routes/mcp');
const communicationRoutes = require('./routes/communication');

// Import API integrations
const CommunicationIntegration = require('./integrations/communicationIntegration');
const DocumentIntegration = require('./integrations/documentIntegration');
const IntegrationPlatformIntegration = require('./integrations/integrationPlatformIntegration');

// Import routes
const authRoutes = require('./routes/auth');
const onboardingRoutes = require('./routes/onboarding');
const aiRoutes = require('./routes/ai');
const documentRoutes = require('./routes/document');
const aiAgentsRoutes = require('./routes/ai-agents');
const streamingChatRoutes = require('./routes/streaming-chat');

const app = express();
const PORT = process.env.PORT || 3001;

// Enhanced middleware configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8081',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key', 'x-request-id']
}));

// Request logging
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Body parsing with enhanced limits
app.use(bodyParser.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(bodyParser.urlencoded({ 
  extended: true, 
  limit: '10mb' 
}));

// Request ID middleware
app.use((req, res, next) => {
  req.id = req.headers['x-request-id'] || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  res.setHeader('x-request-id', req.id);
  next();
});

// Request timing middleware
app.use((req, res, next) => {
  req.startTime = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - req.startTime;
    logger.info('Request completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      requestId: req.id
    });
  });
  next();
});

// Initialize AI engines with error handling
let userProfilingEngine, conversationalAI, securityAI, documentAI, churnPredictor;

try {
  userProfilingEngine = new UserProfilingEngine();
  conversationalAI = new ConversationalAIEngine();
  securityAI = new SecurityAIEngine();
  documentAI = new DocumentAIEngine();
  churnPredictor = new ChurnPredictor();
  
  logger.info('AI engines initialized successfully');
} catch (error) {
  logger.error('Failed to initialize AI engines:', error);
  process.exit(1);
}

// Initialize API integrations with error handling
let communicationIntegration, documentIntegration, integrationPlatformIntegration;

try {
  communicationIntegration = new CommunicationIntegration({
    apiKey: process.env.COMMUNICATION_API_KEY,
    apiSecret: process.env.COMMUNICATION_API_SECRET
  });

  documentIntegration = new DocumentIntegration({
    apiKey: process.env.DOCUMENT_API_KEY,
    baseUrl: process.env.DOCUMENT_API_BASE_URL
  });

  integrationPlatformIntegration = new IntegrationPlatformIntegration({
    baseUrl: process.env.INTEGRATION_PLATFORM_BASE_URL,
    clientId: process.env.INTEGRATION_PLATFORM_CLIENT_ID,
    clientSecret: process.env.INTEGRATION_PLATFORM_CLIENT_SECRET
  });
  
  logger.info('API integrations initialized successfully');
} catch (error) {
  logger.error('Failed to initialize API integrations:', error);
  process.exit(1);
}

// Initialize multi-agent orchestrator
let orchestrator;
try {
  orchestrator = new MultiAgentOrchestrator();
  orchestrator.initialize({
    userProfilingEngine,
    conversationalAI,
    securityAI,
    documentAI,
    churnPredictor,
    communicationIntegration,
    documentIntegration,
    integrationPlatformIntegration
  });
  
  logger.info('Multi-agent orchestrator initialized successfully');
} catch (error) {
  logger.error('Failed to initialize orchestrator:', error);
  process.exit(1);
}

// Make AI engines available to routes
app.use((req, res, next) => {
  req.ai = {
    userProfiling: userProfilingEngine,
    conversational: conversationalAI,
    security: securityAI,
    document: documentAI,
    churnPredictor: churnPredictor,
    orchestrator: orchestrator
  };
  req.integrations = {
    communication: communicationIntegration,
    document: documentIntegration,
    integrationPlatform: integrationPlatformIntegration
  };
  req.logger = logger;
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    services: {
      userProfiling: userProfilingEngine.isReady,
      conversational: conversationalAI.isReady,
      security: securityAI.isReady,
      document: documentAI.isReady,
      churnPredictor: churnPredictor.isReady
    }
  };
  
  const allServicesReady = Object.values(health.services).every(ready => ready);
  const statusCode = allServicesReady ? 200 : 503;
  
  res.status(statusCode).json(health);
});

// Enhanced routes with error handling
app.use('/api/auth', authRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/document', documentRoutes);
app.use('/api/ai-agents', aiAgentsRoutes);
app.use('/api/mcp', mcpRoutes);
app.use('/api/communication', communicationRoutes);
app.use('/api/streaming-chat', streamingChatRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    requestId: req.id
  });

  // Don't leak error details in production
  const errorResponse = {
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    timestamp: new Date().toISOString(),
    requestId: req.id
  };

  if (process.env.NODE_ENV !== 'production') {
    errorResponse.stack = err.stack;
  }

  res.status(err.status || 500).json(errorResponse);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Unhandled promise rejection handler
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Uncaught exception handler
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 OnboardIQ Backend Server running on port ${PORT}`);
  logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
  logger.info(`📈 API Documentation: http://localhost:${PORT}/api/docs`);
});

module.exports = app;
