import { get, del, post } from '../services/api-client.js';
import { ListExecutionsSchema, GetExecutionSchema, DeleteExecutionsSchema, IdParamSchema } from '../schemas/index.js';
// Format execution for display
const formatExecution = (execution) => {
    const statusEmoji = {
        success: '✅',
        error: '❌',
        running: '🔄',
        waiting: '⏳',
        new: '🆕',
        canceled: '🚫',
        crashed: '💥'
    }[execution.status] || '❓';
    const lines = [
        `${statusEmoji} **Execution ${execution.id}**`,
        `- Workflow ID: ${execution.workflowId}`,
        `- Status: ${execution.status}`,
        `- Mode: ${execution.mode}`,
        `- Started: ${execution.startedAt}`
    ];
    if (execution.stoppedAt) {
        lines.push(`- Stopped: ${execution.stoppedAt}`);
    }
    return lines.join('\n');
};
export const registerExecutionTools = (server) => {
    // ============ List Executions ============
    server.registerTool('n8n_list_executions', {
        title: 'List n8n Executions',
        description: `List workflow executions with optional filtering.

Args:
  - workflowId (string, optional): Filter by workflow ID
  - status (string, optional): Filter by status (error, success, waiting, new, running, canceled, crashed)
  - includeData (boolean): Include full execution data (default: false)
  - projectId (string, optional): Filter by project ID
  - limit (number): Maximum results (default: 100)
  - cursor (string, optional): Pagination cursor

Returns:
  List of executions with id, workflowId, status, mode, timestamps.`,
        inputSchema: ListExecutionsSchema,
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false
        }
    }, async (params) => {
        const queryParams = {
            limit: params.limit,
            includeData: params.includeData
        };
        if (params.workflowId)
            queryParams.workflowId = params.workflowId;
        if (params.status)
            queryParams.status = params.status;
        if (params.projectId)
            queryParams.projectId = params.projectId;
        if (params.cursor)
            queryParams.cursor = params.cursor;
        const response = await get('/executions', queryParams);
        const formatted = response.data.map(formatExecution).join('\n\n---\n\n');
        const output = {
            count: response.data.length,
            executions: response.data,
            nextCursor: response.nextCursor
        };
        let text = `Found ${response.data.length} execution(s):\n\n${formatted}`;
        if (response.nextCursor) {
            text += `\n\n_More results available. Use cursor: ${response.nextCursor}_`;
        }
        return {
            content: [{ type: 'text', text }],
            structuredContent: output
        };
    });
    // ============ Get Execution ============
    server.registerTool('n8n_get_execution', {
        title: 'Get n8n Execution',
        description: `Get detailed information about a specific execution.

Args:
  - id (string): Execution ID
  - includeData (boolean): Include full execution data with node outputs (default: true)

Returns:
  Complete execution details including:
  - Status and mode
  - Timestamps (started, stopped)
  - Workflow data
  - Node execution results (if includeData is true)`,
        inputSchema: GetExecutionSchema,
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false
        }
    }, async (params) => {
        const execution = await get(`/executions/${params.id}`, {
            includeData: params.includeData
        });
        let text = formatExecution(execution);
        if (execution.data?.resultData?.error) {
            text += `\n\n**Error:**\n\`\`\`\n${JSON.stringify(execution.data.resultData.error, null, 2)}\n\`\`\``;
        }
        if (execution.data?.resultData?.lastNodeExecuted) {
            text += `\n\n- Last Node: ${execution.data.resultData.lastNodeExecuted}`;
        }
        return {
            content: [{ type: 'text', text }],
            structuredContent: execution
        };
    });
    // ============ Delete Execution ============
    server.registerTool('n8n_delete_execution', {
        title: 'Delete n8n Execution',
        description: `Delete a specific execution by ID.

⚠️ WARNING: This action cannot be undone!

Args:
  - id (string): Execution ID to delete

Returns:
  Confirmation of deletion.`,
        inputSchema: IdParamSchema,
        annotations: {
            readOnlyHint: false,
            destructiveHint: true,
            idempotentHint: true,
            openWorldHint: false
        }
    }, async (params) => {
        await del(`/executions/${params.id}`);
        return {
            content: [{ type: 'text', text: `✅ Execution ${params.id} deleted successfully.` }],
            structuredContent: { deleted: true, id: params.id }
        };
    });
    // ============ Delete Multiple Executions ============
    server.registerTool('n8n_delete_executions', {
        title: 'Delete n8n Executions (Bulk)',
        description: `Delete multiple executions based on filters.

⚠️ WARNING: This action cannot be undone! Use with caution.

Args:
  - workflowId (string, optional): Delete executions for this workflow
  - status (string, optional): Delete executions with this status
  - deleteBefore (string, optional): Delete executions before this date (ISO 8601 format)
  - ids (array, optional): Specific execution IDs to delete

Returns:
  Count of deleted executions.`,
        inputSchema: DeleteExecutionsSchema,
        annotations: {
            readOnlyHint: false,
            destructiveHint: true,
            idempotentHint: false,
            openWorldHint: false
        }
    }, async (params) => {
        const result = await post('/executions/delete', params);
        return {
            content: [{ type: 'text', text: `✅ Deleted ${result.deletedCount} execution(s).` }],
            structuredContent: result
        };
    });
    // ============ Stop Execution ============
    server.registerTool('n8n_stop_execution', {
        title: 'Stop n8n Execution',
        description: `Stop a running execution.

Args:
  - id (string): Execution ID to stop

Returns:
  The stopped execution details.`,
        inputSchema: IdParamSchema,
        annotations: {
            readOnlyHint: false,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false
        }
    }, async (params) => {
        const execution = await post(`/executions/${params.id}/stop`);
        return {
            content: [{ type: 'text', text: `🛑 Execution stopped.\n\n${formatExecution(execution)}` }],
            structuredContent: execution
        };
    });
    // ============ Retry Execution ============
    server.registerTool('n8n_retry_execution', {
        title: 'Retry n8n Execution',
        description: `Retry a failed execution.

Args:
  - id (string): Execution ID to retry

Returns:
  The new execution created from the retry.`,
        inputSchema: IdParamSchema,
        annotations: {
            readOnlyHint: false,
            destructiveHint: false,
            idempotentHint: false,
            openWorldHint: false
        }
    }, async (params) => {
        const execution = await post(`/executions/${params.id}/retry`);
        return {
            content: [{ type: 'text', text: `🔄 Execution retry started.\n\n${formatExecution(execution)}` }],
            structuredContent: execution
        };
    });
};
//# sourceMappingURL=executions.js.map