const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

// Rate limiting for AI Agents API endpoints
const aiAgentsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all AI Agents routes
router.use(aiAgentsLimiter);

// Validation middleware
const validateKnowledgeQuery = [
  body('query').notEmpty().withMessage('Query is required'),
  body('context').optional().isObject().withMessage('Context must be an object'),
  body('filters').optional().isObject().withMessage('Filters must be an object')
];

const validateAgentRequest = [
  body('agentType').isIn(['discovery', 'context', 'decision']).withMessage('Invalid agent type'),
  body('data').isObject().withMessage('Data must be an object'),
  body('options').optional().isObject().withMessage('Options must be an object')
];

const validateMCPRequest = [
  body('tool').notEmpty().withMessage('Tool name is required'),
  body('parameters').isObject().withMessage('Parameters must be an object'),
  body('context').optional().isObject().withMessage('Context must be an object')
];

// Error handling middleware for validation
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// Mock AI Agents data
const mockAgents = {
  discovery: {
    id: 'agent-discovery-001',
    name: 'Knowledge Discovery Agent',
    type: 'discovery',
    status: 'active',
    capabilities: ['search', 'index', 'crawl', 'normalize'],
    performance: {
      accuracy: 98.5,
      responseTime: 245,
      tasksCompleted: 1247,
      lastActivity: new Date().toISOString()
    },
    currentTask: 'Indexing Salesforce knowledge articles'
  },
  context: {
    id: 'agent-context-001',
    name: 'Context Analysis Agent',
    type: 'context',
    status: 'active',
    capabilities: ['analyze', 'classify', 'score', 'intent'],
    performance: {
      accuracy: 96.2,
      responseTime: 180,
      tasksCompleted: 892,
      lastActivity: new Date().toISOString()
    },
    currentTask: 'Analyzing query intent'
  },
  decision: {
    id: 'agent-decision-001',
    name: 'Decision Support Agent',
    type: 'decision',
    status: 'active',
    capabilities: ['synthesize', 'recommend', 'prioritize', 'execute'],
    performance: {
      accuracy: 99.1,
      responseTime: 320,
      tasksCompleted: 567,
      lastActivity: new Date().toISOString()
    },
    currentTask: 'Generating recommendations'
  }
};

const mockKnowledgeAssets = [
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

const mockMCPTools = [
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

const mockDataWeaveTransformations = [
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
      lastUsed: new Date().toISOString()
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
      lastUsed: new Date().toISOString()
    }
  }
];

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    agents: {
      total: Object.keys(mockAgents).length,
      active: Object.values(mockAgents).filter(agent => agent.status === 'active').length
    },
    services: {
      knowledgeDiscovery: 'operational',
      contextAnalysis: 'operational',
      decisionSupport: 'operational',
      mcpServer: 'operational'
    }
  });
});

// Get all agents status
router.get('/agents', (req, res) => {
  try {
    res.json({
      success: true,
      agents: Object.values(mockAgents),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch agents status'
    });
  }
});

// Get specific agent status
router.get('/agents/:agentType', (req, res) => {
  try {
    const { agentType } = req.params;
    const agent = mockAgents[agentType];
    
    if (!agent) {
      return res.status(404).json({
        success: false,
        error: 'Agent not found'
      });
    }
    
    res.json({
      success: true,
      agent,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching agent:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch agent status'
    });
  }
});

// Execute agent task
router.post('/agents/:agentType/execute', validateAgentRequest, handleValidationErrors, (req, res) => {
  try {
    const { agentType } = req.params;
    const { data, options } = req.body;
    
    const agent = mockAgents[agentType];
    if (!agent) {
      return res.status(404).json({
        success: false,
        error: 'Agent not found'
      });
    }
    
    // Simulate agent execution
    const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Mock execution result based on agent type
    let result;
    switch (agentType) {
      case 'discovery':
        result = {
          discoveredAssets: mockKnowledgeAssets.length,
          newAssets: Math.floor(Math.random() * 5) + 1,
          processingTime: Math.floor(Math.random() * 1000) + 200,
          dataWeaveTransformation: mockDataWeaveTransformations[0]
        };
        break;
      case 'context':
        result = {
          analyzedQuery: data.query || 'sample query',
          intent: 'business_inquiry',
          confidence: 0.92,
          relevantSources: ['salesforce', 'confluence', 'database'],
          processingTime: Math.floor(Math.random() * 500) + 100
        };
        break;
      case 'decision':
        result = {
          recommendation: 'Based on analysis, recommend targeting healthcare clients with bundled security solutions.',
          confidence: 0.89,
          supportingData: mockKnowledgeAssets.slice(0, 2),
          nextSteps: ['Schedule demo', 'Prepare proposal', 'Engage technical team'],
          processingTime: Math.floor(Math.random() * 800) + 150
        };
        break;
      default:
        result = { message: 'Task executed successfully' };
    }
    
    res.json({
      success: true,
      executionId,
      agentType,
      result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error executing agent task:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to execute agent task'
    });
  }
});

