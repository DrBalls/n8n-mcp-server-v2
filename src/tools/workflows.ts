// Workflow Tools for n8n MCP Server
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { get, post, put, del, patch } from '../services/api-client.js';
import {
  CreateWorkflowSchema,
  UpdateWorkflowSchema,
  ListWorkflowsSchema,
  RunWorkflowSchema,
  WorkflowTagsSchema,
  IdParamSchema
} from '../schemas/index.js';
import type { N8nWorkflow, N8nWorkflowListItem, N8nPaginatedResponse, N8nExecution } from '../types.js';

// Format workflow for display
const formatWorkflow = (workflow: N8nWorkflow | N8nWorkflowListItem): string => {
  const lines = [
    `**${workflow.name}** (ID: ${workflow.id})`,
    `- Active: ${workflow.active ? '✅ Yes' : '❌ No'}`,
    `- Created: ${workflow.createdAt || 'N/A'}`,
    `- Updated: ${workflow.updatedAt || 'N/A'}`
  ];
  
  if ('nodes' in workflow && workflow.nodes) {
    lines.push(`- Nodes: ${workflow.nodes.length}`);
  }
  
  if (workflow.tags && workflow.tags.length > 0) {
    const tagNames = workflow.tags.map(t => typeof t === 'string' ? t : t.name).join(', ');
    lines.push(`- Tags: ${tagNames}`);
  }
  
  return lines.join('\n');
};

