// Credential Tools for n8n MCP Server
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { get, post, put, del, patch } from '../services/api-client.js';
import {
  CreateCredentialSchema,
  UpdateCredentialSchema,
  ListCredentialsSchema,
  CredentialSchemaRequestSchema,
  IdParamSchema,
  TransferToProjectSchema
} from '../schemas/index.js';
import type { N8nCredential, N8nCredentialListItem, N8nCredentialSchema, N8nPaginatedResponse } from '../types.js';

// Format credential for display (without sensitive data)
const formatCredential = (credential: N8nCredential | N8nCredentialListItem): string => {
  return [
    `**${credential.name}** (ID: ${credential.id})`,
    `- Type: ${credential.type}`,
    `- Created: ${credential.createdAt || 'N/A'}`,
    `- Updated: ${credential.updatedAt || 'N/A'}`
  ].join('\n');
};

export const registerCredentialTools = (server: McpServer): void => {

  // ============ List Credentials ============
  server.registerTool(
    'n8n_list_credentials',
    {
      title: 'List n8n Credentials',
      description: `List all credentials (without sensitive data).

Args:
  - type (string, optional): Filter by credential type (e.g., "slackApi", "httpBasicAuth")
  - limit (number): Maximum results (default: 100)
  - cursor (string, optional): Pagination cursor

Returns:
  List of credentials with id, name, type, and timestamps.
  ⚠️ Credential data/secrets are NOT included for security.`,
      inputSchema: ListCredentialsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
      }
    },
    async (params: z.infer<typeof ListCredentialsSchema>) => {
      const queryParams: Record<string, unknown> = { limit: params.limit };
      if (params.type) queryParams.type = params.type;
      if (params.cursor) queryParams.cursor = params.cursor;
      
      const response = await get<N8nPaginatedResponse<N8nCredentialListItem>>('/credentials', queryParams);
      
      const formatted = response.data.map(formatCredential).join('\n\n---\n\n');
      const output = {
        count: response.data.length,
        credentials: response.data,
        nextCursor: response.nextCursor
      };
      
      let text = `Found ${response.data.length} credential(s):\n\n${formatted}`;
      if (response.nextCursor) {
        text += `\n\n_More results available. Use cursor: ${response.nextCursor}_`;
      }
      
      return {
        content: [{ type: 'text', text }],
        structuredContent: output
      };
    }
  );

  // ============ Get Credential ============
  server.registerTool(
    'n8n_get_credential',
    {
      title: 'Get n8n Credential',
      description: `Get details of a specific credential (without sensitive data).

Args:
  - id (string): Credential ID

Returns:
  Credential metadata (id, name, type, timestamps).
  ⚠️ Credential data/secrets are NOT returned for security.`,
      inputSchema: IdParamSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
      }
    },
    async (params: z.infer<typeof IdParamSchema>) => {
      const credential = await get<N8nCredential>(`/credentials/${params.id}`);
      
      return {
        content: [{ type: 'text', text: formatCredential(credential) }],
        structuredContent: credential
      };
    }
  );

  // ============ Create Credential ============
  server.registerTool(
    'n8n_create_credential',
    {
      title: 'Create n8n Credential',
      description: `Create a new credential.

Args:
  - name (string): Credential name
  - type (string): Credential type (use n8n_get_credential_schema to see required fields)
  - data (object): Credential data (fields depend on type)

Common credential types:
  - slackApi: { accessToken }
  - httpBasicAuth: { user, password }
  - httpHeaderAuth: { name, value }
  - oAuth2Api: { clientId, clientSecret, ... }
  - gmailOAuth2Api: OAuth credentials for Gmail
  - notionApi: { apiKey }
  - openAiApi: { apiKey }

Use n8n_get_credential_schema to get the exact fields required for a type.

Returns:
  The created credential (without sensitive data).`,
      inputSchema: CreateCredentialSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false
      }
    },
    async (params: z.infer<typeof CreateCredentialSchema>) => {
      const credential = await post<N8nCredential>('/credentials', params);
      
      return {
        content: [{ type: 'text', text: `✅ Credential created!\n\n${formatCredential(credential)}` }],
        structuredContent: credential
      };
    }
  );

  // ============ Update Credential ============
  server.registerTool(
    'n8n_update_credential',
    {
      title: 'Update n8n Credential',
      description: `Update an existing credential.

Args:
  - id (string): Credential ID to update
  - name (string, optional): New credential name
  - data (object, optional): Updated credential data

Returns:
  The updated credential (without sensitive data).`,
      inputSchema: UpdateCredentialSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
      }
    },
    async (params: z.infer<typeof UpdateCredentialSchema>) => {
      const { id, ...updateData } = params;
      const credential = await patch<N8nCredential>(`/credentials/${id}`, updateData);
      
      return {
        content: [{ type: 'text', text: `✅ Credential updated!\n\n${formatCredential(credential)}` }],
        structuredContent: credential
      };
    }
  );

  // ============ Delete Credential ============
  server.registerTool(
    'n8n_delete_credential',
    {
      title: 'Delete n8n Credential',
      description: `Delete a credential.

⚠️ WARNING: This will break any workflows using this credential!

Args:
  - id (string): Credential ID to delete

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
      await del(`/credentials/${params.id}`);
      
      return {
        content: [{ type: 'text', text: `✅ Credential ${params.id} deleted successfully.` }],
        structuredContent: { deleted: true, id: params.id }
      };
    }
  );

  // ============ Get Credential Schema ============
  server.registerTool(
    'n8n_get_credential_schema',
    {
      title: 'Get Credential Schema',
      description: `Get the schema/fields required for a credential type.

Args:
  - credentialType (string): The credential type (e.g., "slackApi", "httpBasicAuth")

Returns:
  JSON schema showing required and optional fields for the credential type.

Use this before creating credentials to know what data fields are needed.`,
      inputSchema: CredentialSchemaRequestSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
      }
    },
    async (params: z.infer<typeof CredentialSchemaRequestSchema>) => {
      const schema = await get<N8nCredentialSchema>(`/credentials/schema/${params.credentialType}`);
      
      const properties = Object.entries(schema.properties || {}).map(([key, value]) => {
        const required = schema.required?.includes(key) ? '(required)' : '(optional)';
        return `  - ${key} ${required}: ${value.type}${value.description ? ` - ${value.description}` : ''}`;
      }).join('\n');
      
      const text = `**Credential Schema: ${params.credentialType}**\n\nFields:\n${properties}`;
      
      return {
        content: [{ type: 'text', text }],
        structuredContent: schema
      };
    }
  );

  // ============ Transfer Credential to Project ============
  server.registerTool(
    'n8n_transfer_credential',
    {
      title: 'Transfer Credential to Project',
      description: `Transfer a credential to a different project.

Args:
  - credentialId (string): Credential ID to transfer
  - destinationProjectId (string): Target project ID

Returns:
  Confirmation of transfer.`,
      inputSchema: z.object({
        credentialId: z.string().min(1).describe('Credential ID to transfer'),
        destinationProjectId: z.string().min(1).describe('Target project ID')
      }).strict(),
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
      }
    },
    async (params: { credentialId: string; destinationProjectId: string }) => {
      await put(`/credentials/${params.credentialId}/transfer`, {
        destinationProjectId: params.destinationProjectId
      });
      
      return {
        content: [{ type: 'text', text: `✅ Credential transferred to project ${params.destinationProjectId}` }],
        structuredContent: { transferred: true, credentialId: params.credentialId, projectId: params.destinationProjectId }
      };
    }
  );
};
