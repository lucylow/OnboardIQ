// Comprehensive Mock Data for OnboardIQ Platform

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  status: 'pending' | 'verified' | 'completed';
  createdAt: string;
  verifiedAt?: string;
  completedAt?: string;
  avatar?: string;
  onboardingProgress: number;
  lastActivity: string;
}

export interface VideoSession {
  id: string;
  title: string;
  description: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  startTime: string;
  endTime?: string;
  duration: number;
  participants: User[];
  host: User;
  recordingUrl?: string;
  transcript?: string;
  notes?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  title: string;
  type: 'welcome_packet' | 'contract' | 'invoice' | 'proposal' | 'guide';
  status: 'draft' | 'generated' | 'sent' | 'signed' | 'archived';
  fileSize: string;
  createdAt: string;
  updatedAt: string;
  downloadUrl?: string;
  previewUrl?: string;
  recipient: User;
  template: string;
  metadata: {
    pages: number;
    wordCount: number;
    hasSignature: boolean;
    isEncrypted: boolean;
  };
}

export interface Analytics {
  totalUsers: number;
  activeUsers: number;
  conversionRate: number;
  averageOnboardingTime: number;
  completionRate: number;
  churnRate: number;
  revenue: number;
  growthRate: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  companyLogo: string;
  avatar: string;
  content: string;
  rating: number;
  featured: boolean;
  industry: string;
  metrics: {
    onboardingTimeReduction: string;
    churnReduction: string;
    userSatisfaction: string;
  };
  createdAt: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  isPopular?: boolean;
  isEnterprise?: boolean;
  limits: {
    users: number;
    sessions: number;
    storage: string;
    support: string;
  };
  cta: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  linkedin: string;
  twitter: string;
  expertise: string[];
  experience: string;
}

export interface Milestone {
  id: string;
  date: string;
  title: string;
  description: string;
  category: 'funding' | 'product' | 'growth' | 'partnership';
  impact: string;
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user_001',
    name: 'Sarah Chen',
    email: 'sarah.chen@techcorp.com',
    phone: '+1 (555) 123-4567',
    company: 'TechCorp Solutions',
    role: 'CTO',
    status: 'completed',
    createdAt: '2024-01-15T10:30:00Z',
    verifiedAt: '2024-01-15T10:35:00Z',
    completedAt: '2024-01-15T11:00:00Z',
    avatar: '/api/placeholder/80/80',
    onboardingProgress: 100,
    lastActivity: '2024-01-20T14:30:00Z'
  },
  {
    id: 'user_002',
    name: 'Michael Rodriguez',
    email: 'michael.rodriguez@fintechpro.com',
    phone: '+1 (555) 234-5678',
    company: 'FinTech Pro',
    role: 'VP of Operations',
    status: 'verified',
    createdAt: '2024-01-16T09:15:00Z',
    verifiedAt: '2024-01-16T09:20:00Z',
    avatar: '/api/placeholder/80/80',
    onboardingProgress: 75,
    lastActivity: '2024-01-19T16:45:00Z'
  },
  {
    id: 'user_003',
    name: 'Emily Johnson',
    email: 'emily.johnson@healthtech.io',
    phone: '+1 (555) 345-6789',
    company: 'HealthTech Innovations',
    role: 'Customer Success Manager',
    status: 'pending',
    createdAt: '2024-01-17T11:20:00Z',
    avatar: '/api/placeholder/80/80',
    onboardingProgress: 25,
    lastActivity: '2024-01-18T13:10:00Z'
  },
  {
    id: 'user_004',
    name: 'David Kim',
    email: 'david.kim@saasstartup.com',
    phone: '+1 (555) 456-7890',
    company: 'SaaS Startup',
    role: 'CEO',
    status: 'completed',
    createdAt: '2024-01-14T08:45:00Z',
    verifiedAt: '2024-01-14T08:50:00Z',
    completedAt: '2024-01-14T09:15:00Z',
    avatar: '/api/placeholder/80/80',
    onboardingProgress: 100,
    lastActivity: '2024-01-21T10:20:00Z'
  },
  {
    id: 'user_005',
    name: 'Lisa Thompson',
    email: 'lisa.thompson@enterprisecorp.com',
    phone: '+1 (555) 567-8901',
    company: 'Enterprise Corp',
    role: 'IT Director',
    status: 'verified',
    createdAt: '2024-01-18T14:30:00Z',
    verifiedAt: '2024-01-18T14:35:00Z',
    avatar: '/api/placeholder/80/80',
    onboardingProgress: 60,
    lastActivity: '2024-01-20T11:15:00Z'
  }
];

// Mock Video Sessions
export const mockVideoSessions: VideoSession[] = [
  {
    id: 'sess_001',
    title: 'Product Onboarding Session',
    description: 'Comprehensive walkthrough of OnboardIQ features and best practices',
    status: 'completed',
    startTime: '2024-01-15T10:00:00Z',
    endTime: '2024-01-15T11:30:00Z',
    duration: 90,
    participants: [mockUsers[0], mockUsers[1]],
    host: mockUsers[0],
    recordingUrl: 'https://onboardiq.lovable.app/recordings/sess_001.mp4',
    transcript: 'Welcome to OnboardIQ! Today we\'ll walk through...',
    notes: 'Great session! Customer showed high engagement with multi-channel features.',
    tags: ['onboarding', 'product-demo', 'enterprise'],
    createdAt: '2024-01-14T09:00:00Z',
    updatedAt: '2024-01-15T11:30:00Z'
  },
  {
    id: 'sess_002',
    title: 'Technical Implementation Review',
    description: 'Deep dive into API integration and custom workflows',
    status: 'in_progress',
    startTime: '2024-01-20T14:00:00Z',
    duration: 60,
    participants: [mockUsers[1], mockUsers[2]],
    host: mockUsers[1],
    tags: ['technical', 'api', 'integration'],
    createdAt: '2024-01-19T16:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z'
  },
  {
    id: 'sess_003',
    title: 'Customer Success Check-in',
    description: 'Monthly review of onboarding progress and optimization opportunities',
    status: 'scheduled',
    startTime: '2024-01-25T15:00:00Z',
    duration: 45,
    participants: [mockUsers[3]],
    host: mockUsers[3],
    tags: ['success', 'review', 'optimization'],
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z'
  },
  {
    id: 'sess_004',
    title: 'Security & Compliance Overview',
    description: 'Detailed review of security features and compliance requirements',
    status: 'completed',
    startTime: '2024-01-16T13:00:00Z',
    endTime: '2024-01-16T14:15:00Z',
    duration: 75,
    participants: [mockUsers[4]],
    host: mockUsers[4],
    recordingUrl: 'https://onboardiq.lovable.app/recordings/sess_004.mp4',
    transcript: 'Today we\'ll cover our enterprise security features...',
    notes: 'Customer was particularly interested in SOC2 compliance.',
    tags: ['security', 'compliance', 'enterprise'],
    createdAt: '2024-01-15T12:00:00Z',
    updatedAt: '2024-01-16T14:15:00Z'
  },
  {
    id: 'sess_005',
    title: 'Customer Success Review',
    description: 'Quarterly business review and success metrics discussion',
    status: 'scheduled',
    startTime: '2024-01-30T10:00:00Z',
    duration: 60,
    participants: [mockUsers[0], mockUsers[3]],
    host: mockUsers[0],
    tags: ['qbr', 'success', 'metrics'],
    createdAt: '2024-01-22T09:00:00Z',
    updatedAt: '2024-01-22T09:00:00Z'
  }
];

