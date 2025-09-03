// Mock Failure Data - For testing error scenarios and fallback behavior
import { faker } from '@faker-js/faker';

// SMS Verification Failure Scenarios
export const mockSMSFailureData = {
  // Failed SMS sending scenarios
  sendFailures: [
    {
      id: 'sms_fail_1',
      userId: 'user_123',
      phoneNumber: '+15551234567',
      error: 'INVALID_PHONE_NUMBER',
      message: 'Phone number format is invalid',
      timestamp: faker.date.recent(),
      retryCount: 0,
      maxRetries: 3
    },
    {
      id: 'sms_fail_2',
      userId: 'user_456',
      phoneNumber: '+15559876543',
      error: 'INSUFFICIENT_CREDITS',
      message: 'Account has insufficient SMS credits',
      timestamp: faker.date.recent(),
      retryCount: 2,
      maxRetries: 3
    },
    {
      id: 'sms_fail_3',
      userId: 'user_789',
      phoneNumber: '+15551111111',
      error: 'CARRIER_UNSUPPORTED',
      message: 'Carrier does not support SMS delivery',
      timestamp: faker.date.recent(),
      retryCount: 1,
      maxRetries: 3
    },
    {
      id: 'sms_fail_4',
      userId: 'user_101',
      phoneNumber: '+15552222222',
      error: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many SMS requests in short time',
      timestamp: faker.date.recent(),
      retryCount: 3,
      maxRetries: 3
    }
  ],

  // Verification code failures
  verificationFailures: [
    {
      id: 'verify_fail_1',
      sessionId: 'sms_session_123',
      userId: 'user_123',
      error: 'CODE_EXPIRED',
      message: 'Verification code has expired',
      attempts: 3,
      maxAttempts: 3,
      timestamp: faker.date.recent()
    },
    {
      id: 'verify_fail_2',
      sessionId: 'sms_session_456',
      userId: 'user_456',
      error: 'INVALID_CODE',
      message: 'Invalid verification code entered',
      attempts: 2,
      maxAttempts: 3,
      timestamp: faker.date.recent()
    },
    {
      id: 'verify_fail_3',
      sessionId: 'sms_session_789',
      userId: 'user_789',
      error: 'MAX_ATTEMPTS_EXCEEDED',
      message: 'Maximum verification attempts exceeded',
      attempts: 3,
      maxAttempts: 3,
      timestamp: faker.date.recent()
    }
  ],

  // Network failures
  networkFailures: [
    {
      id: 'network_fail_1',
      type: 'TIMEOUT',
      message: 'Request timeout after 30 seconds',
      timestamp: faker.date.recent(),
      retryable: true
    },
    {
      id: 'network_fail_2',
      type: 'CONNECTION_ERROR',
      message: 'Failed to connect to SMS service',
      timestamp: faker.date.recent(),
      retryable: true
    },
    {
      id: 'network_fail_3',
      type: 'API_ERROR',
      message: 'SMS API returned 500 error',
      timestamp: faker.date.recent(),
      retryable: false
    }
  ]
};

// Video Onboarding Failure Scenarios
export const mockVideoFailureData = {
  // Session scheduling failures
  schedulingFailures: [
    {
      id: 'schedule_fail_1',
      userId: 'user_123',
      templateId: 'welcome_call',
      error: 'HOST_UNAVAILABLE',
      message: 'No hosts available for requested time',
      timestamp: faker.date.recent(),
      requestedTime: faker.date.future()
    },
    {
      id: 'schedule_fail_2',
      userId: 'user_456',
      templateId: 'training_session',
      error: 'TIME_SLOT_CONFLICT',
      message: 'Requested time slot conflicts with existing session',
      timestamp: faker.date.recent(),
      requestedTime: faker.date.future()
    },
    {
      id: 'schedule_fail_3',
      userId: 'user_789',
      templateId: 'support_call',
      error: 'VIDEO_SERVICE_UNAVAILABLE',
      message: 'Video service temporarily unavailable',
      timestamp: faker.date.recent(),
      requestedTime: faker.date.future()
    }
  ],

  // Session execution failures
  executionFailures: [
    {
      id: 'exec_fail_1',
      sessionId: 'video_session_123',
      error: 'PARTICIPANT_NO_SHOW',
      message: 'Participant did not join the session',
      timestamp: faker.date.recent(),
      sessionType: 'welcome_call'
    },
    {
      id: 'exec_fail_2',
      sessionId: 'video_session_456',
      error: 'TECHNICAL_ISSUES',
      message: 'Audio/video quality issues during session',
      timestamp: faker.date.recent(),
      sessionType: 'training_session'
    },
    {
      id: 'exec_fail_3',
      sessionId: 'video_session_789',
      error: 'RECORDING_FAILED',
      message: 'Failed to record session due to storage issues',
      timestamp: faker.date.recent(),
      sessionType: 'support_call'
    }
  ],

  // Video service failures
  serviceFailures: [
    {
      id: 'service_fail_1',
      type: 'MEETING_ROOM_CREATION_FAILED',
      message: 'Failed to create meeting room',
      timestamp: faker.date.recent(),
      retryable: true
    },
    {
      id: 'service_fail_2',
      type: 'STREAMING_ERROR',
      message: 'Video streaming interrupted',
      timestamp: faker.date.recent(),
      retryable: true
    },
    {
      id: 'service_fail_3',
      type: 'AUTHENTICATION_FAILED',
      message: 'Video service authentication failed',
      timestamp: faker.date.recent(),
      retryable: false
    }
  ]
};

