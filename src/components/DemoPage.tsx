import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Zap, 
  Phone, 
  Video, 
  FileText, 
  Users, 
  Bug, 
  Shield, 
  BarChart3, 
  BookOpen,
  CheckCircle,
  AlertTriangle,
  Play,
  Settings,
  Activity,
  Eye,
  Bot,
  MessageCircle
} from 'lucide-react';
import ProductFeatures from './ProductFeatures';
import FailureTesting from './FailureTesting';

interface DemoPageProps {
  userId?: string;
}

export const DemoPage: React.FC<DemoPageProps> = ({ userId = 'demo_user_123' }) => {
  const [activeTab, setActiveTab] = useState('features');
  const [demoMode, setDemoMode] = useState<'success' | 'failure' | 'mixed'>('success');
  const [actionStatus, setActionStatus] = useState<{[key: string]: string}>({});

  const tabs = [
    { id: 'features', name: 'Product Features', icon: Zap },
    { id: 'testing', name: 'Failure Testing', icon: Bug },
    { id: 'demo', name: 'Demo Mode', icon: Play },
    { id: 'analytics', name: 'Real-Time Analytics', icon: Activity },
    { id: 'security', name: 'Security Monitoring', icon: Shield }
  ];

  const features = [
    {
      id: 'sms',
      name: 'SMS Verification',
      description: 'Secure phone number verification with real-time SMS delivery',
      icon: Phone,
      status: 'active',
      successRate: 98.5
    },
    {
      id: 'video',
      name: 'Video Onboarding',
      description: 'Personalized video sessions for seamless customer onboarding',
      icon: Video,
      status: 'active',
      successRate: 95.2
    },
    {
      id: 'document',
      name: 'Document Generation',
      description: 'AI-powered document creation with personalization',
      icon: FileText,
      status: 'active',
      successRate: 97.8
    },

  ];

  const securityFeatures = [
    {
      name: 'Authentication',
      description: 'Multi-factor authentication and secure login',
      icon: Shield,
      status: 'enabled'
    },
    {
      name: 'Analytics',
      description: 'Real-time analytics and performance monitoring',
      icon: BarChart3,
      status: 'enabled'
    },
    {
      name: 'Documentation',
      description: 'Comprehensive API documentation and guides',
      icon: BookOpen,
      status: 'enabled'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
      case 'enabled':
        return <Badge variant="default" className="bg-green-500">Active</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'disabled':
        return <Badge variant="destructive">Disabled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Action handlers for Quick Action buttons
  const handleSMSTest = async () => {
    setActionStatus(prev => ({ ...prev, sms: 'loading' }));
    try {
      // Simulate SMS test
      await new Promise(resolve => setTimeout(resolve, 2000));
      setActionStatus(prev => ({ ...prev, sms: 'success' }));
      setActiveTab('features');
      // Show success message
      alert('SMS test completed successfully! Check the SMS Verification tab for details.');
    } catch (error) {
      setActionStatus(prev => ({ ...prev, sms: 'error' }));
      alert('SMS test failed. Please try again.');
    }
  };

  const handleVideoTest = async () => {
    setActionStatus(prev => ({ ...prev, video: 'loading' }));
    try {
      // Simulate video test
      await new Promise(resolve => setTimeout(resolve, 1500));
      setActionStatus(prev => ({ ...prev, video: 'success' }));
      setActiveTab('features');
      // Show success message
      alert('Video test completed successfully! Check the Video Onboarding tab for details.');
    } catch (error) {
      setActionStatus(prev => ({ ...prev, video: 'error' }));
      alert('Video test failed. Please try again.');
    }
  };

  const handleDocumentTest = async () => {
    setActionStatus(prev => ({ ...prev, document: 'loading' }));
    try {
      // Simulate document generation test
      await new Promise(resolve => setTimeout(resolve, 2500));
      setActionStatus(prev => ({ ...prev, document: 'success' }));
      setActiveTab('features');
      // Show success message
      alert('Document generation test completed successfully! Check the Document Generation tab for details.');
    } catch (error) {
      setActionStatus(prev => ({ ...prev, document: 'error' }));
      alert('Document generation test failed. Please try again.');
    }
  };

  const handleFailureTest = async () => {
    setActionStatus(prev => ({ ...prev, failure: 'loading' }));
    try {
      // Simulate failure test
      await new Promise(resolve => setTimeout(resolve, 1000));
      setActionStatus(prev => ({ ...prev, failure: 'success' }));
      setActiveTab('testing');
      // Show success message
      alert('Failure test initiated! Check the Failure Testing tab for details.');
    } catch (error) {
      setActionStatus(prev => ({ ...prev, failure: 'error' }));
      alert('Failure test failed to start. Please try again.');
    }
  };

  const handleAnalyticsTest = async () => {
    setActionStatus(prev => ({ ...prev, analytics: 'loading' }));
    try {
      // Simulate analytics test
      await new Promise(resolve => setTimeout(resolve, 1200));
      setActionStatus(prev => ({ ...prev, analytics: 'success' }));
      setActiveTab('analytics');
      // Show success message
      alert('Analytics test completed! Check the Real-Time Analytics tab for details.');
    } catch (error) {
      setActionStatus(prev => ({ ...prev, analytics: 'error' }));
      alert('Analytics test failed. Please try again.');
    }
  };

  const handleSecurityTest = async () => {
    setActionStatus(prev => ({ ...prev, security: 'loading' }));
    try {
      // Simulate security test
      await new Promise(resolve => setTimeout(resolve, 1800));
      setActionStatus(prev => ({ ...prev, security: 'success' }));
      setActiveTab('security');
      // Show success message
      alert('Security test completed! Check the Security Monitoring tab for details.');
    } catch (error) {
      setActionStatus(prev => ({ ...prev, security: 'error' }));
      alert('Security test failed. Please try again.');
    }
  };

  const handleLiveAnalytics = () => {
    setActionStatus(prev => ({ ...prev, liveAnalytics: 'loading' }));
    try {
      // Open live analytics in new window
      window.open('/real-time-analytics', '_blank');
      setActionStatus(prev => ({ ...prev, liveAnalytics: 'success' }));
      alert('Live Analytics dashboard opened in new window!');
    } catch (error) {
      setActionStatus(prev => ({ ...prev, liveAnalytics: 'error' }));
      alert('Failed to open Live Analytics. Please try again.');
    }
  };

  const handleSecurityMonitor = () => {
    setActionStatus(prev => ({ ...prev, securityMonitor: 'loading' }));
    try {
      // Open security monitoring in new window
      window.open('/security-monitoring', '_blank');
      setActionStatus(prev => ({ ...prev, securityMonitor: 'success' }));
      alert('Security Monitoring dashboard opened in new window!');
    } catch (error) {
      setActionStatus(prev => ({ ...prev, securityMonitor: 'error' }));
      alert('Failed to open Security Monitoring. Please try again.');
    }
  };

  const renderDemoMode = () => (
    <div className="space-y-6">
      {/* Demo Mode Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Demo Mode Configuration
          </CardTitle>
          <CardDescription>
            Configure how the application behaves during demonstrations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant={demoMode === 'success' ? 'default' : 'outline'}
              onClick={() => setDemoMode('success')}
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <CheckCircle className="h-6 w-6" />
              <span className="font-medium">Success Mode</span>
              <span className="text-xs text-muted-foreground">All features work perfectly</span>
            </Button>
            <Button
              variant={demoMode === 'failure' ? 'default' : 'outline'}
              onClick={() => setDemoMode('failure')}
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <AlertTriangle className="h-6 w-6" />
              <span className="font-medium">Failure Mode</span>
              <span className="text-xs text-muted-foreground">Simulate error scenarios</span>
            </Button>
            <Button
              variant={demoMode === 'mixed' ? 'default' : 'outline'}
              onClick={() => setDemoMode('mixed')}
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <Settings className="h-6 w-6" />
              <span className="font-medium">Mixed Mode</span>
              <span className="text-xs text-muted-foreground">Random success/failure</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Feature Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Status Overview</CardTitle>
          <CardDescription>
            Current status of all product features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature) => (
              <div key={feature.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <feature.icon className="h-5 w-5" />
                    <h4 className="font-medium">{feature.name}</h4>
                  </div>
                  {getStatusBadge(feature.status)}
                </div>
                <p className="text-sm text-muted-foreground mb-2">{feature.description}</p>
                <div className="flex items-center gap-2 text-sm">
                  <span>Success Rate:</span>
                  <span className="font-medium text-green-600">{feature.successRate}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security & Analytics Status */}
      <Card>
        <CardHeader>
          <CardTitle>Security & Analytics Status</CardTitle>
          <CardDescription>
            Status of security, analytics, and documentation features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {securityFeatures.map((feature) => (
              <div key={feature.name} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <feature.icon className="h-5 w-5" />
                    <h4 className="font-medium">{feature.name}</h4>
                  </div>
                  {getStatusBadge(feature.status)}
                </div>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Demo Instructions */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Demo Instructions:</strong> Use the buttons above to switch between different demo modes. 
          In Success Mode, all features work perfectly. In Failure Mode, you can test error handling. 
          In Mixed Mode, features randomly succeed or fail to simulate real-world conditions.
        </AlertDescription>
      </Alert>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Zap className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">OnboardIQ Demo</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Comprehensive demonstration of all product features, failure testing, and demo modes
        </p>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              <tab.icon className="h-4 w-4" />
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Product Features Tab */}
        <TabsContent value="features" className="mt-6">
          <ProductFeatures userId={userId} />
        </TabsContent>

        {/* Failure Testing Tab */}
        <TabsContent value="testing" className="mt-6">
          <FailureTesting 
            onFailureTriggered={(category, failure) => {
              console.log(`Failure triggered in ${category}:`, failure);
            }}
          />
        </TabsContent>

        {/* Demo Mode Tab */}
        <TabsContent value="demo" className="mt-6">
          {renderDemoMode()}
        </TabsContent>

        {/* Real-Time Analytics Tab */}
        <TabsContent value="analytics" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Real-Time Analytics Preview
              </CardTitle>
              <CardDescription>
                Live analytics dashboard with real-time data visualization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">1,247</div>
                    <div className="text-sm text-muted-foreground">Total Users</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">89</div>
                    <div className="text-sm text-muted-foreground">Active Users</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">78.5%</div>
                    <div className="text-sm text-muted-foreground">Conversion Rate</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">12.3m</div>
                    <div className="text-sm text-muted-foreground">Avg Onboarding Time</div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open('/real-time-analytics', '_blank')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Full Analytics Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Monitoring Tab */}
        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Monitoring Preview
              </CardTitle>
              <CardDescription>
                Real-time security monitoring and threat detection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">152</div>
                    <div className="text-sm text-muted-foreground">Threats Blocked</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">3</div>
                    <div className="text-sm text-muted-foreground">Active Alerts</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">99.98%</div>
                    <div className="text-sm text-muted-foreground">System Uptime</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">98.5%</div>
                    <div className="text-sm text-muted-foreground">Verification Success</div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open('/security-monitoring', '_blank')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Full Security Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Quick access to common demo actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              onClick={handleSMSTest}
              disabled={actionStatus.sms === 'loading'}
              className={`flex flex-col items-center gap-2 h-auto p-4 transition-all duration-200 ${
                actionStatus.sms === 'loading' ? 'opacity-50 cursor-not-allowed' : 
                actionStatus.sms === 'success' ? 'border-green-500 bg-green-50' :
                actionStatus.sms === 'error' ? 'border-red-500 bg-red-50' : ''
              }`}
            >
              {actionStatus.sms === 'loading' ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              ) : (
                <Phone className="h-6 w-6" />
              )}
              <span className="font-medium">Test SMS</span>
              {actionStatus.sms === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
              {actionStatus.sms === 'error' && <AlertTriangle className="h-4 w-4 text-red-600" />}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleVideoTest}
              disabled={actionStatus.video === 'loading'}
              className={`flex flex-col items-center gap-2 h-auto p-4 transition-all duration-200 ${
                actionStatus.video === 'loading' ? 'opacity-50 cursor-not-allowed' : 
                actionStatus.video === 'success' ? 'border-green-500 bg-green-50' :
                actionStatus.video === 'error' ? 'border-red-500 bg-red-50' : ''
              }`}
            >
              {actionStatus.video === 'loading' ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              ) : (
                <Video className="h-6 w-6" />
              )}
              <span className="font-medium">Test Video</span>
              {actionStatus.video === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
              {actionStatus.video === 'error' && <AlertTriangle className="h-4 w-4 text-red-600" />}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleDocumentTest}
              disabled={actionStatus.document === 'loading'}
              className={`flex flex-col items-center gap-2 h-auto p-4 transition-all duration-200 ${
                actionStatus.document === 'loading' ? 'opacity-50 cursor-not-allowed' : 
                actionStatus.document === 'success' ? 'border-green-500 bg-green-50' :
                actionStatus.document === 'error' ? 'border-red-500 bg-red-50' : ''
              }`}
            >
              {actionStatus.document === 'loading' ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              ) : (
                <FileText className="h-6 w-6" />
              )}
              <span className="font-medium">Test Documents</span>
              {actionStatus.document === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
              {actionStatus.document === 'error' && <AlertTriangle className="h-4 w-4 text-red-600" />}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleFailureTest}
              disabled={actionStatus.failure === 'loading'}
              className={`flex flex-col items-center gap-2 h-auto p-4 transition-all duration-200 ${
                actionStatus.failure === 'loading' ? 'opacity-50 cursor-not-allowed' : 
                actionStatus.failure === 'success' ? 'border-green-500 bg-green-50' :
                actionStatus.failure === 'error' ? 'border-red-500 bg-red-50' : ''
              }`}
            >
              {actionStatus.failure === 'loading' ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              ) : (
                <Bug className="h-6 w-6" />
              )}
              <span className="font-medium">Test Failures</span>
              {actionStatus.failure === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
              {actionStatus.failure === 'error' && <AlertTriangle className="h-4 w-4 text-red-600" />}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleAnalyticsTest}
              disabled={actionStatus.analytics === 'loading'}
              className={`flex flex-col items-center gap-2 h-auto p-4 transition-all duration-200 ${
                actionStatus.analytics === 'loading' ? 'opacity-50 cursor-not-allowed' : 
                actionStatus.analytics === 'success' ? 'border-green-500 bg-green-50' :
                actionStatus.analytics === 'error' ? 'border-red-500 bg-red-50' : ''
              }`}
            >
              {actionStatus.analytics === 'loading' ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              ) : (
                <Activity className="h-6 w-6" />
              )}
              <span className="font-medium">Analytics</span>
              {actionStatus.analytics === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
              {actionStatus.analytics === 'error' && <AlertTriangle className="h-4 w-4 text-red-600" />}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleSecurityTest}
              disabled={actionStatus.security === 'loading'}
              className={`flex flex-col items-center gap-2 h-auto p-4 transition-all duration-200 ${
                actionStatus.security === 'loading' ? 'opacity-50 cursor-not-allowed' : 
                actionStatus.security === 'success' ? 'border-green-500 bg-green-50' :
                actionStatus.security === 'error' ? 'border-red-500 bg-red-50' : ''
              }`}
            >
              {actionStatus.security === 'loading' ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              ) : (
                <Shield className="h-6 w-6" />
              )}
              <span className="font-medium">Security</span>
              {actionStatus.security === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
              {actionStatus.security === 'error' && <AlertTriangle className="h-4 w-4 text-red-600" />}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleLiveAnalytics}
              disabled={actionStatus.liveAnalytics === 'loading'}
              className={`flex flex-col items-center gap-2 h-auto p-4 transition-all duration-200 ${
                actionStatus.liveAnalytics === 'loading' ? 'opacity-50 cursor-not-allowed' : 
                actionStatus.liveAnalytics === 'success' ? 'border-green-500 bg-green-50' :
                actionStatus.liveAnalytics === 'error' ? 'border-red-500 bg-red-50' : ''
              }`}
            >
              {actionStatus.liveAnalytics === 'loading' ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              ) : (
                <BarChart3 className="h-6 w-6" />
              )}
              <span className="font-medium">Live Analytics</span>
              {actionStatus.liveAnalytics === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
              {actionStatus.liveAnalytics === 'error' && <AlertTriangle className="h-4 w-4 text-red-600" />}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleSecurityMonitor}
              disabled={actionStatus.securityMonitor === 'loading'}
              className={`flex flex-col items-center gap-2 h-auto p-4 transition-all duration-200 ${
                actionStatus.securityMonitor === 'loading' ? 'opacity-50 cursor-not-allowed' : 
                actionStatus.securityMonitor === 'success' ? 'border-green-500 bg-green-50' :
                actionStatus.securityMonitor === 'error' ? 'border-red-500 bg-red-50' : ''
              }`}
            >
              {actionStatus.securityMonitor === 'loading' ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              ) : (
                <Eye className="h-6 w-6" />
              )}
              <span className="font-medium">Security Monitor</span>
              {actionStatus.securityMonitor === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
              {actionStatus.securityMonitor === 'error' && <AlertTriangle className="h-4 w-4 text-red-600" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Demo Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Demo Statistics</CardTitle>
          <CardDescription>
            Overview of demo activities and feature usage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">4</div>
              <div className="text-sm text-muted-foreground">Active Features</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">97.7%</div>
              <div className="text-sm text-muted-foreground">Average Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">7</div>
              <div className="text-sm text-muted-foreground">Failure Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">3</div>
              <div className="text-sm text-muted-foreground">Demo Modes</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DemoPage;
