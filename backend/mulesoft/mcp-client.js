const axios = require('axios');
const { EventEmitter } = require('events');

/**
 * MuleSoft MCP (Model Context Protocol) Client
 * Enables AI agents to communicate with MuleSoft MCP servers
 */
class MuleSoftMCPClient extends EventEmitter {
  constructor(config = {}) {
    super();
    
    this.config = {
      serverUrl: config.serverUrl || 'http://localhost:3001',
      timeout: config.timeout || 30000,
      retries: config.retries || 3,
      ...config
    };

    this.connected = false;
    this.sessionId = null;
  }

  /**
   * Connect to MCP server
   */
  async connect() {
    try {
      const response = await axios.get(`${this.config.serverUrl}/mcp/health`, {
        timeout: this.config.timeout
      });

      if (response.data.status === 'healthy') {
        this.connected = true;
        this.sessionId = this.generateSessionId();
        
        console.log('Connected to MuleSoft MCP Server');
        this.emit('connected', {
          sessionId: this.sessionId,
          timestamp: new Date().toISOString()
        });
        
        return true;
      } else {
        throw new Error('MCP server is not healthy');
      }
    } catch (error) {
      console.error('Failed to connect to MCP server:', error.message);
      this.emit('connection_error', error);
      return false;
    }
  }

  /**
   * Discover available resources and tools
   */
  async discover() {
    try {
      const response = await axios.get(`${this.config.serverUrl}/mcp/discovery`, {
        timeout: this.config.timeout
      });

      this.emit('discovered', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to discover MCP server:', error.message);
      throw error;
    }
  }

  /**
   * List available resources
   */
  async listResources(uri = 'mcp://onboardiq/apis') {
    try {
      const response = await axios.post(`${this.config.serverUrl}/mcp/list-resources`, {
        uri
      }, {
        timeout: this.config.timeout,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response.data.resources;
    } catch (error) {
      console.error('Failed to list resources:', error.message);
      throw error;
    }
  }

  /**
   * Read resource content
   */
  async readResource(uri) {
    try {
      const response = await axios.post(`${this.config.serverUrl}/mcp/read-resource`, {
        uri
      }, {
        timeout: this.config.timeout,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response.data.contents[0];
    } catch (error) {
      console.error('Failed to read resource:', error.message);
      throw error;
    }
  }

  /**
   * List available tools
   */
  async listTools() {
    try {
      const response = await axios.post(`${this.config.serverUrl}/mcp/list-tools`, {}, {
        timeout: this.config.timeout,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response.data.tools;
    } catch (error) {
      console.error('Failed to list tools:', error.message);
      throw error;
    }
  }

  /**
   * Call a tool
   */
  async callTool(name, args) {
    try {
      const response = await axios.post(`${this.config.serverUrl}/mcp/call-tool`, {
        name,
        arguments: args
      }, {
        timeout: this.config.timeout,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response.data.content[0];
    } catch (error) {
      console.error(`Failed to call tool ${name}:`, error.message);
      throw error;
    }
  }

  /**
   * Execute a command
   */
  async executeCommand(command, args) {
    try {
      const response = await axios.post(`${this.config.serverUrl}/mcp/execute-command`, {
        command,
        arguments: args
      }, {
        timeout: this.config.timeout,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response.data.result;
    } catch (error) {
      console.error(`Failed to execute command ${command}:`, error.message);
      throw error;
    }
  }

  /**
   * Analyze user behavior using MuleSoft AI
   */
  async analyzeUserBehavior(userId, timeRange = '7d', metrics = ['engagement', 'conversion']) {
    return await this.callTool('analyze_user_behavior', {
      userId,
      timeRange,
      metrics
    });
  }

  /**
   * Generate AI recommendations
   */
  async generateRecommendations(userProfile, context = 'onboarding', limit = 5) {
    return await this.callTool('generate_recommendations', {
      userProfile,
      context,
      limit
    });
  }

  /**
   * Orchestrate multi-agent workflow
   */
  async orchestrateWorkflow(workflowId, parameters = {}, agents = []) {
    return await this.callTool('orchestrate_workflow', {
      workflowId,
      parameters,
      agents
    });
  }

  /**
   * Monitor security events
   */
  async monitorSecurity(userId, eventType = 'login', severity = 'medium') {
    return await this.callTool('monitor_security', {
      userId,
      eventType,
      severity
    });
  }

  /**
   * Deploy workflow to MuleSoft
   */
  async deployWorkflow(workflowId, environment = 'development') {
    return await this.executeCommand('deploy_workflow', {
      workflowId,
      environment
    });
  }

  /**
   * Update API configuration
   */
  async updateAPI(apiId, configuration) {
    return await this.executeCommand('update_api', {
      apiId,
      configuration
    });
  }

  /**
   * Train AI agent
   */
  async trainAIAgent(agentId, trainingData) {
    return await this.executeCommand('train_ai_agent', {
      agentId,
      trainingData
    });
  }

  /**
   * Monitor performance metrics
   */
  async monitorPerformance(metrics = ['response_time', 'throughput', 'error_rate']) {
    return await this.executeCommand('monitor_performance', {
      metrics
    });
  }

  /**
   * Get API resource information
   */
  async getAPIInfo(apiName) {
    const uri = `mcp://onboardiq/apis/${apiName}`;
    return await this.readResource(uri);
  }

  /**
   * Get workflow information
   */
  async getWorkflowInfo(workflowName) {
    const uri = `mcp://onboardiq/workflows/${workflowName}`;
    return await this.readResource(uri);
  }

  /**
   * Get AI agent information
   */
  async getAIAgentInfo(agentName) {
    const uri = `mcp://onboardiq/ai-agents/${agentName}`;
    return await this.readResource(uri);
  }

  /**
   * Generate session ID
   */
  generateSessionId() {
    return `mcp_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Disconnect from MCP server
   */
  disconnect() {
    this.connected = false;
    this.sessionId = null;
    
    console.log('Disconnected from MuleSoft MCP Server');
    this.emit('disconnected');
  }

  /**
   * Check if connected
   */
  isConnected() {
    return this.connected;
  }

  /**
   * Get connection status
   */
  getStatus() {
    return {
      connected: this.connected,
      sessionId: this.sessionId,
      serverUrl: this.config.serverUrl,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = MuleSoftMCPClient;