// Document Generation Failure Scenarios
export const mockDocumentFailureData = {
  // Template failures
  templateFailures: [
    {
      id: 'template_fail_1',
      templateId: 'welcome_packet',
      error: 'TEMPLATE_NOT_FOUND',
      message: 'Document template not found',
      timestamp: faker.date.recent(),
      userId: 'user_123'
    },
    {
      id: 'template_fail_2',
      templateId: 'service_agreement',
      error: 'TEMPLATE_CORRUPTED',
      message: 'Document template is corrupted',
      timestamp: faker.date.recent(),
      userId: 'user_456'
    },
    {
      id: 'template_fail_3',
      templateId: 'user_guide',
      error: 'TEMPLATE_VERSION_MISMATCH',
      message: 'Template version incompatible',
      timestamp: faker.date.recent(),
      userId: 'user_789'
    }
  ],

  // Generation failures
  generationFailures: [
    {
      id: 'gen_fail_1',
      documentId: 'doc_123',
      error: 'VARIABLE_MISSING',
      message: 'Required variables not provided',
      missingVariables: ['user_name', 'company_name'],
      timestamp: faker.date.recent(),
      userId: 'user_123'
    },
    {
      id: 'gen_fail_2',
      documentId: 'doc_456',
      error: 'GENERATION_TIMEOUT',
      message: 'Document generation timed out',
      timeout: 300, // seconds
      timestamp: faker.date.recent(),
      userId: 'user_456'
    },
    {
      id: 'gen_fail_3',
      documentId: 'doc_789',
      error: 'STORAGE_FULL',
      message: 'Document storage is full',
      timestamp: faker.date.recent(),
      userId: 'user_789'
    }
  ],

  // Quality failures
  qualityFailures: [
    {
      id: 'quality_fail_1',
      documentId: 'doc_123',
      error: 'LOW_QUALITY_SCORE',
      message: 'Generated document quality below threshold',
      qualityScore: 0.3,
      threshold: 0.7,
      timestamp: faker.date.recent()
    },
    {
      id: 'quality_fail_2',
      documentId: 'doc_456',
      error: 'CONTENT_VALIDATION_FAILED',
      message: 'Document content failed validation checks',
      validationErrors: ['Invalid formatting', 'Missing sections'],
      timestamp: faker.date.recent()
    }
  ]
};

// Team Management Failure Scenarios
export const mockTeamFailureData = {
  // Team creation failures
  creationFailures: [
    {
      id: 'create_fail_1',
      userId: 'user_123',
      teamName: 'Marketing Team',
      error: 'TEAM_NAME_EXISTS',
      message: 'Team name already exists',
      timestamp: faker.date.recent()
    },
    {
      id: 'create_fail_2',
      userId: 'user_456',
      teamName: 'Sales Team',
      error: 'PLAN_LIMIT_EXCEEDED',
      message: 'Maximum teams allowed for current plan',
      timestamp: faker.date.recent(),
      currentPlan: 'free',
      maxTeams: 1
    },
    {
      id: 'create_fail_3',
      userId: 'user_789',
      teamName: 'Development Team',
      error: 'INVALID_TEAM_NAME',
      message: 'Team name contains invalid characters',
      timestamp: faker.date.recent()
    }
  ],

  // Invitation failures
  invitationFailures: [
    {
      id: 'invite_fail_1',
      teamId: 'team_123',
      email: 'user@example.com',
      error: 'EMAIL_INVALID',
      message: 'Invalid email address format',
      timestamp: faker.date.recent(),
      invitedBy: 'user_123'
    },
    {
      id: 'invite_fail_2',
      teamId: 'team_456',
      email: 'member@example.com',
      error: 'MEMBER_ALREADY_EXISTS',
      message: 'User is already a member of this team',
      timestamp: faker.date.recent(),
      invitedBy: 'user_456'
    },
    {
      id: 'invite_fail_3',
      teamId: 'team_789',
      email: 'newuser@example.com',
      error: 'TEAM_FULL',
      message: 'Team has reached maximum member limit',
      timestamp: faker.date.recent(),
      invitedBy: 'user_789',
      currentMembers: 25,
      maxMembers: 25
    }
  ],

  // Permission failures
  permissionFailures: [
    {
      id: 'perm_fail_1',
      userId: 'user_123',
      teamId: 'team_123',
      action: 'REMOVE_MEMBER',
      error: 'INSUFFICIENT_PERMISSIONS',
      message: 'User does not have permission to remove members',
      timestamp: faker.date.recent(),
      requiredRole: 'admin',
      userRole: 'member'
    },
    {
      id: 'perm_fail_2',
      userId: 'user_456',
      teamId: 'team_456',
      action: 'CHANGE_ROLE',
      error: 'CANNOT_MODIFY_OWNER',
      message: 'Cannot modify team owner role',
      timestamp: faker.date.recent()
    }
  ]
};