// Knowledge discovery endpoint
router.post('/knowledge/discover', validateKnowledgeQuery, handleValidationErrors, (req, res) => {
  try {
    const { query, context, filters } = req.body;
    
    // Simulate knowledge discovery process
    const discoveredAssets = mockKnowledgeAssets.filter(asset => {
      if (query) {
        return asset.title.toLowerCase().includes(query.toLowerCase()) ||
               asset.content.toLowerCase().includes(query.toLowerCase()) ||
               asset.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
      }
      return true;
    });
    
    // Apply filters if provided
    let filteredAssets = discoveredAssets;
    if (filters) {
      if (filters.source) {
        filteredAssets = filteredAssets.filter(asset => asset.source === filters.source);
      }
      if (filters.category) {
        filteredAssets = filteredAssets.filter(asset => asset.category === filters.category);
      }
    }
    
    res.json({
      success: true,
      query,
      discoveredCount: filteredAssets.length,
      assets: filteredAssets,
      dataWeaveTransformation: mockDataWeaveTransformations[0],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error discovering knowledge:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to discover knowledge'
    });
  }
});

// Context analysis endpoint
router.post('/knowledge/context-analyze', validateKnowledgeQuery, handleValidationErrors, (req, res) => {
  try {
    const { query, context } = req.body;
    
    // Simulate context analysis
    const analysis = {
      query,
      intent: 'business_inquiry',
      domain: 'sales',
      confidence: 0.94,
      relevantSources: ['salesforce', 'confluence', 'database'],
      suggestedActions: ['search_past_deals', 'analyze_market_trends', 'generate_proposal'],
      processingTime: Math.floor(Math.random() * 300) + 50
    };
    
    res.json({
      success: true,
      analysis,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error analyzing context:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze context'
    });
  }
});

// Decision support endpoint
router.post('/knowledge/decision-support', validateKnowledgeQuery, handleValidationErrors, (req, res) => {
  try {
    const { query, context, data } = req.body;
    
    // Simulate decision support
    const recommendation = {
      query,
      recommendation: 'Based on analysis of 150+ successful healthcare deals and market research: Target healthcare clients with bundled security solutions.',
      confidence: 0.89,
      supportingData: mockKnowledgeAssets.slice(0, 3),
      nextSteps: [
        'Lead with compliance automation features (45% of healthcare pain points)',
        'Demonstrate data privacy controls (60% priority)',
        'Offer Security Suite + Compliance Manager + API Gateway bundle',
        'Engage CTO first, then CISO for technical validation'
      ],
      metrics: {
        averageDealSize: '$250K',
        salesCycle: '6 months',
        successRate: '85%'
      },
      processingTime: Math.floor(Math.random() * 500) + 100
    };
    
    res.json({
      success: true,
      recommendation,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating decision support:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate decision support'
    });
  }
});

// MCP Tools endpoints
router.get('/mcp/tools', (req, res) => {
  try {
    res.json({
      success: true,
      tools: mockMCPTools,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching MCP tools:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch MCP tools'
    });
  }
});

