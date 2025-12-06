export declare const resetClient: () => void;
export declare const apiRequest: <T>(method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE", endpoint: string, data?: unknown, params?: Record<string, unknown>) => Promise<T>;
export declare const get: <T>(endpoint: string, params?: Record<string, unknown>) => Promise<T>;
export declare const post: <T>(endpoint: string, data?: unknown) => Promise<T>;
export declare const put: <T>(endpoint: string, data?: unknown) => Promise<T>;
export declare const patch: <T>(endpoint: string, data?: unknown) => Promise<T>;
export declare const del: <T>(endpoint: string) => Promise<T>;
export declare const getPaginated: <T>(endpoint: string, params?: Record<string, unknown>, maxItems?: number) => Promise<T[]>;
export declare const checkConnection: () => Promise<{
    connected: boolean;
    version?: string;
    error?: string;
}>;
//# sourceMappingURL=api-client.d.ts.map