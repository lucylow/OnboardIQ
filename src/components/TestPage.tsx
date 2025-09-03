import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Rocket,
  Users,
  Settings,
  Home,
  FileText,
  Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { foxitApiService } from '@/services/foxitApiService';

const TestPage = () => {
  const navigate = useNavigate();

  const testComponents = [
    { name: 'Button', component: <Button>Test Button</Button> },
    { name: 'Card', component: <Card><CardHeader><CardTitle>Test Card</CardTitle></CardHeader><CardContent>Card content</CardContent></Card> },
    { name: 'Badge', component: <Badge>Test Badge</Badge> },
    { name: 'Icons', component: <div className="flex space-x-2"><Rocket className="h-5 w-5" /><Users className="h-5 w-5" /><Settings className="h-5 w-5" /></div> },
  ];

  const testNavigation = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Signup', path: '/signup', icon: Users },
    { name: 'Onboarding', path: '/onboarding', icon: Rocket },
    { name: 'Admin', path: '/admin', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">OnboardIQ Test Page</h1>
          <p className="text-gray-600">Testing all components and navigation</p>
        </div>

        {/* Status Check */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>React Router</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>UI Components</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Navigation</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Component Tests */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Info className="h-5 w-5 text-blue-500 mr-2" />
              Component Tests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testComponents.map((test, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">{test.name}</h3>
                  {test.component}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation Tests */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Rocket className="h-5 w-5 text-purple-500 mr-2" />
              Navigation Tests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testNavigation.map((nav, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start"
                  onClick={() => navigate(nav.path)}
                >
                  <nav.icon className="h-4 w-4 mr-2" />
                  {nav.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* API Test */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 text-orange-500 mr-2" />
              API Connection Test
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Backend Health Check:</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={async () => {
                    try {
                      const response = await fetch('http://localhost:5000/health');
                      const data = await response.json();
                      alert(`Backend Status: ${data.status}`);
                    } catch (error) {
                      alert('Backend not reachable');
                    }
                  }}
                >
                  Test Connection
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span>Vonage API Test:</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={async () => {
                    try {
                      const response = await fetch('http://localhost:5000/api/vonage/account-balance');
                      const data = await response.json();
                      alert(`Vonage API: ${data.success ? 'Connected' : 'Error'}`);
                    } catch (error) {
                      alert('Vonage API not reachable');
                    }
                  }}
                >
                  Test Vonage
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span>Foxit API Test:</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={async () => {
                    try {
                      const health = await foxitApiService.healthCheck();
                      alert(`Foxit API: ${health.status === 'healthy' ? 'Connected' : 'Error'}`);
                    } catch (error) {
                      alert('Foxit API not reachable');
                    }
                  }}
                >
                  Test Foxit
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Foxit Document Test */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 text-blue-500 mr-2" />
              Foxit Document Generation Test
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Generate Welcome Packet:</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={async () => {
                    try {
                      const result = await foxitApiService.createWelcomePacketForUser('test_user_123', {
                        name: 'Test User',
                        company: 'Test Company',
                        plan: 'Premium Plan',
                        email: 'test@example.com',
                        phone: '+1234567890'
                      });
                      if (result.success) {
                        alert('Welcome packet generated successfully!');
                        if (result.document_url) {
                          window.open(result.document_url, '_blank');
                        }
                      } else {
                        alert(`Failed: ${result.error}`);
                      }
                    } catch (error) {
                      alert('Document generation failed');
                    }
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Generate
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span>Create Onboarding Guide:</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={async () => {
                    try {
                      const result = await foxitApiService.createOnboardingGuideForUser('test_user_123', {
                        name: 'Test User',
                        company: 'Test Company',
                        plan: 'Premium Plan',
                        features: ['AI Personalization', 'Multi-Channel Support']
                      });
                      if (result.success) {
                        alert('Onboarding guide created successfully!');
                        if (result.document_url) {
                          window.open(result.document_url, '_blank');
                        }
                      } else {
                        alert(`Failed: ${result.error}`);
                      }
                    } catch (error) {
                      alert('Guide creation failed');
                    }
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Create Guide
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span>Generate Invoice:</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={async () => {
                    try {
                      const result = await foxitApiService.createInvoiceForUser('test_user_123', {
                        customer_name: 'Test User',
                        company_name: 'Test Company',
                        plan_name: 'Premium Plan',
                        amount: 299.99,
                        currency: 'USD'
                      });
                      if (result.success) {
                        alert('Invoice generated successfully!');
                        if (result.document_url) {
                          window.open(result.document_url, '_blank');
                        }
                      } else {
                        alert(`Failed: ${result.error}`);
                      }
                    } catch (error) {
                      alert('Invoice generation failed');
                    }
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Generate Invoice
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="text-center">
          <Button onClick={() => navigate('/')} className="mr-4">
            Go to Landing Page
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