// Security Failure Scenarios
export const mockSecurityFailureData = {
  // Authentication failures
  authFailures: [
    {
      id: 'auth_fail_1',
      userId: 'user_123',
      error: 'INVALID_CREDENTIALS',
      message: 'Invalid username or password',
      timestamp: faker.date.recent(),
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0...'
    },
    {
      id: 'auth_fail_2',
      userId: 'user_456',
      error: 'ACCOUNT_LOCKED',
      message: 'Account locked due to multiple failed attempts',
      timestamp: faker.date.recent(),
      failedAttempts: 5,
      lockoutDuration: 30 // minutes
    },
    {
      id: 'auth_fail_3',
      userId: 'user_789',
      error: 'SESSION_EXPIRED',
      message: 'User session has expired',
      timestamp: faker.date.recent(),
      sessionDuration: 120 // minutes
    }
  ],

  // Authorization failures
  authorizationFailures: [
    {
      id: 'authz_fail_1',
      userId: 'user_123',
      resource: 'admin_dashboard',
      error: 'ACCESS_DENIED',
      message: 'User does not have access to admin dashboard',
      timestamp: faker.date.recent(),
      requiredRole: 'admin',
      userRole: 'user'
    },
    {
      id: 'authz_fail_2',
      userId: 'user_456',
      resource: 'team_settings',
      error: 'INSUFFICIENT_PERMISSIONS',
      message: 'Insufficient permissions to modify team settings',
      timestamp: faker.date.recent(),
      action: 'UPDATE_TEAM_SETTINGS'
    }
  ],

  // Security violations
  securityViolations: [
    {
      id: 'sec_violation_1',
      userId: 'user_123',
      type: 'RATE_LIMITING',
      message: 'Too many requests from this IP address',
      timestamp: faker.date.recent(),
      ipAddress: '192.168.1.100',
      requestsPerMinute: 100,
      limit: 60
    },
    {
      id: 'sec_violation_2',
      userId: 'user_456',
      type: 'SUSPICIOUS_ACTIVITY',
      message: 'Unusual login pattern detected',
      timestamp: faker.date.recent(),
      location: 'Unknown Location',
      previousLocation: 'New York, NY'
    }
  ]
};

// Analytics Failure Scenarios
export const mockAnalyticsFailureData = {
  // Data collection failures
  dataCollectionFailures: [
    {
      id: 'collect_fail_1',
      type: 'TRACKING_DISABLED',
      message: 'Analytics tracking is disabled by user',
      timestamp: faker.date.recent(),
      userId: 'user_123',
      feature: 'sms_verification'
    },
    {
      id: 'collect_fail_2',
      type: 'DATA_CORRUPTION',
      message: 'Analytics data corrupted during collection',
      timestamp: faker.date.recent(),
      feature: 'video_onboarding',
      dataSize: '2.5MB'
    },
    {
      id: 'collect_fail_3',
      type: 'STORAGE_ERROR',
      message: 'Failed to store analytics data',
      timestamp: faker.date.recent(),
      feature: 'document_generation',
      error: 'DISK_FULL'
    }
  ],

  // Report generation failures
  reportFailures: [
    {
      id: 'report_fail_1',
      reportType: 'user_activity',
      error: 'INSUFFICIENT_DATA',
      message: 'Insufficient data to generate report',
      timestamp: faker.date.recent(),
      dataPoints: 5,
      requiredPoints: 100
    },
    {
      id: 'report_fail_2',
      reportType: 'performance_metrics',
      error: 'PROCESSING_TIMEOUT',
      message: 'Report generation timed out',
      timestamp: faker.date.recent(),
      processingTime: 300, // seconds
      timeout: 240 // seconds
    },
    {
      id: 'report_fail_3',
      reportType: 'conversion_funnel',
      error: 'INVALID_DATE_RANGE',
      message: 'Invalid date range specified for report',
      timestamp: faker.date.recent(),
      startDate: '2024-01-01',
      endDate: '2023-12-31'
    }
  ],

  // Dashboard failures
  dashboardFailures: [
    {
      id: 'dashboard_fail_1',
      component: 'real_time_metrics',
      error: 'SERVICE_UNAVAILABLE',
      message: 'Real-time metrics service unavailable',
      timestamp: faker.date.recent(),
      retryable: true
    },
    {
      id: 'dashboard_fail_2',
      component: 'chart_visualization',
      error: 'RENDERING_ERROR',
      message: 'Failed to render chart visualization',
      timestamp: faker.date.recent(),
      chartType: 'line_chart',
      dataPoints: 1000
    }
  ]
};