// Mock Documents
export const mockDocuments: Document[] = [
  {
    id: 'doc_001',
    title: 'Welcome to OnboardIQ - Getting Started Guide',
    type: 'welcome_packet',
    status: 'sent',
    fileSize: '2.3 MB',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:35:00Z',
    downloadUrl: 'https://onboardiq.lovable.app/documents/doc_001.pdf',
    previewUrl: 'https://onboardiq.lovable.app/preview/doc_001',
    recipient: mockUsers[0],
    template: 'welcome_packet',
    metadata: {
      pages: 12,
      wordCount: 2500,
      hasSignature: true,
      isEncrypted: false
    }
  },
  {
    id: 'doc_002',
    title: 'Service Agreement - TechCorp Solutions',
    type: 'contract',
    status: 'signed',
    fileSize: '4.1 MB',
    createdAt: '2024-01-16T09:15:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
    downloadUrl: 'https://onboardiq.lovable.app/documents/doc_002.pdf',
    previewUrl: 'https://onboardiq.lovable.app/preview/doc_002',
    recipient: mockUsers[1],
    template: 'contract',
    metadata: {
      pages: 18,
      wordCount: 4500,
      hasSignature: true,
      isEncrypted: true
    }
  },
  {
    id: 'doc_003',
    title: 'Onboarding Process Guide',
    type: 'guide',
    status: 'generated',
    fileSize: '3.2 MB',
    createdAt: '2024-01-17T11:20:00Z',
    updatedAt: '2024-01-17T11:25:00Z',
    downloadUrl: 'https://onboardiq.lovable.app/documents/doc_003.pdf',
    previewUrl: 'https://onboardiq.lovable.app/preview/doc_003',
    recipient: mockUsers[2],
    template: 'onboarding_guide',
    metadata: {
      pages: 15,
      wordCount: 3200,
      hasSignature: false,
      isEncrypted: false
    }
  },
  {
    id: 'doc_004',
    title: 'Invoice #INV-2024-001',
    type: 'invoice',
    status: 'sent',
    fileSize: '1.8 MB',
    createdAt: '2024-01-18T14:30:00Z',
    updatedAt: '2024-01-18T14:35:00Z',
    downloadUrl: 'https://onboardiq.lovable.app/documents/doc_004.pdf',
    previewUrl: 'https://onboardiq.lovable.app/preview/doc_004',
    recipient: mockUsers[3],
    template: 'invoice',
    metadata: {
      pages: 3,
      wordCount: 800,
      hasSignature: false,
      isEncrypted: false
    }
  },
  {
    id: 'doc_005',
    title: 'Enterprise Proposal - Q1 2024',
    type: 'proposal',
    status: 'draft',
    fileSize: '5.7 MB',
    createdAt: '2024-01-19T16:45:00Z',
    updatedAt: '2024-01-19T16:50:00Z',
    downloadUrl: 'https://onboardiq.lovable.app/documents/doc_005.pdf',
    previewUrl: 'https://onboardiq.lovable.app/preview/doc_005',
    recipient: mockUsers[4],
    template: 'proposal',
    metadata: {
      pages: 25,
      wordCount: 6800,
      hasSignature: false,
      isEncrypted: true
    }
  }
];

// Mock Analytics
export const mockAnalytics: Analytics = {
  totalUsers: 1250,
  activeUsers: 892,
  conversionRate: 78.5,
  averageOnboardingTime: 2.3,
  completionRate: 85.2,
  churnRate: 12.3,
  revenue: 1250000,
  growthRate: 23.7
};

