// Variable Tools for n8n MCP Server
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { get, post, put, del } from '../services/api-client.js';
import {
  CreateVariableSchema,
  UpdateVariableSchema,
  ListVariablesSchema,
  IdParamSchema
} from '../schemas/index.js';
import type { N8nVariable, N8nPaginatedResponse } from '../types.js';

// Format variable for display
const formatVariable = (variable: N8nVariable): string => {
  // Mask potentially sensitive values
  const displayValue = variable.value.length > 50 
    ? variable.value.substring(0, 47) + '...' 
    : variable.value;
  
  return `📝 **${variable.key}** = "${displayValue}" (ID: ${variable.id})`;
};

export const registerVariableTools = (server: McpServer): void => {

  // ============ List Variables ============
  server.registerTool(
    'n8n_list_variables',
    {
      title: 'List n8n Variables',
      description: `List all environment variables.

Variables are accessible in workflows using $vars.variableName syntax.

Args:
  - limit (number): Maximum results (default: 100)
  - cursor (string, optional): Pagination cursor

Returns:
  List of variables with id, key, and value.`,
      inputSchema: ListVariablesSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
      }
    },
    async (params: z.infer<typeof ListVariablesSchema>) => {
      const queryParams: Record<string, unknown> = { limit: params.limit };
      if (params.cursor) queryParams.cursor = params.cursor;
      
      const response = await get<N8nPaginatedResponse<N8nVariable>>('/variables', queryParams);
      
      const formatted = response.data.map(formatVariable).join('\n');
      const output = {
        count: response.data.length,
        variables: response.data,
        nextCursor: response.nextCursor
      };
      
      let text = `Found ${response.data.length} variable(s):\n\n${formatted}`;
      if (response.nextCursor) {
        text += `\n\n_More results available. Use cursor: ${response.nextCursor}_`;
      }
      
      return {
        content: [{ type: 'text', text }],
        structuredContent: output
      };
    }
  );

  // ============ Get Variable ============
  server.registerTool(
    'n8n_get_variable',
    {
      title: 'Get n8n Variable',
      description: `Get a specific variable by ID.

Args:
  - id (string): Variable ID

Returns:
  Variable details with id, key, and value.`,
      inputSchema: IdParamSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
      }
    },
    async (params: z.infer<typeof IdParamSchema>) => {
      const variable = await get<N8nVariable>(`/variables/${params.id}`);
      
      return {
        content: [{ type: 'text', text: formatVariable(variable) }],
        structuredContent: variable
      };
    }
  );

  // ============ Create Variable ============
  server.registerTool(
    'n8n_create_variable',
    {
      title: 'Create n8n Variable',
      description: `Create a new environment variable.

Variables can be used in workflows with $vars.variableName syntax.

Args:
  - key (string): Variable key (alphanumeric + underscore, must start with letter or underscore)
  - value (string): Variable value

Returns:
  The created variable.`,
      inputSchema: CreateVariableSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false
      }
    },
    async (params: z.infer<typeof CreateVariableSchema>) => {
      const variable = await post<N8nVariable>('/variables', params);
      
      return {
        content: [{ type: 'text', text: `✅ Variable created!\n\n${formatVariable(variable)}\n\nUse in workflows: \`$vars.${variable.key}\`` }],
        structuredContent: variable
      };
    }
  );

  // ============ Update Variable ============
  server.registerTool(
    'n8n_update_variable',
    {
      title: 'Update n8n Variable',
      description: `Update an existing variable.

Args:
  - id (string): Variable ID to update
  - key (string, optional): New variable key
  - value (string, optional): New variable value

Returns:
  The updated variable.`,
      inputSchema: UpdateVariableSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
      }
    },
    async (params: z.infer<typeof UpdateVariableSchema>) => {
      const { id, ...updateData } = params;
      const variable = await put<N8nVariable>(`/variables/${id}`, updateData);
      
      return {
        content: [{ type: 'text', text: `✅ Variable updated!\n\n${formatVariable(variable)}` }],
        structuredContent: variable
      };
    }
  );

  // ============ Delete Variable ============
  server.registerTool(
    'n8n_delete_variable',
    {
      title: 'Delete n8n Variable',
      description: `Delete a variable.

⚠️ WARNING: Workflows using this variable will break!

Args:
  - id (string): Variable ID to delete

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
      await del(`/variables/${params.id}`);
      
      return {
        content: [{ type: 'text', text: `✅ Variable ${params.id} deleted successfully.` }],
        structuredContent: { deleted: true, id: params.id }
      };
    }
  );
};
