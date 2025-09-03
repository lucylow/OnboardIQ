import { vonageApi } from './vonageApi';
import { foxitApiService } from './foxitApiService';

// Types for Contract Management
export interface ContractTerms {
  planType: string;
  duration: string;
  price: number;
  features: string[];
  customizations?: Record<string, any>;
}

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  preferences?: {
    communicationChannel: 'sms' | 'email' | 'video';
    timezone: string;
    language: string;
  };
}

export interface NegotiationSession {
  sessionId: string;
  userId: string;
  channel: 'sms' | 'email' | 'video';
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  startTime: string;
  endTime?: string;
  messages: Array<{
    timestamp: string;
    sender: 'user' | 'agent';
    content: string;
    type: 'text' | 'document' | 'proposal';
  }>;
}

export interface Contract {
  contractId: string;
  userId: string;
  terms: ContractTerms;
  status: 'draft' | 'negotiating' | 'approved' | 'signed' | 'active';
  generatedAt: string;
  effectiveDate: string;
  expirationDate: string;
  documentUrl?: string;
  signatureUrl?: string;
}

// Contract Agent for Dynamic Agreement Management
export class ContractAgent {
  private templateRepository: Map<string, any>;
  private activeNegotiations: Map<string, NegotiationSession>;
  private contracts: Map<string, Contract>;

  constructor() {
    this.templateRepository = new Map();
    this.activeNegotiations = new Map();
    this.contracts = new Map();
  }

  async negotiateTerms(userData: UserData, terms: ContractTerms): Promise<{
    session: NegotiationSession;
    terms: ContractTerms;
    contract: Contract;
  }> {
    // Use Vonage to communicate terms negotiation
    const negotiationSession = await this.initiateNegotiation(userData);
    
    // AI-powered term optimization
    const optimizedTerms = await this.optimizeTerms(terms, userData);
    
    // Generate final contract using Foxit
    const contract = await this.generateContract(optimizedTerms, userData);
    
    return {
      session: negotiationSession,
      terms: optimizedTerms,
      contract: contract
    };
  }

  async initiateNegotiation(userData: UserData): Promise<NegotiationSession> {
    const channel = this.determinePreferredChannel(userData);
    const sessionId = this.generateSessionId();
    
    const session: NegotiationSession = {
      sessionId,
      userId: userData.email,
      channel,
      status: 'pending',
      startTime: new Date().toISOString(),
      messages: []
    };

    this.activeNegotiations.set(sessionId, session);
    
    switch(channel) {
      case 'sms':
        await this.sendSMSNegotiation(userData, session);
        break;
      case 'video':
        await this.createVideoSession(userData, session);
        break;
      default:
        await this.sendEmailNegotiation(userData, session);
    }

    session.status = 'active';
    return session;
  }

  private async sendSMSNegotiation(userData: UserData, session: NegotiationSession) {
    const message = `Hi ${userData.firstName}! Welcome to OnboardIQ. Let's discuss your contract terms. 
Please review your personalized offer: [Link to terms]
Reply with any questions or modifications you'd like to discuss.`;
    
    try {
      await vonageApi.sendSMS({
        to: userData.phone,
        text: message
      });
      
      session.messages.push({
        timestamp: new Date().toISOString(),
        sender: 'agent',
        content: message,
        type: 'text'
      });
    } catch (error) {
      console.error('Failed to send SMS negotiation:', error);
    }
  }

  private async createVideoSession(userData: UserData, session: NegotiationSession) {
    try {
      const videoSession = await vonageApi.createVideoSession({
        user_id: userData.email,
        session_type: 'contract_negotiation',
        media_mode: 'routed'
      });
      
      const inviteMessage = `Hi ${userData.firstName}! I'd like to discuss your contract terms via video call. 
Join me at: ${videoSession.sessionId}
This will help us personalize your agreement to your specific needs.`;
      
      await vonageApi.sendSMS({
        to: userData.phone,
        text: inviteMessage
      });
      
      session.messages.push({
        timestamp: new Date().toISOString(),
        sender: 'agent',
        content: inviteMessage,
        type: 'text'
      });
    } catch (error) {
      console.error('Failed to create video session:', error);
    }
  }

