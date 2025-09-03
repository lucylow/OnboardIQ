import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  BarChart3,
  PieChart,
  LineChart,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  conversionRate: number;
  avgOnboardingTime: number;
  churnRate: number;
  securityAlerts: number;
  documentGenerated: number;
  videoSessions: number;
  smsSent: number;
  realTimeEvents: Array<{
    id: string;
    type: 'user_signup' | 'verification' | 'document_gen' | 'video_session' | 'security_alert';
    timestamp: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }>;
  hourlyStats: Array<{
    hour: string;
    signups: number;
    verifications: number;
    documents: number;
  }>;
  userSegments: Array<{
    segment: string;
    count: number;
    percentage: number;
  }>;
}

const RealTimeAnalytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLive, setIsLive] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5000);
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');

  // Mock real-time data generation
  useEffect(() => {
    const generateMockData = (): AnalyticsData => ({
      totalUsers: 1247 + Math.floor(Math.random() * 50),
      activeUsers: 89 + Math.floor(Math.random() * 20),
      conversionRate: 78.5 + (Math.random() - 0.5) * 5,
      avgOnboardingTime: 12.3 + (Math.random() - 0.5) * 2,
      churnRate: 3.2 + (Math.random() - 0.5) * 1,
      securityAlerts: 2 + Math.floor(Math.random() * 3),
      documentGenerated: 156 + Math.floor(Math.random() * 10),
      videoSessions: 23 + Math.floor(Math.random() * 5),
      smsSent: 89 + Math.floor(Math.random() * 15),
      realTimeEvents: [
        {
          id: `event-${Date.now()}`,
          type: 'user_signup',
          timestamp: new Date().toISOString(),
          description: 'New user registered from marketing campaign',
          severity: 'low'
        },
        {
          id: `event-${Date.now() + 1}`,
          type: 'verification',
          timestamp: new Date().toISOString(),
          description: 'Phone verification completed successfully',
          severity: 'low'
        },
        {
          id: `event-${Date.now() + 2}`,
          type: 'document_gen',
          timestamp: new Date().toISOString(),
          description: 'Welcome packet generated for premium user',
          severity: 'low'
        },
        {
          id: `event-${Date.now() + 3}`,
          type: 'security_alert',
          timestamp: new Date().toISOString(),
          description: 'Suspicious login attempt detected',
          severity: 'high'
        }
      ],
      hourlyStats: Array.from({ length: 24 }, (_, i) => ({
        hour: `${i.toString().padStart(2, '0')}:00`,
        signups: Math.floor(Math.random() * 10),
        verifications: Math.floor(Math.random() * 15),
        documents: Math.floor(Math.random() * 8)
      })),
      userSegments: [
        { segment: 'Premium', count: 456, percentage: 36.5 },
        { segment: 'Enterprise', count: 234, percentage: 18.8 },
        { segment: 'Free Tier', count: 557, percentage: 44.7 }
      ]
    });

    setData(generateMockData());

    if (isLive) {
      const interval = setInterval(() => {
        setData(generateMockData());
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [isLive, refreshInterval]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'user_signup': return <Users className="h-4 w-4" />;
      case 'verification': return <CheckCircle className="h-4 w-4" />;
      case 'document_gen': return <BarChart3 className="h-4 w-4" />;
      case 'video_session': return <Activity className="h-4 w-4" />;
      case 'security_alert': return <AlertCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (!data) return <div>Loading analytics...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Real-Time Analytics</h1>
          <p className="text-muted-foreground">Live insights into your onboarding performance</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant={isLive ? "default" : "outline"}
            onClick={() => setIsLive(!isLive)}
            className="flex items-center space-x-2"
          >
            {isLive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            <span>{isLive ? 'Live' : 'Paused'}</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => setData({ ...data, realTimeEvents: [...data.realTimeEvents] })}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 text-green-500" /> +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 text-green-500" /> +8% from last hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 text-green-500" /> +2.3% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Onboarding Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.avgOnboardingTime.toFixed(1)}m</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="inline h-3 w-3 text-green-500" /> -15% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="realtime" className="space-y-4">
        <TabsList>
          <TabsTrigger value="realtime">Real-Time Events</TabsTrigger>
          <TabsTrigger value="hourly">Hourly Trends</TabsTrigger>
          <TabsTrigger value="segments">User Segments</TabsTrigger>
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="realtime" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Live Activity Feed</CardTitle>
              <CardDescription>Real-time events from the last 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.realTimeEvents.slice(0, 10).map((event) => (
                  <div key={event.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${getSeverityColor(event.severity)}`} />
                    <div className="flex items-center space-x-2">
                      {getEventIcon(event.type)}
                      <span className="text-sm font-medium">{event.description}</span>
                    </div>
                    <Badge variant="outline" className="ml-auto">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hourly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hourly Activity Trends</CardTitle>
              <CardDescription>24-hour activity breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.hourlyStats.map((stat, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-16 text-sm font-medium">{stat.hour}</div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">Signups:</span>
                        <Progress value={(stat.signups / 10) * 100} className="w-20" />
                        <span className="text-xs">{stat.signups}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">Verifications:</span>
                        <Progress value={(stat.verifications / 15) * 100} className="w-20" />
                        <span className="text-xs">{stat.verifications}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">Documents:</span>
                        <Progress value={(stat.documents / 8) * 100} className="w-20" />
                        <span className="text-xs">{stat.documents}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Segmentation</CardTitle>
              <CardDescription>Distribution of users across segments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.userSegments.map((segment) => (
                  <div key={segment.segment} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full bg-blue-500" />
                      <span className="font-medium">{segment.segment}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress value={segment.percentage} className="w-24" />
                      <span className="text-sm text-muted-foreground">
                        {segment.count} ({segment.percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Metrics</CardTitle>
                <CardDescription>Security and compliance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Security Alerts</span>
                  <Badge variant={data.securityAlerts > 0 ? "destructive" : "default"}>
                    {data.securityAlerts}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Churn Rate</span>
                  <span className="text-sm font-medium">{data.churnRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Verification Success</span>
                  <span className="text-sm font-medium text-green-600">98.5%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Communication Metrics</CardTitle>
                <CardDescription>Multi-channel communication stats</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">SMS Sent</span>
                  <span className="text-sm font-medium">{data.smsSent}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Video Sessions</span>
                  <span className="text-sm font-medium">{data.videoSessions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Documents Generated</span>
                  <span className="text-sm font-medium">{data.documentGenerated}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RealTimeAnalytics;
