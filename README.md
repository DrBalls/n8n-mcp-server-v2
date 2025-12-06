# n8n MCP Server

A comprehensive MCP (Model Context Protocol) server for n8n workflow automation. This connector provides Claude Desktop with **ALL** available n8n API operations, enabling full workflow management directly from Claude.

## Features

Unlike the limited default connector, this server includes **40+ tools** covering:

### Workflow Management
- `n8n_list_workflows` - List all workflows with filtering
- `n8n_get_workflow` - Get full workflow details including nodes and connections
- `n8n_create_workflow` - Create new workflows with nodes and connections
- `n8n_update_workflow` - Update existing workflows
- `n8n_delete_workflow` - Delete workflows
- `n8n_activate_workflow` - Activate a workflow
- `n8n_deactivate_workflow` - Deactivate a workflow
- `n8n_run_workflow` - Execute a workflow manually
- `n8n_update_workflow_tags` - Update workflow tag associations
- `n8n_duplicate_workflow` - Create a copy of a workflow
- `n8n_export_workflow` - Export workflow as JSON
- `n8n_import_workflow` - Import workflow from JSON
- `n8n_transfer_workflow` - Transfer workflow to another project

### Execution Management
- `n8n_list_executions` - List workflow executions with filtering
- `n8n_get_execution` - Get detailed execution information
- `n8n_delete_execution` - Delete a single execution
- `n8n_delete_executions` - Bulk delete executions
- `n8n_stop_execution` - Stop a running execution
- `n8n_retry_execution` - Retry a failed execution

### Credential Management
- `n8n_list_credentials` - List all credentials
- `n8n_get_credential` - Get credential details
- `n8n_create_credential` - Create new credentials
- `n8n_update_credential` - Update existing credentials
- `n8n_delete_credential` - Delete credentials
- `n8n_get_credential_schema` - Get required fields for credential type
- `n8n_transfer_credential` - Transfer credential to another project

### Tag Management
- `n8n_list_tags` - List all tags
- `n8n_get_tag` - Get tag details
- `n8n_create_tag` - Create new tags
- `n8n_update_tag` - Rename tags
- `n8n_delete_tag` - Delete tags

### Variable Management
- `n8n_list_variables` - List all environment variables
- `n8n_get_variable` - Get variable details
- `n8n_create_variable` - Create new variables
- `n8n_update_variable` - Update variables
- `n8n_delete_variable` - Delete variables

### Project Management
- `n8n_list_projects` - List all projects
- `n8n_get_project` - Get project details
- `n8n_create_project` - Create new projects
- `n8n_update_project` - Rename projects
- `n8n_delete_project` - Delete projects

### User Management
- `n8n_list_users` - List all users
- `n8n_get_user` - Get user details
- `n8n_get_current_user` - Get current authenticated user

### Source Control (Git)
- `n8n_source_control_status` - Get Git status
- `n8n_source_control_pull` - Pull changes from remote
- `n8n_source_control_push` - Push changes to remote
- `n8n_source_control_disconnect` - Disconnect Git integration

### Security & Utilities
- `n8n_check_connection` - Test API connection
- `n8n_generate_audit` - Generate security audit report
- `n8n_get_node_types` - List available node types
- `n8n_get_active_webhooks` - List active webhooks

## Installation

### Prerequisites

- Node.js 18 or later
- n8n instance with API access enabled
- n8n API key (generate in n8n Settings → API)

### Setup

1. **Clone or download this project**:
   ```bash
   git clone git@github.com:DrBalls/n8n-mcp-server-v2.git
   cd n8n-mcp-server-v2
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the project**:
   ```bash
   npm run build
   ```

4. **Configure Claude Desktop**:

   Add to your Claude Desktop configuration file:

   **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

   ```json
   {
     "mcpServers": {
       "n8n": {
         "command": "node",
         "args": ["/absolute/path/to/n8n-mcp-server-v2/dist/index.js"],
         "env": {
           "N8N_URL": "http://localhost:5678",
           "N8N_API_KEY": "your-api-key-here"
         }
       }
     }
   }
   ```

5. **Restart Claude Desktop**

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `N8N_URL` | Base URL of your n8n instance | `http://localhost:5678` |
| `N8N_API_KEY` | Your n8n API key | (required) |

### Getting an API Key

1. Open your n8n instance
2. Go to **Settings** → **API**
3. Click **Create API Key**
4. Copy the generated key

## Usage Examples

### Create a Simple Workflow

```
Create a new n8n workflow called "Hello World" with:
1. A manual trigger node
2. A Set node that outputs {"message": "Hello, World!"}
```

### List and Filter Workflows

```
Show me all active workflows tagged with "production"
```

### Run a Workflow with Input

```
Execute workflow ID abc123 with input data: {"email": "test@example.com"}
```

### Manage Credentials

```
List all Slack credentials and show me the schema for creating new ones
```

### Check Execution Status

```
Show me the last 10 failed executions and their error messages
```

### Source Control

```
What's the current Git status? Are there any unpushed changes?
```

## Common Node Types

When creating workflows, use these node type identifiers:

| Node | Type String |
|------|-------------|
| Manual Trigger | `n8n-nodes-base.manualTrigger` |
| Schedule Trigger | `n8n-nodes-base.scheduleTrigger` |
| Webhook | `n8n-nodes-base.webhook` |
| HTTP Request | `n8n-nodes-base.httpRequest` |
| Code (JavaScript) | `n8n-nodes-base.code` |
| Set | `n8n-nodes-base.set` |
| IF | `n8n-nodes-base.if` |
| Switch | `n8n-nodes-base.switch` |
| Merge | `n8n-nodes-base.merge` |
| Split In Batches | `n8n-nodes-base.splitInBatches` |
| Wait | `n8n-nodes-base.wait` |
| No Operation | `n8n-nodes-base.noOp` |

## Troubleshooting

### Connection Failed

- Verify your `N8N_URL` is correct and accessible
- Check that your API key is valid
- Ensure n8n API access is enabled in settings

### Permission Denied

- Your API key may not have sufficient permissions
- Check if the API user has access to the requested resource

### Workflow Not Found

- Verify the workflow ID is correct
- Check if the workflow exists in the specified project

## Development

### Building

```bash
npm run build
```

### Testing Connection

After building, test the connection:

```bash
N8N_URL=http://localhost:5678 N8N_API_KEY=your-key node dist/index.js
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.