// Execute MCP tool
router.post('/mcp/execute', validateMCPRequest, handleValidationErrors, (req, res) => {
  try {
    const { tool, parameters, context } = req.body;
    
    const mcpTool = mockMCPTools.find(t => t.name === tool);
    if (!mcpTool) {
      return res.status(404).json({
        success: false,
        error: 'MCP tool not found'
      });
    }
    
    // Simulate MCP tool execution
    const executionId = `mcp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    let result;
    switch (tool) {
      case 'Knowledge Search':
        result = {
          query: parameters.query,
          results: mockKnowledgeAssets.filter(asset => 
            asset.title.toLowerCase().includes(parameters.query.toLowerCase())
          ),
          totalResults: mockKnowledgeAssets.length
        };
        break;
      case 'Context Analysis':
        result = {
          text: parameters.text,
          intent: 'business_inquiry',
          domain: 'sales',
          confidence: 0.92,
          entities: ['healthcare', 'security', 'compliance']
        };
        break;
      case 'Recommendation Engine':
        result = {
          context: parameters.context,
          recommendation: 'Target healthcare clients with bundled security solutions',
          confidence: 0.89,
          supportingData: mockKnowledgeAssets.slice(0, 2)
        };
        break;
      case 'Workflow Trigger':
        result = {
          action: parameters.action,
          target: parameters.target,
          status: 'triggered',
          workflowId: `wf_${Date.now()}`
        };
        break;
      default:
        result = { message: 'Tool executed successfully' };
    }
    
    res.json({
      success: true,
      executionId,
      tool,
      result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error executing MCP tool:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to execute MCP tool'
    });
  }
});

// DataWeave transformations endpoint
router.get('/dataweave/transformations', (req, res) => {
  try {
    res.json({
      success: true,
      transformations: mockDataWeaveTransformations,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching DataWeave transformations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch DataWeave transformations'
    });
  }
});

// Generate DataWeave transformation
router.post('/dataweave/generate', [
  body('description').notEmpty().withMessage('Description is required'),
  body('sourceData').isObject().withMessage('Source data must be an object'),
  body('targetFormat').notEmpty().withMessage('Target format is required')
], handleValidationErrors, (req, res) => {
  try {
    const { description, sourceData, targetFormat } = req.body;
    
    // Simulate AI-generated DataWeave transformation
    const transformation = {
      id: `dw_${Date.now()}`,
      name: `AI Generated: ${description}`,
      description,
      source: 'ai_generated',
      code: `%dw 2.0
output application/${targetFormat}
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
        executionTime: Math.floor(Math.random() * 50) + 20,
        successRate: 98.5 + Math.random() * 1.5,
        lastUsed: new Date().toISOString()
      }
    };
    
    res.json({
      success: true,
      transformation,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating DataWeave transformation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate DataWeave transformation'
    });
  }
});

// Analytics endpoint
router.get('/analytics', (req, res) => {
  try {
    const analytics = {
      agents: {
        total: Object.keys(mockAgents).length,
        active: Object.values(mockAgents).filter(agent => agent.status === 'active').length,
        averageAccuracy: Object.values(mockAgents).reduce((acc, agent) => acc + agent.performance.accuracy, 0) / Object.keys(mockAgents).length,
        totalTasksCompleted: Object.values(mockAgents).reduce((acc, agent) => acc + agent.performance.tasksCompleted, 0)
      },
      knowledge: {
        totalAssets: mockKnowledgeAssets.length,
        sources: ['salesforce', 'confluence', 'database', 'sharepoint'],
        averageRelevanceScore: mockKnowledgeAssets.reduce((acc, asset) => acc + asset.relevanceScore, 0) / mockKnowledgeAssets.length
      },
      mcp: {
        totalTools: mockMCPTools.length,
        availableTools: mockMCPTools.filter(tool => tool.status === 'available').length,
        totalExecutions: Math.floor(Math.random() * 1000) + 500
      },
      dataweave: {
        totalTransformations: mockDataWeaveTransformations.length,
        aiGenerated: mockDataWeaveTransformations.filter(t => t.source === 'ai_generated').length,
        averageSuccessRate: mockDataWeaveTransformations.reduce((acc, t) => acc + t.performance.successRate, 0) / mockDataWeaveTransformations.length
      }
    };
    
    res.json({
      success: true,
      analytics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics'
    });
  }
});

