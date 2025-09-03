const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const app = express();
const PORT = 3001;

// Basic middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: 'http://localhost:8081',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
    environment: 'development'
  });
});

// AI Agents health check
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

// Foxit health check
app.get('/api/foxit/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      documentGeneration: 'operational',
      pdfServices: 'operational'
    }
  });
});

// Vonage health check
app.get('/api/vonage/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      verify: 'operational',
      sms: 'operational',
      video: 'operational'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 OnboardIQ Simple Backend Server running on port ${PORT}`);
  console.log(`📊 Environment: development`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🤖 AI Agents: http://localhost:${PORT}/api/ai-agents/health`);
  console.log(`📄 Foxit: http://localhost:${PORT}/api/foxit/health`);
  console.log(`📞 Vonage: http://localhost:${PORT}/api/vonage/health`);
});
