const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    message: 'Test server is running'
  });
});

app.get('/api/ai-agents/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    agents: {
      total: 3,
      active: 3
    },
    services: {
      knowledgeDiscovery: 'operational',
      contextAnalysis: 'operational',
      decisionSupport: 'operational',
      mcpServer: 'operational'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🤖 AI Agents: http://localhost:${PORT}/api/ai-agents/health`);
});

