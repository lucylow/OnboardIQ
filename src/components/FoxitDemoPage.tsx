import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
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
  Clock
} from 'lucide-react';

const FoxitDemoPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleGenerateDocument = async () => {
    setIsGenerating(true);
    setProgress(0);
    
    // Simulate document generation progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
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
                This demo showcases the Foxit PDF integration capabilities. All operations use mock data for demonstration purposes.
              </AlertDescription>
            </Alert>
          </TabsContent>

          {/* Document Generation Tab */}
          <TabsContent value="generation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generate Sample Document</CardTitle>
                <CardDescription>
                  Create a personalized welcome packet using our document generation API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Document Type</label>
                    <select className="w-full mt-1 p-2 border rounded-md">
                      <option>Welcome Packet</option>
                      <option>Service Contract</option>
                      <option>Invoice</option>
                      <option>Onboarding Guide</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Customer Name</label>
                    <input 
                      type="text" 
                      placeholder="John Doe"
                      className="w-full mt-1 p-2 border rounded-md"
                    />
                  </div>
                </div>

                {isGenerating && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Generating document...</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="w-full" />
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
                    <input type="checkbox" id="compress" />
                    <label htmlFor="compress">Compress PDF</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="watermark" />
                    <label htmlFor="watermark">Add watermark</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="encrypt" />
                    <label htmlFor="encrypt">Encrypt document</label>
                  </div>
                  <Button className="w-full mt-4">
                    <Zap className="h-4 w-4 mr-2" />
                    Process PDF
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
                  Experience a complete document processing workflow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        1
                      </div>
                      <div>
                        <h4 className="font-medium">Document Generation</h4>
                        <p className="text-sm text-gray-600">Create welcome packet</p>
                      </div>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        2
                      </div>
                      <div>
                        <h4 className="font-medium">PDF Processing</h4>
                        <p className="text-sm text-gray-600">Add watermark & compress</p>
                      </div>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        3
                      </div>
                      <div>
                        <h4 className="font-medium">Delivery</h4>
                        <p className="text-sm text-gray-600">Send to customer</p>
                      </div>
                    </div>
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <Button className="w-full mt-6">
                  <Play className="h-4 w-4 mr-2" />
                  Start Workflow Demo
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