// Mock Testimonials
export const mockTestimonials: Testimonial[] = [
  {
    id: 'testimonial_001',
    name: 'Sarah Chen',
    role: 'CTO',
    company: 'TechCorp Solutions',
    companyLogo: '/api/placeholder/120/60',
    avatar: '/api/placeholder/80/80',
    content: 'OnboardIQ transformed our customer onboarding process completely. We reduced onboarding time by 65% and improved customer satisfaction scores by 40%. The multi-channel approach and automated document generation have been game-changers for our enterprise clients.',
    rating: 5,
    featured: true,
    industry: 'Technology',
    metrics: {
      onboardingTimeReduction: '65%',
      churnReduction: '40%',
      userSatisfaction: '95%'
    },
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'testimonial_002',
    name: 'Michael Rodriguez',
    role: 'VP of Operations',
    company: 'FinTech Pro',
    companyLogo: '/api/placeholder/120/60',
    avatar: '/api/placeholder/80/80',
    content: 'The compliance automation features alone have saved us countless hours. Our audit preparation time went from weeks to days, and the built-in security features give us confidence in handling sensitive financial data.',
    rating: 5,
    featured: false,
    industry: 'Financial Services',
    metrics: {
      onboardingTimeReduction: '70%',
      churnReduction: '35%',
      userSatisfaction: '92%'
    },
    createdAt: '2024-01-16T09:15:00Z'
  },
  {
    id: 'testimonial_003',
    name: 'Emily Johnson',
    role: 'Customer Success Manager',
    company: 'HealthTech Innovations',
    companyLogo: '/api/placeholder/120/60',
    avatar: '/api/placeholder/80/80',
    content: 'The real-time analytics and predictive insights have revolutionized how we approach customer success. We can now proactively identify at-risk customers and intervene before they churn.',
    rating: 4,
    featured: false,
    industry: 'Healthcare',
    metrics: {
      onboardingTimeReduction: '55%',
      churnReduction: '45%',
      userSatisfaction: '88%'
    },
    createdAt: '2024-01-17T11:20:00Z'
  },
  {
    id: 'testimonial_004',
    name: 'David Kim',
    role: 'CEO',
    company: 'SaaS Startup',
    companyLogo: '/api/placeholder/120/60',
    avatar: '/api/placeholder/80/80',
    content: 'As a fast-growing startup, we needed a solution that could scale with us. OnboardIQ\'s flexibility and ease of integration made it the perfect choice. Our customer onboarding is now completely automated.',
    rating: 5,
    featured: false,
    industry: 'SaaS',
    metrics: {
      onboardingTimeReduction: '80%',
      churnReduction: '50%',
      userSatisfaction: '96%'
    },
    createdAt: '2024-01-14T08:45:00Z'
  },
  {
    id: 'testimonial_005',
    name: 'Lisa Thompson',
    role: 'IT Director',
    company: 'Enterprise Corp',
    companyLogo: '/api/placeholder/120/60',
    avatar: '/api/placeholder/80/80',
    content: 'The enterprise security features and compliance automation have made our IT team\'s job much easier. We can now focus on strategic initiatives instead of manual compliance tasks.',
    rating: 4,
    featured: false,
    industry: 'Enterprise',
    metrics: {
      onboardingTimeReduction: '60%',
      churnReduction: '30%',
      userSatisfaction: '90%'
    },
    createdAt: '2024-01-18T14:30:00Z'
  }
];

// Mock Pricing Plans
export const mockPricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for small teams getting started with customer onboarding',
    price: 99,
    billingCycle: 'monthly',
    features: [
      'Up to 100 users',
      'Multi-channel onboarding',
      'Basic document generation',
      'Email support',
      'Standard security',
      'Basic analytics'
    ],
    limits: {
      users: 100,
      sessions: 50,
      storage: '10 GB',
      support: 'Email'
    },
    cta: 'Start Free Trial'
  },
  {
    id: 'growth',
    name: 'Growth',
    description: 'Ideal for growing companies with advanced onboarding needs',
    price: 299,
    billingCycle: 'monthly',
    features: [
      'Up to 500 users',
      'Advanced automation',
      'Custom document templates',
      'Priority support',
      'Enhanced security',
      'Advanced analytics',
      'API access',
      'Custom integrations'
    ],
    isPopular: true,
    limits: {
      users: 500,
      sessions: 200,
      storage: '50 GB',
      support: 'Priority'
    },
    cta: 'Start Free Trial'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Complete solution for large organizations with complex requirements',
    price: 999,
    billingCycle: 'monthly',
    features: [
      'Unlimited users',
      'Full automation suite',
      'Custom development',
      'Dedicated support',
      'Enterprise security',
      'Advanced analytics',
      'Full API access',
      'Custom integrations',
      'SLA guarantees',
      'On-premise option'
    ],
    isEnterprise: true,
    limits: {
      users: -1,
      sessions: -1,
      storage: 'Unlimited',
      support: 'Dedicated'
    },
    cta: 'Contact Sales'
  }
];

