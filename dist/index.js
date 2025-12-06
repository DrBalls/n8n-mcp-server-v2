#!/usr/bin/env node
// n8n MCP Server - Comprehensive n8n workflow automation connector
// Supports ALL n8n API operations: workflows, executions, credentials, tags, variables, projects, users, source control, and more
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
// Import tool registrations
import { registerWorkflowTools } from './tools/workflows.js';
import { registerExecutionTools } from './tools/executions.js';
import { registerCredentialTools } from './tools/credentials.js';
import { registerTagTools } from './tools/tags.js';
import { registerVariableTools } from './tools/variables.js';
import { registerProjectTools } from './tools/projects.js';
import { registerUserTools, registerSourceControlTools } from './tools/users-sourcecontrol.js';
import { registerAuditTools, registerUtilityTools } from './tools/audit-utils.js';
// Create the MCP server
const server = new McpServer({
    name: 'n8n-mcp-server',
    version: '1.0.0'
});
// Register all tool categories
console.error('Registering n8n MCP tools...');
// Core workflow operations
registerWorkflowTools(server);
console.error('✓ Workflow tools registered');
// Execution management
registerExecutionTools(server);
console.error('✓ Execution tools registered');
// Credential management
registerCredentialTools(server);
console.error('✓ Credential tools registered');
// Tag management
registerTagTools(server);
console.error('✓ Tag tools registered');
// Variable management
registerVariableTools(server);
console.error('✓ Variable tools registered');
// Project management
registerProjectTools(server);
console.error('✓ Project tools registered');
// User management
registerUserTools(server);
console.error('✓ User tools registered');
// Source control
registerSourceControlTools(server);
console.error('✓ Source control tools registered');
// Audit tools
registerAuditTools(server);
console.error('✓ Audit tools registered');
// Utility tools
registerUtilityTools(server);
console.error('✓ Utility tools registered');
// Run with stdio transport (for Claude Desktop integration)
async function main() {
    console.error('Starting n8n MCP Server...');
    console.error(`n8n URL: ${process.env.N8N_URL || process.env.N8N_BASE_URL || 'http://localhost:5678'}`);
    console.error(`API Key: ${process.env.N8N_API_KEY ? '****' + process.env.N8N_API_KEY.slice(-4) : 'NOT SET'}`);
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('n8n MCP Server running on stdio');
}
main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map