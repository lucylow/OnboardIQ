import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  BarChart3,
  Activity,
  Target,
  Smartphone,
  Video,
  FileText,
  MessageSquare
} from 'lucide-react';

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

const AnalyticsDashboard: React.FC = () => {
  const [data, setData] = useState<AnalyticsData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('7d');

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [funnelRes, channelsRes, realtimeRes, atRiskRes, insightsRes] = await Promise.all([
        fetch(`http://localhost:3000/api/analytics/funnel?startDate=${getStartDate()}`),
        fetch(`http://localhost:3000/api/analytics/channels?startDate=${getStartDate()}`),
        fetch('http://localhost:3000/api/analytics/realtime'),
        fetch('http://localhost:3000/api/analytics/at-risk'),
        fetch('http://localhost:3000/api/analytics/insights')
      ]);

      const [funnelData, channelsData, realtimeData, atRiskData, insightsData] = await Promise.all([
        funnelRes.json(),
        channelsRes.json(),
        realtimeRes.json(),
        atRiskRes.json(),
        insightsRes.json()
      ]);

      setData({
        funnel: funnelData.data,
        channels: channelsData.data,
        realtime: realtimeData.data,
        atRisk: atRiskData.data,
        insights: insightsData.data
      });
    } catch (err) {
      setError('Failed to fetch analytics data');
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStartDate = () => {
    const now = new Date();
    switch (timeRange) {
      case '1d':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      default:
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [timeRange]);

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'sms': return <Smartphone className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'email': return <MessageSquare className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getEventTypeLabel = (eventType: string) => {
    return eventType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600" />
          <p>Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-6">
            <AlertTriangle className="h-8 w-8 mx-auto mb-4 text-red-500" />
            <p className="text-red-600">{error}</p>
            <Button onClick={fetchAnalytics} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <div className="flex gap-2">
          {['1d', '7d', '30d'].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users (Last Hour)</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.realtime?.lastHour.uniqueUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              {data.realtime?.lastHour.totalEvents || 0} events
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Active Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.realtime?.lastDay.uniqueUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              {data.realtime?.lastDay.totalEvents || 0} events
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At-Risk Users</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.atRisk?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Success Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.insights?.length ? 
                Math.round(data.insights.reduce((acc, insight) => acc + insight.successRate, 0) / data.insights.length) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Across all events
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="funnel" className="space-y-4">
        <TabsList>
          <TabsTrigger value="funnel">Onboarding Funnel</TabsTrigger>
          <TabsTrigger value="channels">Channel Performance</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="funnel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Onboarding Funnel Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              {data.funnel?.map((step, index) => (
                <div key={step.eventType} className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{getEventTypeLabel(step.eventType)}</span>
                    <Badge variant="secondary">{step.uniqueUsers} users</Badge>
                  </div>
                  <Progress value={(step.uniqueUsers / (data.funnel?.[0]?.uniqueUsers || 1)) * 100} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-1">
                    {step.count} total events
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Channel Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.channels?.map((channel) => (
                  <div key={channel.channel} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {getChannelIcon(channel.channel)}
                      <span className="font-medium capitalize">{channel.channel}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Success Rate</span>
                        <span className="text-sm font-medium">{channel.successRate.toFixed(1)}%</span>
                      </div>
                      <Progress value={channel.successRate} className="h-2" />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{channel.totalEvents} events</span>
                        <span>Avg: {channel.avgProcessingTime?.toFixed(0) || 0}ms</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Automated Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.insights?.map((insight) => (
                  <div key={insight.eventType} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{getEventTypeLabel(insight.eventType)}</span>
                      <Badge variant={insight.successRate > 90 ? "default" : insight.successRate > 70 ? "secondary" : "destructive"}>
                        {insight.successRate.toFixed(1)}% success
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {insight.total} total events
                    </div>
                    {insight.successRate < 90 && (
                      <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-sm text-yellow-800">
                          ⚠️ This event type has a lower success rate than expected. Consider investigating.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* At-Risk Users */}
      {data.atRisk && data.atRisk.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>At-Risk Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.atRisk.slice(0, 5).map((user) => (
                <div key={user._id} className="flex justify-between items-center p-2 border rounded">
                  <span className="font-mono text-sm">{user._id}</span>
                  <span className="text-sm text-muted-foreground">
                    Signed up {new Date(user.signupTime).toLocaleDateString()}
                  </span>
                </div>
              ))}
              {data.atRisk.length > 5 && (
                <p className="text-sm text-muted-foreground text-center">
                  ... and {data.atRisk.length - 5} more users
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
