// Comprehensive Mock Data for OnboardIQ Application
import { faker } from '@faker-js/faker';
import mockFailureData from './mockFailureData';

// Mock user data
export const mockUsers = Array.from({ length: 50 }, (_, i) => ({
  id: `user_${i + 1}`,
  email: faker.internet.email(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
  companyName: faker.company.name(),
  planTier: faker.helpers.arrayElement(['free', 'premium', 'enterprise']),
  companySize: faker.helpers.arrayElement(['1-10', '11-50', '51-200', '201+']),
  industry: faker.helpers.arrayElement(['Technology', 'Finance', 'Healthcare', 'Education', 'Retail', 'Manufacturing']),
  role: faker.helpers.arrayElement(['Manager', 'Director', 'VP', 'CEO', 'CTO', 'Developer']),
  signupDate: faker.date.past(),
  lastLogin: faker.date.recent(),
  status: faker.helpers.arrayElement(['active', 'pending', 'completed', 'churned']),
  userSegment: faker.helpers.arrayElement(['free_tier_individual', 'premium_small_business', 'enterprise_corporate', 'high_potential_lead']),
  successProbability: faker.number.float({ min: 0.3, max: 0.95 }),
  churnRisk: faker.helpers.arrayElement(['low', 'medium', 'high']),
  onboardingProgress: faker.number.int({ min: 0, max: 100 }),
  totalEngagement: faker.number.int({ min: 10, max: 500 }),
  documentsGenerated: faker.number.int({ min: 0, max: 20 }),
  communicationChannels: faker.helpers.arrayElements(['email', 'sms', 'whatsapp', 'voice'], { min: 1, max: 4 })
}));

// Mock onboarding workflows
export const mockOnboardingWorkflows = Array.from({ length: 30 }, (_, i) => ({
  id: `workflow_${i + 1}`,
  userId: mockUsers[i % mockUsers.length].id,
  status: faker.helpers.arrayElement(['in_progress', 'completed', 'paused', 'failed']),
  progress: faker.number.int({ min: 0, max: 100 }),
  currentStep: faker.helpers.arrayElement(['Welcome', 'Profile Setup', 'Document Review', 'Security Verification', 'Final Setup']),
  nextStep: faker.helpers.arrayElement(['Profile Setup', 'Document Review', 'Security Verification', 'Final Setup', 'Complete']),
  startDate: faker.date.past(),
  estimatedCompletion: faker.date.future(),
  steps: [
    { id: 'welcome', name: 'Welcome Sequence', status: 'completed', completedAt: faker.date.recent() },
    { id: 'profile', name: 'Profile Setup', status: 'completed', completedAt: faker.date.recent() },
    { id: 'documents', name: 'Document Review', status: 'in_progress', completedAt: null },
    { id: 'security', name: 'Security Verification', status: 'pending', completedAt: null },
    { id: 'final', name: 'Final Setup', status: 'pending', completedAt: null }
  ],
  aiInsights: {
    userSegment: mockUsers[i % mockUsers.length].userSegment,
    successProbability: mockUsers[i % mockUsers.length].successProbability,
    recommendations: faker.helpers.arrayElements([
      'Schedule a video call for personalized guidance',
      'Send welcome package via email',
      'Enable SMS notifications for important updates',
      'Provide industry-specific documentation',
      'Set up automated follow-up sequence'
    ], { min: 2, max: 4 })
  }
}));

// Mock AI engine analytics
export const mockAIAnalytics = {
  userProfiling: {
    totalUsers: 1250,
    segments: {
      'free_tier_individual': 450,
      'premium_small_business': 380,
      'enterprise_corporate': 320,
      'high_potential_lead': 100
    },
    accuracy: 0.94,
    processingTime: 0.8,
    recommendationsGenerated: 2847
  },
  conversational: {
    totalConversations: 3420,
    averageResponseTime: 1.2,
    satisfactionScore: 4.6,
    channels: {
      email: 1200,
      sms: 890,
      whatsapp: 780,
      voice: 550
    },
    escalationRate: 0.08
  },
  security: {
    totalAssessments: 2150,
    riskLevels: {
      low: 1450,
      medium: 520,
      high: 180
    },
    falsePositives: 0.03,
    averageResponseTime: 0.5,
    stepUpAuthTriggered: 180
  },
  document: {
    totalGenerated: 2847,
    documentTypes: {
      'welcome_packet': 850,
      'contract': 620,
      'guide': 780,
      'custom': 597
    },
    averageGenerationTime: 2.1,
    validationSuccess: 0.97,
    personalizationRate: 0.89
  },
  churn: {
    totalPredictions: 1250,
    accuracy: 0.91,
    interventionsTriggered: 180,
    successRate: 0.73,
    riskLevels: {
      low: 850,
      medium: 320,
      high: 80
    }
  },
  orchestrator: {
    totalWorkflows: 1250,
    averageCompletionTime: 4.2,
    successRate: 0.88,
    agentUtilization: 0.76,
    coordinationEfficiency: 0.92
  }
};

// Mock communication history
export const mockCommunicationHistory = Array.from({ length: 100 }, (_, i) => ({
  id: `comm_${i + 1}`,
  userId: mockUsers[i % mockUsers.length].id,
  type: faker.helpers.arrayElement(['email', 'sms', 'whatsapp', 'voice', 'video']),
  status: faker.helpers.arrayElement(['sent', 'delivered', 'read', 'failed']),
  subject: faker.helpers.arrayElement([
    'Welcome to OnboardIQ!',
    'Complete Your Profile Setup',
    'Document Review Required',
    'Security Verification Needed',
    'Onboarding Call Scheduled',
    'Welcome Package Delivered'
  ]),
  content: faker.lorem.paragraph(),
  sentAt: faker.date.recent(),
  deliveredAt: faker.date.recent(),
  readAt: faker.date.recent(),
  channel: faker.helpers.arrayElement(['email', 'sms', 'whatsapp', 'voice']),
  priority: faker.helpers.arrayElement(['low', 'medium', 'high']),
  aiOptimized: faker.datatype.boolean()
}));

// Mock document history
export const mockDocumentHistory = Array.from({ length: 80 }, (_, i) => ({
  id: `doc_${i + 1}`,
  userId: mockUsers[i % mockUsers.length].id,
  type: faker.helpers.arrayElement(['welcome_packet', 'contract', 'guide', 'custom']),
  title: faker.helpers.arrayElement([
    'Welcome to OnboardIQ - Getting Started Guide',
    'Service Agreement and Terms',
    'Platform User Guide',
    'Security Best Practices',
    'Industry-Specific Documentation',
    'Onboarding Checklist'
  ]),
  status: faker.helpers.arrayElement(['generated', 'sent', 'viewed', 'signed', 'archived']),
  generatedAt: faker.date.recent(),
  sentAt: faker.date.recent(),
  viewedAt: faker.date.recent(),
  signedAt: faker.date.recent(),
  downloadCount: faker.number.int({ min: 0, max: 5 }),
  fileSize: faker.number.int({ min: 100, max: 5000 }),
  aiGenerated: faker.datatype.boolean(),
  personalized: faker.datatype.boolean(),
  validationStatus: faker.helpers.arrayElement(['passed', 'pending', 'failed'])
}));

// Mock performance metrics
export const mockPerformanceMetrics = {
  system: {
    uptime: 99.8,
    responseTime: 0.8,
    throughput: 1250,
    errorRate: 0.02,
    activeConnections: 45
  },
  ai: {
    averageProcessingTime: 1.2,
    modelAccuracy: 0.94,
    resourceUtilization: 0.68,
    cacheHitRate: 0.85,
    concurrentRequests: 23
  },
  user: {
    activeUsers: 1250,
    newSignups: 45,
    completionRate: 0.88,
    satisfactionScore: 4.6,
    averageSessionTime: 12.5
  }
};

// Mock notifications
export const mockNotifications = Array.from({ length: 20 }, (_, i) => ({
  id: `notif_${i + 1}`,
  type: faker.helpers.arrayElement(['info', 'success', 'warning', 'error']),
  title: faker.helpers.arrayElement([
    'New user signed up',
    'Onboarding workflow completed',
    'High churn risk detected',
    'Document generated successfully',
    'Security assessment completed',
    'AI model updated',
    'System maintenance scheduled'
  ]),
  message: faker.lorem.sentence(),
  timestamp: faker.date.recent(),
  read: faker.datatype.boolean(),
  priority: faker.helpers.arrayElement(['low', 'medium', 'high']),
  actionRequired: faker.datatype.boolean()
}));

// Mock dashboard data
export const mockDashboardData = {
  overview: {
    totalUsers: 1250,
    activeUsers: 890,
    newSignups: 45,
    completionRate: 0.88,
    averageOnboardingTime: 4.2,
    satisfactionScore: 4.6
  },
  recentActivity: mockUsers.slice(0, 10).map(user => ({
    id: user.id,
    action: faker.helpers.arrayElement(['signed_up', 'completed_step', 'generated_document', 'sent_message']),
    timestamp: faker.date.recent(),
    user: user.firstName + ' ' + user.lastName,
    details: faker.lorem.sentence()
  })),
  topPerformers: mockUsers.slice(0, 5).map(user => ({
    id: user.id,
    name: user.firstName + ' ' + user.lastName,
    company: user.companyName,
    engagement: user.totalEngagement,
    progress: user.onboardingProgress,
    segment: user.userSegment
  })),
  alerts: mockNotifications.filter(n => n.priority === 'high').slice(0, 5)
};

// Mock API responses
export const mockAPIResponses = {
  health: {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: 99.8,
    services: {
      backend: 'healthy',
      database: 'healthy',
      ai: 'healthy',
      integrations: 'healthy'
    }
  },
  userProfile: (userId: string) => {
    const user = mockUsers.find(u => u.id === userId) || mockUsers[0];
    return {
      ...user,
      onboardingWorkflow: mockOnboardingWorkflows.find(w => w.userId === userId),
      recentCommunications: mockCommunicationHistory.filter(c => c.userId === userId).slice(0, 5),
      documents: mockDocumentHistory.filter(d => d.userId === userId).slice(0, 5)
    };
  },
  aiInsights: (userId: string) => {
    const user = mockUsers.find(u => u.id === userId) || mockUsers[0];
    return {
      userSegment: user.userSegment,
      successProbability: user.successProbability,
      churnRisk: user.churnRisk,
      recommendations: faker.helpers.arrayElements([
        'Schedule a personalized video call',
        'Send industry-specific documentation',
        'Enable SMS notifications',
        'Provide advanced feature training',
        'Set up automated follow-up sequence'
      ], { min: 3, max: 5 }),
      nextBestAction: faker.helpers.arrayElement([
        'Send welcome email',
        'Schedule onboarding call',
        'Generate personalized documents',
        'Initiate security verification'
      ])
    };
  },
  onboardingStatus: (userId: string) => {
    const workflow = mockOnboardingWorkflows.find(w => w.userId === userId) || mockOnboardingWorkflows[0];
    return {
      ...workflow,
      estimatedCompletion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      nextMilestone: faker.helpers.arrayElement(['Document Review', 'Security Verification', 'Final Setup']),
      timeToComplete: faker.number.int({ min: 1, max: 7 })
    };
  }
};

// Mock data generators
export const generateMockData = {
  user: () => mockUsers[faker.number.int({ min: 0, max: mockUsers.length - 1 })],
  workflow: () => mockOnboardingWorkflows[faker.number.int({ min: 0, max: mockOnboardingWorkflows.length - 1 })],
  communication: () => mockCommunicationHistory[faker.number.int({ min: 0, max: mockCommunicationHistory.length - 1 })],
  document: () => mockDocumentHistory[faker.number.int({ min: 0, max: mockDocumentHistory.length - 1 })],
  notification: () => mockNotifications[faker.number.int({ min: 0, max: mockNotifications.length - 1 })]
};

// Mock data utilities
export const mockDataUtils = {
  // Get users by segment
  getUsersBySegment: (segment: string) => mockUsers.filter(user => user.userSegment === segment),
  
  // Get users by status
  getUsersByStatus: (status: string) => mockUsers.filter(user => user.status === status),
  
  // Get recent activity
  getRecentActivity: (limit = 10) => mockDashboardData.recentActivity.slice(0, limit),
  
  // Get top performers
  getTopPerformers: (limit = 5) => mockDashboardData.topPerformers.slice(0, limit),
  
  // Get high priority alerts
  getHighPriorityAlerts: () => mockNotifications.filter(n => n.priority === 'high'),
  
  // Get analytics summary
  getAnalyticsSummary: () => ({
    totalUsers: mockDashboardData.overview.totalUsers,
    activeUsers: mockDashboardData.overview.activeUsers,
    completionRate: mockDashboardData.overview.completionRate,
    satisfactionScore: mockDashboardData.overview.satisfactionScore,
    aiAccuracy: mockAIAnalytics.userProfiling.accuracy,
    systemUptime: mockPerformanceMetrics.system.uptime
  }),
  
  // Simulate real-time updates
  simulateRealTimeUpdate: () => {
    const randomUser = generateMockData.user();
    return {
      type: 'user_activity',
      userId: randomUser.id,
      action: faker.helpers.arrayElement(['step_completed', 'document_viewed', 'message_sent']),
      timestamp: new Date().toISOString(),
      user: randomUser.firstName + ' ' + randomUser.lastName
    };
  }
};

// NEW: Product Features Mock Data

// 1. SMS Verification Feature
export const mockSMSVerification = {
  // SMS verification sessions
  sessions: Array.from({ length: 200 }, (_, i) => ({
    id: `sms_session_${i + 1}`,
    userId: mockUsers[i % mockUsers.length].id,
    phoneNumber: faker.phone.number(),
    requestId: faker.string.uuid(),
    status: faker.helpers.arrayElement(['pending', 'sent', 'delivered', 'verified', 'expired', 'failed']),
    createdAt: faker.date.recent(),
    expiresAt: faker.date.future({ years: 0.001 }), // 10 minutes from creation
    verifiedAt: faker.helpers.maybe(() => faker.date.recent(), { probability: 0.7 }),
    attempts: faker.number.int({ min: 1, max: 5 }),
    maxAttempts: 3,
    code: faker.string.numeric(6),
    countryCode: faker.helpers.arrayElement(['+1', '+44', '+33', '+49', '+81', '+91']),
    carrier: faker.helpers.arrayElement(['Verizon', 'AT&T', 'T-Mobile', 'Sprint', 'Vodafone', 'Orange']),
    cost: faker.number.float({ min: 0.01, max: 0.10 }),
    template: faker.helpers.arrayElement(['verification', 'welcome', 'reminder', 'custom']),
    message: faker.helpers.arrayElement([
      'Your OnboardIQ verification code is: {code}',
      'Welcome to OnboardIQ! Your code: {code}',
      'Complete your setup with code: {code}'
    ])
  })),

  // SMS templates
  templates: [
    {
      id: 'verification_template',
      name: 'Verification Code',
      content: 'Your OnboardIQ verification code is: {code}. Valid for 10 minutes.',
      variables: ['code'],
      language: 'en',
      category: 'verification'
    },
    {
      id: 'welcome_template',
      name: 'Welcome Message',
      content: 'Welcome to OnboardIQ! Your verification code: {code}. Start your journey now!',
      variables: ['code'],
      language: 'en',
      category: 'welcome'
    },
    {
      id: 'reminder_template',
      name: 'Reminder',
      content: 'Complete your OnboardIQ setup with code: {code}. Expires soon!',
      variables: ['code'],
      language: 'en',
      category: 'reminder'
    }
  ],

  // SMS analytics
  analytics: {
    totalSent: 15420,
    delivered: 14850,
    verified: 13200,
    failed: 570,
    deliveryRate: 0.96,
    verificationRate: 0.89,
    averageResponseTime: 2.3,
    costPerVerification: 0.05,
    totalCost: 771.0,
    byCountry: {
      'US': { sent: 8500, verified: 7600, rate: 0.89 },
      'UK': { sent: 3200, verified: 2900, rate: 0.91 },
      'CA': { sent: 1800, verified: 1600, rate: 0.89 },
      'AU': { sent: 1200, verified: 1100, rate: 0.92 }
    }
  }
};

// 2. Video Onboarding Feature
export const mockVideoOnboarding = {
  // Video sessions
  sessions: Array.from({ length: 150 }, (_, i) => ({
    id: `video_session_${i + 1}`,
    userId: mockUsers[i % mockUsers.length].id,
    sessionId: faker.string.uuid(),
    status: faker.helpers.arrayElement(['scheduled', 'in_progress', 'completed', 'cancelled', 'no_show']),
    scheduledAt: faker.date.future(),
    startedAt: faker.helpers.maybe(() => faker.date.recent(), { probability: 0.8 }),
    endedAt: faker.helpers.maybe(() => faker.date.recent(), { probability: 0.7 }),
    duration: faker.helpers.maybe(() => faker.number.int({ min: 15, max: 60 }), { probability: 0.7 }),
    host: faker.person.fullName(),
    participant: mockUsers[i % mockUsers.length].firstName + ' ' + mockUsers[i % mockUsers.length].lastName,
    meetingUrl: faker.internet.url(),
    recordingUrl: faker.helpers.maybe(() => faker.internet.url(), { probability: 0.6 }),
    notes: faker.helpers.maybe(() => faker.lorem.paragraph(), { probability: 0.5 }),
    satisfaction: faker.helpers.maybe(() => faker.number.int({ min: 1, max: 5 }), { probability: 0.8 }),
    topics: faker.helpers.arrayElements([
      'Platform Overview',
      'Feature Walkthrough',
      'Best Practices',
      'Q&A Session',
      'Custom Setup'
    ], { min: 1, max: 4 }),
    type: faker.helpers.arrayElement(['welcome', 'training', 'support', 'sales', 'custom'])
  })),

  // Video templates
  templates: [
    {
      id: 'welcome_call',
      name: 'Welcome Call',
      duration: 30,
      agenda: [
        'Introduction and welcome',
        'Platform overview',
        'Next steps',
        'Q&A session'
      ],
      materials: ['welcome_presentation', 'getting_started_guide'],
      type: 'welcome'
    },
    {
      id: 'training_session',
      name: 'Training Session',
      duration: 45,
      agenda: [
        'Feature deep dive',
        'Hands-on demonstration',
        'Best practices',
        'Customization options'
      ],
      materials: ['training_materials', 'demo_environment'],
      type: 'training'
    },
    {
      id: 'support_call',
      name: 'Support Call',
      duration: 20,
      agenda: [
        'Issue identification',
        'Solution demonstration',
        'Follow-up plan'
      ],
      materials: ['support_documentation'],
      type: 'support'
    }
  ],

  // Video analytics
  analytics: {
    totalScheduled: 850,
    completed: 720,
    cancelled: 80,
    noShow: 50,
    completionRate: 0.85,
    averageDuration: 32.5,
    averageSatisfaction: 4.6,
    byType: {
      welcome: { scheduled: 400, completed: 350, satisfaction: 4.7 },
      training: { scheduled: 300, completed: 250, satisfaction: 4.5 },
      support: { scheduled: 150, completed: 120, satisfaction: 4.4 }
    }
  }
};

// 3. Document Generation Feature
export const mockDocumentGeneration = {
  // Document templates
  templates: [
    {
      id: 'welcome_packet',
      name: 'Welcome Packet',
      category: 'onboarding',
      description: 'Comprehensive welcome package with platform overview and getting started guide',
      variables: ['user_name', 'company_name', 'plan_tier', 'onboarding_date'],
      sections: [
        'Welcome Letter',
        'Platform Overview',
        'Getting Started Guide',
        'Contact Information',
        'Next Steps'
      ],
      format: 'pdf',
      estimatedTime: 2.5
    },
    {
      id: 'service_agreement',
      name: 'Service Agreement',
      category: 'legal',
      description: 'Standard service agreement with customizable terms',
      variables: ['company_name', 'contact_name', 'start_date', 'plan_details'],
      sections: [
        'Terms of Service',
        'Service Description',
        'Payment Terms',
        'Data Protection',
        'Termination Clause'
      ],
      format: 'pdf',
      estimatedTime: 3.0
    },
    {
      id: 'user_guide',
      name: 'User Guide',
      category: 'training',
      description: 'Comprehensive user guide with screenshots and step-by-step instructions',
      variables: ['user_name', 'company_name', 'industry', 'use_case'],
      sections: [
        'Getting Started',
        'Core Features',
        'Advanced Features',
        'Troubleshooting',
        'Support Resources'
      ],
      format: 'pdf',
      estimatedTime: 4.0
    },
    {
      id: 'onboarding_checklist',
      name: 'Onboarding Checklist',
      category: 'onboarding',
      description: 'Customizable checklist for onboarding process',
      variables: ['user_name', 'company_name', 'onboarding_steps'],
      sections: [
        'Account Setup',
        'Profile Configuration',
        'Document Review',
        'Security Verification',
        'Final Steps'
      ],
      format: 'pdf',
      estimatedTime: 1.5
    }
  ],

  // Generated documents
  documents: Array.from({ length: 300 }, (_, i) => ({
    id: `doc_gen_${i + 1}`,
    userId: mockUsers[i % mockUsers.length].id,
    templateId: faker.helpers.arrayElement(['welcome_packet', 'service_agreement', 'user_guide', 'onboarding_checklist']),
    status: faker.helpers.arrayElement(['generating', 'completed', 'failed', 'archived']),
    createdAt: faker.date.recent(),
    completedAt: faker.helpers.maybe(() => faker.date.recent(), { probability: 0.9 }),
    fileUrl: faker.helpers.maybe(() => faker.internet.url(), { probability: 0.9 }),
    fileSize: faker.helpers.maybe(() => faker.number.int({ min: 100, max: 5000 }), { probability: 0.9 }),
    downloadCount: faker.number.int({ min: 0, max: 10 }),
    variables: {
      user_name: mockUsers[i % mockUsers.length].firstName + ' ' + mockUsers[i % mockUsers.length].lastName,
      company_name: mockUsers[i % mockUsers.length].companyName,
      plan_tier: mockUsers[i % mockUsers.length].planTier,
      onboarding_date: faker.date.recent().toISOString().split('T')[0],
      industry: mockUsers[i % mockUsers.length].industry
    },
    personalization: {
      industry_specific: faker.datatype.boolean(),
      company_branding: faker.datatype.boolean(),
      custom_content: faker.datatype.boolean()
    },
    quality: {
      score: faker.number.float({ min: 0.8, max: 1.0 }),
      issues: faker.helpers.maybe(() => faker.helpers.arrayElements(['formatting', 'content', 'branding'], { min: 0, max: 2 }), { probability: 0.1 })
    }
  })),

  // Document analytics
  analytics: {
    totalGenerated: 2847,
    successful: 2750,
    failed: 97,
    successRate: 0.97,
    averageGenerationTime: 2.1,
    totalFileSize: 8500000, // 8.5MB
    byTemplate: {
      welcome_packet: { generated: 1200, success: 1160, avgTime: 2.5 },
      service_agreement: { generated: 800, success: 780, avgTime: 3.0 },
      user_guide: { generated: 600, success: 580, avgTime: 4.0 },
      onboarding_checklist: { generated: 447, success: 430, avgTime: 1.5 }
    },
    byIndustry: {
      Technology: { generated: 950, success: 920 },
      Finance: { generated: 750, success: 730 },
      Healthcare: { generated: 600, success: 580 },
      Education: { generated: 547, success: 520 }
    }
  }
};

// 4. Team Management Feature
export const mockTeamManagement = {
  // Team members
  teams: Array.from({ length: 25 }, (_, i) => ({
    id: `team_${i + 1}`,
    name: faker.company.name() + ' Team',
    owner: mockUsers[i % mockUsers.length].id,
    createdAt: faker.date.past(),
    status: faker.helpers.arrayElement(['active', 'archived', 'pending']),
    plan: faker.helpers.arrayElement(['free', 'premium', 'enterprise']),
    members: Array.from({ length: faker.number.int({ min: 2, max: 8 }) }, (_, j) => ({
      id: `member_${i}_${j}`,
      userId: mockUsers[(i + j) % mockUsers.length].id,
      role: faker.helpers.arrayElement(['owner', 'admin', 'member', 'viewer']),
      joinedAt: faker.date.recent(),
      permissions: faker.helpers.arrayElements([
        'manage_users',
        'manage_documents',
        'view_analytics',
        'manage_integrations',
        'billing_access'
      ], { min: 1, max: 5 }),
      status: faker.helpers.arrayElement(['active', 'invited', 'suspended'])
    })),
    settings: {
      allowInvites: faker.datatype.boolean(),
      requireApproval: faker.datatype.boolean(),
      maxMembers: faker.number.int({ min: 5, max: 50 }),
      defaultRole: faker.helpers.arrayElement(['member', 'viewer'])
    }
  })),

  // Team invitations
  invitations: Array.from({ length: 100 }, (_, i) => ({
    id: `invite_${i + 1}`,
    teamId: `team_${(i % 25) + 1}`,
    email: faker.internet.email(),
    role: faker.helpers.arrayElement(['admin', 'member', 'viewer']),
    status: faker.helpers.arrayElement(['pending', 'accepted', 'declined', 'expired']),
    invitedBy: mockUsers[i % mockUsers.length].id,
    invitedAt: faker.date.recent(),
    expiresAt: faker.date.future({ years: 0.001 }), // 7 days
    acceptedAt: faker.helpers.maybe(() => faker.date.recent(), { probability: 0.6 }),
    message: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 })
  })),

  // Team activities
  activities: Array.from({ length: 200 }, (_, i) => ({
    id: `activity_${i + 1}`,
    teamId: `team_${(i % 25) + 1}`,
    userId: mockUsers[i % mockUsers.length].id,
    action: faker.helpers.arrayElement([
      'member_joined',
      'member_left',
      'role_changed',
      'document_created',
      'document_shared',
      'invitation_sent',
      'invitation_accepted',
      'settings_updated'
    ]),
    timestamp: faker.date.recent(),
    details: {
      targetUser: faker.helpers.maybe(() => faker.person.fullName(), { probability: 0.5 }),
      oldRole: faker.helpers.maybe(() => faker.helpers.arrayElement(['member', 'admin', 'viewer']), { probability: 0.3 }),
      newRole: faker.helpers.maybe(() => faker.helpers.arrayElement(['member', 'admin', 'viewer']), { probability: 0.3 }),
      documentName: faker.helpers.maybe(() => faker.helpers.arrayElement(['Welcome Packet', 'Service Agreement', 'User Guide']), { probability: 0.3 })
    }
  })),

  // Team analytics
  analytics: {
    totalTeams: 25,
    activeTeams: 23,
    totalMembers: 156,
    averageTeamSize: 6.2,
    invitationsSent: 100,
    invitationsAccepted: 60,
    acceptanceRate: 0.60,
    byPlan: {
      free: { teams: 8, members: 32 },
      premium: { teams: 12, members: 84 },
      enterprise: { teams: 5, members: 40 }
    },
    activityMetrics: {
      dailyActiveTeams: 18,
      weeklyActiveTeams: 22,
      monthlyActiveTeams: 23,
      averageActivitiesPerDay: 15
    }
  }
};

