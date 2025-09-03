import { apiGuardian } from './apiGuardian';
import { contractAgent } from './contractAgent';
import { vonageApi } from './vonageApi';
import { foxitApiService } from './foxitApiService';

// Base Agent Interface
export interface BaseAgent {
  id: string;
  name: string;
  status: 'idle' | 'active' | 'error';
  handleMessage(message: AgentMessage): Promise<void>;
  getCapabilities(): string[];
}

export interface AgentMessage {
  id: string;
  from: string;
  to: string;
  type: string;
  payload: any;
  timestamp: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

// Enhanced Multi-Agent Orchestrator
export class EnhancedOrchestrator {
  private agents: Map<string, BaseAgent>;
  private messageQueue: AgentMessage[];
  private isRunning: boolean;
  private apiGuardian: typeof apiGuardian;
  private contractAgent: typeof contractAgent;

  constructor() {
    this.agents = new Map();
    this.messageQueue = [];
    this.isRunning = false;
    this.apiGuardian = apiGuardian;
    this.contractAgent = contractAgent;
  }

  async initialize() {
    console.log('Initializing Enhanced OnboardIQ Orchestrator...');
    
    // Register core agents
    this.registerAgent(new IntakeAgent());
    this.registerAgent(new DecisionAgent());
    this.registerAgent(new SecurityAgent());
    this.registerAgent(new CommunicationAgent());
    this.registerAgent(new DocumentAgent());
    this.registerAgent(new APIGuardianAgent());
    this.registerAgent(new ContractAgentWrapper());
    
    // Start API health monitoring
    await this.initializeAPIMonitoring();
    
    // Start message processing
    this.startMessageProcessing();
    
    console.log('Enhanced Orchestrator initialized successfully');
  }

  private async initializeAPIMonitoring() {
    const apiEndpoints = [
      { name: 'Vonage Verify', url: 'https://api.nexmo.com/verify', method: 'POST' as const, expectedStatus: 200 },
      { name: 'Vonage Video', url: 'https://api.vonage.com/video', method: 'POST' as const, expectedStatus: 200 },
      { name: 'Foxit API', url: 'https://api.foxit.com/documents', method: 'POST' as const, expectedStatus: 200 },
      { name: 'MuleSoft API', url: 'https://api.mulesoft.com', method: 'GET' as const, expectedStatus: 200 }
    ];
    
    // Start monitoring
    for (const endpoint of apiEndpoints) {
      await this.apiGuardian.checkEndpointHealth(endpoint);
    }
    
    // Set up continuous monitoring
    setInterval(async () => {
      for (const endpoint of apiEndpoints) {
        await this.apiGuardian.checkEndpointHealth(endpoint);
      }
    }, 30000);
  }

  registerAgent(agent: BaseAgent) {
    this.agents.set(agent.id, agent);
    console.log(`Registered agent: ${agent.name} (${agent.id})`);
  }

  async sendMessage(from: string, to: string, type: string, payload: any, priority: 'low' | 'medium' | 'high' | 'critical' = 'medium') {
    const message: AgentMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      from,
      to,
      type,
      payload,
      timestamp: new Date().toISOString(),
      priority
    };

    this.messageQueue.push(message);
    
    // Process high priority messages immediately
    if (priority === 'high' || priority === 'critical') {
      await this.processMessage(message);
    }
  }

