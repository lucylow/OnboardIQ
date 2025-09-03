import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  FileText, 
  Download, 
  Eye, 
  Settings, 
  Zap, 
  Shield, 
  Users,
  CreditCard,
  FileCheck,
  ArrowRight,
  Play,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
import FoxitDocumentWorkflow from './FoxitDocumentWorkflow';

export const FoxitWorkflowExample: React.FC = () => {
  const [activeTab, setActiveTab] = useState('workflow');
  const [workflowResults, setWorkflowResults] = useState<any[]>([]);
  const [isWorkflowRunning, setIsWorkflowRunning] = useState(false);

  const handleWorkflowComplete = (result: any) => {
    setWorkflowResults(prev => [result, ...prev]);
    setIsWorkflowRunning(false);
  };

  const handleWorkflowFailed = (error: string) => {
    console.error('Workflow failed:', error);
    setIsWorkflowRunning(false);
  };

  const workflowExamples = [
    {
      id: 'customer_onboarding',
      title: 'Customer Onboarding Package',
      description: 'Complete onboarding workflow with welcome packet, contract, and guide',
      icon: <Users className="h-6 w-6" />,
      steps: [
        'Generate personalized welcome letter',
        'Create service contract',
        'Generate onboarding guide',
        'Merge all documents',
        'Add security features'
      ],
      benefits: [
        'Automated document generation',
        'Consistent branding',
        'Secure document delivery',
        'Time savings: 80% reduction'
      ]
    },
    {
      id: 'invoice_package',
      title: 'Invoice Package',
      description: 'Professional invoice with payment instructions and branding',
      icon: <CreditCard className="h-6 w-6" />,
      steps: [
        'Generate professional invoice',
        'Create payment instructions',
        'Merge documents',
        'Add company branding'
      ],
      benefits: [
        'Professional appearance',
        'Clear payment instructions',
        'Brand consistency',
        'Faster payment processing'
      ]
    },
    {
      id: 'contract_package',
      title: 'Contract Package',
      description: 'Legal contract with terms, signature page, and security',
      icon: <FileCheck className="h-6 w-6" />,
      steps: [
        'Generate service contract',
        'Create terms sheet',
        'Generate signature page',
        'Merge all documents',
        'Add encryption and watermark'
      ],
      benefits: [
        'Legal compliance',
        'Digital signatures',
        'Document security',
        'Audit trail'
      ]
    }
  ];

  const getWorkflowStatus = (workflowType: string) => {
    const result = workflowResults.find(r => r.workflow_type === workflowType);
    if (result) {
      return 'completed';
    }
    if (isWorkflowRunning) {
      return 'running';
    }
    return 'pending';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-500">Completed</Badge>;
      case 'running':
        return <Badge variant="default" className="bg-blue-500">Running</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Foxit Workflow Examples</h1>
              <p className="text-gray-600 mt-2">
                Real-world examples of automated document workflows using Foxit APIs
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Zap className="h-3 w-3 mr-1" />
                API Connected
              </Badge>
              <Badge variant="outline">
                <Shield className="h-3 w-3 mr-1" />
                Secure
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="workflow" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Workflow Demo
            </TabsTrigger>
            <TabsTrigger value="examples" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Examples
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Results
            </TabsTrigger>
          </TabsList>

          {/* Workflow Demo Tab */}
          <TabsContent value="workflow" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Interactive Workflow Demo
                </CardTitle>
                <CardDescription>
                  Experience the power of automated document workflows with Foxit APIs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FoxitDocumentWorkflow
                  userId="demo_user_123"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Examples Tab */}
          <TabsContent value="examples" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {workflowExamples.map((example) => (
                <Card key={example.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                        {example.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{example.title}</CardTitle>
                        <CardDescription>{example.description}</CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(getWorkflowStatus(example.id))}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Workflow Steps:</h4>
                      <ul className="space-y-1">
                        {example.steps.map((step, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                            <div className="w-1 h-1 bg-gray-400 rounded-full" />
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Benefits:</h4>
                      <ul className="space-y-1">
                        {example.benefits.map((benefit, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Workflow Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Workflow Comparison</CardTitle>
                <CardDescription>
                  Compare different workflow types and their use cases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Workflow Type</th>
                        <th className="text-left p-2">Steps</th>
                        <th className="text-left p-2">Use Case</th>
                        <th className="text-left p-2">Time Savings</th>
                        <th className="text-left p-2">Security Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2 font-medium">Customer Onboarding</td>
                        <td className="p-2">5 steps</td>
                        <td className="p-2">New customer setup</td>
                        <td className="p-2">80%</td>
                        <td className="p-2">High</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-medium">Invoice Package</td>
                        <td className="p-2">4 steps</td>
                        <td className="p-2">Billing and payments</td>
                        <td className="p-2">70%</td>
                        <td className="p-2">Medium</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-medium">Contract Package</td>
                        <td className="p-2">5 steps</td>
                        <td className="p-2">Legal agreements</td>
                        <td className="p-2">85%</td>
                        <td className="p-2">Very High</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Workflow Results
                </CardTitle>
                <CardDescription>
                  View completed workflows and generated documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                {workflowResults.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No workflows completed yet</p>
                    <p className="text-sm">Run a workflow to see results here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {workflowResults.map((result, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">
                              {result.workflow_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Completed {result.steps_completed} steps • {new Date().toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Workflows</p>
                      <p className="text-2xl font-bold">{workflowResults.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Success Rate</p>
                      <p className="text-2xl font-bold">100%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Clock className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Avg. Time</p>
                      <p className="text-2xl font-bold">2.5s</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