// Mock Team Members
export const mockTeamMembers: TeamMember[] = [
  {
    id: 'team_001',
    name: 'Sarah Johnson',
    role: 'CEO & Co-Founder',
    bio: 'Former VP of Product at Stripe with 15+ years in fintech. Passionate about transforming customer experiences through technology.',
    avatar: '/api/placeholder/80/80',
    linkedin: 'https://linkedin.com/in/sarahjohnson',
    twitter: 'https://twitter.com/sarahjohnson',
    expertise: ['Product Strategy', 'Fintech', 'Customer Experience'],
    experience: '15+ years'
  },
  {
    id: 'team_002',
    name: 'Michael Chen',
    role: 'CTO & Co-Founder',
    bio: 'Ex-Google engineer and AI/ML specialist with 12+ years experience. Led teams building scalable systems for millions of users.',
    avatar: '/api/placeholder/80/80',
    linkedin: 'https://linkedin.com/in/michaelchen',
    twitter: 'https://twitter.com/michaelchen',
    expertise: ['AI/ML', 'Scalable Systems', 'Engineering Leadership'],
    experience: '12+ years'
  },
  {
    id: 'team_003',
    name: 'Emily Rodriguez',
    role: 'VP of Sales',
    bio: 'Former Director of Enterprise Sales at HubSpot. Expert in B2B sales and customer success with proven track record.',
    avatar: '/api/placeholder/80/80',
    linkedin: 'https://linkedin.com/in/emilyrodriguez',
    twitter: 'https://twitter.com/emilyrodriguez',
    expertise: ['Enterprise Sales', 'Customer Success', 'B2B'],
    experience: '10+ years'
  },
  {
    id: 'team_004',
    name: 'David Kim',
    role: 'VP of Engineering',
    bio: 'Led engineering teams at Airbnb and Uber. Expert in building high-performance, scalable applications.',
    avatar: '/api/placeholder/80/80',
    linkedin: 'https://linkedin.com/in/davidkim',
    twitter: 'https://twitter.com/davidkim',
    expertise: ['Engineering Leadership', 'Scalable Architecture', 'Performance'],
    experience: '14+ years'
  }
];

// Mock Milestones
export const mockMilestones: Milestone[] = [
  {
    id: 'milestone_001',
    date: 'January 2024',
    title: 'Company Founded',
    description: 'OnboardIQ established with founding team and initial vision',
    category: 'product',
    impact: 'Foundation established'
  },
  {
    id: 'milestone_002',
    date: 'March 2024',
    title: 'MVP Launch',
    description: 'First version of platform launched with core features',
    category: 'product',
    impact: 'First customers onboarded'
  },
  {
    id: 'milestone_003',
    date: 'May 2024',
    title: 'Seed Funding',
    description: 'Successfully raised $2.5M in seed funding',
    category: 'funding',
    impact: 'Team expansion and product development'
  },
  {
    id: 'milestone_004',
    date: 'July 2024',
    title: 'First 100 Customers',
    description: 'Reached 100 paying customers milestone',
    category: 'growth',
    impact: 'Product-market fit validated'
  },
  {
    id: 'milestone_005',
    date: 'September 2024',
    title: 'Enterprise Partnerships',
    description: 'Strategic partnerships with major enterprise customers',
    category: 'partnership',
    impact: 'Enterprise market entry'
  },
  {
    id: 'milestone_006',
    date: 'December 2024',
    title: 'Series A Target',
    description: 'Targeting $8.5M Series A funding round',
    category: 'funding',
    impact: 'International expansion'
  }
];

// Mock Company Stats
export const mockCompanyStats = {
  customers: 1250,
  countries: 15,
  teamMembers: 45,
  satisfactionRate: 95,
  uptime: 99.9,
  responseTime: '2.3s'
};

