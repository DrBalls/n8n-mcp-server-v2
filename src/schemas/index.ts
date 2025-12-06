// Zod schemas for n8n MCP server input validation
import { z } from 'zod';

// ============ Common Schemas ============
export const PaginationSchema = z.object({
  limit: z.number().int().min(1).max(250).default(100)
    .describe('Maximum number of items to return (1-250)'),
  cursor: z.string().optional()
    .describe('Pagination cursor from previous response')
}).strict();

export const IdParamSchema = z.object({
  id: z.string().min(1)
    .describe('The unique identifier of the resource')
}).strict();

// ============ Workflow Schemas ============
export const NodeSchema = z.object({
  id: z.string().optional()
    .describe('Unique node ID (auto-generated if not provided)'),
  name: z.string().min(1)
    .describe('Display name for the node'),
  type: z.string().min(1)
    .describe('Node type (e.g., "n8n-nodes-base.httpRequest", "n8n-nodes-base.code")'),
  typeVersion: z.number().optional()
    .describe('Version of the node type'),
  position: z.tuple([z.number(), z.number()])
    .describe('Canvas position [x, y]'),
  parameters: z.record(z.unknown()).default({})
    .describe('Node-specific configuration parameters'),
  credentials: z.record(z.object({
    id: z.string(),
    name: z.string()
  })).optional()
    .describe('Credentials used by this node'),
  disabled: z.boolean().optional()
    .describe('Whether the node is disabled'),
  notes: z.string().optional()
    .describe('Notes/comments for the node'),
  notesInFlow: z.boolean().optional()
    .describe('Show notes in flow view'),
  webhookId: z.string().optional()
    .describe('Webhook ID for webhook nodes')
});

export const ConnectionSchema = z.object({
  node: z.string().describe('Target node name'),
  type: z.string().default('main').describe('Connection type'),
  index: z.number().int().min(0).default(0).describe('Output index')
});

export const WorkflowSettingsSchema = z.object({
  saveExecutionProgress: z.boolean().optional()
    .describe('Save execution progress'),
  saveManualExecutions: z.boolean().optional()
    .describe('Save manual executions'),
  saveDataErrorExecution: z.enum(['all', 'none']).optional()
    .describe('Save data on error'),
  saveDataSuccessExecution: z.enum(['all', 'none']).optional()
    .describe('Save data on success'),
  executionTimeout: z.number().int().min(-1).optional()
    .describe('Execution timeout in seconds (-1 for no timeout)'),
  timezone: z.string().optional()
    .describe('Timezone for the workflow'),
  errorWorkflow: z.string().optional()
    .describe('Workflow ID to run on error'),
  callerPolicy: z.enum(['any', 'none', 'workflowsFromAList', 'workflowsFromSameOwner']).optional()
    .describe('Who can call this workflow')
});

export const CreateWorkflowSchema = z.object({
  name: z.string().min(1).max(128)
    .describe('Workflow name'),
  nodes: z.array(NodeSchema).default([])
    .describe('Array of workflow nodes'),
  connections: z.record(z.record(z.array(z.array(ConnectionSchema)))).default({})
    .describe('Node connections mapping'),
  settings: WorkflowSettingsSchema.optional()
    .describe('Workflow settings'),
  staticData: z.record(z.unknown()).optional()
    .describe('Static data for the workflow'),
  tags: z.array(z.string()).optional()
    .describe('Array of tag IDs to associate')
}).strict();

export const UpdateWorkflowSchema = z.object({
  id: z.string().min(1)
    .describe('Workflow ID to update'),
  name: z.string().min(1).max(128).optional()
    .describe('New workflow name'),
  nodes: z.array(NodeSchema).optional()
    .describe('Updated nodes array'),
  connections: z.record(z.record(z.array(z.array(ConnectionSchema)))).optional()
    .describe('Updated connections'),
  settings: WorkflowSettingsSchema.optional()
    .describe('Updated settings'),
  staticData: z.record(z.unknown()).optional()
    .describe('Updated static data'),
  tags: z.array(z.string()).optional()
    .describe('Updated tag IDs')
}).strict();

export const ListWorkflowsSchema = z.object({
  active: z.boolean().optional()
    .describe('Filter by active status'),
  tags: z.string().optional()
    .describe('Filter by tag IDs (comma-separated)'),
  name: z.string().optional()
    .describe('Filter by name (partial match)'),
  projectId: z.string().optional()
    .describe('Filter by project ID'),
  limit: z.number().int().min(1).max(250).default(100)
    .describe('Maximum results to return'),
  cursor: z.string().optional()
    .describe('Pagination cursor')
}).strict();

export const RunWorkflowSchema = z.object({
  id: z.string().min(1)
    .describe('Workflow ID to run'),
  data: z.record(z.unknown()).optional()
    .describe('Input data to pass to the workflow')
}).strict();

export const WorkflowTagsSchema = z.object({
  id: z.string().min(1)
    .describe('Workflow ID'),
  tags: z.array(z.object({
    id: z.string().describe('Tag ID')
  }))
    .describe('Array of tag objects with IDs')
}).strict();

// ============ Execution Schemas ============
export const ListExecutionsSchema = z.object({
  workflowId: z.string().optional()
    .describe('Filter by workflow ID'),
  status: z.enum(['error', 'success', 'waiting', 'new', 'running', 'canceled', 'crashed']).optional()
    .describe('Filter by execution status'),
  includeData: z.boolean().default(false)
    .describe('Include full execution data'),
  projectId: z.string().optional()
    .describe('Filter by project ID'),
  limit: z.number().int().min(1).max(250).default(100)
    .describe('Maximum results to return'),
  cursor: z.string().optional()
    .describe('Pagination cursor')
}).strict();

