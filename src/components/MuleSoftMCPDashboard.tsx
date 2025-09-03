import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Server, 
  Network, 
  Bot, 
  Workflow, 
  Activity, 
  Settings, 
  Play, 
  Stop, 
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Database,
  Shield,
  Users,
  BarChart3,
  Zap,
  Brain,
  Cpu
} from 'lucide-react';
import { toast } from 'sonner';

interface MCPStatus {
  connected: boolean;
  sessionId: string | null;
  serverUrl: string;
  timestamp: string;
}

interface Agent {
  id: string;
  name: string;
  type: string;
  status: 'idle' | 'running' | 'error' | 'completed';
  lastActivity: string;
  performance: number;
}

interface Workflow {
  id: string;
  name: string;
  type: 'onboarding' | 'security' | 'document' | 'analytics';
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  agents: string[];
  startTime: string;
  endTime?: string;
}

interface Statistics {
  totalAgents: number;
  activeAgents: number;
  totalWorkflows: number;
  activeWorkflows: number;
  successRate: number;
  averageResponseTime: number;
}

const MuleSoftMCPDashboard: React.FC = () => {
  const [mcpStatus, setMcpStatus] = useState<MCPStatus | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for demonstration
  const mockAgents: Agent[] = [
    {
      id: 'behavior-analyzer',
      name: 'Behavior Analyzer',
      type: 'AI Analysis',
      status: 'running',
      lastActivity: '2024-01-15T10:30:00Z',
      performance: 94
    },
    {
      id: 'recommendation-engine',
      name: 'Recommendation Engine',
      type: 'AI Recommendations',
      status: 'idle',
      lastActivity: '2024-01-15T09:45:00Z',
      performance: 89
    },
    {
      id: 'workflow-orchestrator',
      name: 'Workflow Orchestrator',
      type: 'Orchestration',
      status: 'running',
      lastActivity: '2024-01-15T10:25:00Z',
      performance: 96
    },
    {
      id: 'security-monitor',
      name: 'Security Monitor',
      type: 'Security',
      status: 'idle',
      lastActivity: '2024-01-15T08:15:00Z',
      performance: 99
    }
  ];

  const mockWorkflows: Workflow[] = [
    {
      id: 'wf-001',
      name: 'Customer Onboarding Flow',
      type: 'onboarding',
      status: 'running',
      progress: 75,
      agents: ['behavior-analyzer', 'recommendation-engine'],
      startTime: '2024-01-15T10:00:00Z'
    },
    {
      id: 'wf-002',
      name: 'Security Assessment',
      type: 'security',
      status: 'completed',
      progress: 100,
      agents: ['security-monitor'],
      startTime: '2024-01-15T09:30:00Z',
      endTime: '2024-01-15T09:45:00Z'
    },
    {
      id: 'wf-003',
      name: 'Document Generation',
      type: 'document',
      status: 'pending',
      progress: 0,
      agents: ['workflow-orchestrator'],
      startTime: '2024-01-15T10:35:00Z'
    }
  ];

  const mockStatistics: Statistics = {
    totalAgents: 4,
    activeAgents: 2,
    totalWorkflows: 3,
    activeWorkflows: 2,
    successRate: 87.5,
    averageResponseTime: 2.3
  };

  useEffect(() => {
    // Load initial data
    setAgents(mockAgents);
    setWorkflows(mockWorkflows);
    setStatistics(mockStatistics);
    
    // Simulate MCP connection status
    setMcpStatus({
      connected: true,
      sessionId: 'mcp_session_1705312345678_abc123def',
      serverUrl: 'http://localhost:3001',
      timestamp: new Date().toISOString()
    });
  }, []);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMcpStatus({
        connected: true,
        sessionId: `mcp_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        serverUrl: 'http://localhost:3001',
        timestamp: new Date().toISOString()
      });
      
      toast.success('Connected to MuleSoft MCP Server');
    } catch (error) {
      toast.error('Failed to connect to MCP server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    setMcpStatus({
      connected: false,
      sessionId: null,
      serverUrl: 'http://localhost:3001',
      timestamp: new Date().toISOString()
    });
    toast.info('Disconnected from MCP server');
  };

  const handleInitializeOrchestrator = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Multi-Agent Orchestrator initialized');
    } catch (error) {
      toast.error('Failed to initialize orchestrator');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteWorkflow = async (workflowId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update workflow status
      setWorkflows(prev => prev.map(wf => 
        wf.id === workflowId 
          ? { ...wf, status: 'running' as const, progress: 25 }
          : wf
      ));
      
      toast.success(`Workflow ${workflowId} started successfully`);
    } catch (error) {
      toast.error('Failed to execute workflow');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
      case 'completed':
        return 'bg-green-500';
      case 'idle':
        return 'bg-blue-500';
      case 'error':
      case 'failed':
        return 'bg-red-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Activity className="w-4 h-4 animate-pulse" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'idle':
        return <Play className="w-4 h-4" />;
      case 'error':
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      case 'pending':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">MuleSoft MCP Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage AI agents, workflows, and MCP server connections
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant={mcpStatus?.connected ? "destructive" : "default"}
            onClick={mcpStatus?.connected ? handleDisconnect : handleConnect}
            disabled={isLoading}
          >
            {mcpStatus?.connected ? (
              <>
                <Stop className="w-4 h-4 mr-2" />
                Disconnect
              </>
            ) : (
              <>
                <Server className="w-4 h-4 mr-2" />
                Connect
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleInitializeOrchestrator}
            disabled={isLoading || !mcpStatus?.connected}
          >
            <Zap className="w-4 h-4 mr-2" />
            Initialize Orchestrator
          </Button>
        </div>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Network className="w-5 h-5 mr-2" />
            MCP Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mcpStatus ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${mcpStatus.connected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="font-medium">
                  {mcpStatus.connected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Server:</span>
                <span className="ml-2 font-mono text-sm">{mcpStatus.serverUrl}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Session:</span>
                <span className="ml-2 font-mono text-sm">
                  {mcpStatus.sessionId ? mcpStatus.sessionId.substring(0, 20) + '...' : 'None'}
                </span>
              </div>
            </div>
          ) : (
            <Alert>
              <AlertDescription>No connection status available</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="agents">AI Agents</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
                <Bot className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics?.totalAgents || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {statistics?.activeAgents || 0} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
                <Workflow className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics?.activeWorkflows || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {statistics?.totalWorkflows || 0} total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics?.successRate || 0}%</div>
                <p className="text-xs text-muted-foreground">
                  +2.1% from last week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                <Cpu className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics?.averageResponseTime || 0}s</div>
                <p className="text-xs text-muted-foreground">
                  -0.3s from last week
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflows.slice(0, 3).map((workflow) => (
                  <div key={workflow.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(workflow.status)}
                      <div>
                        <p className="font-medium">{workflow.name}</p>
                        <p className="text-sm text-gray-600">
                          Started {new Date(workflow.startTime).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant={workflow.status === 'completed' ? 'default' : 'secondary'}>
                      {workflow.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Agents</CardTitle>
              <CardDescription>
                Monitor and manage AI agent performance and status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agents.map((agent) => (
                  <div key={agent.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)}`} />
                        <div>
                          <h3 className="font-medium">{agent.name}</h3>
                          <p className="text-sm text-gray-600">{agent.type}</p>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {agent.performance}% performance
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Status:</span>
                        <span className="ml-2 font-medium">{agent.status}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Last Activity:</span>
                        <span className="ml-2">
                          {new Date(agent.lastActivity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Performance</span>
                        <span>{agent.performance}%</span>
                      </div>
                      <Progress value={agent.performance} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workflows</CardTitle>
              <CardDescription>
                Monitor workflow execution and manage orchestration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflows.map((workflow) => (
                  <div key={workflow.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(workflow.status)}
                        <div>
                          <h3 className="font-medium">{workflow.name}</h3>
                          <p className="text-sm text-gray-600">
                            Type: {workflow.type} | Agents: {workflow.agents.length}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={workflow.status === 'completed' ? 'default' : 'secondary'}>
                          {workflow.status}
                        </Badge>
                        {workflow.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => handleExecuteWorkflow(workflow.id)}
                            disabled={isLoading}
                          >
                            <Play className="w-3 h-3 mr-1" />
                            Start
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-600">Start Time:</span>
                        <span className="ml-2">
                          {new Date(workflow.startTime).toLocaleString()}
                        </span>
                      </div>
                      {workflow.endTime && (
                        <div>
                          <span className="text-gray-600">End Time:</span>
                          <span className="ml-2">
                            {new Date(workflow.endTime).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{workflow.progress}%</span>
                      </div>
                      <Progress value={workflow.progress} className="h-2" />
                    </div>
                    
                    <div className="mt-3">
                      <span className="text-sm text-gray-600">Agents:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {workflow.agents.map((agentId) => (
                          <Badge key={agentId} variant="outline" className="text-xs">
                            {agentId}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Agent Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {agents.map((agent) => (
                    <div key={agent.id} className="flex items-center justify-between">
                      <span className="text-sm">{agent.name}</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={agent.performance} className="w-20 h-2" />
                        <span className="text-sm font-medium">{agent.performance}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Workflow Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workflows.map((workflow) => (
                    <div key={workflow.id} className="flex items-center justify-between">
                      <span className="text-sm">{workflow.name}</span>
                      <Badge variant={workflow.status === 'completed' ? 'default' : 'secondary'}>
                        {workflow.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">98.5%</div>
                  <div className="text-sm text-gray-600">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">2.3s</div>
                  <div className="text-sm text-gray-600">Avg Response Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">87.5%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MuleSoftMCPDashboard;
