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
  progress?: number;
  steps?: string[];
  currentStep?: number;
  details?: any;
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
        steps: [
          'Initializing verification request...',
          'Validating phone number format...',
          'Generating secure verification code...',
          'Sending SMS via Vonage API...',
          'Tracking delivery status...',
          'Verification complete!'
        ],
        action: async () => {
          setLiveDemos(prev => prev.map(d => 
            d.id === 'verify-demo' ? { ...d, status: 'running', progress: 0, currentStep: 0 } : d
          ));
          
          try {
            // Step 1: Initialize
            await new Promise(resolve => setTimeout(resolve, 800));
            setLiveDemos(prev => prev.map(d => 
              d.id === 'verify-demo' ? { ...d, progress: 16, currentStep: 1 } : d
            ));
            
            // Step 2: Validate
            await new Promise(resolve => setTimeout(resolve, 600));
            setLiveDemos(prev => prev.map(d => 
              d.id === 'verify-demo' ? { ...d, progress: 33, currentStep: 2 } : d
            ));
            
            // Step 3: Generate code
            await new Promise(resolve => setTimeout(resolve, 500));
            setLiveDemos(prev => prev.map(d => 
              d.id === 'verify-demo' ? { ...d, progress: 50, currentStep: 3 } : d
            ));
            
            // Step 4: Send SMS
            await new Promise(resolve => setTimeout(resolve, 1000));
            setLiveDemos(prev => prev.map(d => 
              d.id === 'verify-demo' ? { ...d, progress: 66, currentStep: 4 } : d
            ));
            
            // Step 5: Track delivery
            await new Promise(resolve => setTimeout(resolve, 700));
            setLiveDemos(prev => prev.map(d => 
              d.id === 'verify-demo' ? { ...d, progress: 83, currentStep: 5 } : d
            ));
            
            // Step 6: Complete
            await new Promise(resolve => setTimeout(resolve, 500));
            const mockCode = Math.floor(100000 + Math.random() * 900000);
            const mockRequestId = 'REQ-' + Math.random().toString(36).substr(2, 9).toUpperCase();
            
            setSuccess(`✅ Verification code sent successfully! Request ID: ${mockRequestId} | Code: ${mockCode} (Demo Mode)`);
            setLiveDemos(prev => prev.map(d => 
              d.id === 'verify-demo' ? { 
                ...d, 
                status: 'completed', 
                progress: 100, 
                currentStep: 6,
                details: {
                  requestId: mockRequestId,
                  code: mockCode,
                  phoneNumber: '+1234567890',
                  deliveryTime: '2.3s',
                  carrier: 'Verizon Wireless'
                }
              } : d
            ));
          } catch (error) {
            setLiveDemos(prev => prev.map(d => 
              d.id === 'verify-demo' ? { ...d, status: 'error' } : d
            ));
          }
        },
        icon: <Shield className="h-4 w-4" />,
        status: 'idle',
        progress: 0,
        currentStep: 0
      },
      {
        id: 'sim-swap-demo',
        title: 'SIM Swap Detection Demo',
        description: 'Simulate SIM swap detection for security testing',
        steps: [
          'Connecting to carrier database...',
          'Retrieving SIM card history...',
          'Analyzing device patterns...',
          'Checking for suspicious activity...',
          'Generating security report...',
          'Security assessment complete!'
        ],
        action: async () => {
          setLiveDemos(prev => prev.map(d => 
            d.id === 'sim-swap-demo' ? { ...d, status: 'running', progress: 0, currentStep: 0 } : d
          ));
          
          try {
            // Step 1: Connect to carrier
            await new Promise(resolve => setTimeout(resolve, 900));
            setLiveDemos(prev => prev.map(d => 
              d.id === 'sim-swap-demo' ? { ...d, progress: 16, currentStep: 1 } : d
            ));
            
            // Step 2: Retrieve history
            await new Promise(resolve => setTimeout(resolve, 800));
            setLiveDemos(prev => prev.map(d => 
              d.id === 'sim-swap-demo' ? { ...d, progress: 33, currentStep: 2 } : d
            ));
            
            // Step 3: Analyze patterns
            await new Promise(resolve => setTimeout(resolve, 1200));
            setLiveDemos(prev => prev.map(d => 
              d.id === 'sim-swap-demo' ? { ...d, progress: 50, currentStep: 3 } : d
            ));
            
            // Step 4: Check activity
            await new Promise(resolve => setTimeout(resolve, 1000));
            setLiveDemos(prev => prev.map(d => 
              d.id === 'sim-swap-demo' ? { ...d, progress: 66, currentStep: 4 } : d
            ));
            
            // Step 5: Generate report
            await new Promise(resolve => setTimeout(resolve, 600));
            setLiveDemos(prev => prev.map(d => 
              d.id === 'sim-swap-demo' ? { ...d, progress: 83, currentStep: 5 } : d
            ));
            
            // Step 6: Complete
            await new Promise(resolve => setTimeout(resolve, 400));
            const riskLevel = Math.random() > 0.7 ? 'HIGH' : Math.random() > 0.3 ? 'MEDIUM' : 'LOW';
            const lastSwap = riskLevel === 'HIGH' ? '2 days ago' : 'Never';
            
            setSuccess(`✅ SIM swap check completed! Status: ${riskLevel === 'HIGH' ? '⚠️ SUSPICIOUS' : '🔒 SECURE'} | Last swap: ${lastSwap} | Risk level: ${riskLevel} (Demo Mode)`);
            setLiveDemos(prev => prev.map(d => 
              d.id === 'sim-swap-demo' ? { 
                ...d, 
                status: 'completed', 
                progress: 100, 
                currentStep: 6,
                details: {
                  riskLevel,
                  lastSwap,
                  deviceCount: Math.floor(Math.random() * 3) + 1,
                  suspiciousActivity: riskLevel === 'HIGH' ? Math.floor(Math.random() * 5) + 1 : 0,
                  carrier: 'AT&T Mobility'
                }
              } : d
            ));
          } catch (error) {
            setLiveDemos(prev => prev.map(d => 
              d.id === 'sim-swap-demo' ? { ...d, status: 'error' } : d
            ));
          }
        },
        icon: <Smartphone className="h-4 w-4" />,
        status: 'idle',
        progress: 0,
        currentStep: 0
      },
      {
        id: 'multi-channel-demo',
        title: 'Multi-Channel Message Demo',
        description: 'Send a message across SMS, WhatsApp, and Email simultaneously',
        steps: [
          'Preparing multi-channel message...',
          'Validating recipient information...',
          'Sending SMS message...',
          'Delivering WhatsApp message...',
          'Queuing email notification...',
          'All channels delivered!'
        ],
        action: async () => {
          setLiveDemos(prev => prev.map(d => 
            d.id === 'multi-channel-demo' ? { ...d, status: 'running', progress: 0, currentStep: 0 } : d
          ));
          
          try {
            // Step 1: Prepare message
            await new Promise(resolve => setTimeout(resolve, 600));
            setLiveDemos(prev => prev.map(d => 
              d.id === 'multi-channel-demo' ? { ...d, progress: 16, currentStep: 1 } : d
            ));
            
            // Step 2: Validate recipient
            await new Promise(resolve => setTimeout(resolve, 500));
            setLiveDemos(prev => prev.map(d => 
              d.id === 'multi-channel-demo' ? { ...d, progress: 33, currentStep: 2 } : d
            ));
            
            // Step 3: Send SMS
            await new Promise(resolve => setTimeout(resolve, 800));
            setLiveDemos(prev => prev.map(d => 
              d.id === 'multi-channel-demo' ? { ...d, progress: 50, currentStep: 3 } : d
            ));
            
            // Step 4: Send WhatsApp
            await new Promise(resolve => setTimeout(resolve, 700));
            setLiveDemos(prev => prev.map(d => 
              d.id === 'multi-channel-demo' ? { ...d, progress: 66, currentStep: 4 } : d
            ));
            
            // Step 5: Queue email
            await new Promise(resolve => setTimeout(resolve, 600));
            setLiveDemos(prev => prev.map(d => 
              d.id === 'multi-channel-demo' ? { ...d, progress: 83, currentStep: 5 } : d
            ));
            
            // Step 6: Complete
            await new Promise(resolve => setTimeout(resolve, 500));
            const smsStatus = Math.random() > 0.1 ? 'Delivered' : 'Pending';
            const whatsappStatus = Math.random() > 0.05 ? 'Delivered' : 'Failed';
            const emailStatus = Math.random() > 0.2 ? 'Queued' : 'Sent';
            
            setSuccess(`✅ Multi-channel message sent! SMS: ${smsStatus} | WhatsApp: ${whatsappStatus} | Email: ${emailStatus} (Demo Mode)`);
            setLiveDemos(prev => prev.map(d => 
              d.id === 'multi-channel-demo' ? { 
                ...d, 
                status: 'completed', 
                progress: 100, 
                currentStep: 6,
                details: {
                  sms: { status: smsStatus, deliveryTime: '1.2s' },
                  whatsapp: { status: whatsappStatus, deliveryTime: '0.8s' },
                  email: { status: emailStatus, deliveryTime: '3.1s' },
                  totalRecipients: 1,
                  messageId: 'MSG-' + Math.random().toString(36).substr(2, 9).toUpperCase()
                }
              } : d
            ));
          } catch (error) {
            setLiveDemos(prev => prev.map(d => 
              d.id === 'multi-channel-demo' ? { ...d, status: 'error' } : d
            ));
          }
        },
        icon: <Zap className="h-4 w-4" />,
        status: 'idle',
        progress: 0,
        currentStep: 0
      },
      {
        id: 'video-demo',
        title: 'Video Session Demo',
        description: 'Create a video session for customer support',
        steps: [
          'Initializing video infrastructure...',
          'Creating session room...',
          'Generating access tokens...',
          'Configuring media settings...',
          'Setting up recording...',
          'Video session ready!'
        ],
        action: async () => {
          setLiveDemos(prev => prev.map(d => 
            d.id === 'video-demo' ? { ...d, status: 'running', progress: 0, currentStep: 0 } : d
          ));
          
          try {
            // Step 1: Initialize infrastructure
            await new Promise(resolve => setTimeout(resolve, 1000));
            setLiveDemos(prev => prev.map(d => 
              d.id === 'video-demo' ? { ...d, progress: 16, currentStep: 1 } : d
            ));
            
            // Step 2: Create session room
            await new Promise(resolve => setTimeout(resolve, 800));
            setLiveDemos(prev => prev.map(d => 
              d.id === 'video-demo' ? { ...d, progress: 33, currentStep: 2 } : d
            ));
            
            // Step 3: Generate tokens
            await new Promise(resolve => setTimeout(resolve, 600));
            setLiveDemos(prev => prev.map(d => 
              d.id === 'video-demo' ? { ...d, progress: 50, currentStep: 3 } : d
            ));
            
            // Step 4: Configure media
            await new Promise(resolve => setTimeout(resolve, 700));
            setLiveDemos(prev => prev.map(d => 
              d.id === 'video-demo' ? { ...d, progress: 66, currentStep: 4 } : d
            ));
            
            // Step 5: Setup recording
            await new Promise(resolve => setTimeout(resolve, 500));
            setLiveDemos(prev => prev.map(d => 
              d.id === 'video-demo' ? { ...d, progress: 83, currentStep: 5 } : d
            ));
            
            // Step 6: Complete
            await new Promise(resolve => setTimeout(resolve, 400));
            const mockSessionId = 'VS_' + Math.random().toString(36).substr(2, 9).toUpperCase();
            const mockToken = 'TK_' + Math.random().toString(36).substr(2, 16).toUpperCase();
            const mockArchiveId = 'AR_' + Math.random().toString(36).substr(2, 12).toUpperCase();
            
            setSuccess(`✅ Video session created! Session ID: ${mockSessionId} | Token: ${mockToken.substr(0, 8)}... | Archive: ${mockArchiveId} (Demo Mode)`);
            setLiveDemos(prev => prev.map(d => 
              d.id === 'video-demo' ? { 
                ...d, 
                status: 'completed', 
                progress: 100, 
                currentStep: 6,
                details: {
                  sessionId: mockSessionId,
                  token: mockToken,
                  archiveId: mockArchiveId,
                  maxParticipants: 10,
                  recordingEnabled: true,
                  quality: 'HD 720p',
                  duration: 'Unlimited'
                }
              } : d
            ));
          } catch (error) {
            setLiveDemos(prev => prev.map(d => 
              d.id === 'video-demo' ? { ...d, status: 'error' } : d
            ));
          }
        },
        icon: <Video className="h-4 w-4" />,
        status: 'idle',
        progress: 0,
        currentStep: 0
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
    setLiveDemos(prev => prev.map(d => ({ 
      ...d, 
      status: 'idle', 
      progress: 0, 
      currentStep: 0,
      details: undefined
    })));
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
              <Card key={demo.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${demo.status === 'completed' ? 'bg-green-100' : demo.status === 'running' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      {demo.icon}
                    </div>
                    {demo.title}
                  </CardTitle>
                  <CardDescription>{demo.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Status and Progress */}
                  <div className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-300 ${getStatusColor(demo.status)}`}>
                    {getStatusIcon(demo.status)}
                    <div className="flex-1">
                      <span className="font-medium">
                        {demo.status === 'idle' && 'Ready to run'}
                        {demo.status === 'running' && 'Running demo...'}
                        {demo.status === 'completed' && 'Demo completed successfully'}
                        {demo.status === 'error' && 'Demo completed (Mock Mode)'}
                      </span>
                      {demo.status === 'running' && demo.steps && (
                        <div className="text-sm text-gray-600 mt-1">
                          {demo.steps[demo.currentStep || 0]}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {demo.status === 'running' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{demo.progress || 0}%</span>
                      </div>
                      <Progress value={demo.progress || 0} className="h-2" />
                    </div>
                  )}

                  {/* Step Indicators */}
                  {demo.status === 'running' && demo.steps && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-700">Steps:</div>
                      <div className="flex flex-wrap gap-1">
                        {demo.steps.map((step, index) => (
                          <div
                            key={index}
                            className={`px-2 py-1 rounded-full text-xs transition-all duration-300 ${
                              index <= (demo.currentStep || 0)
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {index + 1}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Demo Results */}
                  {demo.status === 'completed' && demo.details && (
                    <div className="space-y-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-sm font-medium text-green-800">Demo Results:</div>
                      {demo.id === 'verify-demo' && (
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Request ID:</span>
                            <span className="font-mono text-xs">{demo.details.requestId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Verification Code:</span>
                            <span className="font-mono font-bold text-green-700">{demo.details.code}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Phone Number:</span>
                            <span className="font-mono">{demo.details.phoneNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Delivery Time:</span>
                            <span className="text-green-600">{demo.details.deliveryTime}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Carrier:</span>
                            <span>{demo.details.carrier}</span>
                          </div>
                        </div>
                      )}
                      {demo.id === 'sim-swap-demo' && (
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Risk Level:</span>
                            <span className={`font-bold ${demo.details.riskLevel === 'HIGH' ? 'text-red-600' : demo.details.riskLevel === 'MEDIUM' ? 'text-yellow-600' : 'text-green-600'}`}>
                              {demo.details.riskLevel}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Last Swap:</span>
                            <span>{demo.details.lastSwap}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Devices:</span>
                            <span>{demo.details.deviceCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Suspicious Activity:</span>
                            <span className={demo.details.suspiciousActivity > 0 ? 'text-red-600' : 'text-green-600'}>
                              {demo.details.suspiciousActivity}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Carrier:</span>
                            <span>{demo.details.carrier}</span>
                          </div>
                        </div>
                      )}
                      {demo.id === 'multi-channel-demo' && (
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Message ID:</span>
                            <span className="font-mono text-xs">{demo.details.messageId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">SMS Status:</span>
                            <span className={demo.details.sms.status === 'Delivered' ? 'text-green-600' : 'text-yellow-600'}>
                              {demo.details.sms.status} ({demo.details.sms.deliveryTime})
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">WhatsApp Status:</span>
                            <span className={demo.details.whatsapp.status === 'Delivered' ? 'text-green-600' : 'text-red-600'}>
                              {demo.details.whatsapp.status} ({demo.details.whatsapp.deliveryTime})
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Email Status:</span>
                            <span className={demo.details.email.status === 'Sent' ? 'text-green-600' : 'text-blue-600'}>
                              {demo.details.email.status} ({demo.details.email.deliveryTime})
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Recipients:</span>
                            <span>{demo.details.totalRecipients}</span>
                          </div>
                        </div>
                      )}
                      {demo.id === 'video-demo' && (
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Session ID:</span>
                            <span className="font-mono text-xs">{demo.details.sessionId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Token:</span>
                            <span className="font-mono text-xs">{demo.details.token.substr(0, 12)}...</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Archive ID:</span>
                            <span className="font-mono text-xs">{demo.details.archiveId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Max Participants:</span>
                            <span>{demo.details.maxParticipants}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Recording:</span>
                            <span className={demo.details.recordingEnabled ? 'text-green-600' : 'text-gray-600'}>
                              {demo.details.recordingEnabled ? 'Enabled' : 'Disabled'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Quality:</span>
                            <span>{demo.details.quality}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Duration:</span>
                            <span>{demo.details.duration}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <Button
                    onClick={() => runDemo(demo.id)}
                    disabled={demo.status === 'running'}
                    className="w-full"
                    variant={demo.status === 'completed' ? 'outline' : 'default'}
                  >
                    {demo.status === 'running' ? (
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Play className="h-4 w-4 mr-2" />
                    )}
                    {demo.status === 'running' ? 'Running...' : demo.status === 'completed' ? 'Run Again' : 'Run Demo'}
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
