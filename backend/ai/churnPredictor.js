// Churn Predictor - Predictive analytics for onboarding success and proactive interventions
const crypto = require('crypto');

class ChurnPredictor {
  constructor() {
    this.isReady = false;
    this.model = null;
    this.featureImportances = null;
    this.userProfiles = new Map();
    this.interventionHistory = new Map();
    this.initialize();
  }

  async initialize() {
    try {
      await this.loadModel();
      this.isReady = true;
      console.log('✅ Churn Predictor initialized');
    } catch (error) {
      console.error('❌ Churn Predictor initialization failed:', error);
      this.isReady = false;
    }
  }

  async loadModel() {
    // In production, this would load a trained ML model
    // For now, we'll use rule-based prediction
    console.log('📊 Loading churn prediction model...');
    
    // Mock feature importances
    this.featureImportances = {
      videoEngagement: 0.25,
      documentEngagement: 0.20,
      chatInteractions: 0.15,
      completionRate: 0.20,
      timeSinceSignup: 0.10,
      planTier: 0.10
    };
  }

  extractFeatures(userData, engagementData) {
    const features = {};
    
    // User demographics and signup features
    features.planTier = this.normalizePlanTier(userData.planTier || 'free');
    features.companySize = this.normalizeCompanySize(userData.companySize || '1-10');
    features.signupChannel = this.hashString(userData.signupChannel || 'direct') % 100;
    
    // Engagement timing features
    const currentTime = Date.now();
    const signupTime = userData.signupTime || currentTime;
    features.timeSinceSignup = (currentTime - signupTime) / (1000 * 60 * 60); // hours
    
    // Video engagement features
    const videoData = engagementData.videoEngagement || [];
    features.videoSessionsCount = videoData.length;
    features.totalVideoDuration = videoData.reduce((sum, session) => sum + (session.duration || 0), 0);
    features.avgVideoCompletion = videoData.length > 0 
      ? videoData.reduce((sum, session) => sum + (session.completionRate || 0), 0) / videoData.length 
      : 0;
    
    // Document engagement features
    const docData = engagementData.documentEngagement || {};
    features.documentsViewed = docData.viewedCount || 0;
    features.documentsSigned = docData.signedCount || 0;
    features.timeToFirstView = docData.timeToFirstView || (24 * 60 * 60); // default 24 hours
    
    // Chatbot interactions
    const chatData = engagementData.chatInteractions || [];
    features.chatInteractionsCount = chatData.length;
    features.avgChatSentiment = chatData.length > 0 
      ? chatData.reduce((sum, chat) => sum + (chat.sentiment || 0.5), 0) / chatData.length 
      : 0.5;
    
    // Feature: Percentage of recommended actions completed
    const recommendedActions = engagementData.recommendedActions || [];
    const completedActions = recommendedActions.filter(action => action.completed);
    features.completionRate = recommendedActions.length > 0 
      ? completedActions.length / recommendedActions.length 
      : 0;
    
    // Additional engagement features
    features.lastActivityTime = engagementData.lastActivityTime || currentTime;
    features.totalLoginCount = engagementData.totalLoginCount || 0;
    features.featuresExplored = engagementData.featuresExplored || 0;
    
    return features;
  }

  normalizePlanTier(planTier) {
    const tierMap = {
      'free': 0.1,
      'premium': 0.7,
      'enterprise': 1.0
    };
    return tierMap[planTier] || 0.1;
  }

  normalizeCompanySize(companySize) {
    const sizeMap = {
      '1-10': 0.1,
      '11-50': 0.3,
      '51-200': 0.6,
      '201+': 1.0
    };
    return sizeMap[companySize] || 0.1;
  }

  hashString(str) {
    return parseInt(crypto.createHash('md5').update(str).digest('hex').substring(0, 8), 16);
  }