export const registerWorkflowTools = (server: McpServer): void => {
  
  // ============ List Workflows ============
  server.registerTool(
    'n8n_list_workflows',
    {
      title: 'List n8n Workflows',
      description: `List all workflows in the n8n instance with optional filtering.

Args:
  - active (boolean, optional): Filter by active status
  - tags (string, optional): Filter by tag IDs (comma-separated)
  - name (string, optional): Filter by name (partial match)
  - projectId (string, optional): Filter by project ID
  - limit (number): Maximum results (default: 100, max: 250)
  - cursor (string, optional): Pagination cursor from previous response

Returns:
  List of workflows with id, name, active status, created/updated timestamps, and tags.
  Includes nextCursor for pagination if more results exist.`,
      inputSchema: ListWorkflowsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
      }
    },
    async (params: z.infer<typeof ListWorkflowsSchema>) => {
      const queryParams: Record<string, unknown> = { limit: params.limit };
      if (params.active !== undefined) queryParams.active = params.active;
      if (params.tags) queryParams.tags = params.tags;
      if (params.name) queryParams.name = params.name;
      if (params.projectId) queryParams.projectId = params.projectId;
      if (params.cursor) queryParams.cursor = params.cursor;
      
      const response = await get<N8nPaginatedResponse<N8nWorkflowListItem>>('/workflows', queryParams);
      
      const formatted = response.data.map(formatWorkflow).join('\n\n---\n\n');
      const output = {
        count: response.data.length,
        workflows: response.data,
        nextCursor: response.nextCursor
      };
      
      let text = `Found ${response.data.length} workflow(s):\n\n${formatted}`;
      if (response.nextCursor) {
        text += `\n\n_More results available. Use cursor: ${response.nextCursor}_`;
      }
      
      return {
        content: [{ type: 'text', text }],
        structuredContent: output
      };
    }
  );

  // ============ Get Workflow ============
  server.registerTool(
    'n8n_get_workflow',
    {
      title: 'Get n8n Workflow',
      description: `Get full details of a specific workflow including all nodes and connections.

Args:
  - id (string): The workflow ID

Returns:
  Complete workflow object with:
  - name, id, active status
  - nodes array with all node configurations
  - connections mapping
  - settings
  - tags
  - timestamps`,
      inputSchema: IdParamSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
      }
    },
    async (params: z.infer<typeof IdParamSchema>) => {
      const workflow = await get<N8nWorkflow>(`/workflows/${params.id}`);
      
      const nodeList = workflow.nodes.map(n => `  - ${n.name} (${n.type})`).join('\n');
      const text = `${formatWorkflow(workflow)}\n\n**Nodes (${workflow.nodes.length}):**\n${nodeList}`;
      
      return {
        content: [{ type: 'text', text }],
        structuredContent: workflow
      };
    }
  );

  // ============ Create Workflow ============
  server.registerTool(
    'n8n_create_workflow',
    {
      title: 'Create n8n Workflow',
      description: `Create a new workflow in n8n.

Args:
  - name (string): Workflow name (required)
  - nodes (array): Array of node objects, each with:
    - name (string): Node display name
    - type (string): Node type (e.g., "n8n-nodes-base.httpRequest")
    - position ([x, y]): Canvas position
    - parameters (object): Node-specific parameters
    - credentials (object, optional): Credential mappings
  - connections (object): Node connections mapping
  - settings (object, optional): Workflow settings
  - tags (array, optional): Tag IDs to associate

Returns:
  The created workflow with its assigned ID.

Example node types:
  - n8n-nodes-base.manualTrigger - Manual trigger
  - n8n-nodes-base.scheduleTrigger - Scheduled trigger
  - n8n-nodes-base.webhook - Webhook trigger
  - n8n-nodes-base.httpRequest - HTTP Request
  - n8n-nodes-base.code - Custom JavaScript/Python
  - n8n-nodes-base.set - Set data
  - n8n-nodes-base.if - Conditional
  - n8n-nodes-base.merge - Merge data`,
      inputSchema: CreateWorkflowSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false
      }
    },
    async (params: z.infer<typeof CreateWorkflowSchema>) => {
      const workflow = await post<N8nWorkflow>('/workflows', params);
      
      return {
        content: [{ type: 'text', text: `✅ Workflow created successfully!\n\n${formatWorkflow(workflow)}` }],
        structuredContent: workflow
      };
    }
  );

  // ============ Update Workflow ============
  server.registerTool(
    'n8n_update_workflow',
    {
      title: 'Update n8n Workflow',
      description: `Update an existing workflow. Can update name, nodes, connections, settings, or tags.

⚠️ IMPORTANT: When updating nodes or connections, you must provide the COMPLETE arrays.
Partial updates are not supported - the provided values will replace existing ones.

Args:
  - id (string): Workflow ID to update (required)
  - name (string, optional): New workflow name
  - nodes (array, optional): Complete updated nodes array
  - connections (object, optional): Complete updated connections
  - settings (object, optional): Updated settings
  - tags (array, optional): Updated tag IDs

Returns:
  The updated workflow object.`,
      inputSchema: UpdateWorkflowSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
      }
    },
    async (params: z.infer<typeof UpdateWorkflowSchema>) => {
      const { id, ...updateData } = params;
      const workflow = await put<N8nWorkflow>(`/workflows/${id}`, updateData);
      
      return {
        content: [{ type: 'text', text: `✅ Workflow updated successfully!\n\n${formatWorkflow(workflow)}` }],
        structuredContent: workflow
      };
    }
  );

  // ============ Delete Workflow ============
  server.registerTool(
    'n8n_delete_workflow',
    {
      title: 'Delete n8n Workflow',
      description: `Permanently delete a workflow.

⚠️ WARNING: This action cannot be undone!

Args:
  - id (string): Workflow ID to delete

Returns:
  Confirmation of deletion.`,
      inputSchema: IdParamSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false
      }
    },
    async (params: z.infer<typeof IdParamSchema>) => {
      await del(`/workflows/${params.id}`);
      
      return {
        content: [{ type: 'text', text: `✅ Workflow ${params.id} deleted successfully.` }],
        structuredContent: { deleted: true, id: params.id }
      };
    }
  );

  // ============ Activate Workflow ============
  server.registerTool(
    'n8n_activate_workflow',
    {
      title: 'Activate n8n Workflow',
      description: `Activate a workflow so it can run automatically based on its triggers.

Args:
  - id (string): Workflow ID to activate

Returns:
  The activated workflow.`,
      inputSchema: IdParamSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
      }
    },
    async (params: z.infer<typeof IdParamSchema>) => {
      const workflow = await post<N8nWorkflow>(`/workflows/${params.id}/activate`);
      
      return {
        content: [{ type: 'text', text: `✅ Workflow activated!\n\n${formatWorkflow(workflow)}` }],
        structuredContent: workflow
      };
    }
  );

  // ============ Deactivate Workflow ============
  server.registerTool(
    'n8n_deactivate_workflow',
    {
      title: 'Deactivate n8n Workflow',
      description: `Deactivate a workflow to stop it from running automatically.

Args:
  - id (string): Workflow ID to deactivate

Returns:
  The deactivated workflow.`,
      inputSchema: IdParamSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
      }
    },
    async (params: z.infer<typeof IdParamSchema>) => {
      const workflow = await post<N8nWorkflow>(`/workflows/${params.id}/deactivate`);
      
      return {
        content: [{ type: 'text', text: `✅ Workflow deactivated.\n\n${formatWorkflow(workflow)}` }],
        structuredContent: workflow
      };
    }
  );

  // ============ Run Workflow ============
  server.registerTool(
    'n8n_run_workflow',
    {
      title: 'Run n8n Workflow',
      description: `Execute a workflow manually with optional input data.

Args:
  - id (string): Workflow ID to run
  - data (object, optional): Input data to pass to the workflow's first node

Returns:
  Execution result with:
  - executionId: ID of this execution
  - status: Current status
  - data: Output data from the workflow`,
      inputSchema: RunWorkflowSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true
      }
    },
    async (params: z.infer<typeof RunWorkflowSchema>) => {
      const body = params.data ? { data: params.data } : undefined;
      const execution = await post<N8nExecution>(`/workflows/${params.id}/run`, body);
      
      const text = `🚀 Workflow execution started!\n\n- Execution ID: ${execution.id}\n- Status: ${execution.status}\n- Started: ${execution.startedAt}`;
      
      return {
        content: [{ type: 'text', text }],
        structuredContent: execution
      };
    }
  );

  // ============ Update Workflow Tags ============
  server.registerTool(
    'n8n_update_workflow_tags',
    {
      title: 'Update Workflow Tags',
      description: `Update the tags associated with a workflow.

Args:
  - id (string): Workflow ID
  - tags (array): Array of tag objects with 'id' property

Returns:
  The updated workflow with new tags.`,
      inputSchema: WorkflowTagsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
      }
    },
    async (params: z.infer<typeof WorkflowTagsSchema>) => {
      const workflow = await put<N8nWorkflow>(`/workflows/${params.id}/tags`, params.tags);
      
      return {
        content: [{ type: 'text', text: `✅ Workflow tags updated!\n\n${formatWorkflow(workflow)}` }],
        structuredContent: workflow
      };
    }
  );
};
