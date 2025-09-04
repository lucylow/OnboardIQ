import api from './api';

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: number;
  actionUrl: string;
  type: string;
  confidence: number;
  completed: boolean;
}

export interface BehaviorAnalysis {
  userType: 'new' | 'active' | 'power';
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  pace: 'fast' | 'moderate' | 'slow';
  complexity: 'basic' | 'intermediate' | 'advanced';
  confidence: number;
  featurePreferences: string[];
  engagementScore: number;
  recommendations: string[];
  riskFactors: string[];
}

export interface SentimentAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  sentimentScore: number;
  intent: 'question' | 'complaint' | 'request' | 'feedback' | 'greeting';
  urgency: 'low' | 'medium' | 'high';
  topics: string[];
  emotions: string[];
  confidence: number;
  suggestedActions: string[];
}

export interface LearningPath {
  milestones: string[];
  estimatedDuration: string;
  resources: string[];
  successMetrics: string[];
  adaptiveRecommendations: string[];
}

export interface SecurityRecommendation {
  id: string;
  title: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  implementationSteps: string[];
  estimatedTime: number;
  priority: 'low' | 'medium' | 'high';
}

export interface AIHealthStatus {
  openai: boolean;
  adaptive: boolean;
  conversational: boolean;
  timestamp: string;
}

export interface AIAgent {
  id: string;
  name: string;
  type: 'intake' | 'personalization' | 'execution' | 'monitoring';
  status: 'active' | 'inactive' | 'training';
  accuracy: number;
  decisions: number;
  trainedDate: string;
  performance: {
    last24h: number;
    last7d: number;
    last30d: number;
    improvement: number;
  };
  capabilities: string[];
  currentTask?: string;
  confidence: number;
}

export interface AgentAction {
  agentId: string;
  action: string;
  timestamp: string;
  parameters?: any;
}

export interface AgentPerformance {
  agentId: string;
  metrics: {
    accuracy: number;
    decisions: number;
    responseTime: number;
    errorRate: number;
  };
  period: '24h' | '7d' | '30d';
  timestamp: string;
}

export interface CacheStats {
  size: number;
  keys: string[];
}

class AIService {
  private baseUrl = '/api/ai';

  // Test OpenAI connection
  async testConnection() {
    try {
      const response = await api.get(`${this.baseUrl}/test`);
      return response.data;
    } catch (error) {
      console.error('AI connection test failed:', error);
      return {
        success: false,
        configured: false,
        error: error.message
      };
    }
  }

  // Generate personalized onboarding recommendations
  async generateRecommendations(userData: any, behaviorAnalysis: any): Promise<AIRecommendation[]> {
    try {
      const response = await api.post(`${this.baseUrl}/recommendations`, {
        userData,
        behaviorAnalysis
      });
      return response.data.recommendations;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return this.getFallbackRecommendations();
    }
  }

  // Analyze user behavior patterns
  async analyzeUserBehavior(interactions: any[], featureUsage: any): Promise<BehaviorAnalysis> {
    try {
      const response = await api.post(`${this.baseUrl}/behavior-analysis`, {
        interactions,
        featureUsage
      });
      return response.data.analysis;
    } catch (error) {
      console.error('Error analyzing user behavior:', error);
      return this.getFallbackBehaviorAnalysis();
    }
  }

  // Generate conversational response
  async generateChatResponse(message: string, context: any, userProfile: any): Promise<string> {
    try {
      const response = await api.post(`${this.baseUrl}/chat`, {
        message,
        context,
        userProfile
      });
      return response.data.response;
    } catch (error) {
      console.error('Error generating chat response:', error);
      return this.getFallbackResponse();
    }
  }

  // Analyze sentiment and intent
  async analyzeSentiment(text: string, context: any = {}): Promise<SentimentAnalysis> {
    try {
      const response = await api.post(`${this.baseUrl}/sentiment`, {
        text,
        context
      });
      return response.data.analysis;
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      return this.getFallbackSentimentAnalysis();
    }
  }

  // Generate document content
  async generateDocumentContent(documentType: string, userData: any, requirements: string): Promise<string> {
    try {
      const response = await api.post(`${this.baseUrl}/document`, {
        documentType,
        userData,
        requirements
      });
      return response.data.content;
    } catch (error) {
      console.error('Error generating document content:', error);
      return this.getFallbackDocumentContent(documentType);
    }
  }

  // Generate learning path
  async generateLearningPath(userProfile: any, goals: string[], currentProgress: any): Promise<LearningPath> {
    try {
      const response = await api.post(`${this.baseUrl}/learning-path`, {
        userProfile,
        goals,
        currentProgress
      });
      return response.data.learningPath;
    } catch (error) {
      console.error('Error generating learning path:', error);
      return this.getFallbackLearningPath();
    }
  }

