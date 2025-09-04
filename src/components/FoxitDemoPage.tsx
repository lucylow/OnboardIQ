import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Download, 
  Upload, 
  Settings, 
  Play, 
  CheckCircle, 
  AlertCircle,
  Zap,
  Shield,
  Users,
  Clock,
  Activity,
  Eye,
  Server,
  Wifi,
  CheckSquare,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface ApiCall {
  id: string;
  endpoint: string;
  method: string;
  status: 'pending' | 'success' | 'error';
  timestamp: Date;
  response?: any;
  duration?: number;
}

interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  apiCall?: string;
  progress?: number;
}

const FoxitDemoPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [apiCalls, setApiCalls] = useState<ApiCall[]>([]);
  const [generatedDoc, setGeneratedDoc] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isWorkflowRunning, setIsWorkflowRunning] = useState(false);
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([
    { id: '1', name: 'Document Generation', description: 'Create welcome packet', status: 'pending' },
    { id: '2', name: 'PDF Processing', description: 'Add watermark & compress', status: 'pending' },
    { id: '3', name: 'Delivery', description: 'Send to customer', status: 'pending' }
  ]);
  const [formData, setFormData] = useState({
    documentType: 'welcome_packet',
    customerName: 'Sarah Chen',
    companyName: 'TechCorp Solutions'
  });
  const { toast } = useToast();

  const addApiCall = (call: Omit<ApiCall, 'id' | 'timestamp'>) => {
    const newCall: ApiCall = {
      ...call,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date()
    };
    setApiCalls(prev => [newCall, ...prev].slice(0, 10)); // Keep only last 10 calls
    return newCall.id;
  };

  const updateApiCall = (id: string, updates: Partial<ApiCall>) => {
    setApiCalls(prev => prev.map(call => 
      call.id === id 
        ? { ...call, ...updates, duration: Date.now() - call.timestamp.getTime() }
        : call
    ));
  };

  const handleGenerateDocument = async () => {
    setIsGenerating(true);
    setProgress(0);
    setGeneratedDoc(null);
    
    // Start API call
    const callId = addApiCall({
      endpoint: '/functions/v1/foxit-api/generate-document',
      method: 'POST',
      status: 'pending'
    });

    // Simulate progress and API call
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + 12, 100);
        
        if (newProgress >= 50 && newProgress < 60) {
          updateApiCall(callId, { 
            status: 'success',
            response: {
              document_id: `DOC_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
              status: 'processing',
              template_id: formData.documentType
            }
          });
        }
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          
          // Final success response
          const mockDoc = {
            document_id: `DOC_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
            document_url: `https://demo-foxit.com/documents/doc_${Date.now()}.pdf`,
            file_size: '2.4 MB',
            generated_at: new Date().toISOString(),
            processing_time: '2.3 seconds',
            pages: 8,
            template_used: formData.documentType,
            customer_data: {
              name: formData.customerName,
              company: formData.companyName
            }
          };
          
          setGeneratedDoc(mockDoc);
          updateApiCall(callId, { 
            status: 'success',
            response: mockDoc
          });
          
          toast({
            title: "Document Generated Successfully!",
            description: `Created ${mockDoc.pages}-page document in ${mockDoc.processing_time}`,
          });
        }
        
        return newProgress;
      });
    }, 200);
  };

  const handleProcessPDF = async () => {
    setIsProcessing(true);
    
    const callId = addApiCall({
      endpoint: '/functions/v1/foxit-api/process-workflow',
      method: 'POST',
      status: 'pending'
    });

    setTimeout(() => {
      const mockResponse = {
        processed_document_id: `PROC_${Date.now()}`,
        operations_applied: ['watermark', 'compression', 'encryption'],
        file_size_reduction: '35%',
        processing_time: '1.8 seconds',
        security_level: 'enhanced'
      };
      
      updateApiCall(callId, { 
        status: 'success',
        response: mockResponse
      });
      
      setIsProcessing(false);
      
      toast({
        title: "PDF Processing Complete!",
        description: `File size reduced by ${mockResponse.file_size_reduction}`,
      });
    }, 2500);
  };

  const runWorkflowDemo = async () => {
    setIsWorkflowRunning(true);
    
    // Reset all steps
    setWorkflowSteps(prev => prev.map(step => ({ ...step, status: 'pending', progress: 0 })));
    
    // Step 1: Document Generation
    setWorkflowSteps(prev => prev.map(step => 
      step.id === '1' ? { ...step, status: 'running', progress: 0 } : step
    ));
    
    const genCallId = addApiCall({
      endpoint: '/functions/v1/foxit-api/generate-document',
      method: 'POST',
      status: 'pending'
    });

    // Simulate step 1 progress
    for (let i = 0; i <= 100; i += 20) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setWorkflowSteps(prev => prev.map(step => 
        step.id === '1' ? { ...step, progress: i } : step
      ));
    }
    
    updateApiCall(genCallId, { 
      status: 'success',
      response: { document_id: 'WF_DOC_001', status: 'generated' }
    });
    
    setWorkflowSteps(prev => prev.map(step => 
      step.id === '1' ? { ...step, status: 'completed', progress: 100 } : step
    ));

    // Step 2: PDF Processing
    setWorkflowSteps(prev => prev.map(step => 
      step.id === '2' ? { ...step, status: 'running', progress: 0 } : step
    ));
    
    const processCallId = addApiCall({
      endpoint: '/functions/v1/foxit-api/process-workflow',
      method: 'POST',
      status: 'pending'
    });

    for (let i = 0; i <= 100; i += 25) {
      await new Promise(resolve => setTimeout(resolve, 400));
      setWorkflowSteps(prev => prev.map(step => 
        step.id === '2' ? { ...step, progress: i } : step
      ));
    }
    
    updateApiCall(processCallId, { 
      status: 'success',
      response: { processed_id: 'WF_PROC_001', watermark: 'applied', compressed: true }
    });
    
    setWorkflowSteps(prev => prev.map(step => 
      step.id === '2' ? { ...step, status: 'completed', progress: 100 } : step
    ));

    // Step 3: Delivery
    setWorkflowSteps(prev => prev.map(step => 
      step.id === '3' ? { ...step, status: 'running', progress: 0 } : step
    ));
    
    const deliveryCallId = addApiCall({
      endpoint: '/functions/v1/foxit-api/deliver-document',
      method: 'POST',
      status: 'pending'
    });

    for (let i = 0; i <= 100; i += 33) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setWorkflowSteps(prev => prev.map(step => 
        step.id === '3' ? { ...step, progress: i } : step
      ));
    }
    
    updateApiCall(deliveryCallId, { 
      status: 'success',
      response: { delivery_id: 'WF_DEL_001', sent_to: formData.customerName, delivery_time: '0.8s' }
    });
    
    setWorkflowSteps(prev => prev.map(step => 
      step.id === '3' ? { ...step, status: 'completed', progress: 100 } : step
    ));

    setIsWorkflowRunning(false);
    
    toast({
      title: "Workflow Completed Successfully!",
      description: "All 3 steps completed in 4.2 seconds",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-gray-400" />;
      case 'running': return <Activity className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'border-gray-200 bg-gray-50';
      case 'running': return 'border-blue-200 bg-blue-50';
      case 'completed': case 'success': return 'border-green-200 bg-green-50';
      case 'error': return 'border-red-200 bg-red-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Working Demo Link */}
        <div className="mb-6">
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>🎉 Working Demo Available!</strong> Try the fully functional Foxit PDF Generator with real document generation and download capabilities.{' '}
              <Link 
                to="/foxit-pdf-generator" 
                className="inline-flex items-center gap-1 text-green-700 hover:text-green-800 font-medium underline"
              >
                Launch Working Demo
                <ExternalLink className="h-3 w-3" />
              </Link>
            </AlertDescription>
          </Alert>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Foxit PDF Integration Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the power of AI-driven document generation and processing with Foxit APIs
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <FileText className="h-3 w-3 mr-1" />
              Document Generation
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Shield className="h-3 w-3 mr-1" />
              PDF Processing
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              <Users className="h-3 w-3 mr-1" />
              Workflow Automation
            </Badge>
          </div>
        </div>

        {/* API Activity Monitor */}
        {apiCalls.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5 text-green-600" />
                Live API Activity
                <Badge variant="outline" className="ml-2">
                  <Wifi className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              </CardTitle>
              <CardDescription>
                Real-time API calls and responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {apiCalls.map((call) => (
                  <div key={call.id} className={`flex items-center justify-between p-3 rounded-lg border ${getStatusColor(call.status)}`}>
                    <div className="flex items-center gap-3">
                      {getStatusIcon(call.status)}
                      <div>
                        <div className="font-mono text-sm">{call.method} {call.endpoint}</div>
                        <div className="text-xs text-gray-500">
                          {call.timestamp.toLocaleTimeString()}
                          {call.duration && ` • ${call.duration}ms`}
                        </div>
                      </div>
                    </div>
                    {call.response && (
                      <Badge variant="outline" className="text-xs">
                        {call.response.document_id || call.response.processed_document_id || 'Response'}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="generation">Document Generation</TabsTrigger>
            <TabsTrigger value="processing">PDF Processing</TabsTrigger>
            <TabsTrigger value="workflow">Workflow Demo</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Document Generation
                  </CardTitle>
                  <CardDescription>
                    Create personalized documents from templates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Welcome packets
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Service contracts
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Invoices & receipts
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-green-600" />
                    PDF Processing
                  </CardTitle>
                  <CardDescription>
                    Advanced PDF manipulation and enhancement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Merge & split documents
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Add watermarks & security
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Compress & optimize
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-purple-600" />
                    Workflow Automation
                  </CardTitle>
                  <CardDescription>
                    End-to-end document processing workflows
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Multi-step processing
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Conditional logic
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Batch operations
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This demo showcases the Foxit PDF integration capabilities with live API monitoring and realistic response simulation.
              </AlertDescription>
            </Alert>
          </TabsContent>

          {/* Document Generation Tab */}
          <TabsContent value="generation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Generate Sample Document</CardTitle>
                  <CardDescription>
                    Create a personalized document using our document generation API
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="documentType">Document Type</Label>
                      <Select value={formData.documentType} onValueChange={(value) => setFormData(prev => ({ ...prev, documentType: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="welcome_packet">Welcome Packet</SelectItem>
                          <SelectItem value="service_contract">Service Contract</SelectItem>
                          <SelectItem value="invoice">Invoice</SelectItem>
                          <SelectItem value="onboarding_guide">Onboarding Guide</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="customerName">Customer Name</Label>
                        <Input 
                          id="customerName"
                          value={formData.customerName}
                          onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input 
                          id="companyName"
                          value={formData.companyName}
                          onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                          placeholder="Acme Corp"
                        />
                      </div>
                    </div>
                  </div>

                  {isGenerating && (
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>🔄 Calling Foxit API...</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="w-full" />
                      <div className="text-xs text-gray-500 space-y-1">
                        {progress < 30 && <div>• Authenticating with Foxit API</div>}
                        {progress >= 30 && progress < 60 && <div>• Processing template data</div>}
                        {progress >= 60 && progress < 90 && <div>• Generating PDF document</div>}
                        {progress >= 90 && <div>• Finalizing document</div>}
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={handleGenerateDocument}
                    disabled={isGenerating}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Document
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Results Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Generation Results
                  </CardTitle>
                  <CardDescription>
                    Live API response and document details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!generatedDoc && !isGenerating && (
                    <div className="text-center text-gray-500 py-8">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Configure your document and click "Generate" to see the API in action</p>
                    </div>
                  )}

                  {generatedDoc && (
                    <div className="space-y-4">
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          Document generated successfully via Foxit API!
                        </AlertDescription>
                      </Alert>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Document ID:</span>
                          <Badge variant="secondary" className="font-mono text-xs">
                            {generatedDoc.document_id}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">File Size:</span>
                          <span className="text-sm">{generatedDoc.file_size}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Pages:</span>
                          <span className="text-sm">{generatedDoc.pages}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Processing Time:</span>
                          <span className="text-sm">{generatedDoc.processing_time}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Template:</span>
                          <Badge variant="outline" className="capitalize">
                            {generatedDoc.template_used.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* PDF Processing Tab */}
          <TabsContent value="processing" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload PDF</CardTitle>
                  <CardDescription>
                    Upload a PDF file for processing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Drag and drop PDF files here</p>
                    <Button variant="outline" className="mt-2">
                      Choose File
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Processing Options</CardTitle>
                  <CardDescription>
                    Select processing operations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="compress" defaultChecked />
                    <label htmlFor="compress" className="text-sm">Compress PDF (reduce file size)</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="watermark" defaultChecked />
                    <label htmlFor="watermark" className="text-sm">Add watermark</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="encrypt" />
                    <label htmlFor="encrypt" className="text-sm">Encrypt document</label>
                  </div>

                  {isProcessing && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="h-4 w-4 text-blue-500 animate-spin" />
                        <span className="text-sm font-medium">Processing via Foxit API...</span>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>• Applying watermark</div>
                        <div>• Compressing document</div>
                        <div>• Optimizing for web delivery</div>
                      </div>
                    </div>
                  )}

                  <Button 
                    className="w-full mt-4" 
                    onClick={handleProcessPDF}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Activity className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Process PDF
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Workflow Demo Tab */}
          <TabsContent value="workflow" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Document Workflow Demo</CardTitle>
                <CardDescription>
                  Experience a complete document processing workflow with live API calls
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workflowSteps.map((step, index) => (
                    <div key={step.id} className={`p-4 rounded-lg border-2 ${getStatusColor(step.status)}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                            step.status === 'completed' ? 'bg-green-500' : 
                            step.status === 'running' ? 'bg-blue-500' : 'bg-gray-400'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-medium">{step.name}</h4>
                            <p className="text-sm text-gray-600">{step.description}</p>
                            {step.status === 'running' && (
                              <div className="text-xs text-blue-600 mt-1">
                                API call in progress...
                              </div>
                            )}
                          </div>
                        </div>
                        {getStatusIcon(step.status)}
                      </div>
                      
                      {step.status === 'running' && typeof step.progress === 'number' && (
                        <div className="mt-3">
                          <Progress value={step.progress} className="w-full h-2" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <Button 
                  className="w-full mt-6" 
                  onClick={runWorkflowDemo}
                  disabled={isWorkflowRunning}
                >
                  {isWorkflowRunning ? (
                    <>
                      <Activity className="h-4 w-4 mr-2 animate-spin" />
                      Running Workflow...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Workflow Demo
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FoxitDemoPage;
