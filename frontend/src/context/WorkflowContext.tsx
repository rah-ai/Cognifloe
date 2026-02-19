import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Workflow } from '../lib/api';
import { workflowApi } from '../lib/api';

interface WorkflowContextType {
    workflows: Workflow[];
    isLoading: boolean;
    error: string | null;
    addWorkflow: (workflow: any) => Promise<void>;
    addAgentToWorkflow: (workflowId: string, agent: any) => void;
    removeAgentFromWorkflow: (workflowId: string, agentId: string) => void;
    deployAgent: (workflowId: string, agentRole: string) => Promise<void>;
    runWorkflow: (workflowId: string) => Promise<{ success: boolean; message: string }>;
    getMetrics: () => { totalWorkflows: number; activeAgents: number; avgAutomation: number };
    refreshWorkflows: () => Promise<void>;
    clearUserData: () => void;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

// Helper to get user ID from JWT token
function getUserIdFromToken(): string | null {
    try {
        const token = localStorage.getItem('token');
        if (!token) return null;

        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.sub || null;
    } catch {
        return null;
    }
}

// Get user-specific storage key
function getStorageKey(userId: string | null): string {
    return userId ? `cognifloe_workflows_${userId}` : 'cognifloe_workflows_guest';
}

// Get workflows for current user from localStorage
function getStoredWorkflows(userId: string | null): Workflow[] {
    try {
        const key = getStorageKey(userId);
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

// Save workflows for current user to localStorage
function saveWorkflows(userId: string | null, workflows: Workflow[]) {
    try {
        const key = getStorageKey(userId);
        localStorage.setItem(key, JSON.stringify(workflows));
    } catch (err) {
        console.error('Failed to save workflows to localStorage:', err);
    }
}

export function WorkflowProvider({ children }: { children: ReactNode }) {
    const [currentUserId, setCurrentUserId] = useState<string | null>(() => getUserIdFromToken());
    const [workflows, setWorkflows] = useState<Workflow[]>(() => getStoredWorkflows(getUserIdFromToken()));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Check for user changes (login/logout)
    useEffect(() => {
        const checkUserChange = () => {
            const newUserId = getUserIdFromToken();
            if (newUserId !== currentUserId) {
                console.log('User changed:', currentUserId, '->', newUserId);
                setCurrentUserId(newUserId);

                if (newUserId) {
                    // User logged in - load their workflows
                    const userWorkflows = getStoredWorkflows(newUserId);
                    setWorkflows(userWorkflows);
                } else {
                    // User logged out - clear state
                    setWorkflows([]);
                }
            }
        };

        // Check on mount
        checkUserChange();

        // Listen for storage changes (logout in another tab)
        window.addEventListener('storage', checkUserChange);

        // Check periodically for token changes
        const interval = setInterval(checkUserChange, 1000);

        return () => {
            window.removeEventListener('storage', checkUserChange);
            clearInterval(interval);
        };
    }, [currentUserId]);

    const refreshWorkflows = useCallback(async () => {
        const userId = getUserIdFromToken();

        try {
            // Only fetch if token exists
            if (!userId) {
                setWorkflows([]);
                return;
            }

            setIsLoading(true);
            const data = await workflowApi.getAll();

            if (data && data.length > 0) {
                setWorkflows(data);
                saveWorkflows(userId, data);
            } else {
                // No backend data, use local storage
                const localData = getStoredWorkflows(userId);
                setWorkflows(localData);
            }
            setError(null);
        } catch (err) {
            console.error("Failed to fetch workflows from backend, using local storage:", err);
            // Keep using local storage data
            const localData = getStoredWorkflows(userId);
            setWorkflows(localData);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initial fetch when user changes
    useEffect(() => {
        if (currentUserId) {
            refreshWorkflows();
        }
    }, [currentUserId, refreshWorkflows]);

    const clearUserData = useCallback(() => {
        // Clear current user's data from localStorage
        const userId = getUserIdFromToken();
        if (userId) {
            const key = getStorageKey(userId);
            localStorage.removeItem(key);
        }
        // Also clear guest data
        localStorage.removeItem('cognifloe_workflows_guest');
        // Clear state
        setWorkflows([]);
        setCurrentUserId(null);
    }, []);

    const addWorkflow = async (workflowData: any) => {
        const userId = getUserIdFromToken();

        // Create the workflow object with a generated ID for immediate display
        const localWorkflow = {
            ...workflowData,
            id: workflowData.id || Date.now().toString(),
            created_at: new Date().toISOString(),
            user_id: userId,
            date: 'Just now'
        };

        // Immediately add to state (optimistic update)
        setWorkflows(prev => {
            const updated = [localWorkflow, ...prev];
            // Persist to user-specific localStorage
            saveWorkflows(userId, updated);
            return updated;
        });

        try {
            setIsLoading(true);
            // Try to sync with backend
            const backendWorkflow = await workflowApi.create(workflowData);

            // Update with backend-generated ID if successful
            if (backendWorkflow && backendWorkflow.id) {
                setWorkflows(prev => {
                    const updated = prev.map(w =>
                        w.id === localWorkflow.id ? { ...w, ...backendWorkflow } : w
                    );
                    saveWorkflows(userId, updated);
                    return updated;
                });
            }
        } catch (err: any) {
            console.warn("Backend sync failed, using local storage:", err.message);
            // Workflow is already in local state, so UI still works
        } finally {
            setIsLoading(false);
        }
    };

    const addAgentToWorkflow = useCallback((workflowId: string, agent: any) => {
        const userId = getUserIdFromToken();

        // Generate agent ID if not provided
        const agentWithId = {
            ...agent,
            id: agent.id || `agent-${Date.now()}`,
            status: agent.status || 'Pending',
            created_at: new Date().toISOString()
        };

        setWorkflows(prev => {
            const updated = prev.map(wf => {
                if (wf.id === workflowId) {
                    return {
                        ...wf,
                        agents: [...(wf.agents || []), agentWithId]
                    };
                }
                return wf;
            });
            saveWorkflows(userId, updated);
            return updated;
        });
    }, []);

    const removeAgentFromWorkflow = useCallback((workflowId: string, agentId: string) => {
        const userId = getUserIdFromToken();

        setWorkflows(prev => {
            const updated = prev.map(wf => {
                if (wf.id === workflowId) {
                    return {
                        ...wf,
                        agents: (wf.agents || []).filter((a: any, index: number) => {
                            // Match by ID if it exists
                            if (a.id) return a.id !== agentId;
                            // Fallback: Check if the passed agentId matches the synthetic ID pattern used in UI
                            // Pattern: agent-{workflowId}-{index} or agent-{index}
                            const syntheticId = `agent-${wf.id}-${index}`;
                            const simpleSyntheticId = `agent-${index}`; // Just in case
                            return syntheticId !== agentId && simpleSyntheticId !== agentId;
                        })
                    };
                }
                return wf;
            });
            saveWorkflows(userId, updated);
            return updated;
        });
    }, []);

    const deployAgent = async (workflowId: string, agentRole: string) => {
        try {
            // Find component agent ID
            const workflow = workflows.find(w => w.id === workflowId);
            if (!workflow) return;

            const agent = workflow.agents.find((a: any) => a.role === agentRole);
            if (agent && agent.id) {
                await workflowApi.deployAgent(agent.id);
                // Refresh to get updated status
                await refreshWorkflows();
            }
        } catch (err: any) {
            console.error("Deploy failed", err);
            setError("Failed to deploy agent");
        }
    };

    const runWorkflow = async (workflowId: string): Promise<{ success: boolean; message: string }> => {
        try {
            const result = await workflowApi.runWorkflow(workflowId);
            return {
                success: true,
                message: result.message || `Logged ${result.executions_logged} executions`
            };
        } catch (err: any) {
            console.error("Run workflow failed", err);
            return {
                success: false,
                message: err.message || "Failed to run workflow"
            };
        }
    };

    const getMetrics = () => {
        const totalWorkflows = workflows.length;
        // logic to sum active agents
        const activeAgents = workflows.reduce((acc, wf) =>
            acc + (wf.agents?.filter((a: any) => a.status === 'Active').length || 0), 0);

        // logic for automation rate
        const avgAutomation = Math.round(
            workflows.reduce((acc, wf) => acc + (wf.metrics?.automation_rate || 0), 0) / (totalWorkflows || 1)
        );

        return { totalWorkflows, activeAgents, avgAutomation };
    };

    return (
        <WorkflowContext.Provider value={{
            workflows,
            isLoading,
            error,
            addWorkflow,
            addAgentToWorkflow,
            removeAgentFromWorkflow,
            deployAgent,
            runWorkflow,
            getMetrics,
            refreshWorkflows,
            clearUserData
        }}>
            {children}
        </WorkflowContext.Provider>
    );
}

export function useWorkflow() {
    const context = useContext(WorkflowContext);
    if (context === undefined) {
        throw new Error('useWorkflow must be used within a WorkflowProvider');
    }
    return context;
}
