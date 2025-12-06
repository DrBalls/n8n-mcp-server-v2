export interface N8nNode {
    id: string;
    name: string;
    type: string;
    typeVersion?: number;
    position: [number, number];
    parameters: Record<string, unknown>;
    credentials?: Record<string, {
        id: string;
        name: string;
    }>;
    disabled?: boolean;
    notes?: string;
    notesInFlow?: boolean;
    webhookId?: string;
}
export interface N8nConnection {
    node: string;
    type: string;
    index: number;
}
export interface N8nConnections {
    [nodeId: string]: {
        [outputType: string]: N8nConnection[][];
    };
}
export interface N8nWorkflowSettings {
    saveExecutionProgress?: boolean;
    saveManualExecutions?: boolean;
    saveDataErrorExecution?: 'all' | 'none';
    saveDataSuccessExecution?: 'all' | 'none';
    executionTimeout?: number;
    timezone?: string;
    errorWorkflow?: string;
    callerPolicy?: 'any' | 'none' | 'workflowsFromAList' | 'workflowsFromSameOwner';
    callerIds?: string;
}
export interface N8nWorkflow {
    [key: string]: unknown;
    id?: string;
    name: string;
    active?: boolean;
    nodes: N8nNode[];
    connections: N8nConnections;
    settings?: N8nWorkflowSettings;
    staticData?: Record<string, unknown>;
    tags?: string[] | N8nTag[];
    createdAt?: string;
    updatedAt?: string;
    versionId?: string;
}
export interface N8nWorkflowListItem {
    id: string;
    name: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
    tags?: N8nTag[];
}
export interface N8nExecutionData {
    startData?: Record<string, unknown>;
    resultData?: {
        runData?: Record<string, unknown[]>;
        lastNodeExecuted?: string;
        error?: Record<string, unknown>;
    };
    executionData?: {
        contextData?: Record<string, unknown>;
        nodeExecutionStack?: unknown[];
        waitingExecution?: Record<string, unknown>;
        waitingExecutionSource?: Record<string, unknown>;
    };
}
export interface N8nExecution {
    [key: string]: unknown;
    id: string;
    finished: boolean;
    mode: 'manual' | 'trigger' | 'webhook' | 'retry' | 'integrated';
    retryOf?: string;
    retrySuccessId?: string;
    startedAt: string;
    stoppedAt?: string;
    workflowId: string;
    workflowData?: N8nWorkflow;
    data?: N8nExecutionData;
    status: 'new' | 'running' | 'success' | 'error' | 'canceled' | 'crashed' | 'waiting';
}
export interface N8nExecutionListItem {
    id: string;
    finished: boolean;
    mode: string;
    startedAt: string;
    stoppedAt?: string;
    workflowId: string;
    status: string;
}
export interface N8nCredential {
    [key: string]: unknown;
    id?: string;
    name: string;
    type: string;
    data?: Record<string, unknown>;
    createdAt?: string;
    updatedAt?: string;
}
export interface N8nCredentialListItem {
    id: string;
    name: string;
    type: string;
    createdAt: string;
    updatedAt: string;
}
export interface N8nCredentialSchema {
    [key: string]: unknown;
    additionalProperties?: boolean;
    type: string;
    properties: Record<string, {
        type: string;
        default?: unknown;
        description?: string;
    }>;
    required?: string[];
}
export interface N8nTag {
    [key: string]: unknown;
    id?: string;
    name: string;
    createdAt?: string;
    updatedAt?: string;
}
export interface N8nVariable {
    [key: string]: unknown;
    id?: string;
    key: string;
    value: string;
    type?: 'string';
}
export interface N8nProject {
    [key: string]: unknown;
    id: string;
    name: string;
    type: 'personal' | 'team';
    createdAt?: string;
    updatedAt?: string;
}
export interface N8nUser {
    [key: string]: unknown;
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role?: 'global:owner' | 'global:admin' | 'global:member';
    isPending?: boolean;
    createdAt?: string;
    updatedAt?: string;
}
export interface N8nSourceControlStatus {
    [key: string]: unknown;
    branchName: string;
    connected: boolean;
    ahead: number;
    behind: number;
    conflicts?: string[];
}
export interface N8nSourceControlPushResult {
    [key: string]: unknown;
    statusCode: number;
    pushResult?: {
        branch?: string;
        files?: string[];
    };
}
export interface N8nSourceControlPullResult {
    [key: string]: unknown;
    statusCode: number;
    pullResult?: {
        branch?: string;
        files?: string[];
    };
}
export interface N8nApiResponse<T> {
    data: T;
    nextCursor?: string;
}
export interface N8nPaginatedResponse<T> {
    data: T[];
    nextCursor?: string;
}
export interface N8nApiError {
    message: string;
    name?: string;
    httpStatusCode?: number;
    hint?: string;
}
export interface N8nWebhook {
    webhookDescription?: {
        httpMethod: string;
        path: string;
        webhookId?: string;
        isFullPath?: boolean;
        restartWebhook?: boolean;
    };
    workflowId: string;
    node: string;
}
export interface N8nAuditResult {
    [key: string]: unknown;
    risk: 'high' | 'medium' | 'low';
    sections: {
        name: string;
        risk: 'high' | 'medium' | 'low';
        issues: string[];
    }[];
}
export interface N8nConfig {
    baseUrl: string;
    apiKey: string;
}
//# sourceMappingURL=types.d.ts.map