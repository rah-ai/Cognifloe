-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can view own workflows" ON workflows;
DROP POLICY IF EXISTS "Users can insert own workflows" ON workflows;
DROP POLICY IF EXISTS "Users can update own workflows" ON workflows;
DROP POLICY IF EXISTS "Users can delete own workflows" ON workflows;
DROP POLICY IF EXISTS "Users can view own agents" ON agents;
DROP POLICY IF EXISTS "Users can manage own agents" ON agents;
DROP POLICY IF EXISTS "Users can view own workflow steps" ON workflow_steps;
DROP POLICY IF EXISTS "Users can manage own workflow steps" ON workflow_steps;
DROP POLICY IF EXISTS "Users can view own metrics" ON metrics;
DROP POLICY IF EXISTS "Users can insert own metrics" ON metrics;

-- CogniFloe Database Schema for Supabase PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workflows Table
CREATE TABLE IF NOT EXISTS workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agents Table
CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'Idle',
  confidence_score FLOAT DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workflow Steps Table
CREATE TABLE IF NOT EXISTS workflow_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
  step_order INT NOT NULL,
  description TEXT NOT NULL,
  actor TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Metrics Table
CREATE TABLE IF NOT EXISTS metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
  automation_rate INT,
  time_saved TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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
CREATE INDEX IF NOT EXISTS idx_workflows_user_id ON workflows(user_id);
CREATE INDEX IF NOT EXISTS idx_agents_workflow_id ON agents(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_steps_workflow_id ON workflow_steps(workflow_id);
CREATE INDEX IF NOT EXISTS idx_metrics_workflow_id ON metrics(workflow_id);
CREATE INDEX IF NOT EXISTS idx_exec_logs_user_id ON execution_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_exec_logs_executed_at ON execution_logs(executed_at);
CREATE INDEX IF NOT EXISTS idx_exec_logs_workflow_id ON execution_logs(workflow_id);

-- Row Level Security (RLS) Policies

-- Users RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Workflows RLS
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own workflows" ON workflows
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workflows" ON workflows
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workflows" ON workflows
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workflows" ON workflows
  FOR DELETE USING (auth.uid() = user_id);

-- Agents RLS
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own agents" ON agents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM workflows
      WHERE workflows.id = agents.workflow_id
      AND workflows.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own agents" ON agents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM workflows
      WHERE workflows.id = agents.workflow_id
      AND workflows.user_id = auth.uid()
    )
  );

-- Workflow Steps RLS
ALTER TABLE workflow_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own workflow steps" ON workflow_steps
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM workflows
      WHERE workflows.id = workflow_steps.workflow_id
      AND workflows.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own workflow steps" ON workflow_steps
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM workflows
      WHERE workflows.id = workflow_steps.workflow_id
      AND workflows.user_id = auth.uid()
    )
  );

-- Metrics RLS
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own metrics" ON metrics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM workflows
      WHERE workflows.id = metrics.workflow_id
      AND workflows.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own metrics" ON metrics
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM workflows
      WHERE workflows.id = metrics.workflow_id
      AND workflows.user_id = auth.uid()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_workflows_updated_at ON workflows;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflows_updated_at
  BEFORE UPDATE ON workflows
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
