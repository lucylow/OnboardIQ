import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Brain,
  Search,
  Lightbulb,
  Database,
  FileText,
  Users,
  BarChart3,
  Zap,
  Play,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Settings,
  Terminal,
  Code,
  GitBranch,
  Server,
  Network,
  Activity,
  Globe,
  Lock,
  Unlock,
  MessageSquare,
  Phone,
  Video,
  Clock,
  DollarSign,
  TrendingUp,
  Code2,
  Bot,
  Sparkles,
  Layers,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Download,
  Upload,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  FileSearch,
  Target,
  PieChart,
  Calendar,
  Mail,
  Edit,
  Trash2,
  CheckSquare,
  Square,
  Filter,
  SortAsc,
  SortDesc,
  Maximize,
  Minimize,
  RotateCw,
  Share,
  BookOpen,
  Award,
  Star,
  Heart,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Send,
  Receive,
  Connect,
  Disconnect,
  Wifi,
  WifiOff,
  Signal,
  SignalHigh,
  SignalMedium,
  SignalLow,
  Battery,
  BatteryFull,
  BatteryCharging,
  Power,
  PowerOff,
  Cpu,
  Memory,
  HardDrive,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Desktop,
  Printer,
  Scanner,
  Camera,
  Microphone,
  Headphones,
  Speaker,
  Volume,
  VolumeX,
  Volume1,
  Volume2,
  Mute,
  Unmute,
  PlayCircle,
  PauseCircle,
  StopCircle,
  SkipBack,
  SkipForward,
  Rewind,
  FastForward,
  Shuffle,
  Repeat,
  Repeat1,
  Shuffle2,
  SkipBack2,
  SkipForward2,
  RotateCcw2,
  RotateCw2,
  ZoomIn,
  ZoomOut,
  Move,
  Crop,
  Scissors,
  Type,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Indent,
  Outdent,
  Link,
  Unlink,
  Image,
  Video2,
  Music,
  File,
  Folder,
  FolderOpen,
  FolderPlus,
  FolderMinus,
  FolderX,
  FilePlus,
  FileMinus,
  FileX,
  FileText2,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  FileCode,
  FileSpreadsheet,
  FilePresentation,
  FileDatabase,
  FileLock,
  FileUnlock,
  FileCheck,
  FileX2,
  FileUp,
  FileDown,
  FileSearch2,
  FileHeart,
  FileClock,
  FileKey,
  FileUser,
  FileSettings,
  FileWarning,
  FileInfo,
  FilePlus2,
  FileMinus2,
  FileX3,
  FileCheck2,
  FileClock2,
  FileKey2,
  FileUser2,
  FileSettings2,
  FileWarning2,
  FileInfo2,
  FileHeart2,
  FileSearch3,
  FileUp2,
  FileDown2,
  FileLock2,
  FileUnlock2,
  FileCode2,
  FileSpreadsheet2,
  FilePresentation2,
  FileDatabase2,
  FileArchive2,
  FileAudio2,
  FileVideo2,
  FileImage2,
  FileText3,
  FileX4,
  FileMinus3,
  FilePlus3,
  FileX5,
  FileMinus4,
  FilePlus4,
  FileX6,
  FileMinus5,
  FilePlus5,
  FileX7,
  FileMinus6,
  FilePlus6,
  FileX8,
  FileMinus7,
  FilePlus7,
  FileX9,
  FileMinus8,
  FilePlus8,
  FileX10,
  FileMinus9,
  FilePlus9,
  FileX11,
  FileMinus10,
  FilePlus10,
  FileX12,
  FileMinus11,
  FilePlus11,
  FileX13,
  FileMinus12,
  FilePlus12,
  FileX14,
  FileMinus13,
  FilePlus13,
  FileX15,
  FileMinus14,
  FilePlus14,
  FileX16,
  FileMinus15,
  FilePlus15,
  FileX17,
  FileMinus16,
  FilePlus16,
  FileX18,
  FileMinus17,
  FilePlus17,
  FileX19,
  FileMinus18,
  FilePlus18,
  FileX20,
  FileMinus19,
  FilePlus19,
  FileX21,
  FileMinus20,
  FilePlus20,
  FileX22,
  FileMinus21,
  FilePlus21,
  FileX23,
  FileMinus22,
  FilePlus22,
  FileX24,
  FileMinus23,
  FilePlus23,
  FileX25,
  FileMinus24,
  FilePlus24,
  FileX26,
  FileMinus25,
  FilePlus25,
  FileX27,
  FileMinus26,
  FilePlus26,
  FileX28,
  FileMinus27,
  FilePlus27,
  FileX29,
  FileMinus28,
  FilePlus28,
  FileX30,
  FileMinus29,
  FilePlus29,
  FileX31,
  FileMinus30,
  FilePlus30,
  FileX32,
  FileMinus31,
  FilePlus31,
  FileX33,
  FileMinus32,
  FilePlus32,
  FileX34,
  FileMinus33,
  FilePlus33,
  FileX35,
  FileMinus34,
  FilePlus34,
  FileX36,
  FileMinus35,
  FilePlus35,
  FileX37,
  FileMinus36,
  FilePlus36,
  FileX38,
  FileMinus37,
  FilePlus37,
  FileX39,
  FileMinus38,
  FilePlus38,
  FileX40,
  FileMinus39,
  FilePlus39,
  FileX41,
  FileMinus40,
  FilePlus40,
  FileX42,
  FileMinus41,
  FilePlus41,
  FileX43,
  FileMinus42,
  FilePlus42,
  FileX44,
  FileMinus43,
  FilePlus43,
  FileX45,
  FileMinus44,
  FilePlus44,
  FileX46,
  FileMinus45,
  FilePlus45,
  FileX47,
  FileMinus46,
  FilePlus46,
  FileX48,
  FileMinus47,
  FilePlus47,
  FileX49,
  FileMinus48,
  FilePlus48,
  FileX50,
  FileMinus49,
  FilePlus49,
  FileX51,
  FileMinus50,
  FilePlus50,
  FileX52,
  FileMinus51,
  FilePlus51,
  FileX53,
  FileMinus52,
  FilePlus52,
  FileX54,
  FileMinus53,
  FilePlus53,
  FileX55,
  FileMinus54,
  FilePlus54,
  FileX56,
  FileMinus55,
  FilePlus55,
  FileX57,
  FileMinus56,
  FilePlus56,
  FileX58,
  FileMinus57,
  FilePlus57,
  FileX59,
  FileMinus58,
  FilePlus58,
  FileX60,
  FileMinus59,
  FilePlus59,
  FileX61,
  FileMinus60,
  FilePlus60,
  FileX62,
  FileMinus61,
  FilePlus61,
  FileX63,
  FileMinus62,
  FilePlus62,
  FileX64,
  FileMinus63,
  FilePlus63,
  FileX65,
  FileMinus64,
  FilePlus64,
  FileX66,
  FileMinus65,
  FilePlus65,
  FileX67,
  FileMinus66,
  FilePlus66,
  FileX68,
  FileMinus67,
  FilePlus67,
  FileX69,
  FileMinus68,
  FilePlus68,
  FileX70,
  FileMinus69,
  FilePlus69,
  FileX71,
  FileMinus70,
  FilePlus70,
  FileX72,
  FileMinus71,
  FilePlus71,
  FileX73,
  FileMinus72,
  FilePlus72,
  FileX74,
  FileMinus73,
  FilePlus73,
  FileX75,
  FileMinus74,
  FilePlus74,
  FileX76,
  FileMinus75,
  FilePlus75,
  FileX77,
  FileMinus76,
  FilePlus76,
  FileX78,
  FileMinus77,
  FilePlus77,
  FileX79,
  FileMinus78,
  FilePlus78,
  FileX80,
  FileMinus79,
  FilePlus79,
  FileX81,
  FileMinus80,
  FilePlus80,
  FileX82,
  FileMinus81,
  FilePlus81,
  FileX83,
  FileMinus82,
  FilePlus82,
  FileX84,
  FileMinus83,
  FilePlus83,
  FileX85,
  FileMinus84,
  FilePlus84,
  FileX86,
  FileMinus85,
  FilePlus85,
  FileX87,
  FileMinus86,
  FilePlus86,
  FileX88,
  FileMinus87,
  FilePlus87,
  FileX89,
  FileMinus88,
  FilePlus88,
  FileX90,
  FileMinus89,
  FilePlus89,
  FileX91,
  FileMinus90,
  FilePlus90,
  FileX92,
  FileMinus91,
  FilePlus91,
  FileX93,
  FileMinus92,
  FilePlus92,
  FileX94,
  FileMinus93,
  FilePlus93,
  FileX95,
  FileMinus94,
  FilePlus94,
  FileX96,
  FileMinus95,
  FilePlus95,
  FileX97,
  FileMinus96,
  FilePlus96,
  FileX98,
  FileMinus97,
  FilePlus97,
  FileX99,
  FileMinus98,
  FilePlus98,
  FileX100,
  FileMinus99,
  FilePlus99,
  FileX101,
  FileMinus100,
  FilePlus100
} from 'lucide-react';