  // Generate security recommendations
  async generateSecurityRecommendations(userData: any, riskAssessment: any): Promise<SecurityRecommendation[]> {
    try {
      const response = await api.post(`${this.baseUrl}/security-recommendations`, {
        userData,
        riskAssessment
      });
      return response.data.recommendations;
    } catch (error) {
      console.error('Error generating security recommendations:', error);
      return this.getFallbackSecurityRecommendations();
    }
  }

  // Adaptive onboarding endpoints
  async analyzeAdaptiveBehavior(userId: string, userData: any): Promise<BehaviorAnalysis> {
    try {
      const response = await api.post(`${this.baseUrl}/adaptive/behavior`, {
        userId,
        userData
      });
      return response.data.analysis;
    } catch (error) {
      console.error('Error in adaptive behavior analysis:', error);
      return this.getFallbackBehaviorAnalysis();
    }
  }

  // AI Agent Management
  async getAgents(): Promise<AIAgent[]> {
    try {
      const response = await api.get(`${this.baseUrl}/ai-agents`);
      return response.data.agents;
    } catch (error) {
      console.error('Error fetching AI agents:', error);
      return this.getFallbackAgents();
    }
  }

  async getAgentById(agentId: string): Promise<AIAgent> {
    try {
      const response = await api.get(`${this.baseUrl}/ai-agents/${agentId}`);
      return response.data.agent;
    } catch (error) {
      console.error('Error fetching agent:', error);
      throw new Error(`Agent ${agentId} not found`);
    }
  }

