// AI Routes - Direct AI engine interactions and AI-assisted development
const express = require('express');
const router = express.Router();
const OpenAIService = require('../services/openaiService');
const AdaptiveOnboardingEngine = require('../ai/adaptiveOnboardingEngine');
const ConversationalAIEngine = require('../ai/conversationalAIEngine');

// Initialize AI services
const openaiService = new OpenAIService();
const adaptiveEngine = new AdaptiveOnboardingEngine();
const conversationalEngine = new ConversationalAIEngine();

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Access token required',
      message: 'Please provide a valid authentication token'
    });
  }

  const jwt = require('jsonwebtoken');
  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({
        error: 'Invalid token',
        message: 'The provided authentication token is invalid or expired'
      });
    }

    req.user = user;
    next();
  });
}

// Test OpenAI connection
router.get('/test', async (req, res) => {
  try {
    const isConfigured = openaiService.isConfigured();
    const connectionTest = await openaiService.testConnection();
    
    res.json({
      success: true,
      configured: isConfigured,
      connection: connectionTest,
      cacheStats: openaiService.getCacheStats()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      configured: openaiService.isConfigured()
    });
  }
});

// Generate personalized recommendations
router.post('/recommendations', async (req, res) => {
  try {
    const { userId, userData, behaviorAnalysis } = req.body;
    
    const recommendations = await openaiService.generateOnboardingRecommendations(
      userData || {},
      behaviorAnalysis || {}
    );
    
    res.json({
      success: true,
      recommendations,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      recommendations: openaiService.getFallbackRecommendations({})
    });
  }
});

// Analyze user behavior
router.post('/behavior-analysis', async (req, res) => {
  try {
    const { userId, interactions, featureUsage } = req.body;
    
    const analysis = await openaiService.analyzeUserBehavior(
      interactions || [],
      featureUsage || {}
    );
    
    res.json({
      success: true,
      analysis,
      analyzedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error analyzing behavior:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      analysis: openaiService.getFallbackBehaviorAnalysis([], {})
    });
  }
});

// Generate conversational response
router.post('/chat', async (req, res) => {
  try {
    const { message, userId, context, userProfile } = req.body;
    
    const response = await openaiService.generateConversationalResponse(
      message,
      context || {},
      userProfile || {}
    );
    
    res.json({
      success: true,
      response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating chat response:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      response: openaiService.getFallbackResponse('', {})
    });
  }
});

// Analyze sentiment and intent
router.post('/sentiment', async (req, res) => {
  try {
    const { text, context } = req.body;
    
    const analysis = await openaiService.analyzeSentimentAndIntent(
      text,
      context || {}
    );
    
    res.json({
      success: true,
      analysis,
      analyzedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      analysis: openaiService.getFallbackSentimentAnalysis('')
    });
  }
});

// Generate document content
router.post('/document', async (req, res) => {
  try {
    const { documentType, userData, requirements } = req.body;
    
    const content = await openaiService.generateDocumentContent(
      documentType,
      userData || {},
      requirements || ''
    );
    
    res.json({
      success: true,
      content,
      documentType,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating document content:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      content: openaiService.getFallbackDocumentContent(documentType, {})
    });
  }
});

// Generate learning path
router.post('/learning-path', async (req, res) => {
  try {
    const { userProfile, goals, currentProgress } = req.body;
    
    const learningPath = await openaiService.generateLearningPath(
      userProfile || {},
      goals || [],
      currentProgress || {}
    );
    
    res.json({
      success: true,
      learningPath,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating learning path:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      learningPath: openaiService.getFallbackLearningPath({}, [])
    });
  }
});

// Generate security recommendations
router.post('/security-recommendations', async (req, res) => {
  try {
    const { userData, riskAssessment } = req.body;
    
    const recommendations = await openaiService.generateSecurityRecommendations(
      userData || {},
      riskAssessment || {}
    );
    
    res.json({
      success: true,
      recommendations,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating security recommendations:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      recommendations: openaiService.getFallbackSecurityRecommendations({})
    });
  }
});

// Adaptive onboarding endpoints
router.post('/adaptive/behavior', async (req, res) => {
  try {
    const { userId, userData } = req.body;
    
    const analysis = await adaptiveEngine.analyzeUserBehavior(userId, userData);
    
    res.json({
      success: true,
      analysis,
      analyzedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in adaptive behavior analysis:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/adaptive/recommendations', async (req, res) => {
  try {
    const { userId, behaviorAnalysis } = req.body;
    
    const recommendations = await adaptiveEngine.generateRecommendations(userId, behaviorAnalysis);
    
    res.json({
      success: true,
      recommendations,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in adaptive recommendations:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Conversational AI endpoints
router.post('/conversational/process', async (req, res) => {
  try {
    const { message, userId, channel } = req.body;
    
    const response = await conversationalEngine.processMessage(message, userId, channel);
    
    res.json({
      success: true,
      response,
      processedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in conversational processing:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Multi-channel message handling
router.post('/conversational/multi-channel', async (req, res) => {
  try {
    const { channel, message, sender } = req.body;
    
    const response = await conversationalEngine.handleMultiChannelMessage(channel, message, sender);
    
    res.json({
      success: true,
      response,
      channel,
      processedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in multi-channel processing:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get conversation analytics
router.get('/conversational/analytics', async (req, res) => {
  try {
    const analytics = conversationalEngine.getConversationAnalytics();
    
    res.json({
      success: true,
      analytics,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting conversation analytics:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Cache management
router.delete('/cache', async (req, res) => {
  try {
    openaiService.clearCache();
    
    res.json({
      success: true,
      message: 'Cache cleared successfully',
      clearedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/cache/stats', async (req, res) => {
  try {
    const stats = openaiService.getCacheStats();
    
    res.json({
      success: true,
      stats,
      retrievedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting cache stats:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check
router.get('/health', async (req, res) => {
  try {
    const health = {
      openai: openaiService.isConfigured(),
      adaptive: adaptiveEngine.isReady !== undefined,
      conversational: conversationalEngine.isReady(),
      timestamp: new Date().toISOString()
    };
    
    res.json({
      success: true,
      health,
      status: 'operational'
    });
  } catch (error) {
    console.error('Error in health check:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      status: 'degraded'
    });
  }
});

module.exports = router;
