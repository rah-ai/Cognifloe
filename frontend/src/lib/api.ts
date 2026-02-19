import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

// Create axio instance with interceptor for auth
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    }
});

// Auth API
export const authApi = {
    login: async (email: string, password: string) => {
        const response = await apiClient.post('/auth/login', { email, password });
        return response.data;
    },
    signup: async (email: string, password: string, fullName: string) => {
        const response = await apiClient.post('/auth/signup', { email, password, full_name: fullName });
        return response.data;
    },
    getProfile: async () => {
        const response = await apiClient.get('/auth/me');
        return response.data;
    }
};

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Types
export interface Workflow {
    id: string;
    name: string;
    description?: string;
    status: string;
    created_at: string;
    date?: string; // For UI display
    steps: any[];
    agents: any[];
    metrics: any;
}

export interface CreateWorkflowParams {
    name: string;
    description: string;
    steps?: any[];
    agents?: any[];
}

export const workflowApi = {
    // Workflow CRUD
    getAll: async (): Promise<Workflow[]> => {
        const response = await apiClient.get('/workflows');
        return response.data;
    },

    getById: async (id: string): Promise<Workflow> => {
        const response = await apiClient.get(`/workflows/${id}`);
        return response.data;
    },

    create: async (data: CreateWorkflowParams): Promise<Workflow> => {
        const response = await apiClient.post('/workflows', data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/workflows/${id}`);
    },

    // Agent Management
    addAgent: async (workflowId: string, agent: any): Promise<any> => {
        const response = await apiClient.post(`/workflows/${workflowId}/agents`, agent);
        return response.data;
    },

    deployAgent: async (agentId: string): Promise<any> => {
        const response = await apiClient.patch(`/agents/${agentId}/deploy`);
        return response.data;
    },

    // Metrics
    getMetrics: async (): Promise<any> => {
        const response = await apiClient.get('/metrics');
        return response.data;
    },

    // Run workflow (logs execution metrics for real data tracking)
    runWorkflow: async (workflowId: string): Promise<any> => {
        const response = await apiClient.post(`/metrics/run-workflow/${workflowId}`);
        return response.data;
    }
};

// Analysis & ML (Public/Mixed endpoints)
export async function analyzeWorkflow(text: string, files?: File[]) {
    if (files && files.length > 0) {
        const formData = new FormData();
        formData.append('description', text);
        formData.append('workflow_type', 'generic');
        files.forEach(file => {
            formData.append('files', file);
        });

        const response = await apiClient.post('/analyze/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    }

    const response = await apiClient.post('/analyze', {
        description: text,
        workflow_type: "generic",
    });
    return response.data;
}

export interface PredictionParams {
    description: string
    agent_count: number
    step_count: number
    historical_avg_time?: number
    confidence_scores?: number[]
}

export async function predictWorkflow(params: PredictionParams) {
    const response = await apiClient.post('/ml/predict', {
        description: params.description,
        agent_count: params.agent_count,
        step_count: params.step_count,
        historical_avg_time: params.historical_avg_time || 2.0,
        confidence_scores: params.confidence_scores || [0.9],
        workflow_age_days: 30,
        agent_performance_avg: 0.85
    });
    return response.data;
}
