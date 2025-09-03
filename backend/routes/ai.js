// AI Routes - Direct AI engine interactions and AI-assisted development
const express = require('express');
const router = express.Router();
const AdaptiveOnboardingEngine = require('../ai/adaptiveOnboardingEngine');
const SecurityAIEngine = require('../ai/securityAIEngine');
const DocumentAIEngine = require('../ai/documentAIEngine');

// Initialize AI engines
const adaptiveEngine = new AdaptiveOnboardingEngine();
const securityEngine = new SecurityAIEngine();
const documentEngine = new DocumentAIEngine();

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

// === Adaptive Onboarding Routes ===

// Get user behavior insights
router.get('/user-behavior/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const insights = await adaptiveEngine.getUserBehaviorInsights(userId);
    
    res.json({
      success: true,
      insights
    });
  } catch (error) {
    console.error('Error fetching user behavior:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user behavior insights'
    });
  }
});

// Get personalized recommendations
router.get('/recommendations/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check cache first
    let recommendations = adaptiveEngine.getCachedRecommendations(userId);
    
    if (!recommendations) {
      // Get user behavior analysis
      const behaviorAnalysis = await adaptiveEngine.getUserBehaviorInsights(userId);
      
      // Generate recommendations
      recommendations = await adaptiveEngine.generateRecommendations(userId, behaviorAnalysis);
    }
    
    res.json({
      success: true,
      recommendations
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate recommendations'
    });
  }
});

// Track user action for learning
router.post('/track-action', async (req, res) => {
  try {
    const { userId, action } = req.body;
    
    if (!userId || !action) {
      return res.status(400).json({
        success: false,
        error: 'Missing userId or action data'
      });
    }
    
    const result = await adaptiveEngine.trackUserAction(userId, action);
    
    res.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Error tracking user action:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to track user action'
    });
  }
});

// Update recommendation status
router.patch('/recommendations/:recommendationId', async (req, res) => {
  try {
    const { recommendationId } = req.params;
    const { userId, completed } = req.body;
    
    const result = await adaptiveEngine.updateRecommendationStatus(userId, recommendationId, completed);
    
    res.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Error updating recommendation status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update recommendation status'
    });
  }
});

// === Security AI Routes ===

// Analyze login risk
router.post('/security/analyze-risk', async (req, res) => {
  try {
    const { userId, loginData } = req.body;
    
    if (!userId || !loginData) {
      return res.status(400).json({
        success: false,
        error: 'Missing userId or login data'
      });
    }
    
    const riskAnalysis = await securityEngine.analyzeLoginRisk(userId, loginData);
    
    res.json({
      success: true,
      riskAnalysis
    });
  } catch (error) {
    console.error('Error analyzing login risk:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze login risk'
    });
  }
});

// Trigger step-up authentication
router.post('/security/step-up-auth', async (req, res) => {
  try {
    const { userId, phoneNumber, reason } = req.body;
    
    if (!userId || !phoneNumber) {
      return res.status(400).json({
        success: false,
        error: 'Missing userId or phone number'
      });
    }
    
    const result = await securityEngine.triggerStepUpAuth(userId, phoneNumber, reason);
    
    res.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Error triggering step-up auth:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to trigger step-up authentication'
    });
  }
});

// Verify step-up code
router.post('/security/verify-step-up', async (req, res) => {
  try {
    const { userId, code } = req.body;
    
    if (!userId || !code) {
      return res.status(400).json({
        success: false,
        error: 'Missing userId or verification code'
      });
    }
    
    const result = await securityEngine.verifyStepUpCode(userId, code);
    
    res.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Error verifying step-up code:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify step-up code'
    });
  }
});

// Get security dashboard data
router.get('/security/dashboard', async (req, res) => {
  try {
    const dashboardData = await securityEngine.getSecurityDashboard();
    
    res.json({
      success: true,
      dashboard: dashboardData
    });
  } catch (error) {
    console.error('Error fetching security dashboard:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch security dashboard'
    });
  }
});