// Mock Integration Partners
export const mockIntegrationPartners = [
  {
    name: 'Salesforce',
    logo: '/api/placeholder/120/60',
    description: 'CRM Integration',
    status: 'active'
  },
  {
    name: 'HubSpot',
    logo: '/api/placeholder/120/60',
    description: 'Marketing Automation',
    status: 'active'
  },
  {
    name: 'Slack',
    logo: '/api/placeholder/120/60',
    description: 'Team Communication',
    status: 'active'
  },
  {
    name: 'Zapier',
    logo: '/api/placeholder/120/60',
    description: 'Workflow Automation',
    status: 'active'
  },
  {
    name: 'Stripe',
    logo: '/api/placeholder/120/60',
    description: 'Payment Processing',
    status: 'active'
  },
  {
    name: 'Intercom',
    logo: '/api/placeholder/120/60',
    description: 'Customer Support',
    status: 'active'
  }
];

// Mock Blog Posts
export const mockBlogPosts = [
  {
    id: 'post_001',
    title: 'The Future of Customer Onboarding: AI-Powered Personalization',
    excerpt: 'Discover how artificial intelligence is revolutionizing customer onboarding by creating personalized experiences that adapt to individual user behavior and preferences.',
    author: 'Sarah Johnson',
    date: '2024-01-15',
    readTime: '5 min read',
    category: 'AI & Automation',
    featured: true
  },
  {
    id: 'post_002',
    title: 'Multi-Channel Onboarding: Why SMS, Email, and Video Matter',
    excerpt: 'Learn why successful onboarding requires a multi-channel approach and how to implement effective communication strategies across different platforms.',
    author: 'Michael Chen',
    date: '2024-01-12',
    readTime: '4 min read',
    category: 'Multi-Channel',
    featured: false
  },
  {
    id: 'post_003',
    title: 'Compliance Automation: Reducing Risk in Customer Onboarding',
    excerpt: 'Explore how automated compliance processes can reduce risk, improve audit trails, and ensure regulatory requirements are met consistently.',
    author: 'Emily Rodriguez',
    date: '2024-01-10',
    readTime: '6 min read',
    category: 'Compliance',
    featured: false
  }
];

// Utility functions for generating mock data
export const generateMockUser = (): User => ({
  id: `user_${Math.random().toString(36).substr(2, 9)}`,
  name: 'New User',
  email: 'newuser@example.com',
  phone: '+1 (555) 000-0000',
  company: 'Example Corp',
  role: 'User',
  status: 'pending',
  createdAt: new Date().toISOString(),
  avatar: '/api/placeholder/80/80',
  onboardingProgress: 0,
  lastActivity: new Date().toISOString()
});

export const generateMockDocument = (type: Document['type'], recipient: User): Document => ({
  id: `doc_${Math.random().toString(36).substr(2, 9)}`,
  title: `New ${type.replace('_', ' ')} Document`,
  type,
  status: 'draft',
  fileSize: '1.0 MB',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  recipient,
  template: type,
  metadata: {
    pages: 5,
    wordCount: 1000,
    hasSignature: false,
    isEncrypted: false
  }
});

export const generateMockVideoSession = (host: User, participants: User[]): VideoSession => ({
  id: `sess_${Math.random().toString(36).substr(2, 9)}`,
  title: 'New Video Session',
  description: 'Scheduled video onboarding session',
  status: 'scheduled',
  startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
  duration: 60,
  participants,
  host,
  tags: ['onboarding', 'new'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

// Export all mock data
export default {
  users: mockUsers,
  videoSessions: mockVideoSessions,
  documents: mockDocuments,
  analytics: mockAnalytics,
  testimonials: mockTestimonials,
  pricingPlans: mockPricingPlans,
  teamMembers: mockTeamMembers,
  milestones: mockMilestones,
  companyStats: mockCompanyStats,
  integrationPartners: mockIntegrationPartners,
  blogPosts: mockBlogPosts,
  generateMockUser,
  generateMockDocument,
  generateMockVideoSession
};