  private async sendEmailNegotiation(userData: UserData, session: NegotiationSession) {
    // Fallback to email negotiation
    const message = `Hi ${userData.firstName},

Thank you for choosing OnboardIQ! I'm here to help you get the most out of your onboarding experience.

I've prepared a personalized contract based on your needs. Please review the attached terms and let me know if you'd like any modifications.

Best regards,
Your OnboardIQ Contract Specialist`;
    
    session.messages.push({
      timestamp: new Date().toISOString(),
      sender: 'agent',
      content: message,
      type: 'text'
    });
  }

  private determinePreferredChannel(userData: UserData): 'sms' | 'email' | 'video' {
    if (userData.preferences?.communicationChannel) {
      return userData.preferences.communicationChannel;
    }
    
    // Default logic based on user data
    if (userData.phone) {
      return 'sms';
    }
    return 'email';
  }

  private async optimizeTerms(terms: ContractTerms, userData: UserData): Promise<ContractTerms> {
    // AI-powered term optimization based on user profile
    const optimizedTerms = { ...terms };
    
    // Add personalized features based on company size and role
    if (userData.role.toLowerCase().includes('manager') || userData.role.toLowerCase().includes('director')) {
      optimizedTerms.features.push('Advanced Analytics Dashboard');
      optimizedTerms.features.push('Team Management Tools');
    }
    
    // Adjust pricing based on company size
    if (userData.company && userData.company.length > 20) {
      optimizedTerms.price = Math.round(optimizedTerms.price * 0.9); // 10% discount for larger companies
    }
    
    return optimizedTerms;
  }

  async generateContract(terms: ContractTerms, userData: UserData): Promise<Contract> {
    const contractId = this.generateContractId();
    
    const contractData = {
      ...terms,
      user: userData,
      generatedAt: new Date().toISOString(),
      effectiveDate: this.calculateEffectiveDate(terms),
      expirationDate: this.calculateExpirationDate(terms)
    };

    let documentUrl = '';
    try {
      const response = await foxitApiService.generateDocument({
        templateId: 'custom_contract_template',
        data: contractData
      });
      documentUrl = response.document_url || '';
    } catch (error) {
      console.error('Failed to generate contract document:', error);
    }

    const contract: Contract = {
      contractId,
      userId: userData.email,
      terms: terms,
      status: 'draft',
      generatedAt: new Date().toISOString(),
      effectiveDate: this.calculateEffectiveDate(terms),
      expirationDate: this.calculateExpirationDate(terms),
      documentUrl
    };

    this.contracts.set(contractId, contract);
    return contract;
  }

  private calculateEffectiveDate(terms: ContractTerms): string {
    const effectiveDate = new Date();
    effectiveDate.setDate(effectiveDate.getDate() + 1); // Start tomorrow
    return effectiveDate.toISOString();
  }

  private calculateExpirationDate(terms: ContractTerms): string {
    const expirationDate = new Date();
    
    switch (terms.duration) {
      case 'monthly':
        expirationDate.setMonth(expirationDate.getMonth() + 1);
        break;
      case 'quarterly':
        expirationDate.setMonth(expirationDate.getMonth() + 3);
        break;
      case 'yearly':
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);
        break;
      default:
        expirationDate.setMonth(expirationDate.getMonth() + 1);
    }
    
    return expirationDate.toISOString();
  }

  private generateSessionId(): string {
    return `NEG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateContractId(): string {
    return `CON-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Public methods for external access
  getNegotiationSession(sessionId: string): NegotiationSession | undefined {
    return this.activeNegotiations.get(sessionId);
  }

  getContract(contractId: string): Contract | undefined {
    return this.contracts.get(contractId);
  }

  getAllContracts(): Contract[] {
    return Array.from(this.contracts.values());
  }

  updateContractStatus(contractId: string, status: Contract['status']) {
    const contract = this.contracts.get(contractId);
    if (contract) {
      contract.status = status;
      this.contracts.set(contractId, contract);
    }
  }
}

export const contractAgent = new ContractAgent();