  async predictChurnRisk(userData, engagementData) {
    try {
      if (!this.isReady) {
        throw new Error('Model not ready');
      }
      
      const features = this.extractFeatures(userData, engagementData);
      const churnProbability = this.calculateChurnProbability(features);
      
      return {
        churnRisk: churnProbability,
        riskLevel: this.determineRiskLevel(churnProbability),
        keyFactors: this.identifyRiskFactors(features),
        confidence: this.calculateConfidence(features),
        recommendations: this.generateRecommendations(features, churnProbability),
        features: features
      };
      
    } catch (error) {
      console.error('Churn prediction error:', error);
      throw error;
    }
  }

  calculateChurnProbability(features) {
    // Rule-based churn probability calculation
    // In production, this would use a trained ML model
    
    let probability = 0.5; // Base probability
    
    // Video engagement factor
    if (features.avgVideoCompletion < 0.3) {
      probability += 0.2;
    } else if (features.avgVideoCompletion > 0.8) {
      probability -= 0.1;
    }
    
    // Document engagement factor
    if (features.documentsViewed === 0) {
      probability += 0.15;
    } else if (features.documentsViewed > 3) {
      probability -= 0.1;
    }
    
    // Time since signup factor
    if (features.timeSinceSignup > 72 && features.completionRate < 0.2) {
      probability += 0.25; // Stalled onboarding
    }
    
    // Chat interactions factor
    if (features.chatInteractionsCount === 0) {
      probability += 0.1;
    } else if (features.avgChatSentiment < 0.3) {
      probability += 0.15; // Negative sentiment
    }
    
    // Plan tier factor
    if (features.planTier === 1.0) {
      probability -= 0.1; // Enterprise users less likely to churn
    } else if (features.planTier === 0.1) {
      probability += 0.05; // Free users more likely to churn
    }
    
    // Recent activity factor
    const hoursSinceLastActivity = (Date.now() - features.lastActivityTime) / (1000 * 60 * 60);
    if (hoursSinceLastActivity > 168) { // 1 week
      probability += 0.2;
    }
    
    // Cap probability between 0 and 1
    return Math.max(0, Math.min(1, probability));
  }

  determineRiskLevel(probability) {
    if (probability >= 0.8) return 'critical';
    else if (probability >= 0.6) return 'high';
    else if (probability >= 0.4) return 'medium';
    else return 'low';
  }

  identifyRiskFactors(features) {
    const factors = [];
    
    if (features.avgVideoCompletion < 0.3) {
      factors.push('low_video_engagement');
    }
    
    if (features.documentsViewed === 0) {
      factors.push('no_document_views');
    }
    
    if (features.timeSinceSignup > 72 && features.completionRate < 0.2) {
      factors.push('stalled_onboarding');
    }
    
    if (features.chatInteractionsCount === 0) {
      factors.push('no_chat_interactions');
    }
    
    if (features.avgChatSentiment < 0.3) {
      factors.push('negative_sentiment');
    }
    
    if (features.completionRate < 0.3) {
      factors.push('low_completion_rate');
    }
    
    const hoursSinceLastActivity = (Date.now() - features.lastActivityTime) / (1000 * 60 * 60);
    if (hoursSinceLastActivity > 168) {
      factors.push('inactive_user');
    }
    
    return factors;
  }

  calculateConfidence(features) {
    // Calculate confidence based on data completeness and quality
    let confidence = 0.5; // Base confidence
    
    // More data points = higher confidence
    if (features.videoSessionsCount > 0) confidence += 0.1;
    if (features.documentsViewed > 0) confidence += 0.1;
    if (features.chatInteractionsCount > 0) confidence += 0.1;
    if (features.totalLoginCount > 5) confidence += 0.1;
    
    // Recent activity = higher confidence
    const hoursSinceLastActivity = (Date.now() - features.lastActivityTime) / (1000 * 60 * 60);
    if (hoursSinceLastActivity < 24) confidence += 0.1;
    
    return Math.min(1, confidence);
  }

