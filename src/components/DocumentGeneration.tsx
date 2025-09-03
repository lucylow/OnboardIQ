import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Progress } from './ui/progress';
import { Loader2, CheckCircle, XCircle, FileText, Download, Eye, Archive, Settings } from 'lucide-react';
import { documentGenerationService, DocumentTemplate, GeneratedDocument } from '../services/documentGenerationService';

interface DocumentGenerationProps {
  userId: string;
  onDocumentGenerated?: (document: GeneratedDocument) => void;
  onDocumentFailed?: (error: string) => void;
}

export const DocumentGeneration: React.FC<DocumentGenerationProps> = ({
  userId,
  onDocumentGenerated,
  onDocumentFailed
}) => {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [personalization, setPersonalization] = useState({
    industry_specific: false,
    company_branding: false,
    custom_content: false
  });
  const [documents, setDocuments] = useState<GeneratedDocument[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<GeneratedDocument | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState<number>(0);

  // Load templates and user documents on component mount
  useEffect(() => {
    loadTemplates();
    loadUserDocuments();
  }, [userId]);

  const loadTemplates = async () => {
    try {
      const allTemplates = documentGenerationService.getAllTemplates();
      setTemplates(allTemplates);
      if (allTemplates.length > 0) {
        setSelectedTemplate(allTemplates[0].id);
      }
    } catch (err) {
      setError('Failed to load templates');
    }
  };

  const loadUserDocuments = async () => {
    try {
      const userDocuments = documentGenerationService.getDocumentsByUserId(userId);
      setDocuments(userDocuments);
    } catch (err) {
      setError('Failed to load documents');
    }
  };

  const handleGenerateDocument = async () => {
    if (!selectedTemplate) {
      setError('Please select a template');
      return;
    }

    // Validate template variables
    const validation = documentGenerationService.validateTemplateVariables(selectedTemplate, variables);
    if (!validation.valid) {
      setError(`Missing required fields: ${validation.missing.join(', ')}`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setGenerationProgress(0);

    // Simulate generation progress
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const document = await documentGenerationService.generateDocument(
        userId,
        selectedTemplate,
        variables,
        personalization
      );
      
      setDocuments(prev => [document, ...prev]);
      setSuccess('Document generated successfully!');
      onDocumentGenerated?.(document);
      
      // Reset form
      setVariables({});
      setPersonalization({
        industry_specific: false,
        company_branding: false,
        custom_content: false
      });
      
      setGenerationProgress(100);
      setTimeout(() => setGenerationProgress(0), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate document');
      onDocumentFailed?.(err instanceof Error ? err.message : 'Failed to generate document');
    } finally {
      setIsLoading(false);
      clearInterval(progressInterval);
    }
  };

  const handleDownloadDocument = async (documentId: string) => {
    try {
      const downloadInfo = await documentGenerationService.downloadDocument(documentId);
      
      // Create a temporary link to download the file
      const link = document.createElement('a');
      link.href = downloadInfo.url;
      link.download = downloadInfo.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setSuccess('Document downloaded successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download document');
    }
  };

  const handleArchiveDocument = async (documentId: string) => {
    try {
      const document = await documentGenerationService.archiveDocument(documentId);
      setDocuments(prev => prev.map(d => d.id === documentId ? document : d));
      setSuccess('Document archived successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to archive document');
    }
  };

  const handleVariableChange = (key: string, value: string) => {
    setVariables(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePersonalizationChange = (key: keyof typeof personalization, value: boolean) => {
    setPersonalization(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getStatusBadge = (status: GeneratedDocument['status']) => {
    switch (status) {
      case 'generating':
        return <Badge variant="default" className="bg-blue-500">Generating</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-500">Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'archived':
        return <Badge variant="secondary">Archived</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getTemplate = (templateId: string) => {
    return templates.find(t => t.id === templateId);
  };

  const getQualityColor = (score: number) => {
    if (score >= 0.9) return 'text-green-600';
    if (score >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Generate New Document */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate Document
          </CardTitle>
          <CardDescription>
            Create personalized documents using AI-powered templates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Template Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Document Template</label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger>
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name} ({template.category})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Template Variables */}
          {selectedTemplate && (() => {
            const template = getTemplate(selectedTemplate);
            if (!template) return null;

            return (
              <div className="space-y-3">
                <label className="text-sm font-medium">Document Variables</label>
                {template.variables.map((variable) => (
                  <div key={variable} className="space-y-1">
                    <label className="text-sm text-muted-foreground capitalize">
                      {variable.replace(/_/g, ' ')}
                    </label>
                    <Input
                      placeholder={`Enter ${variable.replace(/_/g, ' ')}`}
                      value={variables[variable] || ''}
                      onChange={(e) => handleVariableChange(variable, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            );
          })()}

          {/* Personalization Options */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Personalization Options</label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="industry_specific"
                  checked={personalization.industry_specific}
                  onCheckedChange={(checked) => 
                    handlePersonalizationChange('industry_specific', checked as boolean)
                  }
                />
                <label htmlFor="industry_specific" className="text-sm">
                  Industry-specific content
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="company_branding"
                  checked={personalization.company_branding}
                  onCheckedChange={(checked) => 
                    handlePersonalizationChange('company_branding', checked as boolean)
                  }
                />
                <label htmlFor="company_branding" className="text-sm">
                  Include company branding
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="custom_content"
                  checked={personalization.custom_content}
                  onCheckedChange={(checked) => 
                    handlePersonalizationChange('custom_content', checked as boolean)
                  }
                />
                <label htmlFor="custom_content" className="text-sm">
                  Custom content sections
                </label>
              </div>
            </div>
          </div>

          {/* Template Details */}
          {selectedTemplate && (() => {
            const template = getTemplate(selectedTemplate);
            if (!template) return null;

            return (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Template Details</h4>
                <div className="text-sm space-y-2">
                  <div><strong>Category:</strong> {template.category}</div>
                  <div><strong>Description:</strong> {template.description}</div>
                  <div><strong>Estimated Time:</strong> {template.estimatedTime} minutes</div>
                  <div><strong>Format:</strong> {template.format.toUpperCase()}</div>
                  <div><strong>Sections:</strong></div>
                  <ul className="list-disc list-inside ml-2">
                    {template.sections.map((section, index) => (
                      <li key={index}>{section}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })()}

          {/* Generation Progress */}
          {isLoading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Generating document...</span>
                <span>{generationProgress}%</span>
              </div>
              <Progress value={generationProgress} className="w-full" />
            </div>
          )}

          <Button
            onClick={handleGenerateDocument}
            disabled={!selectedTemplate || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Generate Document'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* User Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Your Documents
          </CardTitle>
          <CardDescription>
            View and manage your generated documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No documents generated yet
            </p>
          ) : (
            <div className="space-y-4">
              {documents.map((document) => (
                <div key={document.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">
                      {getTemplate(document.templateId)?.name}
                    </h4>
                    {getStatusBadge(document.status)}
                  </div>
                  
                  <div className="text-sm text-muted-foreground space-y-1 mb-3">
                    <div>Created: {document.createdAt.toLocaleString()}</div>
                    {document.completedAt && (
                      <div>Completed: {document.completedAt.toLocaleString()}</div>
                    )}
                    {document.fileSize && (
                      <div>Size: {(document.fileSize / 1024).toFixed(1)} KB</div>
                    )}
                    <div>Downloads: {document.downloadCount}</div>
                    {document.quality && (
                      <div className={`flex items-center gap-1 ${getQualityColor(document.quality.score)}`}>
                        Quality: {(document.quality.score * 100).toFixed(0)}%
                      </div>
                    )}
                    <div className="flex gap-1">
                      {document.personalization.industry_specific && (
                        <Badge variant="outline" className="text-xs">Industry</Badge>
                      )}
                      {document.personalization.company_branding && (
                        <Badge variant="outline" className="text-xs">Branding</Badge>
                      )}
                      {document.personalization.custom_content && (
                        <Badge variant="outline" className="text-xs">Custom</Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {document.status === 'completed' && document.fileUrl && (
                      <Button
                        size="sm"
                        onClick={() => handleDownloadDocument(document.id)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    )}
                    
                    {document.status === 'completed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedDocument(document)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    )}
                    
                    {document.status === 'completed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleArchiveDocument(document.id)}
                      >
                        <Archive className="h-4 w-4 mr-1" />
                        Archive
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Details Modal */}
      {selectedDocument && (
        <Card>
          <CardHeader>
            <CardTitle>Document Details</CardTitle>
            <CardDescription>
              Detailed information about the generated document
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Template:</strong> {getTemplate(selectedDocument.templateId)?.name}
              </div>
              <div>
                <strong>Status:</strong> {selectedDocument.status}
              </div>
              <div>
                <strong>Created:</strong> {selectedDocument.createdAt.toLocaleString()}
              </div>
              {selectedDocument.completedAt && (
                <div>
                  <strong>Completed:</strong> {selectedDocument.completedAt.toLocaleString()}
                </div>
              )}
              {selectedDocument.fileSize && (
                <div>
                  <strong>File Size:</strong> {(selectedDocument.fileSize / 1024).toFixed(1)} KB
                </div>
              )}
              <div>
                <strong>Downloads:</strong> {selectedDocument.downloadCount}
              </div>
            </div>

            <div className="space-y-2">
              <strong>Variables:</strong>
              <div className="text-sm text-muted-foreground">
                {Object.entries(selectedDocument.variables).map(([key, value]) => (
                  <div key={key}>
                    {key.replace(/_/g, ' ')}: {value}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <strong>Personalization:</strong>
              <div className="text-sm text-muted-foreground">
                <div>Industry-specific: {selectedDocument.personalization.industry_specific ? 'Yes' : 'No'}</div>
                <div>Company branding: {selectedDocument.personalization.company_branding ? 'Yes' : 'No'}</div>
                <div>Custom content: {selectedDocument.personalization.custom_content ? 'Yes' : 'No'}</div>
              </div>
            </div>

            {selectedDocument.quality && (
              <div className="space-y-2">
                <strong>Quality Assessment:</strong>
                <div className="text-sm text-muted-foreground">
                  <div>Score: {(selectedDocument.quality.score * 100).toFixed(0)}%</div>
                  {selectedDocument.quality.issues && selectedDocument.quality.issues.length > 0 && (
                    <div>
                      Issues: {selectedDocument.quality.issues.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={() => setSelectedDocument(null)}
                variant="outline"
              >
                Close
              </Button>
              {selectedDocument.fileUrl && (
                <Button
                  onClick={() => handleDownloadDocument(selectedDocument.id)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Messages */}
      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success Messages */}
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default DocumentGeneration;
