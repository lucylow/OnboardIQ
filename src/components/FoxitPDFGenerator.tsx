import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
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
  User,
  Building,
  Mail,
  Phone
} from 'lucide-react';
import { foxitApiService } from '../services/foxitApiService';

interface FoxitPDFGeneratorProps {
  userId: string;
}

const FoxitPDFGenerator: React.FC<FoxitPDFGeneratorProps> = ({ userId }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedDocument, setGeneratedDocument] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    templateId: 'welcome_packet',
    customerName: '',
    companyName: '',
    email: '',
    phoneNumber: '',
    welcomeMessage: 'Welcome to OnboardIQ! We\'re excited to have you on board.',
    startDate: new Date().toISOString().split('T')[0]
  });

  const templates = [
    { id: 'welcome_packet', name: 'Welcome Packet', description: 'Personalized welcome letter and onboarding guide' },
    { id: 'contract', name: 'Service Contract', description: 'Professional service agreement with terms' },
    { id: 'onboarding_guide', name: 'Onboarding Guide', description: 'Step-by-step customer onboarding process' },
    { id: 'invoice', name: 'Invoice', description: 'Professional billing document' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenerateDocument = async () => {
    setIsGenerating(true);
    setProgress(0);
    setError(null);
    setGeneratedDocument(null);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Call Foxit API
      const response = await foxitApiService.generateDocument({
        templateId: formData.templateId,
        data: {
          customer_name: formData.customerName,
          company_name: formData.companyName,
          email: formData.email,
          phone_number: formData.phoneNumber,
          welcome_message: formData.welcomeMessage,
          start_date: formData.startDate
        },
        options: {
          includeWatermark: true
        }
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (response.success) {
        setGeneratedDocument(response);
      } else {
        setError('Failed to generate document');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedDocument) return;

    try {
      const downloadResponse = await foxitApiService.downloadDocument(generatedDocument.document_id);
      
      // Create a temporary link to download the file
      const link = document.createElement('a');
      link.href = downloadResponse.url;
      link.download = downloadResponse.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError('Failed to download document');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Foxit PDF Generator
          </h1>
          <p className="text-lg text-gray-600">
            Generate personalized PDF documents using AI-powered templates
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Document Configuration
              </CardTitle>
              <CardDescription>
                Configure your document settings and data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Template Selection */}
              <div className="space-y-2">
                <Label htmlFor="template">Document Template</Label>
                <Select 
                  value={formData.templateId} 
                  onValueChange={(value) => handleInputChange('templateId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        <div>
                          <div className="font-medium">{template.name}</div>
                          <div className="text-sm text-gray-500">{template.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Customer Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="Acme Corp"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="john@acme.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="welcomeMessage">Welcome Message</Label>
                <Textarea
                  id="welcomeMessage"
                  value={formData.welcomeMessage}
                  onChange={(e) => handleInputChange('welcomeMessage', e.target.value)}
                  placeholder="Enter your personalized welcome message..."
                  rows={3}
                />
              </div>

              <Button 
                onClick={handleGenerateDocument}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Generating Document...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate PDF
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Generation Results
              </CardTitle>
              <CardDescription>
                View and download your generated document
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isGenerating && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Generating document...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {generatedDocument && (
                <div className="space-y-4">
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Document generated successfully!
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Document ID:</span>
                      <Badge variant="secondary">{generatedDocument.document_id}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">File Size:</span>
                      <span className="text-sm">{generatedDocument.file_size}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Generated:</span>
                      <span className="text-sm">
                        {new Date(generatedDocument.generated_at).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleDownload} className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <FileText className="h-4 w-4 mr-2" />
                      View Online
                    </Button>
                  </div>
                </div>
              )}

              {!isGenerating && !generatedDocument && !error && (
                <div className="text-center text-gray-500 py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Configure your document and click "Generate PDF" to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Template Preview */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Template Preview</CardTitle>
            <CardDescription>
              Preview of the selected template structure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {templates.map(template => (
                <div 
                  key={template.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    formData.templateId === template.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleInputChange('templateId', template.id)}
                >
                  <h4 className="font-medium mb-1">{template.name}</h4>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FoxitPDFGenerator;
