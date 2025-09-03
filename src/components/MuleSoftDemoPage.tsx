import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { mulesoftApiService } from '@/services/mulesoftApiService';
import {
  Code,
  Database,
  Cloud,
  Zap,
  Brain,
  Workflow,
  Shield,
  BarChart3,
  Play,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Settings,
  Terminal,
  FileCode,
  GitBranch,
  Server,
  Network,
  Cpu,
  Memory,
  HardDrive,
  Activity,
  Globe,
  Lock,
  Unlock,
  MessageSquare,
  Phone,
  Video,
  FileText,
  Users,
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
  ExternalLink
} from 'lucide-react';

interface MuleFlow {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'error';
  type: 'api' | 'integration' | 'workflow';
  endpoints: string[];
  performance: {
    requests: number;
    avgResponseTime: number;
    errorRate: number;
  };
  lastDeployed: string;
}

interface MCPEndpoint {
  id: string;
  name: string;
  protocol: 'mcp' | 'rest' | 'graphql';
  status: 'active' | 'inactive' | 'error';
  capabilities: string[];
  metadata: {
    version: string;
    description: string;
    schema: Record<string, unknown>;
  };
}

interface AIPersonalizationAgent {
  id: string;
  name: string;
  type: 'intake' | 'personalization' | 'execution' | 'monitoring';
  status: 'active' | 'learning' | 'error';
  accuracy: number;
  decisions: number;
  lastTraining: string;
}

const MuleSoftDemoPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null);
  const [isRunningDemo, setIsRunningDemo] = useState(false);
  const [demoProgress, setDemoProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  // Mock data for MuleSoft components
  const muleFlows: MuleFlow[] = [
    {
      id: 'flow-1',
      name: 'User Onboarding Flow',
      status: 'running',
      type: 'api',
      endpoints: ['/api/onboard', '/api/verify', '/api/personalize'],
      performance: {
        requests: 1247,
        avgResponseTime: 245,
        errorRate: 0.2
      },
      lastDeployed: '2024-01-15T10:30:00Z'
    },
    {
      id: 'flow-2',
      name: 'Vonage Integration Flow',
      status: 'running',
      type: 'integration',
      endpoints: ['/api/vonage/verify', '/api/vonage/sms', '/api/vonage/video'],
      performance: {
        requests: 892,
        avgResponseTime: 180,
        errorRate: 0.1
      },
      lastDeployed: '2024-01-14T15:45:00Z'
    },
    {
      id: 'flow-3',
      name: 'Foxit Document Workflow',
      status: 'running',
      type: 'workflow',
      endpoints: ['/api/foxit/generate', '/api/foxit/process', '/api/foxit/compress'],
      performance: {
        requests: 567,
        avgResponseTime: 320,
        errorRate: 0.3
      },
      lastDeployed: '2024-01-13T09:20:00Z'
    },
    {
      id: 'flow-4',
      name: 'AI Personalization Agent',
      status: 'running',
      type: 'api',
      endpoints: ['/api/ai/analyze', '/api/ai/decide', '/api/ai/optimize'],
      performance: {
        requests: 2341,
        avgResponseTime: 156,
        errorRate: 0.05
      },
      lastDeployed: '2024-01-16T08:15:00Z'
    }
  ];

  const mcpEndpoints: MCPEndpoint[] = [
    {
      id: 'mcp-1',
      name: 'Onboarding MCP Server',
      protocol: 'mcp',
      status: 'active',
      capabilities: ['metadata', 'invoke', 'discover', 'context'],
      metadata: {
        version: '1.0.0',
        description: 'AI-native interface for onboarding APIs',
        schema: {
          resources: ['users', 'onboarding', 'verification'],
          actions: ['create', 'read', 'update', 'delete']
        }
      }
    },
    {
      id: 'mcp-2',
      name: 'Integration MCP Server',
      protocol: 'mcp',
      status: 'active',
      capabilities: ['orchestrate', 'monitor', 'optimize'],
      metadata: {
        version: '1.0.0',
        description: 'Multi-agent orchestration interface',
        schema: {
          resources: ['flows', 'agents', 'workflows'],
          actions: ['execute', 'monitor', 'optimize']
        }
      }
    }
  ];

  const aiAgents: AIPersonalizationAgent[] = [
    {
      id: 'agent-1',
      name: 'Intake Agent',
      type: 'intake',
      status: 'active',
      accuracy: 98.5,
      decisions: 1247,
      lastTraining: '2024-01-15T14:30:00Z'
    },
    {
      id: 'agent-2',
      name: 'Personalization Agent',
      type: 'personalization',
      status: 'active',
      accuracy: 96.2,
      decisions: 892,
      lastTraining: '2024-01-14T11:15:00Z'
    },
    {
      id: 'agent-3',
      name: 'Execution Agent',
      type: 'execution',
      status: 'active',
      accuracy: 99.1,
      decisions: 567,
      lastTraining: '2024-01-13T16:45:00Z'
    },
    {
      id: 'agent-4',
      name: 'Monitoring Agent',
      type: 'monitoring',
      status: 'active',
      accuracy: 97.8,
      decisions: 2341,
      lastTraining: '2024-01-16T09:20:00Z'
    }
  ];

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // API integration functions
  const checkAIAgentsHealth = async () => {
    try {
      const health = await mulesoftApiService.checkHealth();
      addLog(`AI Agents Health: ${health.status}`);
      return health;
    } catch (error) {
      addLog(`Error checking AI agents health: ${error}`);
      return null;
    }
  };

  const executeAgentTask = async (agentType: string, data: Record<string, unknown>) => {
    try {
      const result = await mulesoftApiService.executeAgentTask(agentType, data);
      addLog(`Agent ${agentType} executed: ${result.executionId}`);
      return result;
    } catch (error) {
      addLog(`Error executing agent task: ${error}`);
      return null;
    }
  };

  const discoverKnowledge = async (query: string) => {
    try {
      const result = await mulesoftApiService.discoverKnowledge(query);
      addLog(`Knowledge discovery: Found ${result.discoveredCount} assets`);
      return result;
    } catch (error) {
      addLog(`Error discovering knowledge: ${error}`);
      return null;
    }
  };

  const runDemo = async () => {
    setIsRunningDemo(true);
    setDemoProgress(0);
    setLogs([]);

    try {
      // Step 1: Check AI agents health
      setDemoProgress(10);
      addLog('Initializing MuleSoft Anypoint Code Builder...');
      await checkAIAgentsHealth();
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 2: Load AI personalization agents
      setDemoProgress(25);
      addLog('Loading AI personalization agents...');
      await executeAgentTask('discovery', { query: 'healthcare onboarding' });
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 3: Start MCP server endpoints
      setDemoProgress(40);
      addLog('Starting MCP server endpoints...');
      await executeAgentTask('context', { query: 'user verification workflow' });
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 4: Execute user onboarding flow
      setDemoProgress(55);
      addLog('Executing user onboarding flow...');
      await discoverKnowledge('healthcare client onboarding');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 5: Trigger Vonage verification
      setDemoProgress(70);
      addLog('Triggering Vonage verification...');
      await executeAgentTask('decision', { query: 'recommend onboarding steps' });
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 6: Generate Foxit documents
      setDemoProgress(85);
      addLog('Generating Foxit documents...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 7: Complete
      setDemoProgress(100);
      addLog('Demo completed successfully!');
    } catch (error) {
      addLog(`Demo error: ${error}`);
    }

    setIsRunningDemo(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'stopped':
      case 'inactive':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <RefreshCw className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'stopped':
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Code className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">MuleSoft Anypoint Platform</h1>
            <p className="text-gray-600">AI-Powered API Orchestration & Integration</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Workflow className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">Active Flows</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">4</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Server className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">MCP Endpoints</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Bot className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium">AI Agents</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">4</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium">Total Requests</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">5,047</p>
            </CardContent>
          </Card>
        </div>

        <Button
          onClick={runDemo}
          disabled={isRunningDemo}
          className="mb-6"
        >
          {isRunningDemo ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Running Demo...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Run Live Demo
            </>
          )}
        </Button>

        {isRunningDemo && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Demo Progress</span>
                <span className="text-sm text-gray-500">{demoProgress}%</span>
              </div>
              <Progress value={demoProgress} className="mb-4" />
              <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-sm h-32 overflow-y-auto">
                {logs.map((log, index) => (
                  <div key={index}>{log}</div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="flows">Mule Flows</TabsTrigger>
          <TabsTrigger value="mcp">MCP Servers</TabsTrigger>
          <TabsTrigger value="ai">AI Agents</TabsTrigger>
          <TabsTrigger value="code">Code Builder</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Code className="h-5 w-5" />
                  <span>Anypoint Code Builder</span>
                </CardTitle>
                <CardDescription>
                  AI-assisted development environment for MuleSoft integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">AI Code Generation</span>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Auto Testing</span>
                  <Badge variant="secondary">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Smart Suggestions</span>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <Button variant="outline" className="w-full">
                  <Terminal className="h-4 w-4 mr-2" />
                  Open Code Builder
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>AI Personalization</span>
                </CardTitle>
                <CardDescription>
                  Multi-agent system for dynamic onboarding orchestration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Decision Accuracy</span>
                    <span className="text-sm font-medium">97.9%</span>
                  </div>
                  <Progress value={97.9} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Response Time</span>
                    <span className="text-sm font-medium">156ms</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <Button variant="outline" className="w-full">
                  <Bot className="h-4 w-4 mr-2" />
                  View AI Dashboard
                </Button>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <Database className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <h3 className="font-medium">Data Sources</h3>
                  <p className="text-sm text-gray-600">CRM, ERP, External APIs</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Workflow className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <h3 className="font-medium">Mule Flows</h3>
                  <p className="text-sm text-gray-600">API Orchestration</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Globe className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <h3 className="font-medium">External Services</h3>
                  <p className="text-sm text-gray-600">Vonage, Foxit, AI Models</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flows" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {muleFlows.map((flow) => (
              <Card key={flow.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      {getStatusIcon(flow.status)}
                      <span>{flow.name}</span>
                    </CardTitle>
                    <Badge className={getStatusColor(flow.status)}>
                      {flow.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    {flow.type.charAt(0).toUpperCase() + flow.type.slice(1)} Flow
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Endpoints</h4>
                    <div className="space-y-1">
                      {flow.endpoints.map((endpoint, index) => (
                        <div key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {endpoint}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{flow.performance.requests}</p>
                      <p className="text-xs text-gray-600">Requests</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">{flow.performance.avgResponseTime}ms</p>
                      <p className="text-xs text-gray-600">Avg Response</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-red-600">{flow.performance.errorRate}%</p>
                      <p className="text-xs text-gray-600">Error Rate</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Last Deployed: {new Date(flow.lastDeployed).toLocaleDateString()}</span>
                    <Button variant="outline" size="sm">
                      <Eye className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
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
                <span>Model Context Protocol (MCP) Servers</span>
              </CardTitle>
              <CardDescription>
                AI-native interfaces for dynamic API interaction and orchestration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mcpEndpoints.map((endpoint) => (
                  <div key={endpoint.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(endpoint.status)}
                        <div>
                          <h3 className="font-medium">{endpoint.name}</h3>
                          <p className="text-sm text-gray-600">{endpoint.metadata.description}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(endpoint.status)}>
                        {endpoint.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Capabilities</h4>
                        <div className="flex flex-wrap gap-1">
                          {endpoint.capabilities.map((capability) => (
                            <Badge key={capability} variant="outline" className="text-xs">
                              {capability}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Schema</h4>
                        <div className="bg-gray-50 p-2 rounded text-xs">
                          <pre className="whitespace-pre-wrap">
                            {JSON.stringify(endpoint.metadata.schema, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Test Endpoint
                      </Button>
                      <Button variant="outline" size="sm">
                        <Code className="h-3 w-3 mr-1" />
                        View Schema
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiAgents.map((agent) => (
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
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Accuracy</span>
                      <span className="text-sm font-medium">{agent.accuracy}%</span>
                    </div>
                    <Progress value={agent.accuracy} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-xl font-bold text-blue-600">{agent.decisions}</p>
                      <p className="text-xs text-gray-600">Decisions</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">
                        Trained: {new Date(agent.lastTraining).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <Activity className="h-4 w-4 mr-2" />
                    View Performance
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="code" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Terminal className="h-5 w-5" />
                <span>Anypoint Code Builder</span>
              </CardTitle>
              <CardDescription>
                AI-assisted development environment with real-time collaboration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">AI Features</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">Smart Code Completion</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Brain className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">AI-Powered Testing</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Code2 className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Auto Documentation</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Layers className="h-4 w-4 text-orange-600" />
                      <span className="text-sm">Integration Templates</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Development Tools</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <GitBranch className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">Version Control</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Settings className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Configuration Management</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Performance Monitoring</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-red-600" />
                      <span className="text-sm">Security Scanning</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-4">
                <h3 className="font-medium">Sample Mule Flow Code</h3>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre>{`<flow name="UserOnboardingFlow">
  <http:listener config-ref="HTTP_Listener" 
                 path="/api/onboard" 
                 doc:name="Receive User Data"/>
  
  <logger message="Starting onboarding for #[payload.email]" 
          level="INFO"/>
  
  <!-- AI Personalization Decision -->
  <choice doc:name="Personalization Decision">
    <when expression="#[payload.plan == 'premium']">
      <flow-ref name="PremiumOnboardingFlow"/>
    </when>
    <otherwise>
      <flow-ref name="StandardOnboardingFlow"/>
    </otherwise>
  </choice>
  
  <set-payload value="Onboarding completed for #[payload.email]"/>
</flow>`}</pre>
                </div>
              </div>
              
              <div className="mt-6 flex space-x-2">
                <Button>
                  <Terminal className="h-4 w-4 mr-2" />
                  Open Code Builder
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Sample
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MuleSoftDemoPage;
