// n8n API Client Service
import axios from 'axios';
// Configuration from environment variables
const getConfig = () => {
    const baseUrl = process.env.N8N_URL || process.env.N8N_BASE_URL || 'http://localhost:5678';
    const apiKey = process.env.N8N_API_KEY || '';
    if (!apiKey) {
        console.error('Warning: N8N_API_KEY environment variable is not set');
    }
    return {
        baseUrl: baseUrl.replace(/\/$/, ''), // Remove trailing slash
        apiKey
    };
};
// Create axios instance with default config
const createClient = () => {
    const config = getConfig();
    return axios.create({
        baseURL: `${config.baseUrl}/api/v1`,
        headers: {
            'Content-Type': 'application/json',
            'X-N8N-API-KEY': config.apiKey
        },
        timeout: 30000
    });
};
let client = null;
const getClient = () => {
    if (!client) {
        client = createClient();
    }
    return client;
};
// Reset client (useful when config changes)
export const resetClient = () => {
    client = null;
};
// Error handler
const handleError = (error) => {
    if (axios.isAxiosError(error)) {
        const axiosError = error;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.message;
        const hint = axiosError.response?.data?.hint;
        let errorMessage = `n8n API Error (${status || 'unknown'}): ${message}`;
        if (hint) {
            errorMessage += ` - Hint: ${hint}`;
        }
        // Add specific guidance based on status codes
        if (status === 401) {
            errorMessage += '\n→ Check your N8N_API_KEY environment variable';
        }
        else if (status === 403) {
            errorMessage += '\n→ Your API key may not have permission for this operation';
        }
        else if (status === 404) {
            errorMessage += '\n→ The requested resource was not found';
        }
        else if (status === 409) {
            errorMessage += '\n→ Conflict: Resource may already exist or have conflicting state';
        }
        else if (status === 429) {
            errorMessage += '\n→ Rate limit exceeded. Please wait and try again';
        }
        throw new Error(errorMessage);
    }
    throw error;
};
// Generic API request function
export const apiRequest = async (method, endpoint, data, params) => {
    try {
        const config = {
            method,
            url: endpoint,
            params
        };
        if (data !== undefined && ['POST', 'PUT', 'PATCH'].includes(method)) {
            config.data = data;
        }
        const response = await getClient().request(config);
        return response.data;
    }
    catch (error) {
        return handleError(error);
    }
};
// Convenience methods
export const get = (endpoint, params) => apiRequest('GET', endpoint, undefined, params);
export const post = (endpoint, data) => apiRequest('POST', endpoint, data);
export const put = (endpoint, data) => apiRequest('PUT', endpoint, data);
export const patch = (endpoint, data) => apiRequest('PATCH', endpoint, data);
export const del = (endpoint) => apiRequest('DELETE', endpoint);
// Paginated request helper
export const getPaginated = async (endpoint, params, maxItems) => {
    const allItems = [];
    let cursor;
    const limit = params?.limit || 100;
    do {
        const requestParams = {
            ...params,
            limit,
            ...(cursor ? { cursor } : {})
        };
        const response = await get(endpoint, requestParams);
        allItems.push(...response.data);
        cursor = response.nextCursor;
        if (maxItems && allItems.length >= maxItems) {
            return allItems.slice(0, maxItems);
        }
    } while (cursor);
    return allItems;
};
// Health check
export const checkConnection = async () => {
    try {
        // Try to get workflows as a connection test
        await get('/workflows', { limit: 1 });
        return { connected: true };
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { connected: false, error: message };
    }
};
//# sourceMappingURL=api-client.js.map