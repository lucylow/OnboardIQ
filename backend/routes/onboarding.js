// Onboarding Routes - AI-powered onboarding workflow orchestration
const express = require('express');
const router = express.Router();

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

// Start onboarding workflow
router.post('/start', authenticateToken, async (req, res) => {
  try {
    console.log(`🚀 Starting onboarding workflow for user: ${req.user.email}`);

    // Get user data (in production, this would come from database)
    const userData = {
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      phoneNumber: req.user.phoneNumber,
      companyName: req.user.companyName,
      planTier: req.user.planTier,
      companySize: req.user.companySize,
      industry: req.user.industry,
      role: req.user.role
    };

    // Execute multi-agent onboarding workflow
    const workflowResult = await req.ai.orchestrator.executeOnboardingWorkflow(userData);

    return res.status(200).json({
      message: 'Onboarding workflow started successfully',
      workflowId: workflowResult.workflowId,
      status: workflowResult.status,
      steps: workflowResult.steps,
      estimatedDuration: workflowResult.steps.length * 2, // Rough estimate
      nextAction: 'Complete profile setup'
    });

  } catch (error) {
    console.error('Onboarding start error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Get onboarding progress
router.get('/progress', authenticateToken, async (req, res) => {
  try {
    const workflowId = req.query.workflowId;
    
    if (!workflowId) {
      return res.status(400).json({
        error: 'Workflow ID is required'
      });
    }

    // Get workflow progress from orchestrator
    const workflowHistory = req.ai.orchestrator.workflowHistory.get(workflowId);
    
    if (!workflowHistory) {
      return res.status(404).json({
        error: 'Workflow not found'
      });
    }

    // Calculate progress
    const completedSteps = workflowHistory.steps.filter(step => step.status === 'completed').length;
    const totalSteps = workflowHistory.steps.length;
    const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

    return res.status(200).json({
      workflowId: workflowId,
      status: workflowHistory.status,
      progress: progress,
      completedSteps: completedSteps,
      totalSteps: totalSteps,
      steps: workflowHistory.steps,
      startTime: workflowHistory.startTime,
      estimatedCompletion: workflowHistory.startTime + (workflowHistory.estimatedDuration * 60 * 60 * 1000)
    });

  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Complete onboarding step
router.post('/step/complete', authenticateToken, async (req, res) => {
  try {
    const { stepId, stepData } = req.body;

    if (!stepId) {
      return res.status(400).json({
        error: 'Step ID is required'
      });
    }

    console.log(`✅ Completing onboarding step: ${stepId} for user: ${req.user.email}`);

    // Update step completion in orchestrator
    // In production, this would update the workflow state
    
    // Get next steps based on AI recommendations
    const userData = {
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      companyName: req.user.companyName,
      planTier: req.user.planTier
    };

    const nextSteps = await req.ai.userProfiling.getNextSteps(userData, stepId);

    return res.status(200).json({
      message: 'Step completed successfully',
      stepId: stepId,
      nextSteps: nextSteps,
      aiRecommendations: await req.ai.userProfiling.getRecommendations(userData)
    });

  } catch (error) {
    console.error('Complete step error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Get personalized onboarding recommendations
router.get('/recommendations', authenticateToken, async (req, res) => {
  try {
    const userData = {
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      companyName: req.user.companyName,
      planTier: req.user.planTier,
      companySize: req.user.companySize,
      industry: req.user.industry,
      role: req.user.role
    };

    // Get AI-powered recommendations
    const recommendations = await req.ai.userProfiling.getRecommendations(userData);
    const successPrediction = await req.ai.userProfiling.predictOnboardingSuccess(userData);
    const churnRisk = await req.ai.churnPredictor.predictChurnRisk(userData, {});

    return res.status(200).json({
      recommendations: recommendations,
      successPrediction: successPrediction,
      churnRisk: churnRisk,
      personalizedWorkflow: await req.ai.userProfiling.createPersonalizedWorkflow(userData)
    });

  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Initiate multi-channel communication
router.post('/communication/initiate', authenticateToken, async (req, res) => {
  try {
    const { channels, message, options = {} } = req.body;

    if (!channels || !Array.isArray(channels)) {
      return res.status(400).json({
        error: 'Channels array is required'
      });
    }

    const userData = {
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      phoneNumber: req.user.phoneNumber,
      companyName: req.user.companyName
    };

    console.log(`📤 Initiating multi-channel communication for user: ${req.user.email}`);

    // Send message through multiple channels
    const results = await req.integrations.vonage.sendMultiChannelMessage(
      userData,
      channels,
      message,
      options
    );

    return res.status(200).json({
      message: 'Multi-channel communication initiated',
      results: results,
      successful: results.successful,
      failed: results.failed
    });

  } catch (error) {
    console.error('Communication initiation error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Schedule onboarding call
router.post('/call/schedule', authenticateToken, async (req, res) => {
  try {
    const { preferredTime, duration, purpose } = req.body;

    const userData = {
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      phoneNumber: req.user.phoneNumber,
      companyName: req.user.companyName,
      planTier: req.user.planTier
    };

    console.log(`📞 Scheduling onboarding call for user: ${req.user.email}`);

    // Create Vonage video session
    const videoSession = await req.integrations.vonage.createVideoSession({
      mediaMode: 'routed',
      archiveMode: 'manual'
    });

    // Generate video token
    const videoToken = await req.integrations.vonage.generateVideoToken(videoSession.sessionId, {
      role: 'publisher'
    });

    // Send invitation
    const invitation = await req.integrations.vonage.inviteToVideoSession(
      videoSession.sessionId,
      userData.email,
      {
        subject: 'OnboardIQ Onboarding Call',
        message: `Hi ${userData.firstName}, we're excited to help you get started with OnboardIQ!`
      }
    );

    return res.status(200).json({
      message: 'Onboarding call scheduled successfully',
      sessionId: videoSession.sessionId,
      videoToken: videoToken.token,
      invitation: invitation,
      scheduledTime: preferredTime || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Default to tomorrow
    });

  } catch (error) {
    console.error('Schedule call error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Generate personalized documents
router.post('/documents/generate', authenticateToken, async (req, res) => {
  try {
    const { documentTypes = ['welcome_packet'], personalizationData = {} } = req.body;

    const userData = {
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      companyName: req.user.companyName,
      planTier: req.user.planTier,
      industry: req.user.industry,
      role: req.user.role
    };

    console.log(`📄 Generating personalized documents for user: ${req.user.email}`);

    const generatedDocuments = [];

    for (const docType of documentTypes) {
      const document = await req.ai.document.generatePersonalizedDocument(
        docType,
        userData,
        personalizationData
      );

      generatedDocuments.push(document);
    }

    return res.status(200).json({
      message: 'Documents generated successfully',
      documents: generatedDocuments,
      totalGenerated: generatedDocuments.length
    });

  } catch (error) {
    console.error('Document generation error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Get onboarding analytics
router.get('/analytics', authenticateToken, async (req, res) => {
  try {
    const userData = {
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      companyName: req.user.companyName,
      planTier: req.user.planTier
    };

    // Get various analytics
    const userProfilingAnalytics = req.ai.userProfiling.getSegmentAnalytics();
    const churnAnalytics = req.ai.churnPredictor.getChurnAnalytics();
    const orchestratorAnalytics = req.ai.orchestrator.getOrchestratorAnalytics();

    return res.status(200).json({
      userProfiling: userProfilingAnalytics,
      churnPrediction: churnAnalytics,
      workflowOrchestration: orchestratorAnalytics,
      userSegment: await req.ai.userProfiling.classifyUser(userData),
      successProbability: await req.ai.userProfiling.predictOnboardingSuccess(userData)
    });

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Complete onboarding
router.post('/complete', authenticateToken, async (req, res) => {
  try {
    const { feedback, rating, suggestions } = req.body;

    const userData = {
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      companyName: req.user.companyName,
      planTier: req.user.planTier
    };

    console.log(`🎉 Completing onboarding for user: ${req.user.email}`);

    // Update user status (in production, this would update database)
    // user.onboardingCompleted = true;
    // user.onboardingFeedback = { feedback, rating, suggestions };

    // AI analysis of onboarding completion
    const completionAnalysis = await req.ai.userProfiling.analyzeOnboardingCompletion(userData, {
      feedback,
      rating,
      suggestions
    });

    // Generate completion certificate/document
    const completionDocument = await req.ai.document.generatePersonalizedDocument(
      'completion_certificate',
      userData,
      { completionDate: new Date().toISOString() }
    );

    // Send completion notification
    const notification = await req.integrations.vonage.sendSMS(
      userData.phoneNumber,
      'OnboardIQ',
      `Congratulations ${userData.firstName}! Your onboarding is complete. Welcome to OnboardIQ!`
    );

    return res.status(200).json({
      message: 'Onboarding completed successfully',
      completionAnalysis: completionAnalysis,
      completionDocument: completionDocument,
      notification: notification,
      nextSteps: [
        'Explore advanced features',
        'Set up team members',
        'Configure integrations',
        'Schedule follow-up call'
      ]
    });

  } catch (error) {
    console.error('Complete onboarding error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Get onboarding status
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const userData = {
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      companyName: req.user.companyName,
      planTier: req.user.planTier
    };

    // Get comprehensive onboarding status
    const status = {
      user: {
        email: userData.email,
        name: `${userData.firstName} ${userData.lastName}`,
        company: userData.companyName,
        planTier: userData.planTier
      },
      onboarding: {
        status: 'in_progress', // Would come from database
        progress: 75, // Would be calculated
        estimatedCompletion: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        nextMilestone: 'Complete document review'
      },
      ai: {
        segment: await req.ai.userProfiling.classifyUser(userData),
        successProbability: await req.ai.userProfiling.predictOnboardingSuccess(userData),
        churnRisk: await req.ai.churnPredictor.predictChurnRisk(userData, {}),
        recommendations: await req.ai.userProfiling.getRecommendations(userData)
      },
      integrations: {
        vonage: req.integrations.vonage.isConnected(),
        foxit: req.integrations.foxit.isConnected(),
        muleSoft: req.integrations.muleSoft.isConnected()
      }
    };

    return res.status(200).json(status);

  } catch (error) {
    console.error('Get status error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

module.exports = router;