  private async startMessageProcessing() {
    this.isRunning = true;
    
    while (this.isRunning) {
      if (this.messageQueue.length > 0) {
        const message = this.messageQueue.shift();
        if (message) {
          await this.processMessage(message);
        }
      }
      
      // Wait before processing next message
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  private async processMessage(message: AgentMessage) {
    const targetAgent = this.agents.get(message.to);
    
    if (targetAgent) {
      try {
        await targetAgent.handleMessage(message);
      } catch (error) {
        console.error(`Error processing message in agent ${targetAgent.name}:`, error);
        
        // Send error notification
        await this.sendMessage(
          'orchestrator',
          'communication_agent',
          'error_notification',
          {
            agent: targetAgent.name,
            error: error.message,
            originalMessage: message
          },
          'high'
        );
      }
    } else {
      console.warn(`Agent not found: ${message.to}`);
    }
  }

  // Public methods for external access
  getAgentStatus(agentId: string) {
    const agent = this.agents.get(agentId);
    return agent ? { id: agent.id, name: agent.name, status: agent.status } : null;
  }

  getAllAgentStatuses() {
    return Array.from(this.agents.values()).map(agent => ({
      id: agent.id,
      name: agent.name,
      status: agent.status
    }));
  }

  getAPIGuardian() {
    return this.apiGuardian;
  }

  getContractAgent() {
    return this.contractAgent;
  }

  stop() {
    this.isRunning = false;
  }
}

// Agent Implementations

class IntakeAgent implements BaseAgent {
  id = 'intake_agent';
  name = 'Intake Agent';
  status: 'idle' | 'active' | 'error' = 'idle';

  async handleMessage(message: AgentMessage): Promise<void> {
    this.status = 'active';
    
    switch (message.type) {
      case 'user_signup':
        await this.processUserSignup(message.payload);
        break;
      case 'user_data_update':
        await this.processUserDataUpdate(message.payload);
        break;
      default:
        console.log(`Intake Agent: Unknown message type ${message.type}`);
    }
    
    this.status = 'idle';
  }

  private async processUserSignup(userData: any) {
    // Process new user signup
    console.log('Processing user signup:', userData);
    
    // Send to decision agent for next steps
    // This would be handled by the orchestrator
  }

  private async processUserDataUpdate(userData: any) {
    console.log('Processing user data update:', userData);
  }

  getCapabilities(): string[] {
    return ['user_signup', 'user_data_update', 'data_validation'];
  }
}

class DecisionAgent implements BaseAgent {
  id = 'decision_agent';
  name = 'Decision Agent';
  status: 'idle' | 'active' | 'error' = 'idle';

  async handleMessage(message: AgentMessage): Promise<void> {
    this.status = 'active';
    
    switch (message.type) {
      case 'onboarding_decision':
        await this.makeOnboardingDecision(message.payload);
        break;
      case 'personalization_decision':
        await this.makePersonalizationDecision(message.payload);
        break;
      default:
        console.log(`Decision Agent: Unknown message type ${message.type}`);
    }
    
    this.status = 'idle';
  }

  private async makeOnboardingDecision(userData: any) {
    // AI-powered decision making for onboarding flow
    console.log('Making onboarding decision for:', userData);
  }

  private async makePersonalizationDecision(userData: any) {
    console.log('Making personalization decision for:', userData);
  }

  getCapabilities(): string[] {
    return ['onboarding_decision', 'personalization_decision', 'ai_analysis'];
  }
}

class SecurityAgent implements BaseAgent {
  id = 'security_agent';
  name = 'Security Agent';
  status: 'idle' | 'active' | 'error' = 'idle';

  async handleMessage(message: AgentMessage): Promise<void> {
    this.status = 'active';
    
    switch (message.type) {
      case 'security_check':
        await this.performSecurityCheck(message.payload);
        break;
      case 'threat_detection':
        await this.handleThreatDetection(message.payload);
        break;
      default:
        console.log(`Security Agent: Unknown message type ${message.type}`);
    }
    
    this.status = 'idle';
  }

  private async performSecurityCheck(data: any) {
    console.log('Performing security check:', data);
  }

  private async handleThreatDetection(threat: any) {
    console.log('Handling threat detection:', threat);
  }

  getCapabilities(): string[] {
    return ['security_check', 'threat_detection', 'fraud_prevention'];
  }
}

class CommunicationAgent implements BaseAgent {
  id = 'communication_agent';
  name = 'Communication Agent';
  status: 'idle' | 'active' | 'error' = 'idle';

  async handleMessage(message: AgentMessage): Promise<void> {
    this.status = 'active';
    
    switch (message.type) {
      case 'send_sms':
        await this.sendSMS(message.payload);
        break;
      case 'send_email':
        await this.sendEmail(message.payload);
        break;
      case 'create_video_session':
        await this.createVideoSession(message.payload);
        break;
      case 'error_notification':
        await this.handleErrorNotification(message.payload);
        break;
      default:
        console.log(`Communication Agent: Unknown message type ${message.type}`);
    }
    
    this.status = 'idle';
  }

  private async sendSMS(data: any) {
    try {
      await vonageApi.sendSMS(data);
    } catch (error) {
      console.error('Failed to send SMS:', error);
    }
  }

  private async sendEmail(data: any) {
    console.log('Sending email:', data);
  }

  private async createVideoSession(data: any) {
    try {
      await vonageApi.createVideoSession(data);
    } catch (error) {
      console.error('Failed to create video session:', error);
    }
  }

  private async handleErrorNotification(data: any) {
    console.log('Handling error notification:', data);
  }

  getCapabilities(): string[] {
    return ['send_sms', 'send_email', 'create_video_session', 'error_notification'];
  }
}

class DocumentAgent implements BaseAgent {
  id = 'document_agent';
  name = 'Document Agent';
  status: 'idle' | 'active' | 'error' = 'idle';

  async handleMessage(message: AgentMessage): Promise<void> {
    this.status = 'active';
    
    switch (message.type) {
      case 'generate_document':
        await this.generateDocument(message.payload);
        break;
      case 'process_document':
        await this.processDocument(message.payload);
        break;
      default:
        console.log(`Document Agent: Unknown message type ${message.type}`);
    }
    
    this.status = 'idle';
  }

  private async generateDocument(data: any) {
    try {
      await foxitApiService.generateDocument({
        template_id: data.template_id,
        data: data.data,
        output_format: data.options?.format || 'pdf'
      });
    } catch (error) {
      console.error('Failed to generate document:', error);
    }
  }

  private async processDocument(data: any) {
    console.log('Processing document:', data);
  }

  getCapabilities(): string[] {
    return ['generate_document', 'process_document', 'document_workflow'];
  }
}

class APIGuardianAgent implements BaseAgent {
  id = 'api_guardian_agent';
  name = 'API Guardian Agent';
  status: 'idle' | 'active' | 'error' = 'idle';

  async handleMessage(message: AgentMessage): Promise<void> {
    this.status = 'active';
    
    switch (message.type) {
      case 'api_health_alert':
        await this.handleAPIAlert(message.payload);
        break;
      case 'security_incident':
        await this.handleSecurityIncident(message.payload);
        break;
      default:
        console.log(`API Guardian Agent: Unknown message type ${message.type}`);
    }
    
    this.status = 'idle';
  }

  private async handleAPIAlert(data: any) {
    console.log('Handling API health alert:', data);
    
    // Automatically trigger scaling or failover procedures
    // Notify operations team
  }

  private async handleSecurityIncident(data: any) {
    console.log('Handling security incident:', data);
    
    // Implement automatic security responses
    // Generate security report
  }

  getCapabilities(): string[] {
    return ['api_health_alert', 'security_incident', 'automated_remediation'];
  }
}

class ContractAgentWrapper implements BaseAgent {
  id = 'contract_agent';
  name = 'Contract Agent';
  status: 'idle' | 'active' | 'error' = 'idle';

  async handleMessage(message: AgentMessage): Promise<void> {
    this.status = 'active';
    
    switch (message.type) {
      case 'negotiate_contract':
        await this.negotiateContract(message.payload);
        break;
      case 'generate_contract':
        await this.generateContract(message.payload);
        break;
      default:
        console.log(`Contract Agent: Unknown message type ${message.type}`);
    }
    
    this.status = 'idle';
  }

  private async negotiateContract(data: any) {
    try {
      await contractAgent.negotiateTerms(data.userData, data.terms);
    } catch (error) {
      console.error('Failed to negotiate contract:', error);
    }
  }

  private async generateContract(data: any) {
    try {
      await contractAgent.generateContract(data.terms, data.userData);
    } catch (error) {
      console.error('Failed to generate contract:', error);
    }
  }

  getCapabilities(): string[] {
    return ['negotiate_contract', 'generate_contract', 'contract_management'];
  }
}

// Export singleton instance
export const enhancedOrchestrator = new EnhancedOrchestrator();
