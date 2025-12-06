import { z } from 'zod';
import { get, post } from '../services/api-client.js';
import { checkConnection } from '../services/api-client.js';
import { GenerateAuditSchema, EmptySchema } from '../schemas/index.js';
export const registerAuditTools = (server) => {
    // ============ Generate Security Audit ============
    server.registerTool('n8n_generate_audit', {
        title: 'Generate Security Audit',
        description: `Generate a security audit report for the n8n instance.

Args:
  - categories (array, optional): Categories to audit:
    - credentials: Check credential security
    - database: Check database configuration
    - filesystem: Check file system access
    - instance: Check instance configuration
    - nodes: Check node security
  - daysAbandonedWorkflow (number, optional): Days to consider workflow abandoned

Returns:
  Audit report with risk levels and issues by category.`,
        inputSchema: GenerateAuditSchema,
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false
        }
    }, async (params) => {
        const result = await post('/audit', params);
        const riskEmoji = {
            high: '🔴',
            medium: '🟡',
            low: '🟢'
        };
        const sections = result.sections.map(section => {
            const issues = section.issues.length > 0
                ? section.issues.map(i => `    - ${i}`).join('\n')
                : '    No issues found';
            return `${riskEmoji[section.risk]} **${section.name}** (${section.risk} risk)\n${issues}`;
        }).join('\n\n');
        const text = [
            `**Security Audit Report**`,
            `Overall Risk: ${riskEmoji[result.risk]} ${result.risk.toUpperCase()}`,
            '',
            sections
        ].join('\n');
        return {
            content: [{ type: 'text', text }],
            structuredContent: result
        };
    });
};
export const registerUtilityTools = (server) => {
    // ============ Check Connection ============
    server.registerTool('n8n_check_connection', {
        title: 'Check n8n Connection',
        description: `Test the connection to the n8n instance.

Verifies that the API key is valid and the n8n instance is reachable.

Returns:
  - connected: Whether connection is successful
  - error: Error message if connection failed`,
        inputSchema: EmptySchema,
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false
        }
    }, async () => {
        const result = await checkConnection();
        const text = result.connected
            ? '✅ Successfully connected to n8n!'
            : `❌ Connection failed: ${result.error}`;
        return {
            content: [{ type: 'text', text }],
            structuredContent: result
        };
    });
    // ============ Get Node Types ============
    server.registerTool('n8n_get_node_types', {
        title: 'Get Available Node Types',
        description: `Get a list of all available node types in the n8n instance.

Returns:
  List of node types with their descriptions and categories.

Useful for understanding what nodes are available when creating workflows.`,
        inputSchema: EmptySchema,
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false
        }
    }, async () => {
        // This endpoint may vary depending on n8n version
        const nodes = await get('/node-types');
        // Group by category
        const grouped = {};
        nodes.forEach(node => {
            const category = node.group?.[0] || 'Other';
            if (!grouped[category])
                grouped[category] = [];
            grouped[category].push(`${node.displayName} (${node.name})`);
        });
        const text = Object.entries(grouped)
            .map(([category, nodeList]) => `**${category}**\n${nodeList.slice(0, 10).join('\n')}${nodeList.length > 10 ? `\n... and ${nodeList.length - 10} more` : ''}`)
            .join('\n\n');
        return {
            content: [{ type: 'text', text: `**Available Node Types (${nodes.length} total)**\n\n${text}` }],
            structuredContent: { count: nodes.length, nodes }
        };
    });
    // ============ Get Active Webhooks ============
    server.registerTool('n8n_get_active_webhooks', {
        title: 'Get Active Webhooks',
        description: `Get a list of all active webhooks in the n8n instance.

Returns:
  List of active webhooks with their paths and associated workflows.`,
        inputSchema: EmptySchema,
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false
        }
    }, async () => {
        const webhooks = await get('/active-webhooks');
        const formatted = webhooks.map(wh => `- **${wh.method}** \`${wh.webhookPath}\`\n  Workflow: ${wh.workflowId}, Node: ${wh.node}`).join('\n\n');
        const text = webhooks.length > 0
            ? `**Active Webhooks (${webhooks.length})**\n\n${formatted}`
            : 'No active webhooks found.';
        return {
            content: [{ type: 'text', text }],
            structuredContent: { count: webhooks.length, webhooks }
        };
    });
    // ============ Export Workflow ============
    server.registerTool('n8n_export_workflow', {
        title: 'Export Workflow JSON',
        description: `Export a workflow as JSON for backup or import elsewhere.

Args:
  - id (string): Workflow ID to export

Returns:
  Complete workflow JSON that can be imported into another n8n instance.`,
        inputSchema: z.object({
            id: z.string().min(1).describe('Workflow ID to export')
        }).strict(),
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false
        }
    }, async (params) => {
        const workflow = await get(`/workflows/${params.id}`);
        // Remove instance-specific fields for export
        const exportable = { ...workflow };
        delete exportable.id;
        delete exportable.createdAt;
        delete exportable.updatedAt;
        delete exportable.versionId;
        const json = JSON.stringify(exportable, null, 2);
        return {
            content: [{ type: 'text', text: `**Exported Workflow: ${workflow.name || params.id}**\n\n\`\`\`json\n${json}\n\`\`\`` }],
            structuredContent: exportable
        };
    });
    // ============ Import Workflow ============
    server.registerTool('n8n_import_workflow', {
        title: 'Import Workflow JSON',
        description: `Import a workflow from JSON.

Args:
  - workflowJson (object): Complete workflow JSON object with:
    - name (string): Workflow name
    - nodes (array): Workflow nodes
    - connections (object): Node connections
    - settings (object, optional): Workflow settings

Returns:
  The imported workflow with its new ID.`,
        inputSchema: z.object({
            workflowJson: z.record(z.unknown())
                .describe('Complete workflow JSON object to import')
        }).strict(),
        annotations: {
            readOnlyHint: false,
            destructiveHint: false,
            idempotentHint: false,
            openWorldHint: false
        }
    }, async (params) => {
        const workflow = await post('/workflows', params.workflowJson);
        return {
            content: [{ type: 'text', text: `✅ Workflow imported!\n\n- ID: ${workflow.id}\n- Name: ${workflow.name}` }],
            structuredContent: workflow
        };
    });
    // ============ Duplicate Workflow ============
    server.registerTool('n8n_duplicate_workflow', {
        title: 'Duplicate Workflow',
        description: `Create a copy of an existing workflow.

Args:
  - id (string): Workflow ID to duplicate
  - newName (string, optional): Name for the copy (default: "Copy of [original name]")

Returns:
  The duplicated workflow with its new ID.`,
        inputSchema: z.object({
            id: z.string().min(1).describe('Workflow ID to duplicate'),
            newName: z.string().optional().describe('Name for the copy')
        }).strict(),
        annotations: {
            readOnlyHint: false,
            destructiveHint: false,
            idempotentHint: false,
            openWorldHint: false
        }
    }, async (params) => {
        // Get the original workflow
        const original = await get(`/workflows/${params.id}`);
        // Prepare copy
        const copy = { ...original };
        delete copy.id;
        delete copy.createdAt;
        delete copy.updatedAt;
        delete copy.versionId;
        copy.name = params.newName || `Copy of ${original.name}`;
        copy.active = false; // Always deactivate copies
        // Create the copy
        const newWorkflow = await post('/workflows', copy);
        return {
            content: [{ type: 'text', text: `✅ Workflow duplicated!\n\n- Original ID: ${params.id}\n- New ID: ${newWorkflow.id}\n- New Name: ${newWorkflow.name}` }],
            structuredContent: newWorkflow
        };
    });
};
//# sourceMappingURL=audit-utils.js.map