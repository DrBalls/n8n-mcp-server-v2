import { z } from 'zod';
export declare const PaginationSchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    limit: number;
    cursor?: string | undefined;
}, {
    limit?: number | undefined;
    cursor?: string | undefined;
}>;
export declare const IdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, "strict", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export declare const NodeSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    type: z.ZodString;
    typeVersion: z.ZodOptional<z.ZodNumber>;
    position: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
    parameters: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    credentials: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        name: string;
    }, {
        id: string;
        name: string;
    }>>>;
    disabled: z.ZodOptional<z.ZodBoolean>;
    notes: z.ZodOptional<z.ZodString>;
    notesInFlow: z.ZodOptional<z.ZodBoolean>;
    webhookId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: string;
    position: [number, number];
    parameters: Record<string, unknown>;
    id?: string | undefined;
    credentials?: Record<string, {
        id: string;
        name: string;
    }> | undefined;
    typeVersion?: number | undefined;
    disabled?: boolean | undefined;
    notes?: string | undefined;
    notesInFlow?: boolean | undefined;
    webhookId?: string | undefined;
}, {
    name: string;
    type: string;
    position: [number, number];
    id?: string | undefined;
    credentials?: Record<string, {
        id: string;
        name: string;
    }> | undefined;
    typeVersion?: number | undefined;
    parameters?: Record<string, unknown> | undefined;
    disabled?: boolean | undefined;
    notes?: string | undefined;
    notesInFlow?: boolean | undefined;
    webhookId?: string | undefined;
}>;
export declare const ConnectionSchema: z.ZodObject<{
    node: z.ZodString;
    type: z.ZodDefault<z.ZodString>;
    index: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    type: string;
    node: string;
    index: number;
}, {
    node: string;
    type?: string | undefined;
    index?: number | undefined;
}>;
export declare const WorkflowSettingsSchema: z.ZodObject<{
    saveExecutionProgress: z.ZodOptional<z.ZodBoolean>;
    saveManualExecutions: z.ZodOptional<z.ZodBoolean>;
    saveDataErrorExecution: z.ZodOptional<z.ZodEnum<["all", "none"]>>;
    saveDataSuccessExecution: z.ZodOptional<z.ZodEnum<["all", "none"]>>;
    executionTimeout: z.ZodOptional<z.ZodNumber>;
    timezone: z.ZodOptional<z.ZodString>;
    errorWorkflow: z.ZodOptional<z.ZodString>;
    callerPolicy: z.ZodOptional<z.ZodEnum<["any", "none", "workflowsFromAList", "workflowsFromSameOwner"]>>;
}, "strip", z.ZodTypeAny, {
    saveExecutionProgress?: boolean | undefined;
    saveManualExecutions?: boolean | undefined;
    saveDataErrorExecution?: "all" | "none" | undefined;
    saveDataSuccessExecution?: "all" | "none" | undefined;
    executionTimeout?: number | undefined;
    timezone?: string | undefined;
    errorWorkflow?: string | undefined;
    callerPolicy?: "none" | "any" | "workflowsFromAList" | "workflowsFromSameOwner" | undefined;
}, {
    saveExecutionProgress?: boolean | undefined;
    saveManualExecutions?: boolean | undefined;
    saveDataErrorExecution?: "all" | "none" | undefined;
    saveDataSuccessExecution?: "all" | "none" | undefined;
    executionTimeout?: number | undefined;
    timezone?: string | undefined;
    errorWorkflow?: string | undefined;
    callerPolicy?: "none" | "any" | "workflowsFromAList" | "workflowsFromSameOwner" | undefined;
}>;
export declare const CreateWorkflowSchema: z.ZodObject<{
    name: z.ZodString;
    nodes: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        name: z.ZodString;
        type: z.ZodString;
        typeVersion: z.ZodOptional<z.ZodNumber>;
        position: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
        parameters: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        credentials: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
            name: string;
        }, {
            id: string;
            name: string;
        }>>>;
        disabled: z.ZodOptional<z.ZodBoolean>;
        notes: z.ZodOptional<z.ZodString>;
        notesInFlow: z.ZodOptional<z.ZodBoolean>;
        webhookId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        type: string;
        position: [number, number];
        parameters: Record<string, unknown>;
        id?: string | undefined;
        credentials?: Record<string, {
            id: string;
            name: string;
        }> | undefined;
        typeVersion?: number | undefined;
        disabled?: boolean | undefined;
        notes?: string | undefined;
        notesInFlow?: boolean | undefined;
        webhookId?: string | undefined;
    }, {
        name: string;
        type: string;
        position: [number, number];
        id?: string | undefined;
        credentials?: Record<string, {
            id: string;
            name: string;
        }> | undefined;
        typeVersion?: number | undefined;
        parameters?: Record<string, unknown> | undefined;
        disabled?: boolean | undefined;
        notes?: string | undefined;
        notesInFlow?: boolean | undefined;
        webhookId?: string | undefined;
    }>, "many">>;
    connections: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodArray<z.ZodArray<z.ZodObject<{
        node: z.ZodString;
        type: z.ZodDefault<z.ZodString>;
        index: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        type: string;
        node: string;
        index: number;
    }, {
        node: string;
        type?: string | undefined;
        index?: number | undefined;
    }>, "many">, "many">>>>;
    settings: z.ZodOptional<z.ZodObject<{
        saveExecutionProgress: z.ZodOptional<z.ZodBoolean>;
        saveManualExecutions: z.ZodOptional<z.ZodBoolean>;
        saveDataErrorExecution: z.ZodOptional<z.ZodEnum<["all", "none"]>>;
        saveDataSuccessExecution: z.ZodOptional<z.ZodEnum<["all", "none"]>>;
        executionTimeout: z.ZodOptional<z.ZodNumber>;
        timezone: z.ZodOptional<z.ZodString>;
        errorWorkflow: z.ZodOptional<z.ZodString>;
        callerPolicy: z.ZodOptional<z.ZodEnum<["any", "none", "workflowsFromAList", "workflowsFromSameOwner"]>>;
    }, "strip", z.ZodTypeAny, {
        saveExecutionProgress?: boolean | undefined;
        saveManualExecutions?: boolean | undefined;
        saveDataErrorExecution?: "all" | "none" | undefined;
        saveDataSuccessExecution?: "all" | "none" | undefined;
        executionTimeout?: number | undefined;
        timezone?: string | undefined;
        errorWorkflow?: string | undefined;
        callerPolicy?: "none" | "any" | "workflowsFromAList" | "workflowsFromSameOwner" | undefined;
    }, {
        saveExecutionProgress?: boolean | undefined;
        saveManualExecutions?: boolean | undefined;
        saveDataErrorExecution?: "all" | "none" | undefined;
        saveDataSuccessExecution?: "all" | "none" | undefined;
        executionTimeout?: number | undefined;
        timezone?: string | undefined;
        errorWorkflow?: string | undefined;
        callerPolicy?: "none" | "any" | "workflowsFromAList" | "workflowsFromSameOwner" | undefined;
    }>>;
    staticData: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strict", z.ZodTypeAny, {
    name: string;
    nodes: {
        name: string;
        type: string;
        position: [number, number];
        parameters: Record<string, unknown>;
        id?: string | undefined;
        credentials?: Record<string, {
            id: string;
            name: string;
        }> | undefined;
        typeVersion?: number | undefined;
        disabled?: boolean | undefined;
        notes?: string | undefined;
        notesInFlow?: boolean | undefined;
        webhookId?: string | undefined;
    }[];
    connections: Record<string, Record<string, {
        type: string;
        node: string;
        index: number;
    }[][]>>;
    settings?: {
        saveExecutionProgress?: boolean | undefined;
        saveManualExecutions?: boolean | undefined;
        saveDataErrorExecution?: "all" | "none" | undefined;
        saveDataSuccessExecution?: "all" | "none" | undefined;
        executionTimeout?: number | undefined;
        timezone?: string | undefined;
        errorWorkflow?: string | undefined;
        callerPolicy?: "none" | "any" | "workflowsFromAList" | "workflowsFromSameOwner" | undefined;
    } | undefined;
    staticData?: Record<string, unknown> | undefined;
    tags?: string[] | undefined;
}, {
    name: string;
    nodes?: {
        name: string;
        type: string;
        position: [number, number];
        id?: string | undefined;
        credentials?: Record<string, {
            id: string;
            name: string;
        }> | undefined;
        typeVersion?: number | undefined;
        parameters?: Record<string, unknown> | undefined;
        disabled?: boolean | undefined;
        notes?: string | undefined;
        notesInFlow?: boolean | undefined;
        webhookId?: string | undefined;
    }[] | undefined;
    connections?: Record<string, Record<string, {
        node: string;
        type?: string | undefined;
        index?: number | undefined;
    }[][]>> | undefined;
    settings?: {
        saveExecutionProgress?: boolean | undefined;
        saveManualExecutions?: boolean | undefined;
        saveDataErrorExecution?: "all" | "none" | undefined;
        saveDataSuccessExecution?: "all" | "none" | undefined;
        executionTimeout?: number | undefined;
        timezone?: string | undefined;
        errorWorkflow?: string | undefined;
        callerPolicy?: "none" | "any" | "workflowsFromAList" | "workflowsFromSameOwner" | undefined;
    } | undefined;
    staticData?: Record<string, unknown> | undefined;
    tags?: string[] | undefined;
}>;
export declare const UpdateWorkflowSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    nodes: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        name: z.ZodString;
        type: z.ZodString;
        typeVersion: z.ZodOptional<z.ZodNumber>;
        position: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
        parameters: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        credentials: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
            name: string;
        }, {
            id: string;
            name: string;
        }>>>;
        disabled: z.ZodOptional<z.ZodBoolean>;
        notes: z.ZodOptional<z.ZodString>;
        notesInFlow: z.ZodOptional<z.ZodBoolean>;
        webhookId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        type: string;
        position: [number, number];
        parameters: Record<string, unknown>;
        id?: string | undefined;
        credentials?: Record<string, {
            id: string;
            name: string;
        }> | undefined;
        typeVersion?: number | undefined;
        disabled?: boolean | undefined;
        notes?: string | undefined;
        notesInFlow?: boolean | undefined;
        webhookId?: string | undefined;
    }, {
        name: string;
        type: string;
        position: [number, number];
        id?: string | undefined;
        credentials?: Record<string, {
            id: string;
            name: string;
        }> | undefined;
        typeVersion?: number | undefined;
        parameters?: Record<string, unknown> | undefined;
        disabled?: boolean | undefined;
        notes?: string | undefined;
        notesInFlow?: boolean | undefined;
        webhookId?: string | undefined;
    }>, "many">>;
    connections: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodArray<z.ZodArray<z.ZodObject<{
        node: z.ZodString;
        type: z.ZodDefault<z.ZodString>;
        index: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        type: string;
        node: string;
        index: number;
    }, {
        node: string;
        type?: string | undefined;
        index?: number | undefined;
    }>, "many">, "many">>>>;
    settings: z.ZodOptional<z.ZodObject<{
        saveExecutionProgress: z.ZodOptional<z.ZodBoolean>;
        saveManualExecutions: z.ZodOptional<z.ZodBoolean>;
        saveDataErrorExecution: z.ZodOptional<z.ZodEnum<["all", "none"]>>;
        saveDataSuccessExecution: z.ZodOptional<z.ZodEnum<["all", "none"]>>;
        executionTimeout: z.ZodOptional<z.ZodNumber>;
        timezone: z.ZodOptional<z.ZodString>;
        errorWorkflow: z.ZodOptional<z.ZodString>;
        callerPolicy: z.ZodOptional<z.ZodEnum<["any", "none", "workflowsFromAList", "workflowsFromSameOwner"]>>;
    }, "strip", z.ZodTypeAny, {
        saveExecutionProgress?: boolean | undefined;
        saveManualExecutions?: boolean | undefined;
        saveDataErrorExecution?: "all" | "none" | undefined;
        saveDataSuccessExecution?: "all" | "none" | undefined;
        executionTimeout?: number | undefined;
        timezone?: string | undefined;
        errorWorkflow?: string | undefined;
        callerPolicy?: "none" | "any" | "workflowsFromAList" | "workflowsFromSameOwner" | undefined;
    }, {
        saveExecutionProgress?: boolean | undefined;
        saveManualExecutions?: boolean | undefined;
        saveDataErrorExecution?: "all" | "none" | undefined;
        saveDataSuccessExecution?: "all" | "none" | undefined;
        executionTimeout?: number | undefined;
        timezone?: string | undefined;
        errorWorkflow?: string | undefined;
        callerPolicy?: "none" | "any" | "workflowsFromAList" | "workflowsFromSameOwner" | undefined;
    }>>;
    staticData: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strict", z.ZodTypeAny, {
    id: string;
    name?: string | undefined;
    nodes?: {
        name: string;
        type: string;
        position: [number, number];
        parameters: Record<string, unknown>;
        id?: string | undefined;
        credentials?: Record<string, {
            id: string;
            name: string;
        }> | undefined;
        typeVersion?: number | undefined;
        disabled?: boolean | undefined;
        notes?: string | undefined;
        notesInFlow?: boolean | undefined;
        webhookId?: string | undefined;
    }[] | undefined;
    connections?: Record<string, Record<string, {
        type: string;
        node: string;
        index: number;
    }[][]>> | undefined;
    settings?: {
        saveExecutionProgress?: boolean | undefined;
        saveManualExecutions?: boolean | undefined;
        saveDataErrorExecution?: "all" | "none" | undefined;
        saveDataSuccessExecution?: "all" | "none" | undefined;
        executionTimeout?: number | undefined;
        timezone?: string | undefined;
        errorWorkflow?: string | undefined;
        callerPolicy?: "none" | "any" | "workflowsFromAList" | "workflowsFromSameOwner" | undefined;
    } | undefined;
    staticData?: Record<string, unknown> | undefined;
    tags?: string[] | undefined;
}, {
    id: string;
    name?: string | undefined;
    nodes?: {
        name: string;
        type: string;
        position: [number, number];
        id?: string | undefined;
        credentials?: Record<string, {
            id: string;
            name: string;
        }> | undefined;
        typeVersion?: number | undefined;
        parameters?: Record<string, unknown> | undefined;
        disabled?: boolean | undefined;
        notes?: string | undefined;
        notesInFlow?: boolean | undefined;
        webhookId?: string | undefined;
    }[] | undefined;
    connections?: Record<string, Record<string, {
        node: string;
        type?: string | undefined;
        index?: number | undefined;
    }[][]>> | undefined;
    settings?: {
        saveExecutionProgress?: boolean | undefined;
        saveManualExecutions?: boolean | undefined;
        saveDataErrorExecution?: "all" | "none" | undefined;
        saveDataSuccessExecution?: "all" | "none" | undefined;
        executionTimeout?: number | undefined;
        timezone?: string | undefined;
        errorWorkflow?: string | undefined;
        callerPolicy?: "none" | "any" | "workflowsFromAList" | "workflowsFromSameOwner" | undefined;
    } | undefined;
    staticData?: Record<string, unknown> | undefined;
    tags?: string[] | undefined;
}>;
export declare const ListWorkflowsSchema: z.ZodObject<{
    active: z.ZodOptional<z.ZodBoolean>;
    tags: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    projectId: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    limit: number;
    name?: string | undefined;
    active?: boolean | undefined;
    tags?: string | undefined;
    cursor?: string | undefined;
    projectId?: string | undefined;
}, {
    name?: string | undefined;
    active?: boolean | undefined;
    tags?: string | undefined;
    limit?: number | undefined;
    cursor?: string | undefined;
    projectId?: string | undefined;
}>;
export declare const RunWorkflowSchema: z.ZodObject<{
    id: z.ZodString;
    data: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strict", z.ZodTypeAny, {
    id: string;
    data?: Record<string, unknown> | undefined;
}, {
    id: string;
    data?: Record<string, unknown> | undefined;
}>;
export declare const WorkflowTagsSchema: z.ZodObject<{
    id: z.ZodString;
    tags: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>, "many">;
}, "strict", z.ZodTypeAny, {
    id: string;
    tags: {
        id: string;
    }[];
}, {
    id: string;
    tags: {
        id: string;
    }[];
}>;
export declare const ListExecutionsSchema: z.ZodObject<{
    workflowId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["error", "success", "waiting", "new", "running", "canceled", "crashed"]>>;
    includeData: z.ZodDefault<z.ZodBoolean>;
    projectId: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    limit: number;
    includeData: boolean;
    workflowId?: string | undefined;
    status?: "new" | "running" | "success" | "error" | "canceled" | "crashed" | "waiting" | undefined;
    cursor?: string | undefined;
    projectId?: string | undefined;
}, {
    workflowId?: string | undefined;
    status?: "new" | "running" | "success" | "error" | "canceled" | "crashed" | "waiting" | undefined;
    limit?: number | undefined;
    cursor?: string | undefined;
    projectId?: string | undefined;
    includeData?: boolean | undefined;
}>;
export declare const GetExecutionSchema: z.ZodObject<{
    id: z.ZodString;
    includeData: z.ZodDefault<z.ZodBoolean>;
}, "strict", z.ZodTypeAny, {
    id: string;
    includeData: boolean;
}, {
    id: string;
    includeData?: boolean | undefined;
}>;
export declare const DeleteExecutionsSchema: z.ZodObject<{
    workflowId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["error", "success", "waiting", "new", "running", "canceled", "crashed"]>>;
    deleteBefore: z.ZodOptional<z.ZodString>;
    ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strict", z.ZodTypeAny, {
    workflowId?: string | undefined;
    status?: "new" | "running" | "success" | "error" | "canceled" | "crashed" | "waiting" | undefined;
    deleteBefore?: string | undefined;
    ids?: string[] | undefined;
}, {
    workflowId?: string | undefined;
    status?: "new" | "running" | "success" | "error" | "canceled" | "crashed" | "waiting" | undefined;
    deleteBefore?: string | undefined;
    ids?: string[] | undefined;
}>;
export declare const CreateCredentialSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodString;
    data: z.ZodRecord<z.ZodString, z.ZodUnknown>;
}, "strict", z.ZodTypeAny, {
    name: string;
    data: Record<string, unknown>;
    type: string;
}, {
    name: string;
    data: Record<string, unknown>;
    type: string;
}>;
export declare const UpdateCredentialSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    data: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strict", z.ZodTypeAny, {
    id: string;
    name?: string | undefined;
    data?: Record<string, unknown> | undefined;
}, {
    id: string;
    name?: string | undefined;
    data?: Record<string, unknown> | undefined;
}>;
export declare const ListCredentialsSchema: z.ZodObject<{
    type: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    limit: number;
    type?: string | undefined;
    cursor?: string | undefined;
}, {
    type?: string | undefined;
    limit?: number | undefined;
    cursor?: string | undefined;
}>;
export declare const CredentialSchemaRequestSchema: z.ZodObject<{
    credentialType: z.ZodString;
}, "strict", z.ZodTypeAny, {
    credentialType: string;
}, {
    credentialType: string;
}>;
export declare const CreateTagSchema: z.ZodObject<{
    name: z.ZodString;
}, "strict", z.ZodTypeAny, {
    name: string;
}, {
    name: string;
}>;
export declare const UpdateTagSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
}, "strict", z.ZodTypeAny, {
    id: string;
    name: string;
}, {
    id: string;
    name: string;
}>;
export declare const ListTagsSchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    limit: number;
    cursor?: string | undefined;
}, {
    limit?: number | undefined;
    cursor?: string | undefined;
}>;
export declare const CreateVariableSchema: z.ZodObject<{
    key: z.ZodString;
    value: z.ZodString;
}, "strict", z.ZodTypeAny, {
    key: string;
    value: string;
}, {
    key: string;
    value: string;
}>;
export declare const UpdateVariableSchema: z.ZodObject<{
    id: z.ZodString;
    key: z.ZodOptional<z.ZodString>;
    value: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    id: string;
    key?: string | undefined;
    value?: string | undefined;
}, {
    id: string;
    key?: string | undefined;
    value?: string | undefined;
}>;
export declare const ListVariablesSchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    limit: number;
    cursor?: string | undefined;
}, {
    limit?: number | undefined;
    cursor?: string | undefined;
}>;
export declare const CreateProjectSchema: z.ZodObject<{
    name: z.ZodString;
}, "strict", z.ZodTypeAny, {
    name: string;
}, {
    name: string;
}>;
export declare const UpdateProjectSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
}, "strict", z.ZodTypeAny, {
    id: string;
    name: string;
}, {
    id: string;
    name: string;
}>;
export declare const ListProjectsSchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    limit: number;
    cursor?: string | undefined;
}, {
    limit?: number | undefined;
    cursor?: string | undefined;
}>;
export declare const TransferToProjectSchema: z.ZodObject<{
    workflowId: z.ZodOptional<z.ZodString>;
    credentialId: z.ZodOptional<z.ZodString>;
    destinationProjectId: z.ZodString;
}, "strict", z.ZodTypeAny, {
    destinationProjectId: string;
    workflowId?: string | undefined;
    credentialId?: string | undefined;
}, {
    destinationProjectId: string;
    workflowId?: string | undefined;
    credentialId?: string | undefined;
}>;
export declare const ListUsersSchema: z.ZodObject<{
    includeRole: z.ZodDefault<z.ZodBoolean>;
    limit: z.ZodDefault<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    limit: number;
    includeRole: boolean;
    cursor?: string | undefined;
}, {
    limit?: number | undefined;
    cursor?: string | undefined;
    includeRole?: boolean | undefined;
}>;
export declare const SourceControlPullSchema: z.ZodObject<{
    force: z.ZodDefault<z.ZodBoolean>;
    variables: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, "strict", z.ZodTypeAny, {
    force: boolean;
    variables?: Record<string, string> | undefined;
}, {
    force?: boolean | undefined;
    variables?: Record<string, string> | undefined;
}>;
export declare const SourceControlPushSchema: z.ZodObject<{
    force: z.ZodDefault<z.ZodBoolean>;
    message: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    force: boolean;
    message?: string | undefined;
}, {
    message?: string | undefined;
    force?: boolean | undefined;
}>;
export declare const GenerateAuditSchema: z.ZodObject<{
    categories: z.ZodOptional<z.ZodArray<z.ZodEnum<["credentials", "database", "filesystem", "instance", "nodes"]>, "many">>;
    daysAbandonedWorkflow: z.ZodOptional<z.ZodNumber>;
}, "strict", z.ZodTypeAny, {
    categories?: ("nodes" | "credentials" | "database" | "filesystem" | "instance")[] | undefined;
    daysAbandonedWorkflow?: number | undefined;
}, {
    categories?: ("nodes" | "credentials" | "database" | "filesystem" | "instance")[] | undefined;
    daysAbandonedWorkflow?: number | undefined;
}>;
export declare const EmptySchema: z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>;
//# sourceMappingURL=index.d.ts.map