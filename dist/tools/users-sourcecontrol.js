import { get, post } from '../services/api-client.js';
import { ListUsersSchema, SourceControlPullSchema, SourceControlPushSchema, IdParamSchema, EmptySchema } from '../schemas/index.js';
// Format user for display
const formatUser = (user) => {
    const roleEmoji = {
        'global:owner': '👑',
        'global:admin': '⚙️',
        'global:member': '👤'
    }[user.role || 'global:member'] || '👤';
    const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'N/A';
    return [
        `${roleEmoji} **${name}** (ID: ${user.id})`,
        `- Email: ${user.email}`,
        `- Role: ${user.role || 'N/A'}`,
        user.isPending ? '- Status: ⏳ Pending' : ''
    ].filter(Boolean).join('\n');
};
export const registerUserTools = (server) => {
    // ============ List Users ============
    server.registerTool('n8n_list_users', {
        title: 'List n8n Users',
        description: `List all users in the n8n instance.

Args:
  - includeRole (boolean): Include user roles (default: true)
  - limit (number): Maximum results (default: 100)
  - cursor (string, optional): Pagination cursor

Returns:
  List of users with id, email, name, and role.`,
        inputSchema: ListUsersSchema,
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false
        }
    }, async (params) => {
        const queryParams = {
            limit: params.limit,
            includeRole: params.includeRole
        };
        if (params.cursor)
            queryParams.cursor = params.cursor;
        const response = await get('/users', queryParams);
        const formatted = response.data.map(formatUser).join('\n\n---\n\n');
        const output = {
            count: response.data.length,
            users: response.data,
            nextCursor: response.nextCursor
        };
        let text = `Found ${response.data.length} user(s):\n\n${formatted}`;
        if (response.nextCursor) {
            text += `\n\n_More results available. Use cursor: ${response.nextCursor}_`;
        }
        return {
            content: [{ type: 'text', text }],
            structuredContent: output
        };
    });
    // ============ Get User ============
    server.registerTool('n8n_get_user', {
        title: 'Get n8n User',
        description: `Get details of a specific user.

Args:
  - id (string): User ID

Returns:
  User details with id, email, name, and role.`,
        inputSchema: IdParamSchema,
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false
        }
    }, async (params) => {
        const user = await get(`/users/${params.id}`);
        return {
            content: [{ type: 'text', text: formatUser(user) }],
            structuredContent: user
        };
    });
    // ============ Get Current User ============
    server.registerTool('n8n_get_current_user', {
        title: 'Get Current n8n User',
        description: `Get details of the currently authenticated user (owner of the API key).

Returns:
  Current user details with id, email, name, and role.`,
        inputSchema: EmptySchema,
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false
        }
    }, async () => {
        const user = await get('/users/me');
        return {
            content: [{ type: 'text', text: `**Current User:**\n\n${formatUser(user)}` }],
            structuredContent: user
        };
    });
};
export const registerSourceControlTools = (server) => {
    // ============ Get Source Control Status ============
    server.registerTool('n8n_source_control_status', {
        title: 'Get Source Control Status',
        description: `Get the current source control (Git) status.

Returns:
  - branchName: Current branch
  - connected: Whether Git is connected
  - ahead: Commits ahead of remote
  - behind: Commits behind remote
  - conflicts: Any merge conflicts`,
        inputSchema: EmptySchema,
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false
        }
    }, async () => {
        const status = await get('/source-control/status');
        const text = [
            `**Source Control Status**`,
            `- Branch: ${status.branchName}`,
            `- Connected: ${status.connected ? '✅ Yes' : '❌ No'}`,
            `- Commits Ahead: ${status.ahead}`,
            `- Commits Behind: ${status.behind}`,
            status.conflicts?.length ? `- Conflicts: ${status.conflicts.join(', ')}` : ''
        ].filter(Boolean).join('\n');
        return {
            content: [{ type: 'text', text }],
            structuredContent: status
        };
    });
    // ============ Pull from Source Control ============
    server.registerTool('n8n_source_control_pull', {
        title: 'Pull from Source Control',
        description: `Pull changes from the remote Git repository.

Args:
  - force (boolean): Force pull even with local changes (default: false)
  - variables (object, optional): Variables to set after pull

Returns:
  Pull result with affected files.`,
        inputSchema: SourceControlPullSchema,
        annotations: {
            readOnlyHint: false,
            destructiveHint: false,
            idempotentHint: false,
            openWorldHint: true
        }
    }, async (params) => {
        const result = await post('/source-control/pull', params);
        const files = result.pullResult?.files || [];
        const text = [
            `**Pull Complete**`,
            `- Status: ${result.statusCode}`,
            result.pullResult?.branch ? `- Branch: ${result.pullResult.branch}` : '',
            files.length ? `- Files Updated:\n${files.map(f => `  - ${f}`).join('\n')}` : '- No files changed'
        ].filter(Boolean).join('\n');
        return {
            content: [{ type: 'text', text }],
            structuredContent: result
        };
    });
    // ============ Push to Source Control ============
    server.registerTool('n8n_source_control_push', {
        title: 'Push to Source Control',
        description: `Push changes to the remote Git repository.

Args:
  - force (boolean): Force push (default: false)
  - message (string, optional): Commit message

Returns:
  Push result with affected files.`,
        inputSchema: SourceControlPushSchema,
        annotations: {
            readOnlyHint: false,
            destructiveHint: false,
            idempotentHint: false,
            openWorldHint: true
        }
    }, async (params) => {
        const result = await post('/source-control/push', params);
        const files = result.pushResult?.files || [];
        const text = [
            `**Push Complete**`,
            `- Status: ${result.statusCode}`,
            result.pushResult?.branch ? `- Branch: ${result.pushResult.branch}` : '',
            files.length ? `- Files Pushed:\n${files.map(f => `  - ${f}`).join('\n')}` : '- No files changed'
        ].filter(Boolean).join('\n');
        return {
            content: [{ type: 'text', text }],
            structuredContent: result
        };
    });
    // ============ Disconnect Source Control ============
    server.registerTool('n8n_source_control_disconnect', {
        title: 'Disconnect Source Control',
        description: `Disconnect from the remote Git repository.

⚠️ WARNING: This will remove the Git integration!

Returns:
  Confirmation of disconnection.`,
        inputSchema: EmptySchema,
        annotations: {
            readOnlyHint: false,
            destructiveHint: true,
            idempotentHint: true,
            openWorldHint: false
        }
    }, async () => {
        await post('/source-control/disconnect');
        return {
            content: [{ type: 'text', text: '✅ Source control disconnected successfully.' }],
            structuredContent: { disconnected: true }
        };
    });
};
//# sourceMappingURL=users-sourcecontrol.js.map