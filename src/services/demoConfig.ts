// Demo Configuration for OnboardIQ Mock Data
// Shows how to configure and use mock data for different scenarios

import { apiFallbackService, enableMockMode, disableMockMode } from './apiFallbackService';
import { mockDemoDataService } from './mockDemoData';

export interface DemoScenario {
  id: string;
  name: string;
  description: string;
  steps: string[];
  estimatedDuration: string;
  successRate: string;
  userProfile: any;
  apiConfig: {
    vonage: boolean;
    foxit: boolean;
    muleSoft: boolean;
  };
}

export interface DemoConfig {
  enableMockMode: boolean;
  showMockIndicators: boolean;
  simulateFailures: boolean;
  failureRate: number;
  demoScenarios: DemoScenario[];
  apiKeys: {
    vonage: {
      apiKey: string;
      apiSecret: string;
      verifyApiKey: string;
    };
    foxit: {
      apiKey: string;
      baseUrl: string;
    };
    muleSoft: {
      clientId: string;
      clientSecret: string;
      baseUrl: string;
    };
  };
}

// Default demo configuration
export const defaultDemoConfig: DemoConfig = {
  enableMockMode: true,
  showMockIndicators: true,
  simulateFailures: false,
  failureRate: 0.1, // 10% failure rate
  demoScenarios: [
    {
      id: 'high_value_enterprise',
      name: 'High-Value Enterprise Customer',
      description: 'Complete onboarding with video session and personalized documents',
      steps: [
        'Phone Verification (Vonage Verify API)',
        'AI Profiling (MuleSoft Workflow)',
        'Video Onboarding (Vonage Video API)',
        'Document Generation (Foxit API)',
        'Follow-up Communication (Vonage SMS API)'
      ],
      estimatedDuration: '15 minutes',
      successRate: '95%',
      userProfile: {
        name: 'Michael Chen',
        email: 'm.chen@globalfinance.com',
        company: 'Global Finance Corp.',
        plan: 'enterprise',
        industry: 'Finance',
        companySize: '201+',
        churnRisk: 'medium',
        successProbability: 0.78
      },
      apiConfig: {
        vonage: true,
        foxit: true,
        muleSoft: true
      }
    },
    {
      id: 'medium_risk_customer',
      name: 'Medium-Risk Customer',
      description: 'Standard onboarding with enhanced monitoring',
      steps: [
        'Phone Verification (Vonage Verify API)',
        'AI Profiling (MuleSoft Workflow)',
        'Document Generation (Foxit API)',
        'SMS Follow-up (Vonage SMS API)'
      ],
      estimatedDuration: '8 minutes',
      successRate: '88%',
      userProfile: {
        name: 'David Thompson',
        email: 'd.thompson@retailchain.com',
        company: 'Retail Chain Corp.',
        plan: 'free',
        industry: 'Retail',
        companySize: '51-200',
        churnRisk: 'high',
        successProbability: 0.45
      },
      apiConfig: {
        vonage: true,
        foxit: true,
        muleSoft: false
      }
    },
    {
      id: 'quick_setup_customer',
      name: 'Quick Setup Customer',
      description: 'Fast-track onboarding for immediate value',
      steps: [
        'Phone Verification (Vonage Verify API)',
        'Document Generation (Foxit API)',
        'Email Welcome'
      ],
      estimatedDuration: '5 minutes',
      successRate: '92%',
      userProfile: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@techstartup.com',
        company: 'TechStartup Inc.',
        plan: 'premium',
        industry: 'Technology',
        companySize: '11-50',
        churnRisk: 'low',
        successProbability: 0.92
      },
      apiConfig: {
        vonage: true,
        foxit: true,
        muleSoft: false
      }
    }
  ],
  apiKeys: {
    vonage: {
      apiKey: 'F7CrPwZ9nXpPHFJt', // Demo API key from user's request
      apiSecret: 'demo_vonage_secret',
      verifyApiKey: 'F7CrPwZ9nXpPHFJt'
    },
    foxit: {
      apiKey: 'demo_foxit_api_key',
      baseUrl: 'https://api.foxit.com'
    },
    muleSoft: {
      clientId: 'demo_mulesoft_client_id',
      clientSecret: 'demo_mulesoft_client_secret',
      baseUrl: 'https://api.mulesoft.com'
    }
  }
};

// Demo configuration manager
export class DemoConfigManager {
  private static instance: DemoConfigManager;
  private config: DemoConfig;

  constructor(config?: Partial<DemoConfig>) {
    this.config = { ...defaultDemoConfig, ...config };
  }

  static getInstance(config?: Partial<DemoConfig>): DemoConfigManager {
    if (!DemoConfigManager.instance) {
      DemoConfigManager.instance = new DemoConfigManager(config);
    }
    return DemoConfigManager.instance;
  }

  // Get current configuration
  getConfig(): DemoConfig {
    return this.config;
  }

  // Update configuration
  updateConfig(updates: Partial<DemoConfig>): void {
    this.config = { ...this.config, ...updates };
    
    // Apply mock mode setting
    if (updates.enableMockMode !== undefined) {
      if (updates.enableMockMode) {
        enableMockMode();
      } else {
        disableMockMode();
      }
    }
  }

  // Get demo scenario by ID
  getDemoScenario(scenarioId: string): DemoScenario | undefined {
    return this.config.demoScenarios.find(scenario => scenario.id === scenarioId);
  }

  // Get all demo scenarios
  getAllDemoScenarios(): DemoScenario[] {
    return this.config.demoScenarios;
  }

