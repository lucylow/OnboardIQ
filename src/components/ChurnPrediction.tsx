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
  EyeOff,
  Target,
  Shield,
  Zap,
  Calendar,
  Filter
} from 'lucide-react';
import { aiAPI } from '@/services/api';

interface ChurnPredictionData {
  churnRisk: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  keyFactors: Array<{
    factor: string;
    impact: number;
    description: string;
  }>;
  confidence: number;
  recommendations: Array<{
    action: string;
    priority: 'low' | 'medium' | 'high';
    impact: number;
    description: string;
  }>;
  features: {
    engagementScore: number;
    usageFrequency: number;
    supportTickets: number;
    paymentHistory: number;
    featureAdoption: number;
  };
  historicalData: Array<{
    date: string;
    churnRisk: number;
    userCount: number;
  }>;
  userSegments: Array<{
    segment: string;
    churnRisk: number;
    userCount: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  }>;
}

const ChurnPrediction: React.FC = () => {
  const [data, setData] = useState<ChurnPredictionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [selectedSegment, setSelectedSegment] = useState<string>('all');

  const fetchChurnData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock data for demonstration - in production this would call the backend
      const mockData: ChurnPredictionData = {
        churnRisk: 0.23,
        riskLevel: 'medium',
        keyFactors: [
          {
            factor: 'Low Feature Adoption',
            impact: 0.35,
            description: 'Users not utilizing core features effectively'
          },
          {
            factor: 'Support Ticket Volume',
            impact: 0.28,
            description: 'High number of unresolved support requests'
          },
          {
            factor: 'Payment Delays',
            impact: 0.22,
            description: 'Multiple late payments in recent months'
          },
          {
            factor: 'Session Duration',
            impact: 0.15,
            description: 'Declining average session time'
          }
        ],
        confidence: 0.87,
        recommendations: [
          {
            action: 'Implement Onboarding Optimization',
            priority: 'high',
            impact: 0.25,
            description: 'Improve feature discovery and usage guidance'
          },
          {
            action: 'Enhance Support Response',
            priority: 'high',
            impact: 0.20,
            description: 'Reduce response time and improve resolution rate'
          },
          {
            action: 'Payment Reminder Campaign',
            priority: 'medium',
            impact: 0.15,
            description: 'Proactive payment reminders and flexible options'
          },
          {
            action: 'Engagement Gamification',
            priority: 'medium',
            impact: 0.12,
            description: 'Add rewards and progress tracking'
          }
        ],
        features: {
          engagementScore: 0.65,
          usageFrequency: 0.72,
          supportTickets: 0.45,
          paymentHistory: 0.78,
          featureAdoption: 0.58
        },
        historicalData: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          churnRisk: 0.20 + Math.random() * 0.15,
          userCount: 1000 + Math.floor(Math.random() * 200)
        })),
        userSegments: [
          {
            segment: 'Premium Users',
            churnRisk: 0.15,
            userCount: 250,
            trend: 'decreasing'
          },
          {
            segment: 'Standard Users',
            churnRisk: 0.28,
            userCount: 450,
            trend: 'increasing'
          },
          {
            segment: 'Free Users',
            churnRisk: 0.35,
            userCount: 300,
            trend: 'stable'
          }
        ]
      };

      setData(mockData);
    } catch (err) {
      setError('Failed to fetch churn prediction data');
      console.error('Churn prediction fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChurnData();
    const interval = setInterval(fetchChurnData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [selectedTimeframe, selectedSegment]);

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'decreasing': return <TrendingDown className="h-4 w-4 text-green-500" />;
      case 'stable': return <Activity className="h-4 w-4 text-blue-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600" />
          <p>Loading churn prediction data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-600" />
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchChurnData} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Churn Prediction Analytics</h1>
        <p className="text-gray-600">AI-powered insights to predict and prevent customer churn</p>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Churn Risk</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(data.churnRisk * 100).toFixed(1)}%</div>
            <Badge className={`mt-2 ${getRiskLevelColor(data.riskLevel)}`}>
              {data.riskLevel.toUpperCase()} RISK
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">
              Confidence: {(data.confidence * 100).toFixed(0)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(data.features.engagementScore * 100).toFixed(0)}%</div>
            <Progress value={data.features.engagementScore * 100} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Based on user activity patterns
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Feature Adoption</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(data.features.featureAdoption * 100).toFixed(0)}%</div>
            <Progress value={data.features.featureAdoption * 100} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Core features utilization
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Support Health</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(data.features.supportTickets * 100).toFixed(0)}%</div>
            <Progress value={data.features.supportTickets * 100} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Ticket resolution rate
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="factors">Risk Factors</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="segments">User Segments</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Churn Risk Distribution</CardTitle>
                <CardDescription>Current risk levels across user base</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.userSegments.map((segment) => (
                    <div key={segment.segment} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{segment.segment}</span>
                        {getTrendIcon(segment.trend)}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{(segment.churnRisk * 100).toFixed(1)}%</div>
                        <div className="text-xs text-muted-foreground">{segment.userCount} users</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
                <CardDescription>Performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Usage Frequency</span>
                    <span className="text-sm font-medium">{(data.features.usageFrequency * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Payment History</span>
                    <span className="text-sm font-medium">{(data.features.paymentHistory * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Session Duration</span>
                    <span className="text-sm font-medium">12.3 min</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="factors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Key Risk Factors</CardTitle>
              <CardDescription>Factors contributing to churn risk</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.keyFactors.map((factor, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{factor.factor}</h4>
                      <p className="text-sm text-muted-foreground">{factor.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-red-600">{(factor.impact * 100).toFixed(0)}%</div>
                      <div className="text-xs text-muted-foreground">Impact</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Recommendations</CardTitle>
              <CardDescription>Actionable insights to reduce churn</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium">{rec.action}</h4>
                        <Badge className={getPriorityColor(rec.priority)}>
                          {rec.priority.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">+{(rec.impact * 100).toFixed(0)}%</div>
                      <div className="text-xs text-muted-foreground">Impact</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Segment Analysis</CardTitle>
              <CardDescription>Churn risk by user segments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.userSegments.map((segment) => (
                  <div key={segment.segment} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{segment.segment}</span>
                        {getTrendIcon(segment.trend)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{(segment.churnRisk * 100).toFixed(1)}%</div>
                      <div className="text-sm text-muted-foreground">{segment.userCount} users</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Churn Risk Trends</CardTitle>
              <CardDescription>Historical churn risk over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end space-x-1">
                {data.historicalData.slice(-14).map((point, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-indigo-200 rounded-t"
                    style={{
                      height: `${(point.churnRisk * 100) * 2}px`,
                      minHeight: '4px'
                    }}
                    title={`${point.date}: ${(point.churnRisk * 100).toFixed(1)}%`}
                  />
                ))}
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                Last 14 days churn risk trend
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="mt-8 flex space-x-4">
        <Button onClick={fetchChurnData} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
        <Button>
          <Target className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>
    </div>
  );
};

export default ChurnPrediction;