  generateRecommendations(features, churnProbability) {
    const recommendations = [];
    
    if (features.avgVideoCompletion < 0.3) {
      recommendations.push('Send personalized video tutorial');
      recommendations.push('Schedule onboarding call');
    }
    
    if (features.documentsViewed === 0) {
      recommendations.push('Send document reminder email');
      recommendations.push('Create simplified document guide');
    }
    
    if (features.chatInteractionsCount === 0) {
      recommendations.push('Initiate proactive chat outreach');
      recommendations.push('Send welcome message via SMS');
    }
    
    if (features.completionRate < 0.3) {
      recommendations.push('Simplify onboarding steps');
      recommendations.push('Provide step-by-step guidance');
    }
    
    if (churnProbability > 0.7) {
      recommendations.push('Assign dedicated success manager');
      recommendations.push('Offer personalized demo session');
    }
    
    return recommendations;
  }

  async monitorAndIntervene(userId, userData, engagementData) {
    try {
      // Predict churn risk
      const riskAssessment = await this.predictChurnRisk(userData, engagementData);
      
      // Only intervene for medium/high/critical risk users
      if (['medium', 'high', 'critical'].includes(riskAssessment.riskLevel)) {
        const interventions = this.determineInterventions(riskAssessment.keyFactors, userData);
        const interventionResults = await this.executeInterventions(interventions, userData);
        
        // Store intervention history
        this.storeInterventionHistory(userId, riskAssessment, interventions, interventionResults);
        
        return {
          interventionsTriggered: true,
          riskAssessment: riskAssessment,
          interventions: interventions,
          results: interventionResults
        };
      }
      
      return {
        interventionsTriggered: false,
        riskAssessment: riskAssessment
      };
      
    } catch (error) {
      console.error('Monitor and intervene error:', error);
      throw error;
    }
  }

  determineInterventions(riskFactors, userData) {
    const interventions = [];
    
    riskFactors.forEach(factor => {
      switch (factor) {
        case 'low_video_engagement':
          interventions.push(this.createVideoIntervention(userData));
          break;
        case 'no_document_views':
          interventions.push(this.createDocumentIntervention(userData));
          break;
        case 'stalled_onboarding':
          interventions.push(this.createStalledOnboardingIntervention(userData));
          break;
        case 'no_chat_interactions':
          interventions.push(this.createChatIntervention(userData));
          break;
        case 'negative_sentiment':
          interventions.push(this.createSentimentIntervention(userData));
          break;
        case 'inactive_user':
          interventions.push(this.createInactiveUserIntervention(userData));
          break;
      }
    });
    
    return interventions;
  }

  createVideoIntervention(userData) {
    return {
      type: 'personalized_video_invite',
      channel: 'sms',
      priority: 'medium',
      message: `Hi ${userData.firstName || 'there'}! Not sure where to start? Let me guide you with a quick 3-min video tour of our platform.`,
      action: 'send_video_invite',
      data: {
        videoType: 'onboarding_tour',
        duration: '3 minutes',
        personalization: {
          name: userData.firstName,
          company: userData.companyName,
          plan: userData.planTier
        }
      }
    };
  }

  createDocumentIntervention(userData) {
    return {
      type: 'document_reminder',
      channel: 'email',
      priority: 'high',
      subject: 'Complete your setup - Important documents awaiting review',
      body: `Hi ${userData.firstName || 'there'}, we noticed you haven't reviewed your welcome documents yet. These contain important information to help you get started.`,
      action: 'send_document_reminder',
      data: {
        documentType: 'welcome_packet',
        urgency: 'high',
        personalization: {
          name: userData.firstName,
          company: userData.companyName
        }
      }
    };
  }

  createStalledOnboardingIntervention(userData) {
    return {
      type: 'human_assistance_offer',
      channel: 'phone',
      priority: 'high',
      message: 'Our onboarding specialist would love to help you get started with a quick 15-min call.',
      action: 'schedule_onboarding_call',
      data: {
        callType: 'onboarding_assistance',
        duration: '15 minutes',
        personalization: {
          name: userData.firstName,
          company: userData.companyName,
          plan: userData.planTier
        }
      }
    };
  }

  createChatIntervention(userData) {
    return {
      type: 'chat_prompt',
      channel: 'in_app',
      priority: 'medium',
      message: 'Have questions? I\'m here to help! Just click the chat icon in the bottom right.',
      action: 'trigger_chat_prompt',
      data: {
        promptType: 'welcome_message',
        personalization: {
          name: userData.firstName,
          company: userData.companyName
        }
      }
    };
  }

  createSentimentIntervention(userData) {
    return {
      type: 'sentiment_recovery',
      channel: 'email',
      priority: 'high',
      subject: 'We\'re here to help - Let\'s get you back on track',
      body: `Hi ${userData.firstName || 'there'}, we want to make sure you're getting the most out of our platform. Let us know how we can help!`,
      action: 'send_sentiment_recovery',
      data: {
        recoveryType: 'personalized_support',
        personalization: {
          name: userData.firstName,
          company: userData.companyName
        }
      }
    };
  }

  createInactiveUserIntervention(userData) {
    return {
      type: 'reactivation_campaign',
      channel: 'email',
      priority: 'medium',
      subject: 'We miss you! Come back and explore more features',
      body: `Hi ${userData.firstName || 'there'}, we noticed you haven't been active lately. Here are some new features you might like!`,
      action: 'send_reactivation_email',
      data: {
        campaignType: 'reactivation',
        personalization: {
          name: userData.firstName,
          company: userData.companyName,
          plan: userData.planTier
        }
      }
    };
  }

  async executeInterventions(interventions, userData) {
    const results = [];
    
    for (const intervention of interventions) {
      try {
        const result = await this.executeIntervention(intervention, userData);
        results.push({
          intervention: intervention,
          result: result,
          success: true
        });
      } catch (error) {
        console.error(`Intervention execution failed: ${intervention.type}`, error);
        results.push({
          intervention: intervention,
          result: { error: error.message },
          success: false
        });
      }
    }
    
    return results;
  }

  async executeIntervention(intervention, userData) {
    console.log(`🎯 Executing intervention: ${intervention.type} for user ${userData.email}`);
    
    switch (intervention.action) {
      case 'send_video_invite':
        return await this.sendVideoInvite(intervention, userData);
      case 'send_document_reminder':
        return await this.sendDocumentReminder(intervention, userData);
      case 'schedule_onboarding_call':
        return await this.scheduleOnboardingCall(intervention, userData);
      case 'trigger_chat_prompt':
        return await this.triggerChatPrompt(intervention, userData);
      case 'send_sentiment_recovery':
        return await this.sendSentimentRecovery(intervention, userData);
      case 'send_reactivation_email':
        return await this.sendReactivationEmail(intervention, userData);
      default:
        throw new Error(`Unknown intervention action: ${intervention.action}`);
    }
  }

  async sendVideoInvite(intervention, userData) {
    // In production, this would integrate with Vonage Video API
    console.log(`📹 Sending video invite to ${userData.email}`);
    return {
      status: 'sent',
      videoUrl: `https://onboardiq.com/video/${Date.now()}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    };
  }

  async sendDocumentReminder(intervention, userData) {
    // In production, this would send via email service
    console.log(`📧 Sending document reminder to ${userData.email}`);
    return {
      status: 'sent',
      emailId: `EMAIL_${Date.now()}`,
      documentUrl: `https://onboardiq.com/documents/welcome`
    };
  }

  async scheduleOnboardingCall(intervention, userData) {
    // In production, this would integrate with calendar/booking system
    console.log(`📞 Scheduling onboarding call for ${userData.email}`);
    return {
      status: 'scheduled',
      callId: `CALL_${Date.now()}`,
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Tomorrow
    };
  }

  async triggerChatPrompt(intervention, userData) {
    // In production, this would trigger in-app notification
    console.log(`💬 Triggering chat prompt for user ${userData.email}`);
    return {
      status: 'triggered',
      promptId: `PROMPT_${Date.now()}`,
      message: intervention.message
    };
  }