  // Get API configuration for a scenario
  getScenarioAPIConfig(scenarioId: string): any {
    const scenario = this.getDemoScenario(scenarioId);
    if (!scenario) return null;

    return {
      vonage: scenario.apiConfig.vonage ? this.config.apiKeys.vonage : null,
      foxit: scenario.apiConfig.foxit ? this.config.apiKeys.foxit : null,
      muleSoft: scenario.apiConfig.muleSoft ? this.config.apiKeys.muleSoft : null
    };
  }

  // Check if API is enabled for scenario
  isAPIEnabledForScenario(scenarioId: string, apiName: 'vonage' | 'foxit' | 'muleSoft'): boolean {
    const scenario = this.getDemoScenario(scenarioId);
    return scenario?.apiConfig[apiName] ?? false;
  }

  // Get mock data for scenario
  getMockDataForScenario(scenarioId: string): any {
    const scenario = this.getDemoScenario(scenarioId);
    if (!scenario) return null;

    return {
      user: scenario.userProfile,
      documents: mockDemoDataService.getDemoDocuments(),
      workflows: mockDemoDataService.getDemoWorkflows(),
      scenarios: mockDemoDataService.getDemoScenarios(),
      errorScenarios: mockDemoDataService.getErrorScenarios()
    };
  }

  // Simulate API failure for testing
  simulateAPIFailure(apiName: 'vonage' | 'foxit' | 'muleSoft', failureType: 'network' | 'timeout' | 'rateLimit'): void {
    console.log(`Simulating ${failureType} failure for ${apiName} API`);
    
    // This would trigger the fallback mechanism
    apiFallbackService.simulateErrorWithFallback(failureType);
  }

  // Get demo statistics
  getDemoStats(): any {
    return {
      totalScenarios: this.config.demoScenarios.length,
      mockModeEnabled: this.config.enableMockMode,
      failureRate: this.config.simulateFailures ? this.config.failureRate : 0,
      apiConfigurations: {
        vonage: this.config.apiKeys.vonage.apiKey ? 'configured' : 'mock',
        foxit: this.config.apiKeys.foxit.apiKey ? 'configured' : 'mock',
        muleSoft: this.config.apiKeys.muleSoft.clientId ? 'configured' : 'mock'
      }
    };
  }

  // Reset to default configuration
  resetToDefault(): void {
    this.config = { ...defaultDemoConfig };
    enableMockMode();
  }

  // Export configuration for sharing
  exportConfig(): string {
    return JSON.stringify(this.config, null, 2);
  }

  // Import configuration
  importConfig(configJson: string): void {
    try {
      const importedConfig = JSON.parse(configJson);
      this.updateConfig(importedConfig);
    } catch (error) {
      console.error('Failed to import configuration:', error);
    }
  }
}

// Export singleton instance
export const demoConfigManager = DemoConfigManager.getInstance();

// Export convenience functions
export const getDemoConfig = () => demoConfigManager.getConfig();
export const updateDemoConfig = (updates: Partial<DemoConfig>) => demoConfigManager.updateConfig(updates);
export const getDemoScenario = (scenarioId: string) => demoConfigManager.getDemoScenario(scenarioId);
export const getAllDemoScenarios = () => demoConfigManager.getAllDemoScenarios();
export const getScenarioAPIConfig = (scenarioId: string) => demoConfigManager.getScenarioAPIConfig(scenarioId);
export const isAPIEnabledForScenario = (scenarioId: string, apiName: 'vonage' | 'foxit' | 'muleSoft') => 
  demoConfigManager.isAPIEnabledForScenario(scenarioId, apiName);
export const getMockDataForScenario = (scenarioId: string) => demoConfigManager.getMockDataForScenario(scenarioId);
export const getDemoStats = () => demoConfigManager.getDemoStats();
export const resetDemoConfig = () => demoConfigManager.resetToDefault();

// Demo setup helpers
export const setupDemoEnvironment = (scenarioId: string) => {
  const scenario = getDemoScenario(scenarioId);
  if (!scenario) {
    throw new Error(`Demo scenario ${scenarioId} not found`);
  }

  // Enable mock mode for demo
  enableMockMode();
  
  // Update configuration for the scenario
  updateDemoConfig({
    enableMockMode: true,
    showMockIndicators: true,
    simulateFailures: false
  });

  console.log(`Demo environment setup for scenario: ${scenario.name}`);
  return scenario;
};

export const setupFailureSimulation = (failureRate: number = 0.2) => {
  updateDemoConfig({
    simulateFailures: true,
    failureRate: failureRate
  });
  
  console.log(`Failure simulation enabled with ${failureRate * 100}% failure rate`);
};

// Demo data generators
export const generateDemoUser = (scenarioId: string) => {
  const scenario = getDemoScenario(scenarioId);
  if (!scenario) return null;

  return {
    ...scenario.userProfile,
    id: `demo_user_${Date.now()}`,
    signupDate: new Date(),
    lastLogin: new Date(),
    status: 'active'
  };
};

export const generateDemoWorkflow = (scenarioId: string, userId: string) => {
  const scenario = getDemoScenario(scenarioId);
  if (!scenario) return null;

  return {
    id: `workflow_${Date.now()}`,
    userId: userId,
    status: 'running' as const,
    progress: 0,
    currentStep: scenario.steps[0],
    steps: scenario.steps.map((step, index) => ({
      id: `step_${index}`,
      name: step,
      status: index === 0 ? 'running' as const : 'pending' as const,
      completedAt: undefined
    })),
    startDate: new Date(),
    estimatedCompletion: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
  };
};
