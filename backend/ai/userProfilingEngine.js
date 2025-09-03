// User Profiling Engine - AI-driven user segmentation and workflow orchestration
const axios = require('axios');

class UserProfilingEngine {
  constructor() {
    this._isReady = false;
    this.segmentDescriptions = {
      0: "free_tier_individual",
      1: "premium_small_business", 
      2: "enterprise_corporate",
      3: "high_potential_lead"
    };
    this.workflowTemplates = this.loadWorkflowTemplates();
    this.initialize();
  }

  async initialize() {
    try {
      // Load any pre-trained models or configurations
      await this.loadModels();
      this._isReady = true;
      console.log('✅ User Profiling Engine initialized');
    } catch (error) {
      console.error('❌ User Profiling Engine initialization failed:', error);
      this._isReady = false;
    }
  }

  async loadModels() {
    // In production, this would load trained ML models
    // For now, we'll use rule-based classification
    console.log('📊 Loading user profiling models...');
  }

  loadWorkflowTemplates() {
    return {
      "free_tier_individual": {
        steps: ["welcome_email", "product_tour", "resource_emails"],
        channels: ["email"],
        priority: "standard",
        estimatedDuration: 7
      },
      "premium_small_business": {
        steps: ["personalized_video", "technical_setup", "success_checkin"],
        channels: ["video", "sms", "email"],
        priority: "high",
        estimatedDuration: 5
      },
      "enterprise_corporate": {
        steps: ["account_manager_intro", "custom_demo", "technical_planning", "executive_review"],
        channels: ["video", "phone", "in_person", "email"],
        priority: "critical",
        estimatedDuration: 3
      },
      "high_potential_lead": {
        steps: ["personal_outreach", "custom_demo", "premium_trial"],
        channels: ["video", "sms", "email"],
        priority: "high",
        estimatedDuration: 4
      }
    };
  }

  extractFeatures(userData) {
    const features = {};
    
    // Company size feature (normalized)
    const companySizeMap = {
      "1-10": 0.1, 
      "11-50": 0.3, 
      "51-200": 0.6, 
      "201+": 1.0
    };
    features.companySize = companySizeMap[userData.companySize] || 0.1;
    
    // Plan tier feature
    const planTierMap = {
      "free": 0.1, 
      "premium": 0.7, 
      "enterprise": 1.0
    };
    features.planTier = planTierMap[userData.planTier] || 0.1;
    
    // Industry weighting (technology gets higher score)
    const industry = (userData.industry || "").toLowerCase();
    const techIndustries = ["tech", "software", "saas", "ai", "fintech"];
    features.industryScore = techIndustries.some(tech => industry.includes(tech)) ? 0.8 : 0.3;
    
    // Role-based feature
    const role = (userData.role || "").toLowerCase();
    const decisionMakerKeywords = ["manager", "director", "vp", "cto", "ceo"];
    features.decisionMaker = decisionMakerKeywords.some(keyword => role.includes(keyword)) ? 1.0 : 0.3;
    
    // Additional features
    features.hasPhone = userData.phoneNumber ? 1.0 : 0.0;
    features.hasCompany = userData.companyName ? 1.0 : 0.0;
    features.signupChannel = this.hashString(userData.signupChannel || "direct") % 100;
    
    return features;
  }

  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  classifyUser(userData) {
    const features = this.extractFeatures(userData);
    
    // Rule-based classification (can be replaced with ML model)
    if (features.planTier === 1.0) {
      return "enterprise_corporate";
    } else if (features.planTier === 0.7) {
      return "premium_small_business";
    } else if (features.companySize >= 0.6 || features.industryScore >= 0.8) {
      return "high_potential_lead";
    } else {
      return "free_tier_individual";
    }
  }

  createPersonalizedWorkflow(userData) {
    const segment = this.classifyUser(userData);
    const workflow = this.workflowTemplates[segment] || this.workflowTemplates["free_tier_individual"];
    
    // Add personalization
    const personalizedWorkflow = {
      ...workflow,
      segment: segment,
      userData: {
        name: userData.firstName || userData.name || "there",
        companyName: userData.companyName || "",
        email: userData.email,
        phoneNumber: userData.phoneNumber
      },
      timeline: this.generateTimeline(workflow.priority),
      personalization: {
        greeting: this.generatePersonalizedGreeting(userData),
        customSteps: this.generateCustomSteps(userData, segment)
      }
    };
    
    return personalizedWorkflow;
  }