  async sendSentimentRecovery(intervention, userData) {
    // In production, this would send via email service
    console.log(`💌 Sending sentiment recovery email to ${userData.email}`);
    return {
      status: 'sent',
      emailId: `EMAIL_${Date.now()}`,
      recoveryType: intervention.data.recoveryType
    };
  }

  async sendReactivationEmail(intervention, userData) {
    // In production, this would send via email service
    console.log(`📧 Sending reactivation email to ${userData.email}`);
    return {
      status: 'sent',
      emailId: `EMAIL_${Date.now()}`,
      campaignType: intervention.data.campaignType
    };
  }

  storeInterventionHistory(userId, riskAssessment, interventions, results) {
    const historyEntry = {
      userId: userId,
      timestamp: Date.now(),
      riskAssessment: riskAssessment,
      interventions: interventions,
      results: results,
      success: results.filter(r => r.success).length / results.length
    };
    
    if (!this.interventionHistory.has(userId)) {
      this.interventionHistory.set(userId, []);
    }
    
    this.interventionHistory.get(userId).push(historyEntry);
  }

  // Analytics and insights
  getChurnAnalytics() {
    const analytics = {
      totalUsers: this.userProfiles.size,
      averageChurnRisk: 0,
      riskDistribution: {
        low: 0,
        medium: 0,
        high: 0,
        critical: 0
      },
      topRiskFactors: {},
      interventionSuccess: {
        total: 0,
        successful: 0,
        rate: 0
      },
      recentInterventions: []
    };
    
    let totalRisk = 0;
    let userCount = 0;
    let totalInterventions = 0;
    let successfulInterventions = 0;
    
    // Calculate from user profiles
    this.userProfiles.forEach((profile, userId) => {
      if (profile.churnRisk !== undefined) {
        totalRisk += profile.churnRisk;
        userCount++;
        
        const riskLevel = this.determineRiskLevel(profile.churnRisk);
        analytics.riskDistribution[riskLevel]++;
      }
    });
    
    // Calculate from intervention history
    this.interventionHistory.forEach((history, userId) => {
      history.forEach(entry => {
        totalInterventions++;
        if (entry.success > 0.5) {
          successfulInterventions++;
        }
      });
    });
    
    analytics.averageChurnRisk = userCount > 0 ? totalRisk / userCount : 0;
    analytics.interventionSuccess.total = totalInterventions;
    analytics.interventionSuccess.successful = successfulInterventions;
    analytics.interventionSuccess.rate = totalInterventions > 0 ? successfulInterventions / totalInterventions : 0;
    
    return analytics;
  }

  // Model training and updates
  async updateModel(newData) {
    console.log('🔄 Updating churn prediction model with new data...');
    
    // In production, this would retrain the model with new data
    // For now, we'll just log the update
    return {
      status: 'updated',
      timestamp: Date.now(),
      dataPoints: newData.length
    };
  }

  // Performance monitoring
  getModelPerformance() {
    return {
      accuracy: 0.85, // Mock accuracy
      precision: 0.82,
      recall: 0.88,
      f1Score: 0.85,
      lastUpdated: Date.now(),
      dataPoints: this.userProfiles.size
    };
  }

  isReady() {
    return this.isReady;
  }

  // Cleanup old data
  cleanupOldData(maxAge = 90 * 24 * 60 * 60 * 1000) { // 90 days
    const now = Date.now();
    const toDelete = [];
    
    // Cleanup user profiles
    this.userProfiles.forEach((profile, userId) => {
      if (now - profile.lastUpdated > maxAge) {
        toDelete.push(userId);
      }
    });
    
    toDelete.forEach(userId => {
      this.userProfiles.delete(userId);
      this.interventionHistory.delete(userId);
    });
    
    console.log(`🧹 Cleaned up ${toDelete.length} old churn prediction data`);
  }
}

module.exports = ChurnPredictor;
