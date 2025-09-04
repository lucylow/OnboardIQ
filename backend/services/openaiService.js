const axios = require('axios');
const crypto = require('crypto');

class OpenAIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.model = process.env.OPENAI_MODEL || 'gpt-4';
    this.maxTokens = parseInt(process.env.OPENAI_MAX_TOKENS) || 2000;
    this.temperature = parseFloat(process.env.OPENAI_TEMPERATURE) || 0.7;
    this.baseURL = 'https://api.openai.com/v1';
    this.cache = new Map();
    this.cacheTTL = 300000; // 5 minutes
  }

  // Initialize the service
  async initialize() {
    if (!this.apiKey || this.apiKey === 'test-openai-api-key') {
      console.warn('⚠️ OpenAI API key not configured. Using fallback responses.');
      return false;
    }

    try {
      // Test the API connection
      const response = await this.testConnection();
      if (response.success) {
        console.log('✅ OpenAI API connected successfully');
        return true;
      } else {
        console.error('❌ OpenAI API connection failed:', response.error);
        return false;
      }
    } catch (error) {
      console.error('❌ OpenAI service initialization failed:', error);
      return false;
    }
  }

  // Test API connection
  async testConnection() {
    try {
      const response = await axios.get(`${this.baseURL}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      return { success: true, models: response.data.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Generate personalized onboarding recommendations
  async generateOnboardingRecommendations(userData, behaviorAnalysis) {
    const prompt = `As an AI onboarding specialist for OnboardIQ, analyze this user data and generate personalized recommendations:

User Profile:
- Company: ${userData.companyName || 'Unknown'}
- Role: ${userData.role || 'User'}
- Industry: ${userData.industry || 'General'}
- Team Size: ${userData.teamSize || 'Unknown'}

Behavior Analysis:
- Learning Style: ${behaviorAnalysis.learningStyle || 'visual'}
- Pace: ${behaviorAnalysis.pace || 'moderate'}
- Complexity Preference: ${behaviorAnalysis.complexity || 'intermediate'}
- Engagement Score: ${behaviorAnalysis.engagementScore || 0.5}

Generate 3-5 specific, actionable recommendations for onboarding this user. Each recommendation should include:
1. A clear title
2. Brief description
3. Estimated time to complete
4. Priority level (high/medium/low)
5. Specific action URL or next step

Format as JSON array with fields: id, title, description, priority, estimatedTime, actionUrl, type, confidence.`;

    try {
      const response = await this.callOpenAI(prompt, 'recommendations');
      return this.parseRecommendationsResponse(response);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return this.getFallbackRecommendations(behaviorAnalysis);
    }
  }

  // Analyze user behavior patterns
  async analyzeUserBehavior(userInteractions, featureUsage) {
    const prompt = `Analyze this user's behavior patterns and provide insights:

User Interactions (last 30 days):
${JSON.stringify(userInteractions, null, 2)}

Feature Usage:
${JSON.stringify(featureUsage, null, 2)}

Provide analysis in JSON format with these fields:
{
  "userType": "new|active|power",
  "learningStyle": "visual|auditory|kinesthetic|mixed",
  "pace": "fast|moderate|slow",
  "complexity": "basic|intermediate|advanced",
  "confidence": 0.0-1.0,
  "featurePreferences": ["array", "of", "preferred", "features"],
  "engagementScore": 0.0-1.0,
  "recommendations": ["array", "of", "suggestions"],
  "riskFactors": ["array", "of", "potential", "issues"]
}`;

    try {
      const response = await this.callOpenAI(prompt, 'behavior_analysis');
      return this.parseBehaviorAnalysisResponse(response);
    } catch (error) {
      console.error('Error analyzing user behavior:', error);
      return this.getFallbackBehaviorAnalysis(userInteractions, featureUsage);
    }
  }

  // Generate conversational responses
  async generateConversationalResponse(message, context, userProfile) {
    const prompt = `You are an AI assistant for OnboardIQ, a comprehensive customer onboarding platform. 

User Profile:
- Name: ${userProfile?.firstName || 'User'}
- Company: ${userProfile?.companyName || 'Unknown'}
- Plan: ${userProfile?.planTier || 'free'}

Conversation Context:
${JSON.stringify(context, null, 2)}

User Message: "${message}"

Provide a helpful, professional response that:
1. Addresses the user's question or concern
2. Suggests relevant OnboardIQ features or solutions
3. Maintains a friendly, supportive tone
4. Includes specific next steps when appropriate

Keep the response concise but informative. If the user needs technical support or complex assistance, suggest escalating to a human agent.`;

    try {
      const response = await this.callOpenAI(prompt, 'conversation');
      return response.trim();
    } catch (error) {
      console.error('Error generating conversational response:', error);
      return this.getFallbackResponse(message, context);
    }
  }

  // Generate document content
  async generateDocumentContent(documentType, userData, requirements) {
    const prompt = `Generate professional ${documentType} content for OnboardIQ:

Document Type: ${documentType}
User Company: ${userData.companyName || 'Company'}
Industry: ${userData.industry || 'General'}
Requirements: ${requirements}

Generate comprehensive, professional content that:
1. Is tailored to the user's industry and company
2. Follows best practices for ${documentType}
3. Includes relevant sections and subsections
4. Uses clear, professional language
5. Is ready for immediate use

Format the response as structured content with clear headings and sections.`;

    try {
      const response = await this.callOpenAI(prompt, 'document_generation');
      return response.trim();
    } catch (error) {
      console.error('Error generating document content:', error);
      return this.getFallbackDocumentContent(documentType, userData);
    }
  }

  // Analyze sentiment and intent
  async analyzeSentimentAndIntent(text, context = {}) {
    const prompt = `Analyze the sentiment and intent of this message:

Text: "${text}"
Context: ${JSON.stringify(context, null, 2)}

Provide analysis in JSON format:
{
  "sentiment": "positive|negative|neutral",
  "sentimentScore": 0.0-1.0,
  "intent": "question|complaint|request|feedback|greeting",
  "urgency": "low|medium|high",
  "topics": ["array", "of", "main", "topics"],
  "emotions": ["array", "of", "detected", "emotions"],
  "confidence": 0.0-1.0,
  "suggestedActions": ["array", "of", "recommended", "actions"]
}`;

    try {
      const response = await this.callOpenAI(prompt, 'sentiment_analysis');
      return this.parseSentimentResponse(response);
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      return this.getFallbackSentimentAnalysis(text);
    }
  }

  // Generate personalized learning paths
  async generateLearningPath(userProfile, goals, currentProgress) {
    const prompt = `Create a personalized learning path for OnboardIQ user:

User Profile:
- Role: ${userProfile.role || 'User'}
- Experience Level: ${userProfile.experienceLevel || 'Beginner'}
- Goals: ${goals.join(', ')}
- Current Progress: ${JSON.stringify(currentProgress, null, 2)}

Generate a structured learning path with:
1. Clear milestones and objectives
2. Estimated time for each step
3. Recommended resources and activities
4. Success metrics for each milestone
5. Adaptive recommendations based on progress

Format as JSON with fields: milestones, estimatedDuration, resources, successMetrics, adaptiveRecommendations.`;

    try {
      const response = await this.callOpenAI(prompt, 'learning_path');
      return this.parseLearningPathResponse(response);
    } catch (error) {
      console.error('Error generating learning path:', error);
      return this.getFallbackLearningPath(userProfile, goals);
    }
  }

  // Generate security recommendations
  async generateSecurityRecommendations(userData, riskAssessment) {
    const prompt = `Generate security recommendations for OnboardIQ user:

User Data:
- Company Size: ${userData.companySize || 'Unknown'}
- Industry: ${userData.industry || 'General'}
- Compliance Requirements: ${userData.complianceRequirements || 'None'}

Risk Assessment:
${JSON.stringify(riskAssessment, null, 2)}

Provide security recommendations that:
1. Address identified risks
2. Follow industry best practices
3. Are appropriate for the company size and industry
4. Include implementation steps
5. Prioritize by risk level

Format as JSON array with fields: id, title, description, riskLevel, implementationSteps, estimatedTime, priority.`;

    try {
      const response = await this.callOpenAI(prompt, 'security_recommendations');
      return this.parseSecurityRecommendationsResponse(response);
    } catch (error) {
      console.error('Error generating security recommendations:', error);
      return this.getFallbackSecurityRecommendations(userData);
    }
  }

  // Call OpenAI API
  async callOpenAI(prompt, cacheKey = null) {
    // Check cache first
    if (cacheKey && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTTL) {
        return cached.response;
      }
    }

    if (!this.apiKey || this.apiKey === 'test-openai-api-key') {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are an AI assistant for OnboardIQ, a comprehensive customer onboarding platform. Provide helpful, professional, and accurate responses.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: this.maxTokens,
          temperature: this.temperature,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const result = response.data.choices[0].message.content;

      // Cache the result
      if (cacheKey) {
        this.cache.set(cacheKey, {
          response: result,
          timestamp: Date.now()
        });
      }

      return result;
    } catch (error) {
      console.error('OpenAI API call failed:', error.response?.data || error.message);
      throw error;
    }
  }

  // Parse responses
  parseRecommendationsResponse(response) {
    try {
      const recommendations = JSON.parse(response);
      return recommendations.map(rec => ({
        id: rec.id || crypto.randomUUID(),
        title: rec.title,
        description: rec.description,
        priority: rec.priority || 'medium',
        estimatedTime: rec.estimatedTime || 15,
        actionUrl: rec.actionUrl || '/onboarding',
        type: rec.type || 'general',
        confidence: rec.confidence || 0.8,
        completed: false
      }));
    } catch (error) {
      console.error('Error parsing recommendations response:', error);
      return this.getFallbackRecommendations({});
    }
  }

  parseBehaviorAnalysisResponse(response) {
    try {
      const analysis = JSON.parse(response);
      return {
        userType: analysis.userType || 'new',
        learningStyle: analysis.learningStyle || 'visual',
        pace: analysis.pace || 'moderate',
        complexity: analysis.complexity || 'basic',
        confidence: analysis.confidence || 0.7,
        featurePreferences: analysis.featurePreferences || [],
        engagementScore: analysis.engagementScore || 0.5,
        recommendations: analysis.recommendations || [],
        riskFactors: analysis.riskFactors || []
      };
    } catch (error) {
      console.error('Error parsing behavior analysis response:', error);
      return this.getFallbackBehaviorAnalysis([], {});
    }
  }

  parseSentimentResponse(response) {
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('Error parsing sentiment response:', error);
      return this.getFallbackSentimentAnalysis('');
    }
  }

  parseLearningPathResponse(response) {
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('Error parsing learning path response:', error);
      return this.getFallbackLearningPath({}, []);
    }
  }

  parseSecurityRecommendationsResponse(response) {
    try {
      const recommendations = JSON.parse(response);
      return recommendations.map(rec => ({
        id: rec.id || crypto.randomUUID(),
        title: rec.title,
        description: rec.description,
        riskLevel: rec.riskLevel || 'medium',
        implementationSteps: rec.implementationSteps || [],
        estimatedTime: rec.estimatedTime || 30,
        priority: rec.priority || 'medium'
      }));
    } catch (error) {
      console.error('Error parsing security recommendations response:', error);
      return this.getFallbackSecurityRecommendations({});
    }
  }

  // Fallback methods
  getFallbackRecommendations(behaviorAnalysis) {
    return [
      {
        id: crypto.randomUUID(),
        title: 'Complete Security Setup',
        description: 'Set up two-factor authentication and security preferences',
        priority: 'high',
        estimatedTime: 10,
        actionUrl: '/onboarding/security-setup',
        type: 'security',
        confidence: 0.9,
        completed: false
      },
      {
        id: crypto.randomUUID(),
        title: 'Product Tour',
        description: 'Take a guided tour of key features',
        priority: 'medium',
        estimatedTime: 15,
        actionUrl: '/onboarding/product-tour',
        type: 'learning',
        confidence: 0.8,
        completed: false
      }
    ];
  }

  getFallbackBehaviorAnalysis(interactions, featureUsage) {
    return {
      userType: 'new',
      learningStyle: 'visual',
      pace: 'moderate',
      complexity: 'basic',
      confidence: 0.6,
      featurePreferences: ['dashboard', 'documents'],
      engagementScore: 0.4,
      recommendations: ['Complete onboarding', 'Explore features'],
      riskFactors: []
    };
  }

  getFallbackResponse(message, context) {
    return "I'm here to help you with OnboardIQ! How can I assist you today?";
  }

  getFallbackDocumentContent(documentType, userData) {
    return `# ${documentType} Template\n\nThis is a template for ${documentType}. Please customize it according to your needs.`;
  }

  getFallbackSentimentAnalysis(text) {
    return {
      sentiment: 'neutral',
      sentimentScore: 0.5,
      intent: 'question',
      urgency: 'low',
      topics: ['general'],
      emotions: ['neutral'],
      confidence: 0.5,
      suggestedActions: ['general_help']
    };
  }

  getFallbackLearningPath(userProfile, goals) {
    return {
      milestones: ['Complete onboarding', 'Explore features', 'Set up integrations'],
      estimatedDuration: '2-3 weeks',
      resources: ['Documentation', 'Video tutorials', 'Support team'],
      successMetrics: ['Feature adoption', 'User engagement', 'Task completion'],
      adaptiveRecommendations: ['Personalized content', 'Progress tracking']
    };
  }

  getFallbackSecurityRecommendations(userData) {
    return [
      {
        id: crypto.randomUUID(),
        title: 'Enable Two-Factor Authentication',
        description: 'Add an extra layer of security to your account',
        riskLevel: 'high',
        implementationSteps: ['Go to settings', 'Enable 2FA', 'Scan QR code'],
        estimatedTime: 5,
        priority: 'high'
      }
    ];
  }

  // Utility methods
  clearCache() {
    this.cache.clear();
  }

  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  isConfigured() {
    return this.apiKey && this.apiKey !== 'test-openai-api-key';
  }
}

module.exports = OpenAIService;
