const express = require('express');
const router = express.Router();
const MuleSoftMCPClient = require('../mulesoft/mcp-client');
const MultiAgentOrchestrator = require('../ai/multiAgentOrchestrator');

// Initialize MCP client and orchestrator
const mcpClient = new MuleSoftMCPClient({
  serverUrl: process.env.MCP_SERVER_URL || 'http://localhost:3001'
});

const orchestrator = new MultiAgentOrchestrator({
  mcpServerUrl: process.env.MCP_SERVER_URL || 'http://localhost:3001'
});

/**
 * MCP Connection Management
 */

// Connect to MCP server
router.post('/connect', async (req, res) => {
  try {
    const connected = await mcpClient.connect();
    if (connected) {
      res.json({
        success: true,
        message: 'Connected to MuleSoft MCP Server',
        status: mcpClient.getStatus()
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to connect to MCP server'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Connection error',
      error: error.message
    });
  }
});

// Get MCP connection status
router.get('/status', (req, res) => {
  res.json({
    success: true,
    status: mcpClient.getStatus()
  });
});

// Disconnect from MCP server
router.post('/disconnect', (req, res) => {
  mcpClient.disconnect();
  res.json({
    success: true,
    message: 'Disconnected from MCP server'
  });
});

/**
 * MCP Discovery and Resources
 */

// Discover MCP server capabilities
router.get('/discover', async (req, res) => {
  try {
    const discovery = await mcpClient.discover();
    res.json({
      success: true,
      discovery
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Discovery failed',
      error: error.message
    });
  }
});

// List available resources
router.post('/resources', async (req, res) => {
  try {
    const { uri } = req.body;
    const resources = await mcpClient.listResources(uri);
    res.json({
      success: true,
      resources
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to list resources',
      error: error.message
    });
  }
});

// Read resource content
router.post('/resources/read', async (req, res) => {
  try {
    const { uri } = req.body;
    const content = await mcpClient.readResource(uri);
    res.json({
      success: true,
      content
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to read resource',
      error: error.message
    });
  }
});

/**
 * MCP Tools and Commands
 */

// List available tools
router.get('/tools', async (req, res) => {
  try {
    const tools = await mcpClient.listTools();
    res.json({
      success: true,
      tools
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to list tools',
      error: error.message
    });
  }
});

// Call a tool
router.post('/tools/call', async (req, res) => {
  try {
    const { name, arguments: args } = req.body;
    const result = await mcpClient.callTool(name, args);
    res.json({
      success: true,
      result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to call tool',
      error: error.message
    });
  }
});

// Execute a command
router.post('/commands/execute', async (req, res) => {
  try {
    const { command, arguments: args } = req.body;
    const result = await mcpClient.executeCommand(command, args);
    res.json({
      success: true,
      result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to execute command',
      error: error.message
    });
  }
});

/**
 * AI Agent Operations
 */

// Initialize orchestrator
router.post('/orchestrator/init', async (req, res) => {
  try {
    const initialized = await orchestrator.initialize();
    if (initialized) {
      res.json({
        success: true,
        message: 'Multi-Agent Orchestrator initialized',
        agents: orchestrator.getAllAgentsStatus()
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to initialize orchestrator'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Initialization failed',
      error: error.message
    });
  }
});

// Execute onboarding workflow
router.post('/workflows/onboarding', async (req, res) => {
  try {
    const { userData } = req.body;
    const result = await orchestrator.executeOnboardingWorkflow(userData);
    res.json({
      success: true,
      result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Onboarding workflow failed',
      error: error.message
    });
  }
});

// Execute security workflow
router.post('/workflows/security', async (req, res) => {
  try {
    const { userId, eventType } = req.body;
    const result = await orchestrator.executeSecurityWorkflow(userId, eventType);
    res.json({
      success: true,
      result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Security workflow failed',
      error: error.message
    });
  }
});

// Get agent status
router.get('/agents/:agentId', (req, res) => {
  const { agentId } = req.params;
  const status = orchestrator.getAgentStatus(agentId);
  
  if (status) {
    res.json({
      success: true,
      agent: status
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Agent not found'
    });
  }
});

// Get all agents status
router.get('/agents', (req, res) => {
  const agents = orchestrator.getAllAgentsStatus();
  res.json({
    success: true,
    agents
  });
});

// Execute agent task
router.post('/agents/:agentId/task', async (req, res) => {
  try {
    const { agentId } = req.params;
    const { task } = req.body;
    
    const result = await orchestrator.executeAgentTask(agentId, task);
    res.json({
      success: true,
      result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Agent task failed',
      error: error.message
    });
  }
});

/**
 * Workflow Management
 */

// Get workflow status
router.get('/workflows/:workflowId', (req, res) => {
  const { workflowId } = req.params;
  const workflow = orchestrator.getWorkflowStatus(workflowId);
  
  if (workflow) {
    res.json({
      success: true,
      workflow
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Workflow not found'
    });
  }
});

// Get all workflows status
router.get('/workflows', (req, res) => {
  const workflows = orchestrator.getAllWorkflowsStatus();
  res.json({
    success: true,
    workflows
  });
});

/**
 * Statistics and Monitoring
 */

// Get orchestrator statistics
router.get('/statistics', (req, res) => {
  const stats = orchestrator.getStatistics();
  res.json({
    success: true,
    statistics: stats
  });
});

/**
 * Specific AI Operations
 */

// Analyze user behavior
router.post('/ai/analyze-behavior', async (req, res) => {
  try {
    const { userId, timeRange, metrics } = req.body;
    const result = await mcpClient.analyzeUserBehavior(userId, timeRange, metrics);
    res.json({
      success: true,
      result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Behavior analysis failed',
      error: error.message
    });
  }
});

// Generate recommendations
router.post('/ai/recommendations', async (req, res) => {
  try {
    const { userProfile, context, limit } = req.body;
    const result = await mcpClient.generateRecommendations(userProfile, context, limit);
    res.json({
      success: true,
      result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Recommendation generation failed',
      error: error.message
    });
  }
});

// Monitor security
router.post('/ai/security-monitor', async (req, res) => {
  try {
    const { userId, eventType, severity } = req.body;
    const result = await mcpClient.monitorSecurity(userId, eventType, severity);
    res.json({
      success: true,
      result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Security monitoring failed',
      error: error.message
    });
  }
});

// Orchestrate workflow
router.post('/ai/orchestrate', async (req, res) => {
  try {
    const { workflowId, parameters, agents } = req.body;
    const result = await mcpClient.orchestrateWorkflow(workflowId, parameters, agents);
    res.json({
      success: true,
      result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Workflow orchestration failed',
      error: error.message
    });
  }
});

/**
 * MuleSoft Operations
 */

// Deploy workflow to MuleSoft
router.post('/mulesoft/deploy', async (req, res) => {
  try {
    const { workflowId, environment } = req.body;
    const result = await mcpClient.deployWorkflow(workflowId, environment);
    res.json({
      success: true,
      result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Workflow deployment failed',
      error: error.message
    });
  }
});

// Update API configuration
router.put('/mulesoft/api/:apiId', async (req, res) => {
  try {
    const { apiId } = req.params;
    const { configuration } = req.body;
    const result = await mcpClient.updateAPI(apiId, configuration);
    res.json({
      success: true,
      result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'API update failed',
      error: error.message
    });
  }
});

// Train AI agent
router.post('/mulesoft/train-agent', async (req, res) => {
  try {
    const { agentId, trainingData } = req.body;
    const result = await mcpClient.trainAIAgent(agentId, trainingData);
    res.json({
      success: true,
      result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Agent training failed',
      error: error.message
    });
  }
});

// Monitor performance
router.post('/mulesoft/monitor', async (req, res) => {
  try {
    const { metrics } = req.body;
    const result = await mcpClient.monitorPerformance(metrics);
    res.json({
      success: true,
      result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Performance monitoring failed',
      error: error.message
    });
  }
});

/**
 * Health Check
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    mcp: mcpClient.getStatus(),
    orchestrator: {
      isRunning: orchestrator.isRunning,
      agentsCount: orchestrator.agents.size,
      workflowsCount: orchestrator.activeWorkflows.size
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