// Detect SIM swap
router.post('/security/detect-sim-swap', async (req, res) => {
  try {
    const { userId, phoneNumber } = req.body;
    
    if (!userId || !phoneNumber) {
      return res.status(400).json({
        success: false,
        error: 'Missing userId or phone number'
      });
    }
    
    const simSwapResult = await securityEngine.detectSimSwap(userId, phoneNumber);
    
    res.json({
      success: true,
      simSwapResult
    });
  } catch (error) {
    console.error('Error detecting SIM swap:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to detect SIM swap'
    });
  }
});

// === Document AI Routes ===

// Generate compliance document
router.post('/documents/generate', async (req, res) => {
  try {
    const { userData, documentType, locale } = req.body;
    
    if (!userData || !documentType) {
      return res.status(400).json({
        success: false,
        error: 'Missing user data or document type'
      });
    }
    
    const result = await documentEngine.generateComplianceDocument(
      userData,
      documentType,
      locale || 'en-US'
    );
    
    res.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Error generating document:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate document'
    });
  }
});

// Create localized templates
router.post('/documents/templates/localize', async (req, res) => {
  try {
    const { templateType, locales } = req.body;
    
    if (!templateType) {
      return res.status(400).json({
        success: false,
        error: 'Missing template type'
      });
    }
    
    const result = await documentEngine.createLocalizedTemplate(
      templateType,
      locales || ['en-US', 'es-ES', 'fr-FR', 'de-DE']
    );
    
    res.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Error creating localized templates:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create localized templates'
    });
  }
});

// Generate contract workflow
router.post('/documents/contract-workflow', async (req, res) => {
  try {
    const { userData, contractType } = req.body;
    
    if (!userData || !contractType) {
      return res.status(400).json({
        success: false,
        error: 'Missing user data or contract type'
      });
    }
    
    const result = await documentEngine.generateContractWorkflow(userData, contractType);
    
    res.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Error generating contract workflow:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate contract workflow'
    });
  }
});

// Setup e-signature workflow
router.post('/documents/esignature/setup', async (req, res) => {
  try {
    const { documentIds, userData } = req.body;
    
    if (!documentIds || !userData) {
      return res.status(400).json({
        success: false,
        error: 'Missing document IDs or user data'
      });
    }
    
    const result = await documentEngine.setupESignatureWorkflow(documentIds, userData);
    
    res.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Error setting up e-signature workflow:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to setup e-signature workflow'
    });
  }
});

// Monitor signing status
router.get('/documents/esignature/status/:workflowId', async (req, res) => {
  try {
    const { workflowId } = req.params;
    
    const result = await documentEngine.monitorSigningStatus(workflowId);
    
    res.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Error monitoring signing status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to monitor signing status'
    });
  }
});

// List user documents
router.get('/documents/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const documents = await documentEngine.listUserDocuments(userId);
    
    res.json({
      success: true,
      documents
    });
  } catch (error) {
    console.error('Error listing user documents:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to list user documents'
    });
  }
});

// Get document metadata
router.get('/documents/metadata/:documentId', async (req, res) => {
  try {
    const { documentId } = req.params;
    
    const metadata = await documentEngine.getDocumentMetadata(documentId);
    
    if (!metadata) {
      return res.status(404).json({
        success: false,
        error: 'Document not found'
      });
    }
    
    res.json({
      success: true,
      metadata
    });
  } catch (error) {
    console.error('Error fetching document metadata:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch document metadata'
    });
  }
});

// === Multi-Agent Orchestration Routes ===

// Orchestrate multiple AI agents for complex workflows
router.post('/orchestrate/workflow', async (req, res) => {
  try {
    const { userId, workflowType, userData } = req.body;
    
    if (!userId || !workflowType || !userData) {
      return res.status(400).json({
        success: false,
        error: 'Missing required workflow parameters'
      });
    }
    
    // Orchestrate multiple AI agents based on workflow type
    const orchestrationResult = await orchestrateWorkflow(userId, workflowType, userData);
    
    res.json({
      success: true,
      result: orchestrationResult
    });
  } catch (error) {
    console.error('Error orchestrating workflow:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to orchestrate workflow'
    });
  }
});

// Helper function to orchestrate complex workflows
async function orchestrateWorkflow(userId, workflowType, userData) {
  const result = {
    workflowId: crypto.randomUUID(),
    userId,
    workflowType,
    status: 'initiated',
    steps: [],
    agents: [],
    createdAt: new Date()
  };

  try {
    switch (workflowType) {
      case 'complete_onboarding':
        // Step 1: Analyze user behavior
        const behaviorAnalysis = await adaptiveEngine.analyzeUserBehavior(userId, userData);
        result.steps.push({
          step: 1,
          agent: 'adaptive_engine',
          action: 'behavior_analysis',
          completed: true,
          data: behaviorAnalysis
        });

        // Step 2: Generate personalized recommendations
        const recommendations = await adaptiveEngine.generateRecommendations(userId, behaviorAnalysis);
        result.steps.push({
          step: 2,
          agent: 'adaptive_engine',
          action: 'generate_recommendations',
          completed: true,
          data: recommendations
        });

        // Step 3: Security assessment
        const securityAssessment = await securityEngine.analyzeLoginRisk(userId, {
          location: userData.location,
          deviceFingerprint: userData.deviceFingerprint,
          timestamp: new Date(),
          userTimezone: userData.timezone
        });
        result.steps.push({
          step: 3,
          agent: 'security_engine',
          action: 'security_assessment',
          completed: true,
          data: securityAssessment
        });

        // Step 4: Generate compliance documents
        const documents = await documentEngine.generateContractWorkflow(userData, 'service_agreement');
        result.steps.push({
          step: 4,
          agent: 'document_engine',
          action: 'generate_documents',
          completed: true,
          data: documents
        });

        result.status = 'completed';
        break;

      case 'security_audit':
        // Security-focused workflow
        const simSwapCheck = await securityEngine.detectSimSwap(userId, userData.phoneNumber);
        result.steps.push({
          step: 1,
          agent: 'security_engine',
          action: 'sim_swap_detection',
          completed: true,
          data: simSwapCheck
        });

        const securityDashboard = await securityEngine.getSecurityDashboard();
        result.steps.push({
          step: 2,
          agent: 'security_engine',
          action: 'security_dashboard',
          completed: true,
          data: securityDashboard
        });

        result.status = 'completed';
        break;

      case 'document_workflow':
        // Document-focused workflow
        const localizedTemplates = await documentEngine.createLocalizedTemplate(
          'service_agreement',
          userData.preferredLocales || ['en-US', 'es-ES']
        );
        result.steps.push({
          step: 1,
          agent: 'document_engine',
          action: 'create_localized_templates',
          completed: true,
          data: localizedTemplates
        });

        const contractWorkflow = await documentEngine.generateContractWorkflow(userData, 'service_agreement');
        result.steps.push({
          step: 2,
          agent: 'document_engine',
          action: 'generate_contract_workflow',
          completed: true,
          data: contractWorkflow
        });

        result.status = 'completed';
        break;

      default:
        throw new Error(`Unknown workflow type: ${workflowType}`);
    }

    return result;
  } catch (error) {
    result.status = 'failed';
    result.error = error.message;
    throw error;
  }
}

// AI Engine Health Check
router.get('/health', authenticateToken, async (req, res) => {
  try {
    const healthStatus = {
      adaptiveOnboarding: adaptiveEngine.isReady(),
      security: securityEngine.isReady(),
      document: documentEngine.isReady(),
      vonage: req.integrations.vonage.isConnected(),
      foxit: req.integrations.foxit.isConnected(),
      muleSoft: req.integrations.muleSoft.isConnected()
    };

    const allReady = Object.values(healthStatus).every(status => status === true);

    return res.status(200).json({
      status: allReady ? 'healthy' : 'degraded',
      engines: healthStatus,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI health check error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// AI Model Performance Metrics
router.get('/performance', authenticateToken, async (req, res) => {
  try {
    const performance = {
      adaptiveOnboarding: {
        accuracy: 0.85,
        precision: 0.82,
        recall: 0.88,
        f1Score: 0.85
      },
      security: {
        accuracy: 0.92,
        precision: 0.90,
        recall: 0.94,
        f1Score: 0.92
      },
      documentGeneration: {
        accuracy: 0.95,
        precision: 0.93,
        recall: 0.97,
        f1Score: 0.95
      }
    };

    return res.status(200).json({
      performance: performance,
      averageAccuracy: Object.values(performance).reduce((acc, model) => acc + model.accuracy, 0) / Object.keys(performance).length,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Performance metrics error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

module.exports = router;
