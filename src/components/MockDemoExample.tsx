// Mock Demo Example Component
// Demonstrates how to use the mock demo data system in React components

import React, { useState, useEffect } from 'react';
import { 
  enableMockMode, 
  vonageVerifyWithFallback, 
  vonageVerifyCodeWithFallback,
  foxitGenerateDocumentWithFallback,
  muleSoftExecuteWorkflowWithFallback,
  apiFallbackService
} from '../services/apiFallbackService';
import { 
  setupDemoEnvironment, 
  getDemoScenario, 
  getAllDemoScenarios 
} from '../services/demoConfig';
import { mockDemoDataService } from '../services/mockDemoData';

interface DemoState {
  currentScenario: string;
  phoneNumber: string;
  verificationCode: string;
  requestId: string | null;
  isVerified: boolean;
  documents: any[];
  workflows: any[];
  loading: boolean;
  error: string | null;
  mockModeEnabled: boolean;
}

const MockDemoExample: React.FC = () => {
  const [state, setState] = useState<DemoState>({
    currentScenario: 'high_value_enterprise',
    phoneNumber: '+15551234567',
    verificationCode: '',
    requestId: null,
    isVerified: false,
    documents: [],
    workflows: [],
    loading: false,
    error: null,
    mockModeEnabled: false
  });

  const scenarios = getAllDemoScenarios();

  useEffect(() => {
    // Enable mock mode on component mount
    enableMockMode();
    setState(prev => ({ ...prev, mockModeEnabled: true }));
    
    // Load initial demo data
    loadDemoData();
  }, []);

  const loadDemoData = async () => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const documents = mockDemoDataService.getDemoDocuments();
      const workflows = mockDemoDataService.getDemoWorkflows();
      
      setState(prev => ({ 
        ...prev, 
        documents, 
        workflows, 
        loading: false 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to load demo data', 
        loading: false 
      }));
    }
  };

  const handleScenarioChange = (scenarioId: string) => {
    try {
      const scenario = setupDemoEnvironment(scenarioId);
      setState(prev => ({ 
        ...prev, 
        currentScenario: scenarioId,
        phoneNumber: scenario.userProfile.phone || '+15551234567'
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: `Failed to setup scenario: ${error}` 
      }));
    }
  };

  const handleSendVerification = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await vonageVerifyWithFallback(state.phoneNumber);
      
      if (result.success) {
        setState(prev => ({ 
          ...prev, 
          requestId: result.data?.requestId || null,
          loading: false 
        }));
      } else {
        setState(prev => ({ 
          ...prev, 
          error: result.error || 'Failed to send verification code',
          loading: false 
        }));
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Verification failed', 
        loading: false 
      }));
    }
  };

  const handleVerifyCode = async () => {
    if (!state.requestId) return;
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await vonageVerifyCodeWithFallback(state.requestId, state.verificationCode);
      
      if (result.success) {
        setState(prev => ({ 
          ...prev, 
          isVerified: true,
          loading: false 
        }));
        
        // Generate welcome document after verification
        await generateWelcomeDocument();
      } else {
        setState(prev => ({ 
          ...prev, 
          error: 'Invalid verification code',
          loading: false 
        }));
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Verification failed', 
        loading: false 
      }));
    }
  };

  const generateWelcomeDocument = async () => {
    const scenario = getDemoScenario(state.currentScenario);
    if (!scenario) return;
    
    try {
      const result = await foxitGenerateDocumentWithFallback('welcome_packet', {
        customer_name: scenario.userProfile.name,
        company_name: scenario.userProfile.company,
        plan_name: scenario.userProfile.plan,
        signup_date: new Date().toISOString()
      });
      
      if (result.success) {
        setState(prev => ({ 
          ...prev, 
          documents: [...prev.documents, result.data] 
        }));
      }
    } catch (error) {
      console.error('Failed to generate document:', error);
    }
  };

  const executeWorkflow = async () => {
    const scenario = getDemoScenario(state.currentScenario);
    if (!scenario) return;
    
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const result = await muleSoftExecuteWorkflowWithFallback('onboarding_workflow', {
        userId: `user_${Date.now()}`,
        company: scenario.userProfile.company,
        industry: scenario.userProfile.industry,
        plan: scenario.userProfile.plan
      });
      
      if (result.success) {
        setState(prev => ({ 
          ...prev, 
          workflows: [...prev.workflows, result.data],
          loading: false 
        }));
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Workflow execution failed',
        loading: false 
      }));
    }
  };

  const simulateError = async (errorType: 'network' | 'timeout' | 'rateLimit') => {
    try {
      const result = await apiFallbackService.simulateErrorWithFallback(errorType);
      console.log(`${errorType} error simulation:`, result);
    } catch (error) {
      console.error('Error simulation failed:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h1 className="text-2xl font-bold text-blue-900 mb-2">
          OnboardIQ Mock Demo System
        </h1>
        <p className="text-blue-700">
          This component demonstrates the mock demo data system for when APIs don't work.
          {state.mockModeEnabled && (
            <span className="inline-block ml-2 px-2 py-1 bg-blue-200 text-blue-800 rounded text-sm">
              Mock Mode Enabled
            </span>
          )}
        </p>
      </div>

      {/* Scenario Selection */}
      <div className="bg-white border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Demo Scenarios</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scenarios.map(scenario => (
            <button
              key={scenario.id}
              onClick={() => handleScenarioChange(scenario.id)}
              className={`p-4 border rounded-lg text-left transition-colors ${
                state.currentScenario === scenario.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h3 className="font-semibold">{scenario.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{scenario.description}</p>
              <p className="text-xs text-gray-500 mt-2">
                Duration: {scenario.estimatedDuration} | Success: {scenario.successRate}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Phone Verification */}
      <div className="bg-white border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Phone Verification (Vonage API)</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              value={state.phoneNumber}
              onChange={(e) => setState(prev => ({ ...prev, phoneNumber: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="+15551234567"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleSendVerification}
              disabled={state.loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {state.loading ? 'Sending...' : 'Send Verification Code'}
            </button>
            
            {state.requestId && (
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={state.verificationCode}
                  onChange={(e) => setState(prev => ({ ...prev, verificationCode: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                />
                <button
                  onClick={handleVerifyCode}
                  disabled={state.loading || !state.verificationCode}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  Verify Code
                </button>
              </div>
            )}
          </div>
          
          {state.isVerified && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800">✅ Phone number verified successfully!</p>
            </div>
          )}
        </div>
      </div>

      {/* Document Generation */}
      <div className="bg-white border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Document Generation (Foxit API)</h2>
        <div className="space-y-4">
          <button
            onClick={generateWelcomeDocument}
            disabled={state.loading || !state.isVerified}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
          >
            Generate Welcome Document
          </button>
          
          {state.documents.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Generated Documents:</h3>
              <div className="space-y-2">
                {state.documents.map((doc, index) => (
                  <div key={index} className="p-3 bg-gray-50 border rounded-md">
                    <p className="font-medium">{doc.downloadUrl}</p>
                    <p className="text-sm text-gray-600">
                      Size: {doc.fileSize} | Pages: {doc.pages} | Processing: {doc.processingTime}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Workflow Execution */}
      <div className="bg-white border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Workflow Execution (MuleSoft API)</h2>
        <div className="space-y-4">
          <button
            onClick={executeWorkflow}
            disabled={state.loading}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
          >
            Execute Onboarding Workflow
          </button>
          
          {state.workflows.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Executed Workflows:</h3>
              <div className="space-y-2">
                {state.workflows.map((workflow, index) => (
                  <div key={index} className="p-3 bg-gray-50 border rounded-md">
                    <p className="font-medium">Execution ID: {workflow.executionId}</p>
                    <p className="text-sm text-gray-600">
                      Status: {workflow.status} | Progress: {workflow.progress}% | 
                      Steps: {workflow.steps_completed}/{workflow.total_steps}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Simulation */}
      <div className="bg-white border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Error Simulation</h2>
        <div className="flex gap-2">
          <button
            onClick={() => simulateError('network')}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Simulate Network Error
          </button>
          <button
            onClick={() => simulateError('timeout')}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Simulate Timeout Error
          </button>
          <button
            onClick={() => simulateError('rateLimit')}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Simulate Rate Limit Error
          </button>
        </div>
      </div>

      {/* Error Display */}
      {state.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">❌ {state.error}</p>
        </div>
      )}

      {/* Loading Indicator */}
      {state.loading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
};

export default MockDemoExample;
