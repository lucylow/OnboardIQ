// Conversational AI Engine - Multi-channel chatbot with sentiment analysis and escalation
const axios = require('axios');
const OpenAIService = require('../services/openaiService');

class ConversationalAIEngine {
  constructor() {
    this.isReady = false;
    this.conversationContext = new Map();
    this.escalationThresholds = {
      negativeSentiment: 0.3,
      frustrationKeywords: 0.7,
      technicalIssues: 3, // number of technical questions
      timeInConversation: 300 // seconds
    };
    this.openaiService = new OpenAIService();
    this.initialize();
  }

  async initialize() {
    try {
      // Initialize OpenAI service
      await this.openaiService.initialize();
      this.isReady = true;
      console.log('✅ Conversational AI Engine initialized');
    } catch (error) {
      console.error('❌ Conversational AI Engine initialization failed:', error);
      this.isReady = false;
    }
  }

  async processMessage(userMessage, userId, channel = 'chat') {
    try {
      // Analyze sentiment
      const sentiment = await this.analyzeSentiment(userMessage);
      
      // Get or create conversation context
      if (!this.conversationContext.has(userId)) {
        this.conversationContext.set(userId, {
          state: 'greeting',
          history: [],
          userProfile: await this.getUserProfile(userId),
          startTime: Date.now()
        });
      }
      
      const context = this.conversationContext.get(userId);
      context.history.push({
        user: userMessage,
        sentiment: sentiment,
        timestamp: Date.now(),
        channel: channel
      });
      
      // Update conversation state
      this.updateConversationState(context, userMessage, sentiment);
      
      // Generate response
      const response = await this.generateResponse(context, userMessage);
      
      // Check if escalation is needed
      const escalationNeeded = this.needsHumanEscalation(context, sentiment);
      
      if (escalationNeeded) {
        await this.escalateToAgent(userId, channel, context);
        response.message += " I'm connecting you with a specialist who can help further.";
      }
      
      // Update context with response
      context.history.push({
        bot: response.message,
        timestamp: Date.now()
      });
      
      return {
        message: response.message,
        sentiment: sentiment,
        escalationTriggered: escalationNeeded,
        suggestedActions: response.suggestedActions,
        confidence: response.confidence
      };
      
    } catch (error) {
      console.error('Error processing message:', error);
      return {
        message: "I'm having trouble processing your request. Let me connect you with a human agent.",
        sentiment: 'neutral',
        escalationTriggered: true,
        error: error.message
      };
    }
  }

  async analyzeSentiment(text) {
    try {
      // Use OpenAI for sentiment analysis
      const analysis = await this.openaiService.analyzeSentimentAndIntent(text);
      return analysis.sentiment;
    } catch (error) {
      console.error('Sentiment analysis error:', error);
      return 'neutral';
    }
  }

  updateConversationState(context, message, sentiment) {
    const messageLower = message.toLowerCase();
    const currentState = context.state;
    
    // State transition logic
    switch (currentState) {
      case 'greeting':
        if (this.containsKeywords(messageLower, ['help', 'support', 'problem'])) {
          context.state = 'onboarding_help';
        } else if (this.containsKeywords(messageLower, ['account', 'login', 'password'])) {
          context.state = 'account_issues';
        } else if (this.containsKeywords(messageLower, ['feature', 'how to', 'tutorial'])) {
          context.state = 'feature_help';
        }
        break;
        
      case 'onboarding_help':
        if (this.containsKeywords(messageLower, ['technical', 'setup', 'configure', 'integration'])) {
          context.state = 'technical_support';
        } else if (sentiment === 'negative') {
          context.state = 'technical_support';
        }
        break;
        
      case 'technical_support':
        // Count technical questions
        const technicalQuestions = context.history.filter(h => 
          h.user && this.containsKeywords(h.user.toLowerCase(), ['technical', 'setup', 'configure', 'integration'])
        ).length;
        
        if (technicalQuestions >= this.escalationThresholds.technicalIssues) {
          context.state = 'escalation_needed';
        }
        break;
        
      case 'account_issues':
        if (sentiment === 'negative' || this.containsKeywords(messageLower, ['urgent', 'emergency'])) {
          context.state = 'escalation_needed';
        }
        break;
    }
  }

  containsKeywords(text, keywords) {
    return keywords.some(keyword => text.includes(keyword));
  }

  async generateResponse(context, message) {
    const state = context.state;
    const userProfile = context.userProfile;
    const sentiment = context.history[context.history.length - 1]?.sentiment || 'neutral';
    
    // Use OpenAI for response generation
    const response = await this.openaiService.generateConversationalResponse(message, context, userProfile);
    
    return {
      message: response,
      suggestedActions: ['product_tour', 'setup_guide', 'contact_support'],
      confidence: 0.85
    };
  }