// Feature-specific utilities
export const featureUtils = {
  // SMS Verification utilities
  sms: {
    generateVerificationCode: () => faker.string.numeric(6),
    calculateDeliveryRate: (sent: number, delivered: number) => delivered / sent,
    getSessionByUserId: (userId: string) => mockSMSVerification.sessions.filter(s => s.userId === userId),
    getTemplatesByCategory: (category: string) => mockSMSVerification.templates.filter(t => t.category === category)
  },

  // Video Onboarding utilities
  video: {
    getSessionsByType: (type: string) => mockVideoOnboarding.sessions.filter(s => s.type === type),
    getSessionsByStatus: (status: string) => mockVideoOnboarding.sessions.filter(s => s.status === status),
    getTemplatesByType: (type: string) => mockVideoOnboarding.templates.filter(t => t.type === type),
    calculateCompletionRate: (scheduled: number, completed: number) => completed / scheduled
  },

  // Document Generation utilities
  documents: {
    getDocumentsByTemplate: (templateId: string) => mockDocumentGeneration.documents.filter(d => d.templateId === templateId),
    getTemplatesByCategory: (category: string) => mockDocumentGeneration.templates.filter(t => t.category === category),
    calculateSuccessRate: (total: number, successful: number) => successful / total,
    getPersonalizationStats: () => {
      const docs = mockDocumentGeneration.documents;
      return {
        industrySpecific: docs.filter(d => d.personalization.industry_specific).length,
        companyBranding: docs.filter(d => d.personalization.company_branding).length,
        customContent: docs.filter(d => d.personalization.custom_content).length
      };
    }
  },

  // Team Management utilities
  teams: {
    getTeamByOwner: (ownerId: string) => mockTeamManagement.teams.find(t => t.owner === ownerId),
    getTeamMembers: (teamId: string) => mockTeamManagement.teams.find(t => t.id === teamId)?.members || [],
    getInvitationsByStatus: (status: string) => mockTeamManagement.invitations.filter(i => i.status === status),
    getTeamActivities: (teamId: string) => mockTeamManagement.activities.filter(a => a.teamId === teamId),
    calculateTeamStats: (teamId: string) => {
      const team = mockTeamManagement.teams.find(t => t.id === teamId);
      if (!team) return null;
      return {
        memberCount: team.members.length,
        activeMembers: team.members.filter(m => m.status === 'active').length,
        admins: team.members.filter(m => m.role === 'admin').length,
        pendingInvitations: mockTeamManagement.invitations.filter(i => i.teamId === teamId && i.status === 'pending').length
      };
    }
  }
};

export default {
  mockUsers,
  mockOnboardingWorkflows,
  mockAIAnalytics,
  mockCommunicationHistory,
  mockDocumentHistory,
  mockPerformanceMetrics,
  mockNotifications,
  mockDashboardData,
  mockAPIResponses,
  generateMockData,
  mockDataUtils,
  // Product Features
  mockSMSVerification,
  mockVideoOnboarding,
  mockDocumentGeneration,
  mockTeamManagement,
  featureUtils,
  // Failure data
  ...mockFailureData
};
