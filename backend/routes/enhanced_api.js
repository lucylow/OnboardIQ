const express = require('express');
const router = express.Router();
const WebSocket = require('ws');
const http = require('http');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Enhanced API with real-time features, WebSocket support, and improved functionality

// Rate limiting for security
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Apply rate limiting to all routes
router.use(limiter);

// Security headers
router.use(helmet());

// CORS configuration
router.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8083',
  credentials: true
}));

// WebSocket server for real-time updates
let wss;
if (process.env.ENABLE_WEBSOCKET === 'true') {
  const server = http.createServer();
  wss = new WebSocket.Server({ server });
  
  wss.on('connection', (ws) => {
    console.log('New WebSocket connection established');
    
    // Send initial connection confirmation
    ws.send(JSON.stringify({
      type: 'connection',
      message: 'Connected to OnboardIQ real-time API',
      timestamp: new Date().toISOString()
    }));
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        handleWebSocketMessage(ws, data);
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
  });
  
  server.listen(process.env.WEBSOCKET_PORT || 8084, () => {
    console.log(`WebSocket server running on port ${process.env.WEBSOCKET_PORT || 8084}`);
  });
}

// Broadcast function for real-time updates
const broadcast = (data) => {
  if (wss) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }
};

// Handle WebSocket messages
const handleWebSocketMessage = (ws, data) => {
  switch (data.type) {
    case 'subscribe_analytics':
      // Subscribe to real-time analytics
      ws.subscribeAnalytics = true;
      break;
    case 'subscribe_security':
      // Subscribe to security events
      ws.subscribeSecurity = true;
      break;
    case 'subscribe_onboarding':
      // Subscribe to onboarding events
      ws.subscribeOnboarding = true;
      break;
    default:
      console.log('Unknown WebSocket message type:', data.type);
  }
};

// Enhanced Analytics API
router.get('/analytics/real-time', async (req, res) => {
  try {
    const analytics = {
      totalUsers: 1247 + Math.floor(Math.random() * 50),
      activeUsers: 89 + Math.floor(Math.random() * 20),
      conversionRate: 78.5 + (Math.random() - 0.5) * 5,
      avgOnboardingTime: 12.3 + (Math.random() - 0.5) * 2,
      churnRate: 3.2 + (Math.random() - 0.5) * 1,
      securityAlerts: 2 + Math.floor(Math.random() * 3),
      documentGenerated: 156 + Math.floor(Math.random() * 10),
      videoSessions: 23 + Math.floor(Math.random() * 5),
      smsSent: 89 + Math.floor(Math.random() * 15),
      timestamp: new Date().toISOString()
    };
    
    // Broadcast real-time analytics if WebSocket is enabled
    if (wss) {
      broadcast({
        type: 'analytics_update',
        data: analytics
      });
    }
    
    res.json({
      success: true,
      data: analytics,
      realTime: true
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch real-time analytics',
      details: error.message
    });
  }
});

// Enhanced Security API
router.get('/security/monitoring', async (req, res) => {
  try {
    const securityData = {
      totalThreats: 156 + Math.floor(Math.random() * 20),
      threatsBlocked: 152 + Math.floor(Math.random() * 15),
      activeAlerts: 3 + Math.floor(Math.random() * 3),
      securityScore: 94 + Math.floor(Math.random() * 5),
      lastIncident: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      uptime: 99.98 + Math.random() * 0.02,
      verificationSuccess: 98.5 + Math.random() * 1,
      fraudAttempts: 12 + Math.floor(Math.random() * 8),
      recentEvents: [
        {
          id: `event-${Date.now()}`,
          type: 'suspicious_activity',
          severity: 'high',
          description: 'Multiple failed login attempts from unknown IP',
          timestamp: new Date().toISOString(),
          location: 'New York, US',
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          status: 'investigating',
          riskScore: 85
        }
      ],
      timestamp: new Date().toISOString()
    };
    
    // Broadcast security events if WebSocket is enabled
    if (wss) {
      broadcast({
        type: 'security_update',
        data: securityData
      });
    }
    
    res.json({
      success: true,
      data: securityData,
      realTime: true
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch security monitoring data',
      details: error.message
    });
  }
});