// Mock data for the 4 AI agents
const mockAIAgents = [
  {
    id: 'intake-agent',
    name: 'Intake Agent',
    type: 'intake',
    status: 'active',
    accuracy: 98.5,
    decisions: 1247,
    trainedDate: '1/15/2024',
    performance: {
      last24h: 45,
      last7d: 312,
      last30d: 1247,
      improvement: 2.3
    },
    capabilities: ['Document Processing', 'Data Extraction', 'Form Recognition', 'Quality Validation'],
    currentTask: 'Processing onboarding documents',
    confidence: 0.985
  },
  {
    id: 'personalization-agent',
    name: 'Personalization Agent',
    type: 'personalization',
    status: 'active',
    accuracy: 96.2,
    decisions: 892,
    trainedDate: '1/14/2024',
    performance: {
      last24h: 32,
      last7d: 224,
      last30d: 892,
      improvement: 1.8
    },
    capabilities: ['User Profiling', 'Content Adaptation', 'Learning Path Optimization', 'Preference Learning'],
    currentTask: 'Optimizing user experience',
    confidence: 0.962
  },
  {
    id: 'execution-agent',
    name: 'Execution Agent',
    type: 'execution',
    status: 'active',
    accuracy: 99.1,
    decisions: 567,
    trainedDate: '1/13/2024',
    performance: {
      last24h: 18,
      last7d: 142,
      last30d: 567,
      improvement: 3.1
    },
    capabilities: ['Workflow Automation', 'Task Execution', 'Process Orchestration', 'Error Handling'],
    currentTask: 'Executing onboarding workflows',
    confidence: 0.991
  },
  {
    id: 'monitoring-agent',
    name: 'Monitoring Agent',
    type: 'monitoring',
    status: 'active',
    accuracy: 97.8,
    decisions: 2341,
    trainedDate: '1/16/2024',
    performance: {
      last24h: 78,
      last7d: 586,
      last30d: 2341,
      improvement: 1.5
    },
    capabilities: ['Performance Tracking', 'Anomaly Detection', 'Alert Management', 'Analytics Reporting'],
    currentTask: 'Monitoring system performance',
    confidence: 0.978
  }
];

// Get all AI agents
router.get('/ai-agents', (req, res) => {
  try {
    res.json({
      success: true,
      agents: mockAIAgents,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching AI agents:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch AI agents'
    });
  }
});

// Get specific AI agent
router.get('/ai-agents/:agentId', (req, res) => {
  try {
    const { agentId } = req.params;
    const agent = mockAIAgents.find(a => a.id === agentId);
    
    if (!agent) {
      return res.status(404).json({
        success: false,
        error: 'Agent not found'
      });
    }
    
    res.json({
      success: true,
      agent,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching AI agent:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch AI agent'
    });
  }
});

// Perform agent action
router.post('/ai-agents/:agentId/:action', (req, res) => {
  try {
    const { agentId, action } = req.params;
    const { parameters } = req.body;
    
    const agent = mockAIAgents.find(a => a.id === agentId);
    if (!agent) {
      return res.status(404).json({
        success: false,
        error: 'Agent not found'
      });
    }
    
    // Simulate action processing
    const result = {
      agentId,
      action,
      status: 'completed',
      result: `Successfully performed ${action} on ${agent.name}`,
      timestamp: new Date().toISOString(),
      parameters
    };
    
    res.json({
      success: true,
      result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error performing agent action:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to perform agent action'
    });
  }
});

// Get agent performance
router.get('/ai-agents/:agentId/performance', (req, res) => {
  try {
    const { agentId } = req.params;
    const { period = '7d' } = req.query;
    
    const agent = mockAIAgents.find(a => a.id === agentId);
    if (!agent) {
      return res.status(404).json({
        success: false,
        error: 'Agent not found'
      });
    }
    
    const performance = {
      agentId,
      metrics: {
        accuracy: agent.accuracy,
        decisions: agent.decisions,
        responseTime: Math.floor(Math.random() * 200) + 100,
        errorRate: Math.random() * 5
      },
      period,
      timestamp: new Date().toISOString()
    };
    
    res.json({
      success: true,
      performance,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching agent performance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch agent performance'
    });
  }
});

// Retrain agent
router.post('/ai-agents/:agentId/retrain', (req, res) => {
  try {
    const { agentId } = req.params;
    const { trainingData } = req.body;
    
    const agent = mockAIAgents.find(a => a.id === agentId);
    if (!agent) {
      return res.status(404).json({
        success: false,
        error: 'Agent not found'
      });
    }
    
    // Simulate retraining process
    const result = {
      agentId,
      status: 'retraining_completed',
      newAccuracy: agent.accuracy + Math.random() * 2,
      trainingData: trainingData || {},
      timestamp: new Date().toISOString()
    };
    
    res.json({
      success: true,
      result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error retraining agent:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrain agent'
    });
  }
});

// Update agent status
router.put('/ai-agents/:agentId/status', (req, res) => {
  try {
    const { agentId } = req.params;
    const { status } = req.body;
    
    const agent = mockAIAgents.find(a => a.id === agentId);
    if (!agent) {
      return res.status(404).json({
        success: false,
        error: 'Agent not found'
      });
    }
    
    // Update agent status
    agent.status = status;
    
    res.json({
      success: true,
      agent,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating agent status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update agent status'
    });
  }
});

module.exports = router;
