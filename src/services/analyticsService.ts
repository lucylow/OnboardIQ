// Mock Analytics Service for MVP POC
import { faker } from '@faker-js/faker';

// Types matching the AnalyticsDashboard component interface
interface AnalyticsData {
  funnel?: Array<{
    eventType: string;
    count: number;
    uniqueUsers: number;
  }>;
  channels?: Array<{
    channel: string;
    totalEvents: number;
    successRate: number;
    avgProcessingTime: number;
  }>;
  realtime?: {
    lastHour: {
      totalEvents: number;
      uniqueUsers: number;
    };
    lastDay: {
      totalEvents: number;
      uniqueUsers: number;
    };
  };
  atRisk?: Array<{
    _id: string;
    signupTime: string;
  }>;
  insights?: Array<{
    eventType: string;
    total: number;
    successRate: number;
  }>;
}

// Mock analytics data generator
const generateMockAnalyticsData = (): AnalyticsData => {
  // Generate funnel data
  const funnelSteps = [
    'user_signup',
    'profile_completion',
    'document_upload',
    'verification_complete',
    'onboarding_finished'
  ];
  
  const funnel = funnelSteps.map((step, index) => {
    const baseUsers = 1000;
    const dropoffRate = 0.85; // 15% dropoff between steps
    const uniqueUsers = Math.floor(baseUsers * Math.pow(dropoffRate, index));
    const count = uniqueUsers + faker.number.int({ min: 0, max: 50 }); // Some users have multiple events
    
    return {
      eventType: step,
      count,
      uniqueUsers
    };
  });

  // Generate channel performance data
  const channels = [
    { channel: 'sms', baseSuccessRate: 0.92, baseEvents: 2500 },
    { channel: 'email', baseSuccessRate: 0.88, baseEvents: 1800 },
    { channel: 'video', baseSuccessRate: 0.95, baseEvents: 800 },
    { channel: 'document', baseSuccessRate: 0.89, baseEvents: 1200 }
  ].map(ch => ({
    channel: ch.channel,
    totalEvents: ch.baseEvents + faker.number.int({ min: -100, max: 100 }),
    successRate: ch.baseSuccessRate + faker.number.float({ min: -0.05, max: 0.05 }),
    avgProcessingTime: faker.number.float({ min: 0.5, max: 3.0 })
  }));

  // Generate real-time data
  const realtime = {
    lastHour: {
      totalEvents: faker.number.int({ min: 50, max: 200 }),
      uniqueUsers: faker.number.int({ min: 30, max: 120 })
    },
    lastDay: {
      totalEvents: faker.number.int({ min: 800, max: 2000 }),
      uniqueUsers: faker.number.int({ min: 400, max: 1000 })
    }
  };

  // Generate at-risk users
  const atRisk = Array.from({ length: faker.number.int({ min: 5, max: 15 }) }, () => ({
    _id: faker.string.uuid(),
    signupTime: faker.date.recent({ days: 30 }).toISOString()
  }));

  // Generate insights
  const insights = [
    { eventType: 'user_signup', baseTotal: 1200, baseSuccessRate: 0.95 },
    { eventType: 'profile_completion', baseTotal: 1000, baseSuccessRate: 0.88 },
    { eventType: 'document_upload', baseTotal: 850, baseSuccessRate: 0.92 },
    { eventType: 'verification_complete', baseTotal: 750, baseSuccessRate: 0.89 },
    { eventType: 'onboarding_finished', baseTotal: 650, baseSuccessRate: 0.94 }
  ].map(insight => ({
    eventType: insight.eventType,
    total: insight.baseTotal + faker.number.int({ min: -50, max: 50 }),
    successRate: insight.baseSuccessRate + faker.number.float({ min: -0.03, max: 0.03 })
  }));

  return {
    funnel,
    channels,
    realtime,
    atRisk,
    insights
  };
};

// Analytics service class
class AnalyticsService {
  private mockData: AnalyticsData;

  constructor() {
    this.mockData = generateMockAnalyticsData();
  }