// Enhanced Onboarding API with AI Personalization
router.post('/onboarding/start', async (req, res) => {
  try {
    const { userData, preferences } = req.body;
    
    // AI-powered personalization logic
    const userSegment = determineUserSegment(userData);
    const personalizedFlow = generatePersonalizedFlow(userSegment, preferences);
    
    const onboardingSession = {
      id: `onboarding-${Date.now()}`,
      userId: userData.id,
      segment: userSegment,
      flow: personalizedFlow,
      status: 'active',
      startTime: new Date().toISOString(),
      estimatedDuration: calculateEstimatedDuration(userSegment),
      progress: 0,
      steps: personalizedFlow.steps
    };
    
    // Broadcast onboarding event if WebSocket is enabled
    if (wss) {
      broadcast({
        type: 'onboarding_started',
        data: onboardingSession
      });
    }
    
    res.json({
      success: true,
      data: onboardingSession,
      message: 'Onboarding session started with AI personalization'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to start onboarding session',
      details: error.message
    });
  }
});

// AI Personalization Helper Functions
const determineUserSegment = (userData) => {
  const { companySize, industry, planTier } = userData;
  
  if (companySize > 1000 || planTier === 'enterprise') {
    return 'enterprise';
  } else if (companySize > 100 || planTier === 'premium') {
    return 'premium';
  } else {
    return 'free';
  }
};

const generatePersonalizedFlow = (segment, preferences) => {
  const baseFlow = {
    steps: [
      { id: 'welcome', title: 'Welcome', duration: 2 },
      { id: 'verification', title: 'Phone Verification', duration: 5 },
      { id: 'profile', title: 'Profile Setup', duration: 3 }
    ]
  };
  
  switch (segment) {
    case 'enterprise':
      return {
        ...baseFlow,
        steps: [
          ...baseFlow.steps,
          { id: 'manager_assignment', title: 'Manager Assignment', duration: 3 },
          { id: 'video_session', title: 'Video Onboarding', duration: 15 },
          { id: 'document_setup', title: 'Document Generation', duration: 5 }
        ]
      };
    case 'premium':
      return {
        ...baseFlow,
        steps: [
          ...baseFlow.steps,
          { id: 'video_session', title: 'Video Onboarding', duration: 10 },
          { id: 'document_setup', title: 'Document Generation', duration: 3 }
        ]
      };
    default:
      return baseFlow;
  }
};

const calculateEstimatedDuration = (segment) => {
  const durations = {
    enterprise: 30,
    premium: 20,
    free: 10
  };
  return durations[segment] || 15;
};

// Enhanced Document Generation API
router.post('/documents/generate', async (req, res) => {
  try {
    const { template, userData, customization } = req.body;
    
    // Simulate document generation with Foxit API
    const document = {
      id: `doc-${Date.now()}`,
      template: template,
      userData: userData,
      customization: customization,
      status: 'generating',
      progress: 0,
      estimatedCompletion: new Date(Date.now() + 5000).toISOString()
    };
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      document.progress += 20;
      
      if (wss) {
        broadcast({
          type: 'document_progress',
          data: { id: document.id, progress: document.progress }
        });
      }
      
      if (document.progress >= 100) {
        clearInterval(progressInterval);
        document.status = 'completed';
        document.downloadUrl = `/documents/download/${document.id}`;
        
        if (wss) {
          broadcast({
            type: 'document_completed',
            data: document
          });
        }
      }
    }, 1000);
    
    res.json({
      success: true,
      data: document,
      message: 'Document generation started'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate document',
      details: error.message
    });
  }
});