  needsHumanEscalation(context, sentiment) {
    // Check sentiment
    if (sentiment === 'negative') {
      return true;
    }
    
    // Check conversation duration
    const conversationDuration = (Date.now() - context.startTime) / 1000;
    if (conversationDuration > this.escalationThresholds.timeInConversation) {
      return true;
    }
    
    // Check for frustration keywords
    const recentMessages = context.history.slice(-3);
    const frustrationCount = recentMessages.filter(msg => 
      msg.user && this.containsKeywords(msg.user.toLowerCase(), ['frustrated', 'angry', 'urgent', 'emergency'])
    ).length;
    
    if (frustrationCount >= 2) {
      return true;
    }
    
    // Check state
    if (context.state === 'escalation_needed') {
      return true;
    }
    
    return false;
  }

  async escalateToAgent(userId, channel, context) {
    try {
      console.log(`🚨 Escalating conversation for user ${userId} via ${channel}`);
      
      // Create escalation record
      const escalation = {
        userId: userId,
        channel: channel,
        reason: context.state,
        conversationHistory: context.history,
        timestamp: new Date().toISOString()
      };
      
      // In production, this would:
      // 1. Create a ticket in the support system
      // 2. Notify available agents
      // 3. Create a Vonage video room for escalation
      // 4. Send notification to the user
      
      // For now, we'll simulate the escalation
      await this.createEscalationTicket(escalation);
      await this.notifyAgents(escalation);
      
      return {
        escalationId: `ESC_${Date.now()}`,
        status: 'created',
        estimatedWaitTime: '5 minutes'
      };
      
    } catch (error) {
      console.error('Escalation error:', error);
      throw error;
    }
  }

  async createEscalationTicket(escalation) {
    // In production, this would create a ticket in Zendesk, Freshdesk, etc.
    console.log('📋 Creating escalation ticket:', escalation.escalationId);
  }

  async notifyAgents(escalation) {
    // In production, this would notify available agents via SMS, email, or internal system
    console.log('🔔 Notifying agents of escalation');
  }

  async getUserProfile(userId) {
    // In production, this would fetch user profile from database
    // For now, return mock data
    return {
      firstName: 'User',
      name: 'User',
      companyName: 'Company',
      planTier: 'free',
      email: 'user@example.com'
    };
  }

  async handleMultiChannelMessage(channel, message, sender) {
    // Process message through AI engine
    const response = await this.processMessage(message, sender, channel);
    
    // Send response through appropriate channel
    switch (channel) {
      case 'sms':
        return await this.sendSMSResponse(sender, response.message);
      case 'whatsapp':
        return await this.sendWhatsAppResponse(sender, response.message);
      case 'voice':
        return await this.sendVoiceResponse(sender, response.message);
      case 'email':
        return await this.sendEmailResponse(sender, response.message);
      default:
        return response;
    }
  }

  async sendSMSResponse(to, message) {
    // In production, this would use Vonage SMS API
    console.log(`📱 Sending SMS to ${to}: ${message}`);
    return { status: 'sent', channel: 'sms' };
  }

  async sendWhatsAppResponse(to, message) {
    // In production, this would use Vonage WhatsApp API
    console.log(`💬 Sending WhatsApp to ${to}: ${message}`);
    return { status: 'sent', channel: 'whatsapp' };
  }

  async sendVoiceResponse(to, message) {
    // In production, this would use Vonage Voice API with TTS
    console.log(`📞 Sending voice call to ${to}: ${message}`);
    return { status: 'sent', channel: 'voice' };
  }

  async sendEmailResponse(to, message) {
    // In production, this would use email service
    console.log(`📧 Sending email to ${to}: ${message}`);
    return { status: 'sent', channel: 'email' };
  }

  // Analytics and insights
  getConversationAnalytics() {
    const analytics = {
      totalConversations: this.conversationContext.size,
      averageSentiment: 0,
      escalationRate: 0,
      channelDistribution: {},
      commonIssues: []
    };
    
    // Calculate analytics from conversation contexts
    let totalSentiment = 0;
    let escalationCount = 0;
    
    this.conversationContext.forEach((context, userId) => {
      const sentiments = context.history
        .filter(h => h.sentiment)
        .map(h => h.sentiment === 'positive' ? 1 : h.sentiment === 'negative' ? -1 : 0);
      
      if (sentiments.length > 0) {
        totalSentiment += sentiments.reduce((a, b) => a + b, 0) / sentiments.length;
      }
      
      if (context.state === 'escalation_needed') {
        escalationCount++;
      }
    });
    
    analytics.averageSentiment = totalSentiment / this.conversationContext.size;
    analytics.escalationRate = escalationCount / this.conversationContext.size;
    
    return analytics;
  }

  isReady() {
    return this.isReady;
  }

  // Cleanup old conversations
  cleanupOldConversations(maxAge = 24 * 60 * 60 * 1000) { // 24 hours
    const now = Date.now();
    const toDelete = [];
    
    this.conversationContext.forEach((context, userId) => {
      if (now - context.startTime > maxAge) {
        toDelete.push(userId);
      }
    });
    
    toDelete.forEach(userId => {
      this.conversationContext.delete(userId);
    });
    
    console.log(`🧹 Cleaned up ${toDelete.length} old conversations`);
  }
}

module.exports = ConversationalAIEngine;
