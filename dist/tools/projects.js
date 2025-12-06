import { z } from 'zod';
import { get, post, put, del } from '../services/api-client.js';
import { CreateProjectSchema, UpdateProjectSchema, ListProjectsSchema, IdParamSchema } from '../schemas/index.js';
// Format project for display
const formatProject = (project) => {
    const icon = project.type === 'personal' ? '👤' : '👥';
    return `${icon} **${project.name}** (ID: ${project.id})\n- Type: ${project.type}`;
};
export const registerProjectTools = (server) => {
    // ============ List Projects ============
    server.registerTool('n8n_list_projects', {
        title: 'List n8n Projects',
        description: `List all projects.

Projects help organize workflows and credentials into separate workspaces.

Args:
  - limit (number): Maximum results (default: 100)
  - cursor (string, optional): Pagination cursor

Returns:
  List of projects with id, name, and type (personal/team).`,
        inputSchema: ListProjectsSchema,
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
        const response = await get('/projects', queryParams);
        const formatted = response.data.map(formatProject).join('\n\n');
        const output = {
            count: response.data.length,
            projects: response.data,
            nextCursor: response.nextCursor
        };
        let text = `Found ${response.data.length} project(s):\n\n${formatted}`;
        if (response.nextCursor) {
            text += `\n\n_More results available. Use cursor: ${response.nextCursor}_`;
        }
        return {
            content: [{ type: 'text', text }],
            structuredContent: output
        };
    });
    // ============ Get Project ============
    server.registerTool('n8n_get_project', {
        title: 'Get n8n Project',
        description: `Get details of a specific project.

Args:
  - id (string): Project ID

Returns:
  Project details with id, name, and type.`,
        inputSchema: IdParamSchema,
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false
        }
    }, async (params) => {
        const project = await get(`/projects/${params.id}`);
        return {
            content: [{ type: 'text', text: formatProject(project) }],
            structuredContent: project
        };
    });
    // ============ Create Project ============
    server.registerTool('n8n_create_project', {
        title: 'Create n8n Project',
        description: `Create a new project for organizing workflows and credentials.

Args:
  - name (string): Project name

Returns:
  The created project.`,
        inputSchema: CreateProjectSchema,
        annotations: {
            readOnlyHint: false,
            destructiveHint: false,
            idempotentHint: false,
            openWorldHint: false
        }
    }, async (params) => {
        const project = await post('/projects', params);
        return {
            content: [{ type: 'text', text: `✅ Project created!\n\n${formatProject(project)}` }],
            structuredContent: project
        };
    });
    // ============ Update Project ============
    server.registerTool('n8n_update_project', {
        title: 'Update n8n Project',
        description: `Rename a project.

Args:
  - id (string): Project ID to update
  - name (string): New project name

Returns:
  The updated project.`,
        inputSchema: UpdateProjectSchema,
        annotations: {
            readOnlyHint: false,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false
        }
    }, async (params) => {
        const { id, ...updateData } = params;
        const project = await put(`/projects/${id}`, updateData);
        return {
            content: [{ type: 'text', text: `✅ Project updated!\n\n${formatProject(project)}` }],
            structuredContent: project
        };
    });
    // ============ Delete Project ============
    server.registerTool('n8n_delete_project', {
        title: 'Delete n8n Project',
        description: `Delete a project.

⚠️ WARNING: All workflows and credentials in this project will be affected!

Args:
  - id (string): Project ID to delete

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
        await del(`/projects/${params.id}`);
        return {
            content: [{ type: 'text', text: `✅ Project ${params.id} deleted successfully.` }],
            structuredContent: { deleted: true, id: params.id }
        };
    });
    // ============ Transfer Workflow to Project ============
    server.registerTool('n8n_transfer_workflow', {
        title: 'Transfer Workflow to Project',
        description: `Transfer a workflow to a different project.

Args:
  - workflowId (string): Workflow ID to transfer
  - destinationProjectId (string): Target project ID

Returns:
  Confirmation of transfer.`,
        inputSchema: z.object({
            workflowId: z.string().min(1).describe('Workflow ID to transfer'),
            destinationProjectId: z.string().min(1).describe('Target project ID')
        }).strict(),
        annotations: {
            readOnlyHint: false,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false
        }
    }, async (params) => {
        await put(`/workflows/${params.workflowId}/transfer`, {
            destinationProjectId: params.destinationProjectId
        });
        return {
            content: [{ type: 'text', text: `✅ Workflow transferred to project ${params.destinationProjectId}` }],
            structuredContent: { transferred: true, workflowId: params.workflowId, projectId: params.destinationProjectId }
        };
    });
};
//# sourceMappingURL=projects.js.map