// Enhanced Video Session API
router.post('/video/session', async (req, res) => {
  try {
    const { userId, sessionType, duration } = req.body;
    
    // Simulate Vonage Video API integration
    const videoSession = {
      id: `video-${Date.now()}`,
      userId: userId,
      sessionType: sessionType,
      duration: duration,
      status: 'scheduled',
      startTime: new Date(Date.now() + 300000).toISOString(), // 5 minutes from now
      token: generateVideoToken(),
      roomUrl: `https://video.onboardiq.com/room/${Date.now()}`,
      participants: []
    };
    
    // Broadcast video session creation if WebSocket is enabled
    if (wss) {
      broadcast({
        type: 'video_session_created',
        data: videoSession
      });
    }
    
    res.json({
      success: true,
      data: videoSession,
      message: 'Video session created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create video session',
      details: error.message
    });
  }
});

const generateVideoToken = () => {
  return 'video_token_' + Math.random().toString(36).substr(2, 9);
};

// Enhanced SMS Verification API
router.post('/sms/verify', async (req, res) => {
  try {
    const { phoneNumber, verificationCode } = req.body;
    
    // Simulate Vonage Verify API
    const verification = {
      id: `verify-${Date.now()}`,
      phoneNumber: phoneNumber,
      status: 'pending',
      attempts: 0,
      maxAttempts: 3,
      expiresAt: new Date(Date.now() + 300000).toISOString() // 5 minutes
    };
    
    // Simulate verification process
    setTimeout(() => {
      verification.status = 'verified';
      verification.verifiedAt = new Date().toISOString();
      
      if (wss) {
        broadcast({
          type: 'sms_verified',
          data: verification
        });
      }
    }, 2000);
    
    res.json({
      success: true,
      data: verification,
      message: 'SMS verification initiated'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to initiate SMS verification',
      details: error.message
    });
  }
});

// Enhanced AI Chatbot API
router.post('/ai/chatbot', async (req, res) => {
  try {
    const { message, context, userId } = req.body;
    
    // Simulate AI response processing
    const aiResponse = await processAIResponse(message, context, userId);
    
    const chatMessage = {
      id: `chat-${Date.now()}`,
      userId: userId,
      userMessage: message,
      aiResponse: aiResponse,
      timestamp: new Date().toISOString(),
      context: context
    };
    
    // Broadcast chat message if WebSocket is enabled
    if (wss) {
      broadcast({
        type: 'chat_message',
        data: chatMessage
      });
    }
    
    res.json({
      success: true,
      data: chatMessage,
      message: 'AI response generated'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to process AI response',
      details: error.message
    });
  }
});

const processAIResponse = async (message, context, userId) => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  const responses = {
    'onboarding': 'I can help you with your onboarding process. What specific step are you having trouble with?',
    'document': 'I can help you generate documents. What type of document do you need?',
    'video': 'I can help you schedule a video session. When would you prefer to have it?',
    'security': 'Security is our top priority. I can help you with verification and security questions.',
    'default': 'I understand your question. Let me provide you with the most relevant information.'
  };
  
  const lowerMessage = message.toLowerCase();
  let response = responses.default;
  
  if (lowerMessage.includes('onboard') || lowerMessage.includes('signup')) {
    response = responses.onboarding;
  } else if (lowerMessage.includes('document') || lowerMessage.includes('contract')) {
    response = responses.document;
  } else if (lowerMessage.includes('video') || lowerMessage.includes('call')) {
    response = responses.video;
  } else if (lowerMessage.includes('security') || lowerMessage.includes('verify')) {
    response = responses.security;
  }
  
  return response;
};

// Health Check API
router.get('/health', (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    websocket: wss ? 'enabled' : 'disabled',
    version: '2.0.0',
    features: [
      'Real-time Analytics',
      'Security Monitoring',
      'AI Personalization',
      'WebSocket Support',
      'Rate Limiting',
      'Enhanced Security'
    ]
  };
  
  res.json(health);
});

// WebSocket Status API
router.get('/websocket/status', (req, res) => {
  const status = {
    enabled: !!wss,
    connections: wss ? wss.clients.size : 0,
    port: process.env.WEBSOCKET_PORT || 8084
  };
  
  res.json(status);
});

module.exports = router;
