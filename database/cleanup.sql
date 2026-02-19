-- CLEANUP SCRIPT - Run this FIRST to drop everything

-- Drop all policies
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

-- Drop triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_workflows_updated_at ON workflows;

-- Drop tables (CASCADE will drop all dependent objects)
DROP TABLE IF EXISTS metrics CASCADE;
DROP TABLE IF EXISTS workflow_steps CASCADE;
DROP TABLE IF EXISTS agents CASCADE;
DROP TABLE IF EXISTS workflows CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop function
DROP FUNCTION IF EXISTS update_updated_at_column();
