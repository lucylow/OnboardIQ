import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  FileText, 
  Download, 
  Upload, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  Clock,
  User,
  Building,
  Mail,
  Phone,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Share2,
  Lock,
  Unlock,
  BarChart3,
  Workflow,
  Zap,
  Shield,
  Star,
  Calendar,
  FolderOpen,
  FileCheck,
  FileX,
  FilePlus,
  FileSearch,
  FileArchive,
  FileSignature,
  FileSpreadsheet,
  FileImage,
  FileVideo,
  FileAudio,
  FileCode,
  FilePdf,
  FileWord,
  FileExcel,
  FilePowerpoint
} from "lucide-react";
import { foxitApiService } from '../services/foxitApiService';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'html' | 'contract' | 'invoice' | 'agreement' | 'proposal';
  status: 'draft' | 'processing' | 'completed' | 'signed' | 'archived' | 'error';
  size: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  template?: string;
  download_url?: string;
  preview_url?: string;
  metadata?: Record<string, any>;
  tags: string[];
  permissions: 'public' | 'private' | 'shared';
  version: string;
  workflow_status?: string;
  signature_status?: 'pending' | 'signed' | 'expired';
}

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  type: string;
  fields: string[];
  preview_url?: string;
  usage_count: number;
  last_used?: string;
  created_at: string;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'draft';
  steps: number;
  documents_processed: number;
  success_rate: number;
  avg_processing_time: string;
  last_executed?: string;
}

const DocumentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('documents');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load documents
      const docsResponse = await foxitApiService.getTemplates();
      if (docsResponse.success && docsResponse.templates) {
        const mockDocuments: Document[] = [
          {
            id: 'doc_1',
            name: 'Welcome Packet - John Doe',
            type: 'pdf',
            status: 'completed',
            size: '2.3 MB',
            created_at: '2024-04-15T10:30:00Z',
            updated_at: '2024-04-15T10:35:00Z',
            created_by: 'Sarah Johnson',
            template: 'welcome_packet',
            download_url: '#',
            preview_url: '#',
            tags: ['onboarding', 'welcome'],
            permissions: 'private',
            version: '1.0'
          },
          {
            id: 'doc_2',
            name: 'Service Agreement - TechFlow Solutions',
            type: 'contract',
            status: 'signed',
            size: '1.8 MB',
            created_at: '2024-04-14T14:20:00Z',
            updated_at: '2024-04-14T16:45:00Z',
            created_by: 'David Rodriguez',
            template: 'service_agreement',
            download_url: '#',
            preview_url: '#',
            tags: ['contract', 'signed', 'enterprise'],
            permissions: 'shared',
            version: '2.1',
            signature_status: 'signed'
          },
          {
            id: 'doc_3',
            name: 'Invoice #INV-2024-001',
            type: 'invoice',
            status: 'completed',
            size: '856 KB',
            created_at: '2024-04-13T09:15:00Z',
            updated_at: '2024-04-13T09:20:00Z',
            created_by: 'Emily Chen',
            template: 'invoice_template',
            download_url: '#',
            preview_url: '#',
            tags: ['invoice', 'billing'],
            permissions: 'private',
            version: '1.0'
          },
          {
            id: 'doc_4',
            name: 'Proposal - Global Retail Corp',
            type: 'proposal',
            status: 'draft',
            size: '3.2 MB',
            created_at: '2024-04-12T11:00:00Z',
            updated_at: '2024-04-12T11:00:00Z',
            created_by: 'Mike Chen',
            template: 'proposal_template',
            download_url: '#',
            preview_url: '#',
            tags: ['proposal', 'draft'],
            permissions: 'shared',
            version: '0.9'
          }
        ];
        setDocuments(mockDocuments);
      }

      // Load templates
      const templatesResponse = await foxitApiService.getTemplates();
      if (templatesResponse.success && templatesResponse.templates) {
        setTemplates(templatesResponse.templates);
      }

      // Load workflows
      const mockWorkflows: Workflow[] = [
        {
          id: 'wf_1',
          name: 'Contract Processing',
          description: 'Automated contract generation and signature workflow',
          status: 'active',
          steps: 4,
          documents_processed: 156,
          success_rate: 94.2,
          avg_processing_time: '2.3 min',
          last_executed: '2024-04-15T15:30:00Z'
        },
        {
          id: 'wf_2',
          name: 'Invoice Generation',
          description: 'Automated invoice creation and delivery',
          status: 'active',
          steps: 3,
          documents_processed: 89,
          success_rate: 98.7,
          avg_processing_time: '1.8 min',
          last_executed: '2024-04-15T14:20:00Z'
        },
        {
          id: 'wf_3',
          name: 'Onboarding Packet',
          description: 'Welcome packet generation for new customers',
          status: 'active',
          steps: 2,
          documents_processed: 234,
          success_rate: 99.1,
          avg_processing_time: '1.2 min',
          last_executed: '2024-04-15T16:45:00Z'
        }
      ];
      setWorkflows(mockWorkflows);

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'signed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'archived': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FilePdf className="h-4 w-4" />;
      case 'docx': return <FileWord className="h-4 w-4" />;
      case 'contract': return <FileSignature className="h-4 w-4" />;
      case 'invoice': return <FileSpreadsheet className="h-4 w-4" />;
      case 'proposal': return <FileText className="h-4 w-4" />;
      case 'agreement': return <FileCheck className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.created_by.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || doc.type === filterType;
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const documentStats = {
    total: documents.length,
    completed: documents.filter(d => d.status === 'completed').length,
    signed: documents.filter(d => d.status === 'signed').length,
    processing: documents.filter(d => d.status === 'processing').length,
    draft: documents.filter(d => d.status === 'draft').length
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Document Management</h1>
          <p className="text-gray-600 mt-2">Generate, manage, and track all your documents in one place</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Document
          </Button>
        </div>
      </div>

      {/* Document Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documentStats.total}</div>
            <p className="text-xs text-muted-foreground">All documents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{documentStats.completed}</div>
            <p className="text-xs text-muted-foreground">Ready for use</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Signed</CardTitle>
            <FileSignature className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{documentStats.signed}</div>
            <p className="text-xs text-muted-foreground">Legally binding</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{documentStats.processing}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <Edit className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{documentStats.draft}</div>
            <p className="text-xs text-muted-foreground">Work in progress</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="invoice">Invoice</SelectItem>
                  <SelectItem value="proposal">Proposal</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="signed">Signed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm" onClick={loadData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Documents Table */}
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Manage and track all your documents</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {getTypeIcon(doc.type)}
                            <div>
                              <div className="font-medium">{doc.name}</div>
                              <div className="text-sm text-gray-500">v{doc.version}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {doc.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(doc.status)}>
                            {doc.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{doc.created_by}</TableCell>
                        <TableCell>
                          {new Date(doc.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{doc.size}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Templates</CardTitle>
              <CardDescription>Document templates for quick generation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <Card key={template.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Category</span>
                          <Badge variant="outline">{template.category}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Usage</span>
                          <span className="text-sm font-medium">{template.usage_count} times</span>
                        </div>
                        <Button className="w-full" size="sm">
                          <FilePlus className="h-4 w-4 mr-2" />
                          Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Automated Workflows</CardTitle>
              <CardDescription>Streamline document processing with automated workflows</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workflows.map((workflow) => (
                  <Card key={workflow.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{workflow.name}</CardTitle>
                      <CardDescription>{workflow.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Status</span>
                          <Badge className={workflow.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {workflow.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Success Rate</span>
                          <span className="text-sm font-medium">{workflow.success_rate}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Avg Time</span>
                          <span className="text-sm font-medium">{workflow.avg_processing_time}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Processed</span>
                          <span className="text-sm font-medium">{workflow.documents_processed} docs</span>
                        </div>
                        <Button className="w-full" size="sm">
                          <Workflow className="h-4 w-4 mr-2" />
                          Run Workflow
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Document Analytics</CardTitle>
                <CardDescription>Performance metrics and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Generation Success Rate</span>
                    <span className="font-bold text-green-600">98.5%</span>
                  </div>
                  <Progress value={98.5} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span>Average Processing Time</span>
                    <span className="font-bold text-blue-600">2.3 min</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span>Template Usage</span>
                    <span className="font-bold text-purple-600">1,234</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest document activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documents.slice(0, 5).map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(doc.type)}
                        <span className="text-sm font-medium">{doc.name}</span>
                      </div>
                      <Badge className={getStatusColor(doc.status)}>
                        {doc.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentManagement;


