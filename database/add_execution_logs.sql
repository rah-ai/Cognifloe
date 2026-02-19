-- Migration: Add execution_logs table for real metrics tracking
-- Run this in Supabase SQL Editor

-- Execution Logs Table (for real-time metrics tracking)
CREATE TABLE IF NOT EXISTS execution_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  latency_ms INTEGER NOT NULL DEFAULT 0,
  success BOOLEAN NOT NULL DEFAULT TRUE,
  cost_usd DECIMAL(10, 4) DEFAULT 0.0,
  error_message TEXT,
  agent_role TEXT
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_exec_logs_user_id ON execution_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_exec_logs_executed_at ON execution_logs(executed_at);
CREATE INDEX IF NOT EXISTS idx_exec_logs_workflow_id ON execution_logs(workflow_id);

-- RLS Policy for execution_logs
ALTER TABLE execution_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own execution logs" ON execution_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own execution logs" ON execution_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Also allow service role (backend) to insert logs
CREATE POLICY "Service can manage execution logs" ON execution_logs
  FOR ALL USING (true)
  WITH CHECK (true);
