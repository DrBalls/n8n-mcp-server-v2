import { get, post, put, del } from '../services/api-client.js';
import { CreateTagSchema, UpdateTagSchema, ListTagsSchema, IdParamSchema } from '../schemas/index.js';
// Format tag for display
const formatTag = (tag) => {
    return `🏷️ **${tag.name}** (ID: ${tag.id})`;
};
export const registerTagTools = (server) => {
    // ============ List Tags ============
    server.registerTool('n8n_list_tags', {
        title: 'List n8n Tags',
        description: `List all tags available for organizing workflows.

Args:
  - limit (number): Maximum results (default: 100)
  - cursor (string, optional): Pagination cursor

Returns:
  List of tags with id and name.`,
        inputSchema: ListTagsSchema,
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false
        }
    }, async (params) => {
        const queryParams = { limit: params.limit };
        if (params.cursor)
            queryParams.cursor = params.cursor;
        const response = await get('/tags', queryParams);
        const formatted = response.data.map(formatTag).join('\n');
        const output = {
            count: response.data.length,
            tags: response.data,
            nextCursor: response.nextCursor
        };
        let text = `Found ${response.data.length} tag(s):\n\n${formatted}`;
        if (response.nextCursor) {
            text += `\n\n_More results available. Use cursor: ${response.nextCursor}_`;
        }
        return {
            content: [{ type: 'text', text }],
            structuredContent: output
        };
    });
    // ============ Get Tag ============
    server.registerTool('n8n_get_tag', {
        title: 'Get n8n Tag',
        description: `Get details of a specific tag.

Args:
  - id (string): Tag ID

Returns:
  Tag details with id and name.`,
        inputSchema: IdParamSchema,
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false
        }
    }, async (params) => {
        const tag = await get(`/tags/${params.id}`);
        return {
            content: [{ type: 'text', text: formatTag(tag) }],
            structuredContent: tag
        };
    });
    // ============ Create Tag ============
    server.registerTool('n8n_create_tag', {
        title: 'Create n8n Tag',
        description: `Create a new tag for organizing workflows.

Args:
  - name (string): Tag name (max 24 characters)

Returns:
  The created tag.`,
        inputSchema: CreateTagSchema,
        annotations: {
            readOnlyHint: false,
            destructiveHint: false,
            idempotentHint: false,
            openWorldHint: false
        }
    }, async (params) => {
        const tag = await post('/tags', params);
        return {
            content: [{ type: 'text', text: `✅ Tag created!\n\n${formatTag(tag)}` }],
            structuredContent: tag
        };
    });
    // ============ Update Tag ============
    server.registerTool('n8n_update_tag', {
        title: 'Update n8n Tag',
        description: `Rename an existing tag.

Args:
  - id (string): Tag ID to update
  - name (string): New tag name (max 24 characters)

Returns:
  The updated tag.`,
        inputSchema: UpdateTagSchema,
        annotations: {
            readOnlyHint: false,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false
        }
    }, async (params) => {
        const { id, ...updateData } = params;
        const tag = await put(`/tags/${id}`, updateData);
        return {
            content: [{ type: 'text', text: `✅ Tag updated!\n\n${formatTag(tag)}` }],
            structuredContent: tag
        };
    });
    // ============ Delete Tag ============
    server.registerTool('n8n_delete_tag', {
        title: 'Delete n8n Tag',
        description: `Delete a tag.

Args:
  - id (string): Tag ID to delete

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
        await del(`/tags/${params.id}`);
        return {
            content: [{ type: 'text', text: `✅ Tag ${params.id} deleted successfully.` }],
            structuredContent: { deleted: true, id: params.id }
        };
    });
};
//# sourceMappingURL=tags.js.map