interface KnowledgeAsset {
  id: string;
  title: string;
  content: string;
  source: 'salesforce' | 'sharepoint' | 'confluence' | 'database';
  category: string;
  relevanceScore: number;
  lastUpdated: string;
  tags: string[];
}

interface AgentStatus {
  id: string;
  name: string;
  type: 'discovery' | 'context' | 'decision';
  status: 'active' | 'processing' | 'idle' | 'error';
  currentTask: string;
  performance: {
    accuracy: number;
    responseTime: number;
    tasksCompleted: number;
  };
  lastActivity: string;
}

interface MCPTool {
  id: string;
  name: string;
  description: string;
  parameters: any[];
  capabilities: string[];
  status: 'available' | 'in_use' | 'error';
}

interface DataWeaveTransformation {
  id: string;
  name: string;
  description: string;
  source: 'ai_generated' | 'manual' | 'template';
  code: string;
  performance: {
    executionTime: number;
    successRate: number;
    lastUsed: string;
  };
}

const EnterpriseKnowledgeOrchestrator: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userQuery, setUserQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [selectedKnowledge, setSelectedKnowledge] = useState<KnowledgeAsset | null>(null);
  const [recommendation, setRecommendation] = useState<string>('');

  // Mock data for the Enterprise Knowledge Orchestrator
  const knowledgeAssets: KnowledgeAsset[] = [
    {
      id: 'ka-1',
      title: 'Healthcare Client Sales Strategy',
      content: 'Best practices for selling to healthcare clients include understanding compliance requirements, building trust through security demonstrations, and offering bundled solutions that address multiple pain points.',
      source: 'salesforce',
      category: 'Sales Strategy',
      relevanceScore: 0.95,
      lastUpdated: '2024-01-15T10:30:00Z',
      tags: ['healthcare', 'sales', 'strategy', 'compliance']
    },
    {
      id: 'ka-2',
      title: 'Product Bundle Configuration Guide',
      content: 'Configure product bundles for healthcare clients by combining security features, compliance tools, and integration capabilities. Recommended bundle: Security Suite + Compliance Manager + API Gateway.',
      source: 'confluence',
      category: 'Product Documentation',
      relevanceScore: 0.87,
      lastUpdated: '2024-01-14T15:45:00Z',
      tags: ['product', 'bundle', 'healthcare', 'configuration']
    },
    {
      id: 'ka-3',
      title: 'Healthcare Market Analysis Q4 2024',
      content: 'Healthcare sector shows 40% growth in security spending. Top pain points: data privacy (60%), compliance automation (45%), integration complexity (35%).',
      source: 'database',
      category: 'Market Research',
      relevanceScore: 0.92,
      lastUpdated: '2024-01-13T09:20:00Z',
      tags: ['market', 'healthcare', 'analysis', 'trends']
    },
    {
      id: 'ka-4',
      title: 'Successful Healthcare Deals Database',
      content: 'Analysis of 150+ successful healthcare deals shows average deal size $250K, 6-month sales cycle, key decision makers: CTO (40%), CISO (35%), CIO (25%).',
      source: 'sharepoint',
      category: 'Sales Data',
      relevanceScore: 0.89,
      lastUpdated: '2024-01-12T16:30:00Z',
      tags: ['deals', 'healthcare', 'sales', 'metrics']
    }
  ];

  const agents: AgentStatus[] = [
    {
      id: 'agent-1',
      name: 'Knowledge Discovery Agent',
      type: 'discovery',
      status: 'active',
      currentTask: 'Indexing Salesforce knowledge articles',
      performance: {
        accuracy: 98.5,
        responseTime: 245,
        tasksCompleted: 1247
      },
      lastActivity: '2024-01-15T14:30:00Z'
    },
    {
      id: 'agent-2',
      name: 'Context Analysis Agent',
      type: 'context',
      status: 'active',
      currentTask: 'Analyzing query intent',
      performance: {
        accuracy: 96.2,
        responseTime: 180,
        tasksCompleted: 892
      },
      lastActivity: '2024-01-15T14:31:00Z'
    },
    {
      id: 'agent-3',
      name: 'Decision Support Agent',
      type: 'decision',
      status: 'active',
      currentTask: 'Generating recommendations',
      performance: {
        accuracy: 99.1,
        responseTime: 320,
        tasksCompleted: 567
      },
      lastActivity: '2024-01-15T14:32:00Z'
    }
  ];

  const mcpTools: MCPTool[] = [
    {
      id: 'tool-1',
      name: 'Knowledge Search',
      description: 'Search across all enterprise knowledge sources',
      parameters: ['query', 'filters', 'limit'],
      capabilities: ['search', 'filter', 'rank'],
      status: 'available'
    },
    {
      id: 'tool-2',
      name: 'Context Analysis',
      description: 'Analyze query context and determine relevance',
      parameters: ['text', 'domain', 'intent'],
      capabilities: ['analyze', 'classify', 'score'],
      status: 'available'
    },
    {
      id: 'tool-3',
      name: 'Recommendation Engine',
      description: 'Generate actionable business recommendations',
      parameters: ['context', 'data', 'constraints'],
      capabilities: ['synthesize', 'recommend', 'prioritize'],
      status: 'available'
    },
    {
      id: 'tool-4',
      name: 'Workflow Trigger',
      description: 'Trigger automated business workflows',
      parameters: ['action', 'target', 'data'],
      capabilities: ['trigger', 'notify', 'execute'],
      status: 'available'
    }
  ];

  const dataWeaveTransformations: DataWeaveTransformation[] = [
    {
      id: 'dw-1',
      name: 'Knowledge Normalization',
      description: 'AI-generated transformation to normalize data from Salesforce, SharePoint, Confluence, and Database',
      source: 'ai_generated',
      code: `%dw 2.0
output application/json
---
payload map {
  id: $.Id default $.id default $.ID,
  title: $.Name default $.Title default $.name,
  content: $.Description default $.Content default $.description,
  source: $.source,
  category: $.Category default $.category,
  tags: $.Tags default $.tags default []
}`,
      performance: {
        executionTime: 45,
        successRate: 99.8,
        lastUsed: '2024-01-15T14:30:00Z'
      }
    },
    {
      id: 'dw-2',
      name: 'Relevance Scoring',
      description: 'AI-generated transformation for calculating relevance scores',
      source: 'ai_generated',
      code: `%dw 2.0
output application/json
var queryTerms = payload.query splitBy " "
---
payload map {
  id: $.id,
  title: $.title,
  relevanceScore: sizeOf($.tags filter ($ contains queryTerms[0])) / sizeOf($.tags) * 100,
  matchedTerms: $.tags filter ($ contains queryTerms[0])
}`,
      performance: {
        executionTime: 23,
        successRate: 98.5,
        lastUsed: '2024-01-15T14:31:00Z'
      }
    }
  ];

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const processQuery = async () => {
    if (!userQuery.trim()) return;

    setIsProcessing(true);
    setProcessingStep(0);
    setLogs([]);
    setRecommendation('');

    const steps = [
      { step: 1, message: 'Agent 1: Discovering knowledge from Salesforce, SharePoint, Confluence...' },
      { step: 2, message: 'Agent 1: Using AI-generated DataWeave to normalize heterogeneous data...' },
      { step: 3, message: 'Agent 2: Analyzing query context and intent...' },
      { step: 4, message: 'Agent 2: Scoring relevance of knowledge sources...' },
      { step: 5, message: 'Agent 3: Synthesizing information from multiple sources...' },
      { step: 6, message: 'Agent 3: Generating actionable recommendation...' },
      { step: 7, message: 'MCP Server: Triggering automated workflow notifications...' },
      { step: 8, message: 'Process completed successfully!' }
    ];

    for (const step of steps) {
      setProcessingStep(step.step);
      addLog(step.message);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Generate mock recommendation based on query
    const mockRecommendation = generateRecommendation(userQuery);
    setRecommendation(mockRecommendation);

    setIsProcessing(false);
  };

  const generateRecommendation = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('healthcare') && lowerQuery.includes('client')) {
      return `Based on analysis of 150+ successful healthcare deals and market research:

STRATEGY: Target healthcare clients with bundled security solutions
- Average deal size: $250K
- Sales cycle: 6 months
- Key decision makers: CTO (40%), CISO (35%), CIO (25%)

RECOMMENDATION: 
1. Lead with compliance automation features (45% of healthcare pain points)
2. Demonstrate data privacy controls (60% priority)
3. Offer Security Suite + Compliance Manager + API Gateway bundle
4. Engage CTO first, then CISO for technical validation

SUCCESS METRICS: 40% growth in healthcare security spending expected in Q4 2024.`;
    }
    
    return `Based on enterprise knowledge analysis:

RECOMMENDATION: 
1. Review similar past deals in Salesforce
2. Check technical documentation in Confluence
3. Analyze market trends in research database
4. Consider bundling related products for better value proposition

NEXT STEPS: Schedule follow-up call with technical team to discuss implementation details.`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <Brain className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Enterprise Knowledge Orchestrator</h1>
            <p className="text-gray-600">AI-Powered Multi-Agent System for Enterprise Knowledge Management</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">Knowledge Assets</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{knowledgeAssets.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Bot className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">AI Agents</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{agents.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Server className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium">MCP Tools</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{mcpTools.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Code className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium">DataWeave Transforms</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{dataWeaveTransformations.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Query Input Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Enterprise Knowledge Query</span>
            </CardTitle>
            <CardDescription>
              Ask a business question and let our AI agents orchestrate knowledge discovery and decision support
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="e.g., What's our best approach for the healthcare client based on past wins?"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                className="min-h-[100px]"
              />
              <Button
                onClick={processQuery}
                disabled={isProcessing || !userQuery.trim()}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Processing Query...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Orchestrate Knowledge Discovery
                  </>
                )}
              </Button>
            </div>

            {isProcessing && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Processing Progress</span>
                  <span className="text-sm text-gray-500">Step {processingStep}/8</span>
                </div>
                <Progress value={(processingStep / 8) * 100} className="mb-4" />
                <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-sm h-32 overflow-y-auto">
                  {logs.map((log, index) => (
                    <div key={index}>{log}</div>
                  ))}
                </div>
              </div>
            )}

            {recommendation && (
              <Alert className="mt-4">
                <Lightbulb className="h-4 w-4" />
                <AlertDescription className="whitespace-pre-line">
                  {recommendation}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="agents">AI Agents</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
          <TabsTrigger value="mcp">MCP Tools</TabsTrigger>
          <TabsTrigger value="dataweave">DataWeave AI</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>Multi-Agent Architecture</span>
                </CardTitle>
                <CardDescription>
                  Three intelligent agents working collaboratively to solve enterprise knowledge challenges
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {agents.map((agent) => (
                    <div key={agent.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(agent.status)}
                        <div>
                          <p className="font-medium">{agent.name}</p>
                          <p className="text-sm text-gray-600">{agent.currentTask}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(agent.status)}>
                        {agent.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Performance Metrics</span>
                </CardTitle>
                <CardDescription>
                  Real-time performance of AI agents and knowledge orchestration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {agents.map((agent) => (
                    <div key={agent.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{agent.name}</span>
                        <span className="text-sm text-gray-500">{agent.performance.accuracy}% accuracy</span>
                      </div>
                      <Progress value={agent.performance.accuracy} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Network className="h-5 w-5" />
                <span>Integration Architecture</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <Database className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <h3 className="font-medium">Data Sources</h3>
                  <p className="text-sm text-gray-600">Salesforce, SharePoint, Confluence, Database</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Bot className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <h3 className="font-medium">AI Agents</h3>
                  <p className="text-sm text-gray-600">Discovery, Context, Decision Support</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Server className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <h3 className="font-medium">MCP Servers</h3>
                  <p className="text-sm text-gray-600">AI-native API interaction</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Code className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                  <h3 className="font-medium">DataWeave AI</h3>
                  <p className="text-sm text-gray-600">AI-generated transformations</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <Card key={agent.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Bot className="h-5 w-5" />
                      <span>{agent.name}</span>
                    </CardTitle>
                    <Badge className={getStatusColor(agent.status)}>
                      {agent.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    {agent.type.charAt(0).toUpperCase() + agent.type.slice(1)} Agent
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Current Task</h4>
                    <p className="text-sm text-gray-600">{agent.currentTask}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Accuracy</span>
                      <span className="text-sm font-medium">{agent.performance.accuracy}%</span>
                    </div>
                    <Progress value={agent.performance.accuracy} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-xl font-bold text-blue-600">{agent.performance.responseTime}ms</p>
                      <p className="text-xs text-gray-600">Response Time</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-green-600">{agent.performance.tasksCompleted}</p>
                      <p className="text-xs text-gray-600">Tasks Completed</p>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    Last Activity: {new Date(agent.lastActivity).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {knowledgeAssets.map((asset) => (
              <Card key={asset.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedKnowledge(asset)}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{asset.title}</CardTitle>
                    <Badge variant="outline">{asset.source}</Badge>
                  </div>
                  <CardDescription>{asset.category}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 line-clamp-3">{asset.content}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Relevance Score</span>
                      <span className="text-sm font-medium">{asset.relevanceScore}%</span>
                    </div>
                    <Progress value={asset.relevanceScore} className="h-2" />
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {asset.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Updated: {new Date(asset.lastUpdated).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mcp" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Server className="h-5 w-5" />
                <span>Model Context Protocol (MCP) Tools</span>
              </CardTitle>
              <CardDescription>
                AI-native tools exposed via MCP servers for dynamic agent interaction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mcpTools.map((tool) => (
                  <div key={tool.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(tool.status)}
                        <div>
                          <h3 className="font-medium">{tool.name}</h3>
                          <p className="text-sm text-gray-600">{tool.description}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(tool.status)}>
                        {tool.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Parameters</h4>
                        <div className="flex flex-wrap gap-1">
                          {tool.parameters.map((param) => (
                            <Badge key={param} variant="outline" className="text-xs">
                              {param}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Capabilities</h4>
                        <div className="flex flex-wrap gap-1">
                          {tool.capabilities.map((capability) => (
                            <Badge key={capability} variant="secondary" className="text-xs">
                              {capability}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dataweave" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Code className="h-5 w-5" />
                <span>AI-Generated DataWeave Transformations</span>
              </CardTitle>
              <CardDescription>
                DataWeave transformations automatically generated by Anypoint Code Builder AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dataWeaveTransformations.map((transformation) => (
                  <div key={transformation.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-medium">{transformation.name}</h3>
                        <p className="text-sm text-gray-600">{transformation.description}</p>
                      </div>
                      <Badge variant="outline" className={transformation.source === 'ai_generated' ? 'text-green-600' : ''}>
                        {transformation.source === 'ai_generated' ? '🤖 AI Generated' : 'Manual'}
                      </Badge>
                    </div>
                    
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto mb-4">
                      <pre>{transformation.code}</pre>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-lg font-bold text-blue-600">{transformation.performance.executionTime}ms</p>
                        <p className="text-xs text-gray-600">Execution Time</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-green-600">{transformation.performance.successRate}%</p>
                        <p className="text-xs text-gray-600">Success Rate</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">
                          Last Used: {new Date(transformation.performance.lastUsed).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnterpriseKnowledgeOrchestrator;
