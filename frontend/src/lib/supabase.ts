import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    email: string
                    full_name: string | null
                    created_at: string
                    updated_at: string
                }
            }
            workflows: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    description: string | null
                    status: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    name: string
                    description?: string | null
                    status?: string
                }
            }
            agents: {
                Row: {
                    id: string
                    workflow_id: string
                    role: string
                    description: string | null
                    status: string
                    confidence_score: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    workflow_id: string
                    role: string
                    description?: string | null
                    status?: string
                    confidence_score?: number
                }
            }
            workflow_steps: {
                Row: {
                    id: string
                    workflow_id: string
                    step_order: number
                    description: string
                    actor: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    workflow_id: string
                    step_order: number
                    description: string
                    actor?: string | null
                }
            }
            metrics: {
                Row: {
                    id: string
                    workflow_id: string
                    automation_rate: number | null
                    time_saved: string | null
                    recorded_at: string
                }
                Insert: {
                    id?: string
                    workflow_id: string
                    automation_rate?: number | null
                    time_saved?: string | null
                }
            }
        }
    }
}
