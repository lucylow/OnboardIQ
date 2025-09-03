const axios = require('axios');
const crypto = require('crypto');

class AdaptiveOnboardingEngine {
  constructor() {
    this.muleSoftBaseUrl = process.env.MULESOFT_BASE_URL || 'https://api.mulesoft.com';
    this.muleSoftToken = process.env.MULESOFT_ACCESS_TOKEN;
    this.userBehaviorCache = new Map();
    this.recommendationCache = new Map();
  }

  // Analyze user behavior patterns using MuleSoft AI
  async analyzeUserBehavior(userId, userData) {
    try {
      const behaviorData = {
        userId,
        interactions: userData.interactions || [],
        featureUsage: userData.featureUsage || {},
        timeSpent: userData.timeSpent || {},
        preferences: userData.preferences || {},
        timestamp: new Date().toISOString()
      };

      // Call MuleSoft AI API for behavior analysis
      const response = await axios.post(
        `${this.muleSoftBaseUrl}/ai/behavior-analysis`,
        behaviorData,
        {
          headers: {
            'Authorization': `Bearer ${this.muleSoftToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const analysis = response.data;
      
      // Cache the analysis
      this.userBehaviorCache.set(userId, {
        ...analysis,
        lastUpdated: new Date(),
        confidence: analysis.confidence || 0.85
      });

      return analysis;
    } catch (error) {
      console.error('Error analyzing user behavior:', error);
      // Fallback to basic analysis
      return this.fallbackBehaviorAnalysis(userData);
    }
  }

  // Generate personalized recommendations
  async generateRecommendations(userId, behaviorAnalysis) {
    try {
      const recommendationData = {
        userId,
        behaviorAnalysis,
        context: {
          userType: behaviorAnalysis.userType || 'new',
          learningStyle: behaviorAnalysis.learningStyle || 'visual',
          pace: behaviorAnalysis.pace || 'moderate',
          complexity: behaviorAnalysis.complexity || 'intermediate'
        }
      };

      // Call MuleSoft AI for recommendations
      const response = await axios.post(
        `${this.muleSoftBaseUrl}/ai/recommendations`,
        recommendationData,
        {
          headers: {
            'Authorization': `Bearer ${this.muleSoftToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const recommendations = response.data.recommendations || [];
      
      // Cache recommendations
      this.recommendationCache.set(userId, {
        recommendations,
        generatedAt: new Date(),
        confidence: response.data.confidence || 0.78
      });

      return recommendations;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      // Fallback to basic recommendations
      return this.fallbackRecommendations(behaviorAnalysis);
    }
  }

  // Track user actions for continuous learning
  async trackUserAction(userId, action) {
    try {
      const actionData = {
        userId,
        action: {
          type: action.type,
          target: action.target,
          timestamp: new Date().toISOString(),
          duration: action.duration || 0,
          outcome: action.outcome || 'success'
        }
      };

      // Send to MuleSoft for learning
      await axios.post(
        `${this.muleSoftBaseUrl}/ai/track-action`,
        actionData,
        {
          headers: {
            'Authorization': `Bearer ${this.muleSoftToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update local cache
      const currentBehavior = this.userBehaviorCache.get(userId);
      if (currentBehavior) {
        currentBehavior.interactions.push(actionData.action);
        currentBehavior.lastUpdated = new Date();
      }

      return { success: true };
    } catch (error) {
      console.error('Error tracking user action:', error);
      return { success: false, error: error.message };
    }
  }

  // Get user behavior insights
  async getUserBehaviorInsights(userId) {
    const cached = this.userBehaviorCache.get(userId);
    if (cached && (new Date() - cached.lastUpdated) < 300000) { // 5 minutes cache
      return cached;
    }

    // Fetch fresh data
    try {
      const response = await axios.get(
        `${this.muleSoftBaseUrl}/ai/user-insights/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.muleSoftToken}`
          }
        }
      );

      const insights = response.data;
      this.userBehaviorCache.set(userId, {
        ...insights,
        lastUpdated: new Date()
      });

      return insights;
    } catch (error) {
      console.error('Error fetching user insights:', error);
      return cached || this.getDefaultInsights();
    }
  }

  // Fallback behavior analysis when MuleSoft is unavailable
  fallbackBehaviorAnalysis(userData) {
    const interactions = userData.interactions || [];
    const featureUsage = userData.featureUsage || {};
    
    // Simple analysis based on interaction patterns
    const totalInteractions = interactions.length;
    const avgDuration = interactions.reduce((sum, i) => sum + (i.duration || 0), 0) / totalInteractions || 0;
    
    // Determine learning style based on interaction types
    const visualInteractions = interactions.filter(i => 
      ['video_view', 'image_view', 'dashboard_view'].includes(i.type)
    ).length;
    const auditoryInteractions = interactions.filter(i => 
      ['audio_play', 'voice_call'].includes(i.type)
    ).length;
    
    let learningStyle = 'visual';
    if (auditoryInteractions > visualInteractions) {
      learningStyle = 'auditory';
    } else if (visualInteractions === auditoryInteractions) {
      learningStyle = 'mixed';
    }

    // Determine pace based on interaction frequency
    const pace = avgDuration < 30 ? 'fast' : avgDuration > 120 ? 'slow' : 'moderate';
    
    // Determine complexity preference
    const complexity = totalInteractions > 20 ? 'advanced' : totalInteractions > 10 ? 'intermediate' : 'basic';

    return {
      userType: totalInteractions > 50 ? 'power' : totalInteractions > 20 ? 'active' : 'new',
      learningStyle,
      pace,
      complexity,
      confidence: 0.75,
      featurePreferences: Object.keys(featureUsage).sort((a, b) => featureUsage[b] - featureUsage[a]),
      engagementScore: Math.min(totalInteractions / 10, 1),
      lastActive: new Date().toISOString()
    };
  }

  // Fallback recommendations when MuleSoft is unavailable
  fallbackRecommendations(behaviorAnalysis) {
    const recommendations = [];
    
    // Security recommendations
    if (behaviorAnalysis.userType === 'new') {
      recommendations.push({
        id: crypto.randomUUID(),
        type: 'security',
        title: 'Complete Security Setup',
        description: 'Set up two-factor authentication and security preferences',
        priority: 'high',
        estimatedTime: 10,
        confidence: 0.95,
        actionUrl: '/onboarding/security-setup',
        completed: false
      });
    }

    // Learning recommendations based on style
    if (behaviorAnalysis.learningStyle === 'visual') {
      recommendations.push({
        id: crypto.randomUUID(),
        type: 'video',
        title: 'Interactive Dashboard Tour',
        description: 'Visual walkthrough of key features and analytics',
        priority: 'medium',
        estimatedTime: 8,
        confidence: 0.85,
        actionUrl: '/video/dashboard-tour',
        completed: false
      });
    } else if (behaviorAnalysis.learningStyle === 'auditory') {
      recommendations.push({
        id: crypto.randomUUID(),
        type: 'audio',
        title: 'Audio Guide to Features',
        description: 'Listen to detailed explanations of platform capabilities',
        priority: 'medium',
        estimatedTime: 12,
        confidence: 0.80,
        actionUrl: '/audio/feature-guide',
        completed: false
      });
    }

    // Complexity-based recommendations
    if (behaviorAnalysis.complexity === 'advanced') {
      recommendations.push({
        id: crypto.randomUUID(),
        type: 'advanced',
        title: 'Advanced Analytics Setup',
        description: 'Configure custom dashboards and reporting',
        priority: 'medium',
        estimatedTime: 20,
        confidence: 0.70,
        actionUrl: '/onboarding/advanced-analytics',
        completed: false
      });
    }

    // Engagement recommendations
    if (behaviorAnalysis.engagementScore < 0.5) {
      recommendations.push({
        id: crypto.randomUUID(),
        type: 'engagement',
        title: 'Quick Start Guide',
        description: 'Get up and running with essential features quickly',
        priority: 'high',
        estimatedTime: 5,
        confidence: 0.90,
        actionUrl: '/onboarding/quick-start',
        completed: false
      });
    }

    return recommendations;
  }

  // Get default insights for new users
  getDefaultInsights() {
    return {
      userType: 'new',
      learningStyle: 'visual',
      pace: 'moderate',
      complexity: 'basic',
      confidence: 0.60,
      featurePreferences: ['dashboard', 'documents', 'analytics'],
      engagementScore: 0.3,
      lastActive: new Date().toISOString()
    };
  }

  // Get cached recommendations
  getCachedRecommendations(userId) {
    const cached = this.recommendationCache.get(userId);
    if (cached && (new Date() - cached.generatedAt) < 600000) { // 10 minutes cache
      return cached.recommendations;
    }
    return null;
  }

  // Update recommendation completion status
  async updateRecommendationStatus(userId, recommendationId, completed) {
    try {
      await axios.patch(
        `${this.muleSoftBaseUrl}/ai/recommendations/${recommendationId}`,
        { completed, userId },
        {
          headers: {
            'Authorization': `Bearer ${this.muleSoftToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update local cache
      const cached = this.recommendationCache.get(userId);
      if (cached) {
        const recommendation = cached.recommendations.find(r => r.id === recommendationId);
        if (recommendation) {
          recommendation.completed = completed;
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating recommendation status:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = AdaptiveOnboardingEngine;
