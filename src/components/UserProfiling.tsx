import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  Brain, 
  TrendingUp, 
  Clock, 
  Target, 
  BarChart3, 
  Activity,
  Eye,
  MousePointer,
  Keyboard,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Calendar,
  MapPin,
  Settings,
  RefreshCw,
  Download,
  Share2,
  Monitor
} from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  lastActive: string;
  totalSessions: number;
  averageSessionDuration: number;
  preferredDevice: string;
  timezone: string;
  language: string;
}

interface BehaviorMetrics {
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  preferredPace: 'slow' | 'moderate' | 'fast';
  featureEngagement: Record<string, number>;
  sessionPatterns: {
    morning: number;
    afternoon: number;
    evening: number;
    night: number;
  };
  deviceUsage: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  interactionStyle: {
    clicks: number;
    scrolls: number;
    formSubmissions: number;
    helpRequests: number;
  };
}

interface AIInsight {
  id: string;
  category: string;
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  recommendations: string[];
}

const UserProfiling: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'user_123',
    name: 'Sarah Chen',
    email: 'sarah.chen@techcorp.com',
    joinDate: '2024-01-15',
    lastActive: '2024-09-03T19:47:00Z',
    totalSessions: 234,
    averageSessionDuration: 28,
    preferredDevice: 'Desktop',
    timezone: 'America/New_York',
    language: 'English'
  });

  const [behaviorMetrics, setBehaviorMetrics] = useState<BehaviorMetrics>({
    learningStyle: 'visual',
    preferredPace: 'moderate',
    featureEngagement: {
      'dashboard': 67,
      'analytics': 89,
      'onboarding': 34,
      'security': 56,
      'documents': 78,
      'settings': 23,
      'reports': 45,
      'integrations': 12,
      'notifications': 38,
      'help': 15
    },
    sessionPatterns: {
      morning: 15,
      afternoon: 55,
      evening: 25,
      night: 5
    },
    deviceUsage: {
      desktop: 82,
      mobile: 15,
      tablet: 3
    },
    interactionStyle: {
      clicks: 2847,
      scrolls: 1567,
      formSubmissions: 89,
      helpRequests: 23
    }
  });

  const [aiInsights, setAiInsights] = useState<AIInsight[]>([
    {
      id: 'insight_1',
      category: 'Learning Pattern',
      title: 'Visual Learner with Moderate Pace',
      description: 'Sarah shows strong preference for visual content and learns best at a moderate pace with regular breaks. She frequently engages with charts, graphs, and visual data representations.',
      confidence: 94,
      impact: 'high',
      recommendations: [
        'Prioritize video tutorials and interactive infographics',
        'Break complex tasks into smaller, visual steps',
        'Provide visual progress indicators and completion badges',
        'Offer visual data export options (charts, graphs)'
      ]
    },
    {
      id: 'insight_2',
      category: 'Engagement Pattern',
      title: 'Afternoon Peak Activity (2-5 PM)',
      description: 'Sarah is most active during afternoon hours with 55% of sessions occurring between 2-5 PM. She shows highest engagement and productivity during this time window.',
      confidence: 89,
      impact: 'high',
      recommendations: [
        'Schedule important notifications and updates for 2-3 PM',
        'Offer afternoon-focused learning sessions and webinars',
        'Optimize content delivery timing for peak engagement',
        'Consider timezone-aware feature rollouts'
      ]
    },
    {
      id: 'insight_3',
      category: 'Feature Preference',
      title: 'Analytics & Document Power User',
      description: 'Sarah frequently accesses analytics (89 visits) and document features (78 visits), showing strong interest in data-driven insights and document management.',
      confidence: 91,
      impact: 'high',
      recommendations: [
        'Highlight advanced analytics features and custom reports',
        'Provide personalized data insights and trend analysis',
        'Offer analytics-focused training and best practices',
        'Introduce document automation and workflow features'
      ]
    },
    {
      id: 'insight_4',
      category: 'Device Usage',
      title: 'Desktop-First Professional',
      description: 'Sarah primarily uses desktop (82%) for complex tasks, with mobile usage focused on quick checks and notifications.',
      confidence: 87,
      impact: 'medium',
      recommendations: [
        'Optimize desktop experience for complex workflows',
        'Ensure mobile features support quick actions',
        'Provide seamless cross-device synchronization',
        'Offer desktop-specific productivity shortcuts'
      ]
    },
    {
      id: 'insight_5',
      category: 'Interaction Style',
      title: 'High Engagement, Low Help Dependency',
      description: 'Sarah has high interaction rates (2,847 clicks) but low help requests (23), indicating self-sufficient usage patterns.',
      confidence: 83,
      impact: 'medium',
      recommendations: [
        'Provide advanced self-service options and documentation',
        'Offer power user features and shortcuts',
        'Implement contextual help for complex features',
        'Consider beta testing new features with this user type'
      ]
    },
    {
      id: 'insight_6',
      category: 'Security Awareness',
      title: 'Security-Conscious User',
      description: 'Sarah frequently accesses security features (56 visits), indicating strong awareness of security best practices.',
      confidence: 85,
      impact: 'medium',
      recommendations: [
        'Highlight advanced security features and compliance tools',
        'Provide security-focused training and best practices',
        'Offer security audit and assessment features',
        'Implement security-focused notifications and alerts'
      ]
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Additional mock data for recent activity
  const [recentActivity] = useState([
    {
      id: 'activity_1',
      type: 'feature_access',
      feature: 'Analytics Dashboard',
      timestamp: '2024-09-03T19:30:00Z',
      duration: 15,
      description: 'Viewed monthly performance report'
    },
    {
      id: 'activity_2',
      type: 'document_created',
      feature: 'Document Generator',
      timestamp: '2024-09-03T18:45:00Z',
      duration: 8,
      description: 'Generated quarterly business report'
    },
    {
      id: 'activity_3',
      type: 'security_check',
      feature: 'Security Settings',
      timestamp: '2024-09-03T17:20:00Z',
      duration: 5,
      description: 'Updated two-factor authentication'
    },
    {
      id: 'activity_4',
      type: 'onboarding_completed',
      feature: 'Onboarding',
      timestamp: '2024-09-03T16:10:00Z',
      duration: 12,
      description: 'Completed advanced features tutorial'
    },
    {
      id: 'activity_5',
      type: 'report_exported',
      feature: 'Reports',
      timestamp: '2024-09-03T15:30:00Z',
      duration: 3,
      description: 'Exported user engagement metrics'
    }
  ]);

  const [trends] = useState({
    weeklyGrowth: 12.5,
    monthlyGrowth: 8.3,
    featureAdoption: {
      'analytics': '+15%',
      'documents': '+22%',
      'security': '+8%',
      'onboarding': '+5%'
    },
    engagementTrend: 'increasing',
    retentionRate: 94.2,
    satisfactionScore: 8.7
  });

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLastUpdated(new Date());
    setIsLoading(false);
  };

  const exportProfile = () => {
    const data = {
      userProfile,
      behaviorMetrics,
      aiInsights,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `user-profile-${userProfile.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getLearningStyleColor = (style: string) => {
    const colors = {
      visual: 'bg-blue-100 text-blue-800',
      auditory: 'bg-green-100 text-green-800',
      kinesthetic: 'bg-purple-100 text-purple-800',
      reading: 'bg-orange-100 text-orange-800'
    };
    return colors[style as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPaceColor = (pace: string) => {
    const colors = {
      slow: 'bg-yellow-100 text-yellow-800',
      moderate: 'bg-blue-100 text-blue-800',
      fast: 'bg-red-100 text-red-800'
    };
    return colors[pace as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              User Profiling & Behavior Analysis
            </h1>
            <p className="text-lg text-gray-600">
              AI-powered insights into user behavior patterns and preferences
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={refreshData}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" onClick={exportProfile}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button>
              <Share2 className="h-4 w-4 mr-2" />
              Share Insights
            </Button>
          </div>
        </div>

        {/* Last Updated */}
        <div className="mb-6">
          <p className="text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleString()}
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="behavior">Behavior Analysis</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="patterns">Usage Patterns</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* User Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  User Profile
                </CardTitle>
                <CardDescription>
                  Basic user information and account details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-lg font-semibold">{userProfile.name}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-lg">{userProfile.email}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Member Since</label>
                    <p className="text-lg">{new Date(userProfile.joinDate).toLocaleDateString()}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Total Sessions</label>
                    <p className="text-lg font-semibold text-blue-600">{userProfile.totalSessions}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Avg Session Duration</label>
                    <p className="text-lg font-semibold text-green-600">{userProfile.averageSessionDuration} min</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Preferred Device</label>
                    <p className="text-lg">{userProfile.preferredDevice}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Learning Style</p>
                      <p className="text-2xl font-bold text-blue-600 capitalize">{behaviorMetrics.learningStyle}</p>
                    </div>
                    <Brain className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Preferred Pace</p>
                      <p className="text-2xl font-bold text-green-600 capitalize">{behaviorMetrics.preferredPace}</p>
                    </div>
                    <Clock className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Engagement Score</p>
                      <p className="text-2xl font-bold text-purple-600">8.4/10</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Retention Rate</p>
                      <p className="text-2xl font-bold text-orange-600">94%</p>
                    </div>
                    <Target className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="behavior" className="space-y-6">
            {/* Feature Engagement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Feature Engagement
                </CardTitle>
                <CardDescription>
                  How often the user interacts with different features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(behaviorMetrics.featureEngagement).map(([feature, count]) => (
                    <div key={feature} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                        <span className="font-medium capitalize">{feature}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-32">
                          <Progress value={(count / 50) * 100} className="h-2" />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Interaction Style */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MousePointer className="h-5 w-5" />
                  Interaction Patterns
                </CardTitle>
                <CardDescription>
                  Detailed breakdown of user interaction behavior
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {behaviorMetrics.interactionStyle.clicks}
                    </div>
                    <div className="text-sm text-gray-500">Total Clicks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      {behaviorMetrics.interactionStyle.scrolls}
                    </div>
                    <div className="text-sm text-gray-500">Scroll Events</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-2">
                      {behaviorMetrics.interactionStyle.formSubmissions}
                    </div>
                    <div className="text-sm text-gray-500">Form Submissions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600 mb-2">
                      {behaviorMetrics.interactionStyle.helpRequests}
                    </div>
                    <div className="text-sm text-gray-500">Help Requests</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            {/* AI Insights */}
            <div className="space-y-6">
              {aiInsights.map((insight) => (
                <Card key={insight.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Brain className="h-5 w-5 text-purple-600" />
                        <div>
                          <CardTitle className="text-lg">{insight.title}</CardTitle>
                          <CardDescription>{insight.category}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={insight.impact === 'high' ? 'destructive' : insight.impact === 'medium' ? 'default' : 'secondary'}>
                          {insight.impact} impact
                        </Badge>
                        <Badge variant="outline">
                          {insight.confidence}% confidence
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{insight.description}</p>
                    <div>
                      <h4 className="font-medium mb-2">Recommendations:</h4>
                      <ul className="space-y-1">
                        {insight.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="patterns" className="space-y-6">
            {/* Session Patterns */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Session Patterns
                </CardTitle>
                <CardDescription>
                  When the user is most active throughout the day
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600 mb-1">
                      {behaviorMetrics.sessionPatterns.morning}%
                    </div>
                    <div className="text-sm text-gray-600">Morning</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {behaviorMetrics.sessionPatterns.afternoon}%
                    </div>
                    <div className="text-sm text-gray-600">Afternoon</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      {behaviorMetrics.sessionPatterns.evening}%
                    </div>
                    <div className="text-sm text-gray-600">Evening</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-600 mb-1">
                      {behaviorMetrics.sessionPatterns.night}%
                    </div>
                    <div className="text-sm text-gray-600">Night</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Device Usage */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Device Usage
                </CardTitle>
                <CardDescription>
                  Distribution of usage across different devices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-4">
                    <Monitor className="h-8 w-8 text-blue-600" />
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Desktop</span>
                        <span className="text-sm font-medium">{behaviorMetrics.deviceUsage.desktop}%</span>
                      </div>
                      <Progress value={behaviorMetrics.deviceUsage.desktop} className="h-2" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Smartphone className="h-8 w-8 text-green-600" />
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Mobile</span>
                        <span className="text-sm font-medium">{behaviorMetrics.deviceUsage.mobile}%</span>
                      </div>
                      <Progress value={behaviorMetrics.deviceUsage.mobile} className="h-2" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Tablet className="h-8 w-8 text-purple-600" />
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Tablet</span>
                        <span className="text-sm font-medium">{behaviorMetrics.deviceUsage.tablet}%</span>
                      </div>
                      <Progress value={behaviorMetrics.deviceUsage.tablet} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Latest user actions and feature interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">{activity.description}</p>
                          <p className="text-sm text-gray-500">{activity.feature}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{activity.duration} min</p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trends and Growth */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Growth Trends
                </CardTitle>
                <CardDescription>
                  User engagement and feature adoption trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      +{trends.weeklyGrowth}%
                    </div>
                    <div className="text-sm text-gray-500">Weekly Growth</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      +{trends.monthlyGrowth}%
                    </div>
                    <div className="text-sm text-gray-500">Monthly Growth</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      {trends.retentionRate}%
                    </div>
                    <div className="text-sm text-gray-500">Retention Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600 mb-1">
                      {trends.satisfactionScore}/10
                    </div>
                    <div className="text-sm text-gray-500">Satisfaction Score</div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium mb-3">Feature Adoption Trends</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(trends.featureAdoption).map(([feature, growth]) => (
                      <div key={feature} className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-semibold text-green-600 mb-1">
                          {growth}
                        </div>
                        <div className="text-sm text-gray-600 capitalize">{feature}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfiling;