  // Simulate API delay
  private async simulateDelay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Fetch funnel data
  async fetchFunnelData(startDate?: string) {
    await this.simulateDelay();
    return {
      success: true,
      data: this.mockData.funnel,
      timestamp: new Date().toISOString()
    };
  }

  // Fetch channel performance data
  async fetchChannelData(startDate?: string) {
    await this.simulateDelay();
    return {
      success: true,
      data: this.mockData.channels,
      timestamp: new Date().toISOString()
    };
  }

  // Fetch real-time data
  async fetchRealtimeData() {
    await this.simulateDelay(300); // Faster for real-time data
    // Update real-time data to simulate live updates
    this.mockData.realtime = {
      lastHour: {
        totalEvents: faker.number.int({ min: 50, max: 200 }),
        uniqueUsers: faker.number.int({ min: 30, max: 120 })
      },
      lastDay: {
        totalEvents: faker.number.int({ min: 800, max: 2000 }),
        uniqueUsers: faker.number.int({ min: 400, max: 1000 })
      }
    };
    
    return {
      success: true,
      data: this.mockData.realtime,
      timestamp: new Date().toISOString()
    };
  }

  // Fetch at-risk users
  async fetchAtRiskData() {
    await this.simulateDelay();
    // Update at-risk users to simulate new users being flagged
    this.mockData.atRisk = Array.from({ length: faker.number.int({ min: 5, max: 15 }) }, () => ({
      _id: faker.string.uuid(),
      signupTime: faker.date.recent({ days: 30 }).toISOString()
    }));
    
    return {
      success: true,
      data: this.mockData.atRisk,
      timestamp: new Date().toISOString()
    };
  }

  // Fetch insights
  async fetchInsightsData() {
    await this.simulateDelay();
    return {
      success: true,
      data: this.mockData.insights,
      timestamp: new Date().toISOString()
    };
  }

  // Fetch all analytics data
  async fetchAllAnalytics(timeRange: string = '7d') {
    await this.simulateDelay();
    
    // Update data based on time range
    const multiplier = timeRange === '1d' ? 0.3 : timeRange === '30d' ? 2.5 : 1;
    
    this.mockData.funnel = this.mockData.funnel?.map(step => ({
      ...step,
      uniqueUsers: Math.floor(step.uniqueUsers * multiplier),
      count: Math.floor(step.count * multiplier)
    }));

    this.mockData.channels = this.mockData.channels?.map(channel => ({
      ...channel,
      totalEvents: Math.floor(channel.totalEvents * multiplier)
    }));

    return {
      success: true,
      data: this.mockData,
      timestamp: new Date().toISOString()
    };
  }

  // Get analytics summary
  getAnalyticsSummary() {
    const totalUsers = this.mockData.funnel?.[0]?.uniqueUsers || 0;
    const activeUsers = this.mockData.realtime?.lastDay.uniqueUsers || 0;
    const completionRate = this.mockData.funnel ? 
      (this.mockData.funnel[this.mockData.funnel.length - 1]?.uniqueUsers / totalUsers) : 0;
    const avgSuccessRate = this.mockData.insights ? 
      this.mockData.insights.reduce((acc, insight) => acc + insight.successRate, 0) / this.mockData.insights.length : 0;

    return {
      totalUsers,
      activeUsers,
      completionRate: Math.round(completionRate * 100),
      avgSuccessRate: Math.round(avgSuccessRate * 100),
      atRiskUsers: this.mockData.atRisk?.length || 0
    };
  }

  // Simulate real-time updates
  simulateRealTimeUpdate() {
    // Update real-time metrics
    this.mockData.realtime!.lastHour.totalEvents += faker.number.int({ min: 1, max: 5 });
    this.mockData.realtime!.lastHour.uniqueUsers += faker.number.int({ min: 0, max: 2 });
    
    return {
      type: 'realtime_update',
      timestamp: new Date().toISOString(),
      data: this.mockData.realtime
    };
  }
}

// Create singleton instance
const analyticsService = new AnalyticsService();

export default analyticsService;
export type { AnalyticsData };