  async performAgentAction(agentId: string, action: string, parameters?: any): Promise<any> {
    try {
      const response = await api.post(`${this.baseUrl}/ai-agents/${agentId}/${action}`, {
        agentId,
        action,
        parameters,
        timestamp: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Error performing agent action:', error);
      throw new Error(`Failed to perform ${action} on agent ${agentId}`);
    }
  }

  async getAgentPerformance(agentId: string, period: '24h' | '7d' | '30d' = '7d'): Promise<AgentPerformance> {
    try {
      const response = await api.get(`${this.baseUrl}/ai-agents/${agentId}/performance`, {
        params: { period }
      });
      return response.data.performance;
    } catch (error) {
      console.error('Error fetching agent performance:', error);
      return this.getFallbackAgentPerformance(agentId, period);
    }
  }

  async retrainAgent(agentId: string, trainingData?: any): Promise<any> {
    try {
      const response = await api.post(`${this.baseUrl}/ai-agents/${agentId}/retrain`, {
        agentId,
        trainingData,
        timestamp: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Error retraining agent:', error);
      throw new Error(`Failed to retrain agent ${agentId}`);
    }
  }

  async updateAgentStatus(agentId: string, status: 'active' | 'inactive' | 'training'): Promise<AIAgent> {
    try {
      const response = await api.put(`${this.baseUrl}/ai-agents/${agentId}/status`, {
        agentId,
        status,
        timestamp: new Date().toISOString()
      });
      return response.data.agent;
    } catch (error) {
      console.error('Error updating agent status:', error);
      throw new Error(`Failed to update status for agent ${agentId}`);
    }
  }

  async generateAdaptiveRecommendations(userId: string, behaviorAnalysis: any): Promise<AIRecommendation[]> {
    try {
      const response = await api.post(`${this.baseUrl}/adaptive/recommendations`, {
        userId,
        behaviorAnalysis
      });
      return response.data.recommendations;
    } catch (error) {
      console.error('Error in adaptive recommendations:', error);
      return this.getFallbackRecommendations();
    }
  }

  // Conversational AI endpoints
  async processConversationalMessage(message: string, userId: string, channel: string = 'chat') {
    try {
      const response = await api.post(`${this.baseUrl}/conversational/process`, {
        message,
        userId,
        channel
      });
      return response.data.response;
    } catch (error) {
      console.error('Error in conversational processing:', error);
      return {
        message: this.getFallbackResponse(),
        sentiment: 'neutral',
        escalationTriggered: false,
        suggestedActions: ['contact_support']
      };
    }
  }

  async handleMultiChannelMessage(channel: string, message: string, sender: string) {
    try {
      const response = await api.post(`${this.baseUrl}/conversational/multi-channel`, {
        channel,
        message,
        sender
      });
      return response.data.response;
    } catch (error) {
      console.error('Error in multi-channel processing:', error);
      return {
        status: 'failed',
        channel,
        error: error.message
      };
    }
  }

  async getConversationAnalytics() {
    try {
      const response = await api.get(`${this.baseUrl}/conversational/analytics`);
      return response.data.analytics;
    } catch (error) {
      console.error('Error getting conversation analytics:', error);
      return {
        totalConversations: 0,
        averageSentiment: 0,
        escalationRate: 0,
        channelDistribution: {},
        commonIssues: []
      };
    }
  }

  // Cache management
  async clearCache(): Promise<boolean> {
    try {
      await api.delete(`${this.baseUrl}/cache`);
      return true;
    } catch (error) {
      console.error('Error clearing cache:', error);
      return false;
    }
  }

  async getCacheStats(): Promise<CacheStats> {
    try {
      const response = await api.get(`${this.baseUrl}/cache/stats`);
      return response.data.stats;
    } catch (error) {
      console.error('Error getting cache stats:', error);
      return {
        size: 0,
        keys: []
      };
    }
  }

  // Health check
  async getHealthStatus(): Promise<AIHealthStatus> {
    try {
      const response = await api.get(`${this.baseUrl}/health`);
      return response.data.health;
    } catch (error) {
      console.error('Error getting health status:', error);
      return {
        openai: false,
        adaptive: false,
        conversational: false,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Fallback methods
  private getFallbackRecommendations(): AIRecommendation[] {
    return [
      {
        id: 'fallback-1',
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
        id: 'fallback-2',
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

  private getFallbackBehaviorAnalysis(): BehaviorAnalysis {
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

  private getFallbackResponse(): string {
    return "I'm here to help you with OnboardIQ! How can I assist you today?";
  }

  private getFallbackSentimentAnalysis(): SentimentAnalysis {
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

  private getFallbackDocumentContent(documentType: string): string {
    return `# ${documentType} Template\n\nThis is a template for ${documentType}. Please customize it according to your needs.`;
  }

  private getFallbackLearningPath(): LearningPath {
    return {
      milestones: ['Complete onboarding', 'Explore features', 'Set up integrations'],
      estimatedDuration: '2-3 weeks',
      resources: ['Documentation', 'Video tutorials', 'Support team'],
      successMetrics: ['Feature adoption', 'User engagement', 'Task completion'],
      adaptiveRecommendations: ['Personalized content', 'Progress tracking']
    };
  }

  private getFallbackSecurityRecommendations(): SecurityRecommendation[] {
    return [
      {
        id: 'fallback-security-1',
        title: 'Enable Two-Factor Authentication',
        description: 'Add an extra layer of security to your account',
        riskLevel: 'high',
        implementationSteps: ['Go to settings', 'Enable 2FA', 'Scan QR code'],
        estimatedTime: 5,
        priority: 'high'
      }
    ];
  }

  private getFallbackAgents(): AIAgent[] {
    return [
      {
        id: 'intake-agent',
        name: 'Intake Agent',
        type: 'intake',
        status: 'active',
        accuracy: 98.5,
        decisions: 1247,
        trainedDate: '1/15/2024',
        performance: {
          last24h: 45,
          last7d: 312,
          last30d: 1247,
          improvement: 2.3
        },
        capabilities: ['Document Processing', 'Data Extraction', 'Form Recognition', 'Quality Validation'],
        currentTask: 'Processing onboarding documents',
        confidence: 0.985
      },
      {
        id: 'personalization-agent',
        name: 'Personalization Agent',
        type: 'personalization',
        status: 'active',
        accuracy: 96.2,
        decisions: 892,
        trainedDate: '1/14/2024',
        performance: {
          last24h: 32,
          last7d: 224,
          last30d: 892,
          improvement: 1.8
        },
        capabilities: ['User Profiling', 'Content Adaptation', 'Learning Path Optimization', 'Preference Learning'],
        currentTask: 'Optimizing user experience',
        confidence: 0.962
      },
      {
        id: 'execution-agent',
        name: 'Execution Agent',
        type: 'execution',
        status: 'active',
        accuracy: 99.1,
        decisions: 567,
        trainedDate: '1/13/2024',
        performance: {
          last24h: 18,
          last7d: 142,
          last30d: 567,
          improvement: 3.1
        },
        capabilities: ['Workflow Automation', 'Task Execution', 'Process Orchestration', 'Error Handling'],
        currentTask: 'Executing onboarding workflows',
        confidence: 0.991
      },
      {
        id: 'monitoring-agent',
        name: 'Monitoring Agent',
        type: 'monitoring',
        status: 'active',
        accuracy: 97.8,
        decisions: 2341,
        trainedDate: '1/16/2024',
        performance: {
          last24h: 78,
          last7d: 586,
          last30d: 2341,
          improvement: 1.5
        },
        capabilities: ['Performance Tracking', 'Anomaly Detection', 'Alert Management', 'Analytics Reporting'],
        currentTask: 'Monitoring system performance',
        confidence: 0.978
      }
    ];
  }

  private getFallbackAgentPerformance(agentId: string, period: '24h' | '7d' | '30d'): AgentPerformance {
    return {
      agentId,
      metrics: {
        accuracy: 95.0,
        decisions: 100,
        responseTime: 250,
        errorRate: 2.5
      },
      period,
      timestamp: new Date().toISOString()
    };
  }

  // Utility methods
  isConfigured(): boolean {
    // This would check if the AI service is properly configured
    return true; // For now, assume it's configured
  }

  async initialize(): Promise<boolean> {
    try {
      const health = await this.getHealthStatus();
      return health.openai || health.adaptive || health.conversational;
    } catch (error) {
      console.error('AI service initialization failed:', error);
      return false;
    }
  }
}

export const aiService = new AIService();
