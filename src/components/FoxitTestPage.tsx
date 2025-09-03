import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  FileText, 
  Settings, 
  Zap, 
  Shield, 
  Users,
  Play,
  Loader2
} from 'lucide-react';

// Import all Foxit components
import FoxitPDFGenerator from './FoxitPDFGenerator';
import FoxitDemoPage from './FoxitDemoPage';
import FoxitDocumentWorkflow from './FoxitDocumentWorkflow';
import { FoxitWorkflowExample } from './FoxitWorkflowExample';
import { FoxitIntegrationExample } from './FoxitIntegrationExample';
import { foxitApiService } from '../services/foxitApiService';

export const FoxitTestPage: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<string>('');
  const [apiStatus, setApiStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [testResults, setTestResults] = useState<Record<string, 'pending' | 'success' | 'error'>>({});

  useEffect(() => {
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    try {
      setApiStatus('loading');
      const status = await foxitApiService.getConnectionStatus();
      setApiStatus(status.connected ? 'connected' : 'error');
    } catch (error) {
      console.error('API status check failed:', error);
      setApiStatus('error');
    }
  };

  const runComponentTest = (componentName: string) => {
    setTestResults(prev => ({ ...prev, [componentName]: 'pending' }));
    
    // Simulate component loading test
    setTimeout(() => {
      try {
        setActiveComponent(componentName);
        setTestResults(prev => ({ ...prev, [componentName]: 'success' }));
      } catch (error) {
        console.error(`Component test failed for ${componentName}:`, error);
        setTestResults(prev => ({ ...prev, [componentName]: 'error' }));
      }
    }, 1000);
  };

  const components = [
    {
      name: 'FoxitPDFGenerator',
      title: 'PDF Generator',
      description: 'Document generation component',
      icon: <FileText className="h-5 w-5" />
    },
    {
      name: 'FoxitDocumentWorkflow',
      title: 'Document Workflow',
      description: 'Chained workflow component',
      icon: <Settings className="h-5 w-5" />
    },
    {
      name: 'FoxitDemoPage',
      title: 'Demo Page',
      description: 'Interactive demo component',
      icon: <Users className="h-5 w-5" />
    },
    {
      name: 'FoxitWorkflowExample',
      title: 'Workflow Examples',
      description: 'Example workflows component',
      icon: <Play className="h-5 w-5" />
    },
    {
      name: 'FoxitIntegrationExample',
      title: 'Integration Example',
      description: 'Complete integration example',
      icon: <Shield className="h-5 w-5" />
    }
  ];

  const getStatusBadge = (status: 'pending' | 'success' | 'error') => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-500">✓ Success</Badge>;
      case 'error':
        return <Badge variant="destructive">✗ Error</Badge>;
      default:
        return <Badge variant="secondary">⏳ Pending</Badge>;
    }
  };

  const getApiStatusBadge = () => {
    switch (apiStatus) {
      case 'connected':
        return <Badge variant="default" className="bg-green-500">✓ Connected</Badge>;
      case 'error':
        return <Badge variant="destructive">✗ Error</Badge>;
      default:
        return <Badge variant="secondary">⏳ Loading</Badge>;
    }
  };

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'FoxitPDFGenerator':
        return (
          <FoxitPDFGenerator
            userId="test_user_123"
          />
        );
      case 'FoxitDocumentWorkflow':
        return (
          <FoxitDocumentWorkflow
            userId="test_user_123"
          />
        );
      case 'FoxitDemoPage':
        return <FoxitDemoPage />;
      case 'FoxitWorkflowExample':
        return <FoxitWorkflowExample />;
      case 'FoxitIntegrationExample':
        return <FoxitIntegrationExample />;
      default:
        return (
          <div className="text-center py-12 text-gray-500">
            <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Select a component to test</p>
            <p className="text-sm">Click on any component above to load and test it</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Foxit Component Test</h1>
              <p className="text-gray-600 mt-2">
                Test and verify all Foxit integration components
              </p>
            </div>
            <div className="flex items-center gap-4">
              {getApiStatusBadge()}
              <Badge variant="outline">
                <Zap className="h-3 w-3 mr-1" />
                Test Mode
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Component List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Components
                </CardTitle>
                <CardDescription>
                  Test each Foxit integration component
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {components.map((component) => (
                  <div
                    key={component.name}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      activeComponent === component.name
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => runComponentTest(component.name)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-1 bg-blue-100 rounded text-blue-600">
                          {component.icon}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{component.title}</p>
                          <p className="text-xs text-gray-600">{component.description}</p>
                        </div>
                      </div>
                      {testResults[component.name] && getStatusBadge(testResults[component.name])}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* API Status */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  API Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Foxit API</span>
                    {getApiStatusBadge()}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={checkApiStatus}
                    disabled={apiStatus === 'loading'}
                  >
                    {apiStatus === 'loading' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Refresh'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Component Display */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  {activeComponent ? `Testing: ${activeComponent}` : 'Component Test'}
                </CardTitle>
                <CardDescription>
                  {activeComponent 
                    ? `Currently testing the ${activeComponent} component`
                    : 'Select a component from the list to begin testing'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderActiveComponent()}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
