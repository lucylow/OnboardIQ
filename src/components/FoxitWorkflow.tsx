import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { foxitApiService, ESignatureRequest, PDFOperationRequest, EmbedTokenRequest, DocumentAnalytics, AnalyticsReport, WorkflowTemplate, WorkflowExecution } from '@/services/foxitApiService';
import { 
  FileText, 
  FileSignature, 
  Eye, 
  Settings, 
  Play, 
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Upload,
  Merge,
  Minus,
  Shield,
  Users,
  Workflow,
  FileText as Template,
  Zap,
  ArrowRight,
  ChevronRight,
  RefreshCw,
  Copy,
  ExternalLink,
  Mail,
  Bell,
  Calendar,
  BarChart3,
  Activity,
  Globe,
  Lock,
  Unlock,
  FileCheck,
  FileX,
  FilePlus,
  RotateCw,
  Wrench
} from 'lucide-react';

interface WorkflowStep {
  id: string;
  name: string;
  type: 'document_generation' | 'pdf_operation' | 'esignature' | 'notification' | 'workflow';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  result?: any;
  error?: string;
}

interface DocumentTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  fields: string[];
  estimatedTime: number;
}

const FoxitWorkflow: React.FC = () => {
  const [activeTab, setActiveTab] = useState('workflows');
  const [workflows, setWorkflows] = useState<WorkflowStep[]>([]);
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [embedToken, setEmbedToken] = useState<string>('');
  const [currentWorkflow, setCurrentWorkflow] = useState<WorkflowStep | null>(null);
  const [workflowTemplates, setWorkflowTemplates] = useState<WorkflowTemplate[]>([]);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsReport | null>(null);
  const [documentAnalytics, setDocumentAnalytics] = useState<DocumentAnalytics | null>(null);
  const [selectedWorkflowTemplate, setSelectedWorkflowTemplate] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [healthStatus, setHealthStatus] = useState<{ connected: boolean; response_time?: number } | null>(null);
  const [circuitBreakerStatus, setCircuitBreakerStatus] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadTemplates();
    loadWorkflows();
    loadWorkflowTemplates();
    loadAnalytics();
    checkHealthStatus();
  }, []);

  const checkHealthStatus = async () => {
    try {
      const health = await foxitApiService.healthCheck();
      setHealthStatus(health);
      setCircuitBreakerStatus(foxitApiService.getCircuitBreakerStatus());
    } catch (error) {
      console.error('Error checking health status:', error);
      setError('Failed to check service health');
    }
  };

  const loadTemplates = async () => {
    try {
      setError(null);
      const response = await foxitApiService.getTemplates();
      if (response.success && response.templates) {
        setTemplates(response.templates.map(template => ({
          id: template.id,
          name: template.name,
          category: template.category,
          description: template.description,
          fields: template.fields,
          estimatedTime: template.estimated_time ? parseInt(template.estimated_time) : 5
        })));
      }
    } catch (error) {
      console.error('Error loading templates:', error);
      setError('Failed to load templates');
      toast({
        title: "Error",
        description: "Failed to load document templates. Please try again.",
        variant: "destructive",
      });
    }
  };

  const loadWorkflows = async () => {
    // Mock workflows for demonstration
    setWorkflows([
      {
        id: 'workflow-1',
        name: 'Welcome Packet Generation',
        type: 'document_generation',
        status: 'completed',
        progress: 100,
        result: { documentId: 'doc_123', url: 'https://example.com/welcome.pdf' }
      },
      {
        id: 'workflow-2',
        name: 'Contract E-Signature',
        type: 'esignature',
        status: 'processing',
        progress: 65,
        result: { envelopeId: 'env_456', status: 'sent' }
      },
      {
        id: 'workflow-3',
        name: 'PDF Compression & Watermark',
        type: 'pdf_operation',
        status: 'pending',
        progress: 0
      }
    ]);
  };

  const loadWorkflowTemplates = async () => {
    try {
      const templates = await foxitApiService.getWorkflowTemplates();
      setWorkflowTemplates(templates);
    } catch (error) {
      console.error('Error loading workflow templates:', error);
    }
  };

  const loadAnalytics = async () => {
    try {
      const analytics = await foxitApiService.getAnalyticsReport('last_30_days');
      setAnalyticsData(analytics);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const loadDocumentAnalytics = async (documentId: string) => {
    try {
      const analytics = await foxitApiService.getDocumentAnalytics(documentId);
      setDocumentAnalytics(analytics);
    } catch (error) {
      console.error('Error loading document analytics:', error);
    }
  };

  const startDocumentGeneration = async () => {
    if (!selectedTemplate) {
      toast({
        title: "Template Required",
        description: "Please select a document template first.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await foxitApiService.generateDocument({
        templateId: selectedTemplate,
        data: formData,
        options: {
          format: 'pdf',
          includeWatermark: true,
          compression: true
        }
      });

      if (response.success) {
        toast({
          title: "Document Generated!",
          description: "Your document has been created successfully.",
        });

        // Add to workflows
        const newWorkflow: WorkflowStep = {
          id: `workflow-${Date.now()}`,
          name: `Generated: ${templates.find(t => t.id === selectedTemplate)?.name}`,
          type: 'document_generation',
          status: 'completed',
          progress: 100,
          result: response
        };

        setWorkflows(prev => [newWorkflow, ...prev]);
      }
    } catch (error) {
      console.error('Error generating document:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const initiateESignature = async (documentUrl: string) => {
    setLoading(true);
    try {
      const request: ESignatureRequest = {
        envelopeName: 'Onboarding Agreement',
        recipients: [
          {
            firstName: 'John',
            lastName: 'Doe',
            emailId: 'john.doe@example.com',
            role: 'signer'
          }
        ],
        documents: [
          {
            url: documentUrl,
            name: 'Onboarding Agreement'
          }
        ],
        options: {
          expiresIn: 30,
          reminderFrequency: 3,
          callbackUrl: 'https://yourapp.com/webhooks/esign'
        }
      };

      const response = await foxitApiService.initiateESignature(request);

      toast({
        title: "E-Signature Initiated!",
        description: "Signature request has been sent to recipients.",
      });

      // Add to workflows
      const newWorkflow: WorkflowStep = {
        id: `esign-${Date.now()}`,
        name: 'E-Signature Workflow',
        type: 'esignature',
        status: 'processing',
        progress: 25,
        result: response
      };

      setWorkflows(prev => [newWorkflow, ...prev]);
    } catch (error) {
      console.error('Error initiating e-signature:', error);
      toast({
        title: "E-Signature Failed",
        description: "Failed to initiate signature workflow.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const performPDFOperation = async (operation: string, documentId: string) => {
    setLoading(true);
    try {
      const request: PDFOperationRequest = {
        operation: operation as any,
        documents: [documentId],
        options: {
          compressionLevel: 'medium',
          watermarkText: 'OnboardIQ - Confidential',
          watermarkPosition: 'center'
        }
      };

      const response = await foxitApiService.performPDFOperation(request);

      toast({
        title: "PDF Operation Started!",
        description: `PDF ${operation} operation has been initiated.`,
      });

      // Add to workflows
      const newWorkflow: WorkflowStep = {
        id: `pdf-${Date.now()}`,
        name: `PDF ${operation.charAt(0).toUpperCase() + operation.slice(1)}`,
        type: 'pdf_operation',
        status: 'processing',
        progress: 30,
        result: response
      };

      setWorkflows(prev => [newWorkflow, ...prev]);
    } catch (error) {
      console.error('Error performing PDF operation:', error);
      toast({
        title: "PDF Operation Failed",
        description: "Failed to perform PDF operation.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const performAdvancedPDFOperation = async (operation: string, documentId: string, options?: any) => {
    setLoading(true);
    try {
      const request: PDFOperationRequest = {
        operation: operation as any,
        documents: [documentId],
        options: {
          ...options,
          compressionLevel: 'medium',
          watermarkText: 'OnboardIQ - Confidential',
          watermarkPosition: 'center'
        }
      };

      const response = await foxitApiService.performAdvancedPDFOperation(request);

      toast({
        title: "Advanced PDF Operation Started!",
        description: `Advanced PDF ${operation} operation has been initiated.`,
      });

      // Add to workflows
      const newWorkflow: WorkflowStep = {
        id: `advanced-pdf-${Date.now()}`,
        name: `Advanced PDF ${operation.charAt(0).toUpperCase() + operation.slice(1)}`,
        type: 'pdf_operation',
        status: 'processing',
        progress: 30,
        result: response
      };

      setWorkflows(prev => [newWorkflow, ...prev]);
    } catch (error) {
      console.error('Error performing advanced PDF operation:', error);
      toast({
        title: "Advanced PDF Operation Failed",
        description: "Failed to perform advanced PDF operation.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const executeWorkflowTemplate = async (templateId: string, data: any) => {
    setLoading(true);
    try {
      const execution = await foxitApiService.executeWorkflowTemplate(templateId, data);

      toast({
        title: "Workflow Started!",
        description: `Workflow template execution has been initiated.`,
      });

      // Add to workflows
      const newWorkflow: WorkflowStep = {
        id: `workflow-${Date.now()}`,
        name: `Workflow Template: ${workflowTemplates.find(t => t.id === templateId)?.name}`,
        type: 'workflow',
        status: 'processing',
        progress: 25,
        result: execution
      };

      setWorkflows(prev => [newWorkflow, ...prev]);
    } catch (error) {
      console.error('Error executing workflow template:', error);
      toast({
        title: "Workflow Execution Failed",
        description: "Failed to execute workflow template.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const trackDocumentEvent = async (documentId: string, event: 'view' | 'download' | 'print' | 'share') => {
    try {
      await foxitApiService.trackDocumentEvent(documentId, event);
      console.log(`Tracked ${event} event for document ${documentId}`);
    } catch (error) {
      console.error('Error tracking document event:', error);
    }
  };

  const generateEmbedToken = async (documentId: string) => {
    setLoading(true);
    try {
      const request: EmbedTokenRequest = {
        documentId,
        options: {
          allowDownload: false,
          allowPrint: true,
          allowEdit: false,
          watermark: 'Preview Only',
          expireIn: 60
        }
      };

      const response = await foxitApiService.generateEmbedToken(request);

      setEmbedToken(response.token);
      toast({
        title: "Embed Token Generated!",
        description: "Document can now be embedded in your application.",
      });
    } catch (error) {
      console.error('Error generating embed token:', error);
      toast({
        title: "Embed Token Failed",
        description: "Failed to generate embed token.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'processing': return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document_generation': return <FileText className="w-4 h-4" />;
      case 'esignature': return <FileSignature className="w-4 h-4" />;
      case 'pdf_operation': return <Settings className="w-4 h-4" />;
      case 'notification': return <Bell className="w-4 h-4" />;
      default: return <Workflow className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between"
      >
        <div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-gray-900 flex items-center gap-3"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FileText className="w-8 h-8 text-blue-600" />
            </motion.div>
            Foxit Document Workflow
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 mt-2"
          >
            Automated document generation, e-signature workflows, and PDF operations
          </motion.p>
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="flex items-center gap-3"
        >
          {healthStatus && (
            <Badge 
              variant={healthStatus.connected ? "default" : "destructive"} 
              className="flex items-center gap-2"
            >
              <div className={`w-2 h-2 rounded-full ${healthStatus.connected ? 'bg-green-500' : 'bg-red-500'}`} />
              {healthStatus.connected ? 'Connected' : 'Disconnected'}
              {healthStatus.response_time && (
                <span className="text-xs">({healthStatus.response_time}ms)</span>
              )}
            </Badge>
          )}
          <Badge variant="secondary" className="flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200">
            <Zap className="w-4 h-4" />
            Enterprise Ready
          </Badge>
        </motion.div>
      </motion.div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => {
                  setError(null);
                  checkHealthStatus();
                  loadTemplates();
                  loadWorkflows();
                  loadWorkflowTemplates();
                  loadAnalytics();
                }}
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Feature Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Document Generation</h3>
                <p className="text-sm text-gray-600">Dynamic templates</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileSignature className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">E-Signature</h3>
                <p className="text-sm text-gray-600">Digital workflows</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Eye className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Embedded Viewer</h3>
                <p className="text-sm text-gray-600">In-app preview</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Workflow className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold">Automation</h3>
                <p className="text-sm text-gray-600">Workflow orchestration</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                  <TabsList className="grid w-full grid-cols-6 bg-gray-100 p-1">
          <TabsTrigger value="workflows" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Workflow className="w-4 h-4 mr-2" />
            Workflows
          </TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Template className="w-4 h-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="operations" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Settings className="w-4 h-4 mr-2" />
            PDF Operations
          </TabsTrigger>
          <TabsTrigger value="advanced" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Zap className="w-4 h-4 mr-2" />
            Advanced
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="embedding" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Eye className="w-4 h-4 mr-2" />
            Embedding
          </TabsTrigger>
        </TabsList>

          {/* Workflows Tab */}
          <TabsContent value="workflows" className="space-y-4">
            {loading && workflows.length === 0 ? (
              <div className="grid gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
                          <div className="space-y-2">
                            <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
                            <div className="w-20 h-3 bg-gray-200 rounded animate-pulse" />
                          </div>
                        </div>
                        <div className="w-24 h-2 bg-gray-200 rounded animate-pulse" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid gap-4">
                {workflows.map((workflow, index) => (
                  <motion.div
                    key={workflow.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              {getTypeIcon(workflow.type)}
                            </div>
                            <div>
                              <h3 className="font-semibold">{workflow.name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className={getStatusColor(workflow.status)}>
                                  {getStatusIcon(workflow.status)}
                                  {workflow.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={workflow.progress} className="w-24" />
                            <span className="text-sm text-gray-600">{workflow.progress}%</span>
                          </div>
                        </div>
                        
                        {workflow.result && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Result:</span>
                              <div className="flex gap-2">
                                {workflow.result.documentId && (
                                  <Button size="sm" variant="outline" onClick={() => generateEmbedToken(workflow.result.documentId)}>
                                    <Eye className="w-4 h-4 mr-1" />
                                    Preview
                                  </Button>
                                )}
                                {workflow.result.documentUrl && (
                                  <Button size="sm" variant="outline" onClick={() => window.open(workflow.result.documentUrl, '_blank')}>
                                    <Download className="w-4 h-4 mr-1" />
                                    Download
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Document Generation</CardTitle>
                <CardDescription>Generate documents from templates with dynamic data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Select Template</label>
                    <select 
                      value={selectedTemplate}
                      onChange={(e) => setSelectedTemplate(e.target.value)}
                      className="w-full mt-1 p-2 border rounded-md"
                    >
                      <option value="">Choose a template...</option>
                      {templates.map(template => (
                        <option key={template.id} value={template.id}>
                          {template.name} ({template.category})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Estimated Time</label>
                    <div className="mt-1 p-2 bg-gray-50 rounded-md">
                      {selectedTemplate ? 
                        `${templates.find(t => t.id === selectedTemplate)?.estimatedTime || 5} minutes` : 
                        'Select a template'
                      }
                    </div>
                  </div>
                </div>

                {selectedTemplate && (
                  <div>
                    <label className="text-sm font-medium">Template Fields</label>
                    <div className="mt-1 p-3 bg-blue-50 rounded-md">
                      <div className="flex flex-wrap gap-2">
                        {templates.find(t => t.id === selectedTemplate)?.fields.map(field => (
                          <Badge key={field} variant="outline" className="text-xs">
                            {field}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={startDocumentGeneration}
                  disabled={loading || !selectedTemplate}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Document
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PDF Operations Tab */}
          <TabsContent value="operations" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Merge className="w-5 h-5" />
                    PDF Merge
                  </CardTitle>
                  <CardDescription>Combine multiple PDFs into one document</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => performPDFOperation('merge', 'doc_123')}
                    disabled={loading}
                    className="w-full"
                  >
                    <Merge className="w-4 h-4 mr-2" />
                    Merge Documents
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                                     <CardTitle className="flex items-center gap-2">
                     <Minus className="w-5 h-5" />
                     PDF Compress
                   </CardTitle>
                  <CardDescription>Reduce file size while maintaining quality</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => performPDFOperation('compress', 'doc_123')}
                    disabled={loading}
                    className="w-full"
                  >
                                         <Minus className="w-4 h-4 mr-2" />
                     Compress PDF
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Add Watermark
                  </CardTitle>
                  <CardDescription>Add security watermarks to documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => performPDFOperation('watermark', 'doc_123')}
                    disabled={loading}
                    className="w-full"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Add Watermark
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Encrypt PDF
                  </CardTitle>
                  <CardDescription>Add password protection to documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => performPDFOperation('encrypt', 'doc_123')}
                    disabled={loading}
                    className="w-full"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Encrypt PDF
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RotateCw className="w-5 h-5" />
                    OCR Processing
                  </CardTitle>
                  <CardDescription>Extract text from scanned documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => performAdvancedPDFOperation('ocr', 'doc_123', { ocrLanguage: 'en' })}
                    disabled={loading}
                    className="w-full"
                  >
                    <RotateCw className="w-4 h-4 mr-2" />
                    Process OCR
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Redact Content
                  </CardTitle>
                  <CardDescription>Remove sensitive information from documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => performAdvancedPDFOperation('redact', 'doc_123', { redactPatterns: ['\\b\\d{3}-\\d{2}-\\d{4}\\b', '\\b\\w+@\\w+\\.\\w+\\b'] })}
                    disabled={loading}
                    className="w-full"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Redact Document
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Extract Text
                  </CardTitle>
                  <CardDescription>Extract text content from PDFs</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => performAdvancedPDFOperation('extract', 'doc_123', { extractText: true })}
                    disabled={loading}
                    className="w-full"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Extract Text
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="w-5 h-5" />
                    Repair PDF
                  </CardTitle>
                  <CardDescription>Fix corrupted PDF documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => performAdvancedPDFOperation('repair', 'doc_123', { repairCorruption: true })}
                    disabled={loading}
                    className="w-full"
                  >
                    <Wrench className="w-4 h-4 mr-2" />
                    Repair PDF
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Workflow Templates */}
            <Card>
              <CardHeader>
                <CardTitle>Workflow Templates</CardTitle>
                <CardDescription>Execute predefined workflow templates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workflowTemplates.map((template) => (
                    <div key={template.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{template.name}</h4>
                        <p className="text-sm text-gray-600">{template.description}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline">{template.category}</Badge>
                          <Badge variant="outline">{template.estimatedTotalTime}s</Badge>
                          <Badge variant="outline">{Math.round(template.successRate * 100)}% success</Badge>
                        </div>
                      </div>
                      <Button 
                        onClick={() => executeWorkflowTemplate(template.id, { customerName: 'John Doe', customerEmail: 'john@example.com' })}
                        disabled={loading}
                        size="sm"
                      >
                        Execute
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            {analyticsData && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{analyticsData.summary.totalDocuments.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Total Documents</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{analyticsData.summary.totalViews.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Total Views</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{analyticsData.summary.totalDownloads.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Total Downloads</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{Math.round(analyticsData.summary.successRate * 100)}%</div>
                      <div className="text-sm text-gray-600">Success Rate</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Top Documents</CardTitle>
                <CardDescription>Most viewed and downloaded documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData?.topDocuments.map((doc) => (
                    <div key={doc.documentId} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{doc.name}</h4>
                        <div className="flex gap-4 text-sm text-gray-600">
                          <span>{doc.views} views</span>
                          <span>{doc.downloads} downloads</span>
                          <span>{Math.round(doc.averageTimeSpent / 60)}min avg time</span>
                        </div>
                      </div>
                      <Button 
                        onClick={() => loadDocumentAnalytics(doc.documentId)}
                        size="sm"
                        variant="outline"
                      >
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {documentAnalytics && (
              <Card>
                <CardHeader>
                  <CardTitle>Document Analytics</CardTitle>
                  <CardDescription>Detailed analytics for selected document</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-xl font-bold">{documentAnalytics.usage.views}</div>
                      <div className="text-sm text-gray-600">Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold">{documentAnalytics.usage.downloads}</div>
                      <div className="text-sm text-gray-600">Downloads</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold">{Math.round(documentAnalytics.usage.timeSpent / 60)}</div>
                      <div className="text-sm text-gray-600">Avg Time (min)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold">{Math.round(documentAnalytics.userEngagement.completionRate * 100)}%</div>
                      <div className="text-sm text-gray-600">Completion Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Embedding Tab */}
          <TabsContent value="embedding" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Embedded Document Viewer</CardTitle>
                <CardDescription>Generate secure tokens for in-app document viewing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Document ID</label>
                    <input 
                      type="text" 
                      placeholder="Enter document ID"
                      className="w-full mt-1 p-2 border rounded-md"
                      defaultValue="doc_123"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Permissions</label>
                    <div className="mt-1 space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        Allow Download
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        Allow Print
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        Allow Edit
                      </label>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => generateEmbedToken('doc_123')}
                  disabled={loading}
                  className="w-full"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Generate Embed Token
                </Button>

                {embedToken && (
                  <Alert>
                    <ExternalLink className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <p><strong>Embed Token Generated:</strong></p>
                        <div className="flex items-center gap-2">
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm flex-1">
                            {embedToken}
                          </code>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => navigator.clipboard.writeText(embedToken)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600">
                          Use this token to embed the document viewer in your application.
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

export default FoxitWorkflow;
