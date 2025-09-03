import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  Clock,
  ArrowRight,
  Zap,
  Shield,
  Users,
  Workflow,
  Play
} from 'lucide-react';
import { foxitApiService } from '../services/foxitApiService';

interface FoxitDocumentWorkflowProps {
  userId: string;
}

const FoxitDocumentWorkflow: React.FC<FoxitDocumentWorkflowProps> = ({ userId }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [workflowResults, setWorkflowResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const [workflowConfig, setWorkflowConfig] = useState({
    workflowType: 'onboarding_package',
    customerName: '',
    companyName: '',
    email: '',
    includeContract: true,
    includeInvoice: false,
    addWatermark: true,
    compressOutput: true
  });

  const workflowTypes = [
    { 
      id: 'onboarding_package', 
      name: 'Onboarding Package', 
      description: 'Complete welcome packet with contract and guide',
      steps: ['Generate Welcome Letter', 'Create Service Contract', 'Add Watermark', 'Compress & Deliver']
    },
    { 
      id: 'contract_workflow', 
      name: 'Contract Workflow', 
      description: 'Professional contract generation and signing',
      steps: ['Generate Contract', 'Add Legal Clauses', 'Apply Security', 'Send for Signature']
    },
    { 
      id: 'invoice_processing', 
      name: 'Invoice Processing', 
      description: 'Automated invoice generation and delivery',
      steps: ['Create Invoice', 'Add Company Branding', 'Calculate Totals', 'Email to Customer']
    }
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setWorkflowConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStartWorkflow = async () => {
    setIsProcessing(true);
    setCurrentStep(0);
    setWorkflowResults([]);
    setError(null);

    try {
      const selectedWorkflow = workflowTypes.find(w => w.id === workflowConfig.workflowType);
      if (!selectedWorkflow) {
        throw new Error('Invalid workflow type');
      }

      // Step 1: Generate initial document
      setCurrentStep(1);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const initialDoc = await foxitApiService.generateDocument({
        template_id: workflowConfig.workflowType === 'onboarding_package' ? 'welcome_packet' : 'contract',
        data: {
          customer_name: workflowConfig.customerName,
          company_name: workflowConfig.companyName,
          email: workflowConfig.email,
          start_date: new Date().toISOString().split('T')[0]
        },
        options: {
          watermark: workflowConfig.addWatermark
        }
      });

      setWorkflowResults(prev => [...prev, { step: 1, result: initialDoc, status: 'completed' }]);

      // Step 2: Generate additional documents if needed
      if (workflowConfig.includeContract && workflowConfig.workflowType === 'onboarding_package') {
        setCurrentStep(2);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const contractDoc = await foxitApiService.generateDocument({
          template_id: 'contract',
          data: {
            client_name: workflowConfig.customerName,
            service_type: 'OnboardIQ Platform',
            contract_value: '$999/month',
            start_date: new Date().toISOString().split('T')[0],
            end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          },
          options: {
            watermark: workflowConfig.addWatermark
          }
        });

        setWorkflowResults(prev => [...prev, { step: 2, result: contractDoc, status: 'completed' }]);
      }

      // Step 3: Process PDF workflow
      setCurrentStep(3);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const documentIds = workflowResults.map(r => r.result.document_id);
      const processedDoc = await foxitApiService.processPdfWorkflow({
        workflow_id: 'secure_delivery',
        document_ids: documentIds,
        operations: workflowConfig.compressOutput ? ['compress', 'watermark'] : ['watermark'],
        options: {
          watermark_text: `${workflowConfig.companyName} - Confidential`,
          compression_level: 'high'
        }
      });

      setWorkflowResults(prev => [...prev, { step: 3, result: processedDoc, status: 'completed' }]);

      // Step 4: Finalize workflow
      setCurrentStep(4);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setWorkflowResults(prev => [...prev, { 
        step: 4, 
        result: { 
          success: true, 
          message: 'Workflow completed successfully',
          final_document_id: processedDoc.processed_document_id 
        }, 
        status: 'completed' 
      }]);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Workflow processing failed');
      setWorkflowResults(prev => [...prev, { 
        step: currentStep, 
        result: { success: false, error: err instanceof Error ? err.message : 'Unknown error' }, 
        status: 'failed' 
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStepStatus = (stepNumber: number) => {
    if (currentStep > stepNumber) return 'completed';
    if (currentStep === stepNumber) return 'processing';
    return 'pending';
  };

  const getStepIcon = (stepNumber: number) => {
    const status = getStepStatus(stepNumber);
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
    }
  };

  const selectedWorkflow = workflowTypes.find(w => w.id === workflowConfig.workflowType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Foxit Document Workflow
          </h1>
          <p className="text-lg text-gray-600">
            Automated document processing workflows with chained operations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Workflow Configuration
              </CardTitle>
              <CardDescription>
                Configure your document workflow settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Workflow Type Selection */}
              <div className="space-y-2">
                <Label htmlFor="workflowType">Workflow Type</Label>
                <Select 
                  value={workflowConfig.workflowType} 
                  onValueChange={(value) => handleInputChange('workflowType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select workflow type" />
                  </SelectTrigger>
                  <SelectContent>
                    {workflowTypes.map(workflow => (
                      <SelectItem key={workflow.id} value={workflow.id}>
                        <div>
                          <div className="font-medium">{workflow.name}</div>
                          <div className="text-sm text-gray-500">{workflow.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Customer Information */}
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  value={workflowConfig.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={workflowConfig.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="Acme Corp"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={workflowConfig.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="john@acme.com"
                />
              </div>

              {/* Workflow Options */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includeContract"
                    checked={workflowConfig.includeContract}
                    onChange={(e) => handleInputChange('includeContract', e.target.checked)}
                  />
                  <Label htmlFor="includeContract">Include Service Contract</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="addWatermark"
                    checked={workflowConfig.addWatermark}
                    onChange={(e) => handleInputChange('addWatermark', e.target.checked)}
                  />
                  <Label htmlFor="addWatermark">Add Watermark</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="compressOutput"
                    checked={workflowConfig.compressOutput}
                    onChange={(e) => handleInputChange('compressOutput', e.target.checked)}
                  />
                  <Label htmlFor="compressOutput">Compress Output</Label>
                </div>
              </div>

              <Button 
                onClick={handleStartWorkflow}
                disabled={isProcessing}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Processing Workflow...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Workflow
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Workflow Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="h-5 w-5" />
                Workflow Progress
              </CardTitle>
              <CardDescription>
                Track the progress of your document workflow
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedWorkflow && (
                <div className="space-y-4">
                  {selectedWorkflow.steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-3">
                      {getStepIcon(index + 1)}
                      <div className="flex-1">
                        <div className="text-sm font-medium">{step}</div>
                        <div className="text-xs text-gray-500">
                          {getStepStatus(index + 1) === 'completed' && 'Completed'}
                          {getStepStatus(index + 1) === 'processing' && 'Processing...'}
                          {getStepStatus(index + 1) === 'pending' && 'Pending'}
                        </div>
                      </div>
                      {index < selectedWorkflow.steps.length - 1 && (
                        <ArrowRight className="h-4 w-4 text-gray-300" />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {isProcessing && (
                <div className="mt-4">
                  <Progress value={(currentStep / (selectedWorkflow?.steps.length || 1)) * 100} />
                  <div className="text-xs text-gray-500 mt-1">
                    Step {currentStep} of {selectedWorkflow?.steps.length}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Workflow Results
              </CardTitle>
              <CardDescription>
                View the results of your workflow execution
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {workflowResults.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Workflow className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Configure your workflow and click "Start Workflow" to begin</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {workflowResults.map((result, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Step {result.step}</span>
                        <Badge variant={result.status === 'completed' ? 'default' : 'destructive'}>
                          {result.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600">
                        {result.result.success ? (
                          <div>
                            {result.result.document_id && (
                              <div>Document ID: {result.result.document_id}</div>
                            )}
                            {result.result.processed_document_id && (
                              <div>Processed ID: {result.result.processed_document_id}</div>
                            )}
                            {result.result.message && (
                              <div>{result.result.message}</div>
                            )}
                          </div>
                        ) : (
                          <div className="text-red-600">{result.result.error}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Workflow Types Overview */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Available Workflow Types</CardTitle>
            <CardDescription>
              Choose from our pre-configured workflow templates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {workflowTypes.map(workflow => (
                <div 
                  key={workflow.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    workflowConfig.workflowType === workflow.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleInputChange('workflowType', workflow.id)}
                >
                  <h4 className="font-medium mb-2">{workflow.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{workflow.description}</p>
                  <div className="space-y-1">
                    {workflow.steps.map((step, index) => (
                      <div key={index} className="text-xs text-gray-500 flex items-center gap-1">
                        <div className="w-1 h-1 bg-gray-400 rounded-full" />
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FoxitDocumentWorkflow;