// Documentation Failure Scenarios
export const mockDocumentationFailureData = {
  // API documentation failures
  apiDocFailures: [
    {
      id: 'api_doc_fail_1',
      endpoint: '/api/sms/send',
      error: 'SCHEMA_MISMATCH',
      message: 'API response schema does not match documentation',
      timestamp: faker.date.recent(),
      expectedSchema: 'SMSResponse',
      actualSchema: 'ErrorResponse'
    },
    {
      id: 'api_doc_fail_2',
      endpoint: '/api/video/schedule',
      error: 'MISSING_EXAMPLES',
      message: 'API documentation missing request/response examples',
      timestamp: faker.date.recent(),
      missingExamples: ['request_body', 'response_200']
    }
  ],

  // User guide failures
  userGuideFailures: [
    {
      id: 'guide_fail_1',
      guideId: 'getting_started',
      error: 'OUTDATED_CONTENT',
      message: 'User guide content is outdated',
      timestamp: faker.date.recent(),
      lastUpdated: '2023-01-01',
      currentVersion: '2.1.0'
    },
    {
      id: 'guide_fail_2',
      guideId: 'advanced_features',
      error: 'MISSING_SCREENSHOTS',
      message: 'User guide missing required screenshots',
      timestamp: faker.date.recent(),
      missingScreenshots: ['dashboard_overview', 'settings_page']
    }
  ],

  // Knowledge base failures
  knowledgeBaseFailures: [
    {
      id: 'kb_fail_1',
      articleId: 'troubleshooting_sms',
      error: 'SEARCH_INDEX_ERROR',
      message: 'Knowledge base search index corrupted',
      timestamp: faker.date.recent(),
      affectedArticles: 150
    },
    {
      id: 'kb_fail_2',
      articleId: 'video_setup_guide',
      error: 'CONTENT_NOT_FOUND',
      message: 'Requested knowledge base article not found',
      timestamp: faker.date.recent(),
      searchQuery: 'video setup configuration'
    }
  ]
};

// Utility functions for failure scenarios
export const failureUtils = {
  // Get random failure scenario
  getRandomFailure: (category: string) => {
    const categories = {
      sms: mockSMSFailureData,
      video: mockVideoFailureData,
      document: mockDocumentFailureData,
      team: mockTeamFailureData,
      security: mockSecurityFailureData,
      analytics: mockAnalyticsFailureData,
      documentation: mockDocumentationFailureData
    };
    
    const categoryData = categories[category as keyof typeof categories];
    if (!categoryData) return null;
    
    const failureTypes = Object.keys(categoryData);
    const randomType = failureTypes[Math.floor(Math.random() * failureTypes.length)];
    const failures = categoryData[randomType as keyof typeof categoryData] as any[];
    
    if (Array.isArray(failures)) {
      return failures[Math.floor(Math.random() * failures.length)];
    }
    
    return null;
  },

  // Generate failure response
  generateFailureResponse: (error: string, message: string, details?: any) => ({
    success: false,
    error,
    message,
    timestamp: new Date().toISOString(),
    ...details
  }),

  // Simulate network delay
  simulateNetworkDelay: (min: number = 1000, max: number = 5000) => {
    return new Promise(resolve => {
      setTimeout(resolve, Math.random() * (max - min) + min);
    });
  },

  // Simulate failure with probability
  simulateFailure: (probability: number = 0.1) => {
    return Math.random() < probability;
  }
};

// Export all failure data
export default {
  sms: mockSMSFailureData,
  video: mockVideoFailureData,
  document: mockDocumentFailureData,
  team: mockTeamFailureData,
  security: mockSecurityFailureData,
  analytics: mockAnalyticsFailureData,
  documentation: mockDocumentationFailureData,
  utils: failureUtils
};