export const GetExecutionSchema = z.object({
  id: z.string().min(1)
    .describe('Execution ID'),
  includeData: z.boolean().default(true)
    .describe('Include full execution data')
}).strict();

export const DeleteExecutionsSchema = z.object({
  workflowId: z.string().optional()
    .describe('Delete executions for this workflow'),
  status: z.enum(['error', 'success', 'waiting', 'new', 'running', 'canceled', 'crashed']).optional()
    .describe('Delete executions with this status'),
  deleteBefore: z.string().optional()
    .describe('Delete executions before this date (ISO 8601)'),
  ids: z.array(z.string()).optional()
    .describe('Specific execution IDs to delete')
}).strict();

// ============ Credential Schemas ============
export const CreateCredentialSchema = z.object({
  name: z.string().min(1).max(128)
    .describe('Credential name'),
  type: z.string().min(1)
    .describe('Credential type (e.g., "slackApi", "httpBasicAuth")'),
  data: z.record(z.unknown())
    .describe('Credential data (fields depend on type)')
}).strict();

export const UpdateCredentialSchema = z.object({
  id: z.string().min(1)
    .describe('Credential ID to update'),
  name: z.string().min(1).max(128).optional()
    .describe('New credential name'),
  data: z.record(z.unknown()).optional()
    .describe('Updated credential data')
}).strict();

export const ListCredentialsSchema = z.object({
  type: z.string().optional()
    .describe('Filter by credential type'),
  limit: z.number().int().min(1).max(250).default(100)
    .describe('Maximum results to return'),
  cursor: z.string().optional()
    .describe('Pagination cursor')
}).strict();

export const CredentialSchemaRequestSchema = z.object({
  credentialType: z.string().min(1)
    .describe('The credential type to get schema for (e.g., "slackApi")')
}).strict();

// ============ Tag Schemas ============
export const CreateTagSchema = z.object({
  name: z.string().min(1).max(24)
    .describe('Tag name (max 24 characters)')
}).strict();

export const UpdateTagSchema = z.object({
  id: z.string().min(1)
    .describe('Tag ID to update'),
  name: z.string().min(1).max(24)
    .describe('New tag name')
}).strict();

export const ListTagsSchema = z.object({
  limit: z.number().int().min(1).max(250).default(100)
    .describe('Maximum results to return'),
  cursor: z.string().optional()
    .describe('Pagination cursor')
}).strict();

// ============ Variable Schemas ============
export const CreateVariableSchema = z.object({
  key: z.string().min(1).max(50).regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/)
    .describe('Variable key (alphanumeric + underscore, must start with letter or underscore)'),
  value: z.string()
    .describe('Variable value')
}).strict();

export const UpdateVariableSchema = z.object({
  id: z.string().min(1)
    .describe('Variable ID to update'),
  key: z.string().min(1).max(50).regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/).optional()
    .describe('New variable key'),
  value: z.string().optional()
    .describe('New variable value')
}).strict();

export const ListVariablesSchema = z.object({
  limit: z.number().int().min(1).max(250).default(100)
    .describe('Maximum results to return'),
  cursor: z.string().optional()
    .describe('Pagination cursor')
}).strict();

// ============ Project Schemas ============
export const CreateProjectSchema = z.object({
  name: z.string().min(1).max(128)
    .describe('Project name')
}).strict();

export const UpdateProjectSchema = z.object({
  id: z.string().min(1)
    .describe('Project ID to update'),
  name: z.string().min(1).max(128)
    .describe('New project name')
}).strict();

export const ListProjectsSchema = z.object({
  limit: z.number().int().min(1).max(250).default(100)
    .describe('Maximum results to return'),
  cursor: z.string().optional()
    .describe('Pagination cursor')
}).strict();

export const TransferToProjectSchema = z.object({
  workflowId: z.string().optional()
    .describe('Workflow ID to transfer'),
  credentialId: z.string().optional()
    .describe('Credential ID to transfer'),
  destinationProjectId: z.string().min(1)
    .describe('Target project ID')
}).strict();

// ============ User Schemas ============
export const ListUsersSchema = z.object({
  includeRole: z.boolean().default(true)
    .describe('Include user roles in response'),
  limit: z.number().int().min(1).max(250).default(100)
    .describe('Maximum results to return'),
  cursor: z.string().optional()
    .describe('Pagination cursor')
}).strict();

// ============ Source Control Schemas ============
export const SourceControlPullSchema = z.object({
  force: z.boolean().default(false)
    .describe('Force pull even with local changes'),
  variables: z.record(z.string()).optional()
    .describe('Variables to set after pull')
}).strict();

export const SourceControlPushSchema = z.object({
  force: z.boolean().default(false)
    .describe('Force push'),
  message: z.string().optional()
    .describe('Commit message')
}).strict();

// ============ Audit Schemas ============
export const GenerateAuditSchema = z.object({
  categories: z.array(z.enum([
    'credentials',
    'database',
    'filesystem',
    'instance',
    'nodes'
  ])).optional()
    .describe('Categories to audit (default: all)'),
  daysAbandonedWorkflow: z.number().int().min(1).optional()
    .describe('Days to consider workflow abandoned')
}).strict();

// ============ Utility Schemas ============
export const EmptySchema = z.object({}).strict();
