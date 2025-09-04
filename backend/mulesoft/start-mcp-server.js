// Start MuleSoft MCP Server
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../config.env') });

const MuleSoftMCPServer = require('./mcp-server');

const port = Number(process.env.MCP_SERVER_PORT || 3002);

const mcpServer = new MuleSoftMCPServer({
  port,
  mulesoftBaseUrl: process.env.MULESOFT_BASE_URL,
  accessToken: process.env.MULESOFT_ACCESS_TOKEN,
  organizationId: process.env.MULESOFT_ORG_ID,
  environmentId: process.env.MULESOFT_ENV_ID
});

mcpServer.start().then(() => {
  // eslint-disable-next-line no-console
  console.log(`✅ MuleSoft MCP Server started on port ${port}`);
}).catch((error) => {
  // eslint-disable-next-line no-console
  console.error('❌ Failed to start MuleSoft MCP Server:', error);
  process.exit(1);
});


