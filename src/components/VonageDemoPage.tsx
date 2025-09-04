import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  MessageSquare, 
  Phone, 
  Video, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw,
  Users,
  Clock,
  DollarSign,
  BarChart3,
  Zap,
  Mail,
  Smartphone,
  Globe,
  Lock,
  Unlock,
  MessageCircle,
  Play,
  Award,
  Star,
  TrendingUp,
  Activity,
  Code
} from 'lucide-react';
import { vonageApiService } from '@/services/vonageApiService';

interface DemoFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'available' | 'demo' | 'coming-soon';
  category: 'auth' | 'communication';
}

interface LiveDemo {
  id: string;
  title: string;
  description: string;
  action: () => Promise<void>;
  icon: React.ReactNode;
  status: 'idle' | 'running' | 'completed' | 'error';
}

const VonageDemoPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [liveDemos, setLiveDemos] = useState<LiveDemo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const demoFeatures: DemoFeature[] = [
    // Challenge #1: Authentication Features
    {
      id: 'verify',
      title: 'Vonage Verify',
      description: 'Multi-factor authentication with SMS verification codes',
      icon: <Shield className="h-5 w-5" />,
      status: 'available',
      category: 'auth'
    },
    {
      id: 'sim-swap',
      title: 'SIM Swap Detection',
      description: 'Advanced security to detect unauthorized SIM card changes',
      icon: <Smartphone className="h-5 w-5" />,
      status: 'available',
      category: 'auth'
    },
    {
      id: 'insights',
      title: 'Phone Number Insights',
      description: 'Real-time phone number validation and carrier information',
      icon: <Globe className="h-5 w-5" />,
      status: 'available',
      category: 'auth'
    },
    // Challenge #2: Multi-channel Communication Features
    {
      id: 'sms',
      title: 'SMS Messaging',
      description: 'Reliable SMS delivery with delivery receipts',
      icon: <MessageSquare className="h-5 w-5" />,
      status: 'available',
      category: 'communication'
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp Business',
      description: 'Rich messaging through WhatsApp Business API',
      icon: <MessageCircle className="h-5 w-5" />,
      status: 'available',
      category: 'communication'
    },
    {
      id: 'voice',
      title: 'Voice Calls',
      description: 'Text-to-speech and interactive voice responses',
      icon: <Phone className="h-5 w-5" />,
      status: 'available',
      category: 'communication'
    },
    {
      id: 'video',
      title: 'Video Sessions',
      description: 'High-quality video conferencing and recording',
      icon: <Video className="h-5 w-5" />,
      status: 'available',
      category: 'communication'
    },
    {
      id: 'multi-channel',
      title: 'Multi-Channel Orchestration',
      description: 'Unified messaging across multiple channels',
      icon: <Zap className="h-5 w-5" />,
      status: 'available',
      category: 'communication'
    }
  ];

  // Initialize live demos
  useEffect(() => {
    const demos: LiveDemo[] = [
      {
        id: 'verify-demo',
        title: 'Phone Verification Demo',
        description: 'Test the complete verification flow with mock phone number',
        action: async () => {
          setLiveDemos(prev => prev.map(d => 
            d.id === 'verify-demo' ? { ...d, status: 'running' } : d
          ));
          try {
            const result = await vonageApiService.startVerification({
              phoneNumber: '+1234567890',
              brand: 'OnboardIQ Demo',
              codeLength: 6
            });
            setSuccess('Verification code sent! Check the console for details.');
            setLiveDemos(prev => prev.map(d => 
              d.id === 'verify-demo' ? { ...d, status: 'completed' } : d
            ));
          } catch (error) {
            setError('Verification demo failed');
            setLiveDemos(prev => prev.map(d => 
              d.id === 'verify-demo' ? { ...d, status: 'error' } : d
            ));
          }
        },
        icon: <Shield className="h-4 w-4" />,
        status: 'idle'
      },
      {
        id: 'sim-swap-demo',
        title: 'SIM Swap Detection Demo',
        description: 'Simulate SIM swap detection for security testing',
        action: async () => {
          setLiveDemos(prev => prev.map(d => 
            d.id === 'sim-swap-demo' ? { ...d, status: 'running' } : d
          ));
          try {
            const result = await vonageApiService.checkSimSwap({
              phoneNumber: '+1234567890',
              country: 'US'
            });
            setSuccess('SIM swap check completed! No swap detected.');
            setLiveDemos(prev => prev.map(d => 
              d.id === 'sim-swap-demo' ? { ...d, status: 'completed' } : d
            ));
          } catch (error) {
            setError('SIM swap demo failed');
            setLiveDemos(prev => prev.map(d => 
              d.id === 'sim-swap-demo' ? { ...d, status: 'error' } : d
            ));
          }
        },
        icon: <Smartphone className="h-4 w-4" />,
        status: 'idle'
      },
      {
        id: 'multi-channel-demo',
        title: 'Multi-Channel Message Demo',
        description: 'Send a message across SMS, WhatsApp, and Email simultaneously',
        action: async () => {
          setLiveDemos(prev => prev.map(d => 
            d.id === 'multi-channel-demo' ? { ...d, status: 'running' } : d
          ));
          try {
            const result = await vonageApiService.sendMultiChannelMessage({
              recipient: {
                phone: '+1234567890',
                email: 'demo@onboardiq.com'
              },
              channels: ['sms', 'whatsapp'],
              message: 'Welcome to OnboardIQ! This is a multi-channel demo message.',
              options: {
                from: 'OnboardIQ Demo',
                priority: 'normal'
              }
            });
            setSuccess('Multi-channel message sent successfully!');
            setLiveDemos(prev => prev.map(d => 
              d.id === 'multi-channel-demo' ? { ...d, status: 'completed' } : d
            ));
          } catch (error) {
            setError('Multi-channel demo failed');
            setLiveDemos(prev => prev.map(d => 
              d.id === 'multi-channel-demo' ? { ...d, status: 'error' } : d
            ));
          }
        },
        icon: <Zap className="h-4 w-4" />,
        status: 'idle'
      },
      {
        id: 'video-demo',
        title: 'Video Session Demo',
        description: 'Create a video session for customer support',
        action: async () => {
          setLiveDemos(prev => prev.map(d => 
            d.id === 'video-demo' ? { ...d, status: 'running' } : d
          ));
          try {
            const session = await vonageApiService.createVideoSession({
              mediaMode: 'routed',
              archiveMode: 'manual',
              location: 'auto'
            });
            const token = await vonageApiService.generateVideoToken({
              sessionId: session.sessionId,
              role: 'publisher'
            });
            setSuccess(`Video session created! Session ID: ${session.sessionId}`);
            setLiveDemos(prev => prev.map(d => 
              d.id === 'video-demo' ? { ...d, status: 'completed' } : d
            ));
          } catch (error) {
            setError('Video session demo failed');
            setLiveDemos(prev => prev.map(d => 
              d.id === 'video-demo' ? { ...d, status: 'error' } : d
            ));
          }
        },
        icon: <Video className="h-4 w-4" />,
        status: 'idle'
      }
    ];
    setLiveDemos(demos);
  }, []);

  // Load health status and analytics
  useEffect(() => {
    loadHealthStatus();
    loadAnalytics();
  }, []);

  const loadHealthStatus = async () => {
    try {
      const health = await vonageApiService.checkHealth();
      setHealthStatus(health);
    } catch (error) {
      console.error('Failed to load health status:', error);
    }
  };

  const loadAnalytics = async () => {
    try {
      const data = await vonageApiService.getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  const runDemo = async (demoId: string) => {
    const demo = liveDemos.find(d => d.id === demoId);
    if (demo) {
      await demo.action();
    }
  };

  const resetDemos = () => {
    setLiveDemos(prev => prev.map(d => ({ ...d, status: 'idle' })));
    setError('');
    setSuccess('');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Play className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'running':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
            <Award className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Vonage API Challenge Demo</h1>
            <p className="text-lg text-gray-600">Showcasing Enhanced Authentication & Multi-Channel Communication</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-4">
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            <Shield className="h-3 w-3 mr-1" />
            Challenge #1: Authentication
          </Badge>
          <Badge variant="default" className="bg-green-100 text-green-800">
            <MessageSquare className="h-3 w-3 mr-1" />
            Challenge #2: Multi-Channel
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="demos">Live Demos</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Challenge #1 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Challenge #1: Enhanced Authentication
                </CardTitle>
                <CardDescription>
                  Secure your app with Vonage Verify, SIM Swap, and Insights APIs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Multi-factor authentication with SMS verification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>SIM swap detection for enhanced security</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Phone number validation and insights</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Flexible authentication flows</span>
                  </div>
                </div>
                <Button 
                  onClick={() => setActiveTab('demos')}
                  className="w-full"
                  variant="outline"
                >
                  Try Authentication Demo
                </Button>
              </CardContent>
            </Card>

            {/* Challenge #2 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                  Challenge #2: Multi-Channel Communication
                </CardTitle>
                <CardDescription>
                  Transform customer service with unified multi-channel interactions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>SMS, WhatsApp, Voice, and Video integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Unified customer service platform</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Personalized support across channels</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Real-time analytics and monitoring</span>
                  </div>
                </div>
                <Button 
                  onClick={() => setActiveTab('demos')}
                  className="w-full"
                  variant="outline"
                >
                  Try Multi-Channel Demo
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Health Status */}
          {healthStatus && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  API Health Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{healthStatus.status}</div>
                    <div className="text-sm text-gray-600">Status</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{healthStatus.version}</div>
                    <div className="text-sm text-gray-600">Version</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{healthStatus.features?.length || 0}</div>
                    <div className="text-sm text-gray-600">Features</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{new Date(healthStatus.timestamp).toLocaleTimeString()}</div>
                    <div className="text-sm text-gray-600">Last Check</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoFeatures.map((feature) => (
              <Card key={feature.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {feature.icon}
                    {feature.title}
                  </CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant={feature.status === 'available' ? 'default' : 'secondary'}
                      className={feature.category === 'auth' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}
                    >
                      {feature.category === 'auth' ? 'Auth' : 'Communication'}
                    </Badge>
                    <Badge variant="outline">
                      {feature.status === 'available' ? 'Available' : 'Demo'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="demos" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Interactive Live Demos</h2>
            <Button onClick={resetDemos} variant="outline">
              Reset All Demos
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {liveDemos.map((demo) => (
              <Card key={demo.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {demo.icon}
                    {demo.title}
                  </CardTitle>
                  <CardDescription>{demo.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className={`flex items-center gap-3 p-3 rounded-lg border-2 ${getStatusColor(demo.status)}`}>
                    {getStatusIcon(demo.status)}
                    <span className="font-medium">
                      {demo.status === 'idle' && 'Ready to run'}
                      {demo.status === 'running' && 'Running demo...'}
                      {demo.status === 'completed' && 'Demo completed'}
                      {demo.status === 'error' && 'Demo failed'}
                    </span>
                  </div>
                  
                  <Button
                    onClick={() => runDemo(demo.id)}
                    disabled={demo.status === 'running'}
                    className="w-full"
                  >
                    {demo.status === 'running' ? (
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Play className="h-4 w-4 mr-2" />
                    )}
                    {demo.status === 'running' ? 'Running...' : 'Run Demo'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Status Messages */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalMessages}</div>
                  <p className="text-xs text-muted-foreground">
                    +{analytics.successfulMessages} successful
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalCalls}</div>
                  <p className="text-xs text-muted-foreground">
                    +{analytics.successfulCalls} successful
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Verifications</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalVerifications}</div>
                  <p className="text-xs text-muted-foreground">
                    +{analytics.successfulVerifications} successful
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Response Time</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.averageResponseTime}</div>
                  <p className="text-xs text-muted-foreground">
                    Average response time
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Success Rate</span>
                    <span>{analytics ? Math.round((analytics.successfulMessages / analytics.totalMessages) * 100) : 0}%</span>
                  </div>
                  <Progress value={analytics ? (analytics.successfulMessages / analytics.totalMessages) * 100 : 0} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Call Success Rate</span>
                    <span>{analytics ? Math.round((analytics.successfulCalls / analytics.totalCalls) * 100) : 0}%</span>
                  </div>
                  <Progress value={analytics ? (analytics.successfulCalls / analytics.totalCalls) * 100 : 0} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Verification Success Rate</span>
                    <span>{analytics ? Math.round((analytics.successfulVerifications / analytics.totalVerifications) * 100) : 0}%</span>
                  </div>
                  <Progress value={analytics ? (analytics.successfulVerifications / analytics.totalVerifications) * 100 : 0} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  API Integration Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Quick Start</h4>
                  <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                    npm install @vonage/server-sdk
                  </div>
                  <p className="text-sm text-gray-600">
                    Install the Vonage SDK and configure your API credentials
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">Environment Variables</h4>
                  <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                    VITE_VONAGE_API_KEY=your_api_key<br/>
                    VITE_VONAGE_API_SECRET=your_api_secret<br/>
                    VITE_VONAGE_API_BASE_URL=http://localhost:3001/api/vonage
                  </div>
                </div>

                <Button className="w-full" variant="outline">
                  View Full Documentation
                </Button>
              </CardContent>
            </Card>


          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VonageDemoPage;