  generateTimeline(priority) {
    const timelines = {
      "critical": [1, 4, 24, 72], // hours
      "high": [2, 24, 72], // hours
      "standard": [4, 48, 120] // hours
    };
    return timelines[priority] || timelines.standard;
  }

  generatePersonalizedGreeting(userData) {
    const name = userData.firstName || userData.name || "there";
    const company = userData.companyName || "";
    
    if (company) {
      return `Hi ${name} from ${company}!`;
    } else {
      return `Hi ${name}!`;
    }
  }

  generateCustomSteps(userData, segment) {
    const customSteps = [];
    
    // Add industry-specific steps
    if (userData.industry) {
      const industry = userData.industry.toLowerCase();
      if (industry.includes("fintech")) {
        customSteps.push({
          type: "compliance_check",
          name: "Financial Compliance Setup",
          description: "Configure regulatory compliance settings"
        });
      } else if (industry.includes("healthcare")) {
        customSteps.push({
          type: "hipaa_setup",
          name: "HIPAA Compliance",
          description: "Set up healthcare data protection"
        });
      }
    }
    
    // Add role-specific steps
    if (userData.role) {
      const role = userData.role.toLowerCase();
      if (role.includes("admin") || role.includes("manager")) {
        customSteps.push({
          type: "team_setup",
          name: "Team Management Setup",
          description: "Configure team permissions and roles"
        });
      }
    }
    
    return customSteps;
  }

  async predictOnboardingSuccess(userData, engagementData = {}) {
    const features = this.extractFeatures(userData);
    
    // Simple success prediction based on features
    let successProbability = 0.5; // Base probability
    
    // Adjust based on plan tier
    successProbability += features.planTier * 0.2;
    
    // Adjust based on company size
    successProbability += features.companySize * 0.15;
    
    // Adjust based on industry
    successProbability += features.industryScore * 0.1;
    
    // Adjust based on decision maker status
    successProbability += features.decisionMaker * 0.15;
    
    // Cap at 1.0
    successProbability = Math.min(successProbability, 1.0);
    
    return {
      successProbability: successProbability,
      confidence: 0.8,
      factors: this.identifySuccessFactors(features),
      recommendations: this.generateRecommendations(features)
    };
  }

  identifySuccessFactors(features) {
    const factors = [];
    
    if (features.planTier > 0.5) {
      factors.push("premium_plan");
    }
    if (features.companySize > 0.5) {
      factors.push("larger_company");
    }
    if (features.industryScore > 0.5) {
      factors.push("tech_industry");
    }
    if (features.decisionMaker > 0.5) {
      factors.push("decision_maker");
    }
    
    return factors;
  }

  generateRecommendations(features) {
    const recommendations = [];
    
    if (features.planTier < 0.5) {
      recommendations.push("Consider upgrading to premium plan for enhanced features");
    }
    if (features.companySize < 0.3) {
      recommendations.push("Focus on individual user onboarding experience");
    }
    if (features.industryScore < 0.5) {
      recommendations.push("Provide industry-specific use cases and examples");
    }
    
    return recommendations;
  }

  isReady() {
    return this._isReady;
  }

  // Method to update user profile with new data
  async updateUserProfile(userId, newData) {
    try {
      // In production, this would update the user's profile in the database
      // and potentially retrain models with new data
      console.log(`📝 Updating profile for user ${userId}`);
      
      // Reclassify user with new data
      const updatedSegment = this.classifyUser(newData);
      const updatedWorkflow = this.createPersonalizedWorkflow(newData);
      
      return {
        userId: userId,
        updatedSegment: updatedSegment,
        updatedWorkflow: updatedWorkflow,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Method to get analytics on user segments
  getSegmentAnalytics() {
    return {
      segments: Object.keys(this.workflowTemplates),
      totalUsers: 0, // Would be fetched from database
      segmentDistribution: {
        "free_tier_individual": 0,
        "premium_small_business": 0,
        "enterprise_corporate": 0,
        "high_potential_lead": 0
      },
      averageOnboardingTime: {
        "free_tier_individual": 7,
        "premium_small_business": 5,
        "enterprise_corporate": 3,
        "high_potential_lead": 4
      }
    };
  }
}

module.exports = UserProfilingEngine;
