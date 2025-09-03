import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  FileText, 
  Settings, 
  Zap, 
  Shield, 
  Users,
  CreditCard,
  FileCheck,
  Play,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

// Import the Foxit components
import FoxitPDFGenerator from './FoxitPDFGenerator';
import FoxitDemoPage from './FoxitDemoPage';
import FoxitDocumentWorkflow from './FoxitDocumentWorkflow';
import { FoxitWorkflowExample } from './FoxitWorkflowExample';

export const FoxitIntegrationExample: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const integrationFeatures = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: 'Document Generation',
      description: 'Create personalized PDFs from templates',
      component: 'FoxitPDFGenerator'
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: 'PDF Processing',
      description: 'Advanced PDF manipulation workflows',
      component: 'FoxitDocumentWorkflow'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Demo Interface',
      description: 'Interactive demo and examples',
      component: 'FoxitDemoPage'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Workflow Examples',
      description: 'Real-world workflow demonstrations',
      component: 'FoxitWorkflowExample'
    }
  ];

  const renderComponent = (componentName: string) => {
    switch (componentName) {
      case 'FoxitPDFGenerator':
        return (
          <FoxitPDFGenerator
            userId="demo_user_123"
          />
        );
      case 'FoxitDocumentWorkflow':
        return (
          <FoxitDocumentWorkflow
            userId="demo_user_123"
          />
        );
      case 'FoxitDemoPage':
        return <FoxitDemoPage />;
      case 'FoxitWorkflowExample':
        return <FoxitWorkflowExample />;
      default:
        return <div>Component not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Foxit API Integration</h1>
              <p className="text-gray-600 mt-2">
                Complete integration examples for Foxit Document Generation and PDF Services APIs
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Ready
              </Badge>
              <Badge variant="outline">
                <Zap className="h-3 w-3 mr-1" />
                API Connected
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="generator" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Generator
            </TabsTrigger>
            <TabsTrigger value="workflow" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Workflow
            </TabsTrigger>
            <TabsTrigger value="demo" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Demo
            </TabsTrigger>
            <TabsTrigger value="examples" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Examples
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Foxit API Integration Overview
                </CardTitle>
                <CardDescription>
                  Comprehensive integration of Foxit Document Generation and PDF Services APIs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {integrationFeatures.map((feature, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            {feature.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold">{feature.title}</h3>
                            <p className="text-sm text-gray-600">{feature.description}</p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => setActiveTab(feature.component.toLowerCase().replace('foxit', ''))}
                        >
                          <ArrowRight className="h-4 w-4 mr-2" />
                          View {feature.title}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* API Status */}
            <Card>
              <CardHeader>
                <CardTitle>API Status</CardTitle>
                <CardDescription>
                  Current status of Foxit API integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Document Generation API</p>
                      <p className="text-sm text-gray-600">Connected</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">PDF Services API</p>
                      <p className="text-sm text-gray-600">Connected</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Authentication</p>
                      <p className="text-sm text-gray-600">Valid</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Generator Tab */}
          <TabsContent value="generator" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Document Generator
                </CardTitle>
                <CardDescription>
                  Generate personalized PDF documents using Foxit Document Generation API
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderComponent('FoxitPDFGenerator')}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Workflow Tab */}
          <TabsContent value="workflow" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Document Workflow
                </CardTitle>
                <CardDescription>
                  Execute chained document workflows with Foxit APIs
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderComponent('FoxitDocumentWorkflow')}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Demo Tab */}
          <TabsContent value="demo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Interactive Demo
                </CardTitle>
                <CardDescription>
                  Experience the full Foxit integration demo
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderComponent('FoxitDemoPage')}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Examples Tab */}
          <TabsContent value="examples" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Workflow Examples
                </CardTitle>
                <CardDescription>
                  Real-world examples and use cases
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderComponent('FoxitWorkflowExample')}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
