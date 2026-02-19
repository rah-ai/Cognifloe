from typing import List, Optional, Dict, Any
from backend.database.supabase_client import get_supabase_client
from datetime import datetime

class WorkflowService:
    """Service for managing workflows in Supabase"""
    
    def __init__(self):
        self.client = get_supabase_client()
    
    async def create_workflow(
        self,
        user_id: str,
        name: str,
        description: Optional[str] = None,
        status: str = "Active"
    ) -> Dict[str, Any]:
        """Create a new workflow"""
        try:
            result = self.client.table("workflows").insert({
                "user_id": user_id,
                "name": name,
                "description": description,
                "status": status
            }).execute()
            
            return result.data[0] if result.data else None
        except Exception as e:
            print(f"Error creating workflow: {e}")
            raise
    
    async def get_user_workflows(self, user_id: str) -> List[Dict[str, Any]]:
        """Get all workflows for a user"""
        try:
            result = self.client.table("workflows")\
                .select("*, agents(*), workflow_steps(*), metrics(*)")\
                .eq("user_id", user_id)\
                .order("created_at", desc=True)\
                .execute()
            
            return result.data if result.data else []
        except Exception as e:
            print(f"Error fetching workflows: {e}")
            return []
    
    async def get_workflow_by_id(self, workflow_id: str, user_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific workflow with all related data"""
        try:
            result = self.client.table("workflows")\
                .select("*, agents(*), workflow_steps(*), metrics(*)")\
                .eq("id", workflow_id)\
                .eq("user_id", user_id)\
                .single()\
                .execute()
            
            return result.data if result.data else None
        except Exception as e:
            print(f"Error fetching workflow: {e}")
            return None
    
    async def update_workflow(
        self,
        workflow_id: str,
        user_id: str,
        updates: Dict[str, Any]
    ) -> Optional[Dict[str, Any]]:
        """Update a workflow"""
        try:
            result = self.client.table("workflows")\
                .update(updates)\
                .eq("id", workflow_id)\
                .eq("user_id", user_id)\
                .execute()
            
            return result.data[0] if result.data else None
        except Exception as e:
            print(f"Error updating workflow: {e}")
            raise
    
    async def delete_workflow(self, workflow_id: str, user_id: str) -> bool:
        """Delete a workflow"""
        try:
            self.client.table("workflows")\
                .delete()\
                .eq("id", workflow_id)\
                .eq("user_id", user_id)\
                .execute()
            
            return True
        except Exception as e:
            print(f"Error deleting workflow: {e}")
            return False
    
    async def add_agent(
        self,
        workflow_id: str,
        role: str,
        description: Optional[str] = None,
        status: str = "Idle",
        confidence_score: float = 0.0
    ) -> Dict[str, Any]:
        """Add an agent to a workflow"""
        try:
            result = self.client.table("agents").insert({
                "workflow_id": workflow_id,
                "role": role,
                "description": description,
                "status": status,
                "confidence_score": confidence_score
            }).execute()
            
            return result.data[0] if result.data else None
        except Exception as e:
            print(f"Error adding agent: {e}")
            raise
    
    async def update_agent_status(
        self,
        agent_id: str,
        status: str
    ) -> Optional[Dict[str, Any]]:
        """Update agent status"""
        try:
            result = self.client.table("agents")\
                .update({"status": status})\
                .eq("id", agent_id)\
                .execute()
            
            return result.data[0] if result.data else None
        except Exception as e:
            print(f"Error updating agent status: {e}")
            raise
    
    async def add_workflow_steps(
        self,
        workflow_id: str,
        steps: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """Add multiple steps to a workflow"""
        try:
            steps_data = [
                {
                    "workflow_id": workflow_id,
                    "step_order": i + 1,
                    "description": step.get("description", ""),
                    "actor": step.get("actor")
                }
                for i, step in enumerate(steps)
            ]
            
            result = self.client.table("workflow_steps")\
                .insert(steps_data)\
                .execute()
            
            return result.data if result.data else []
        except Exception as e:
            print(f"Error adding workflow steps: {e}")
            raise
    
    async def record_metrics(
        self,
        workflow_id: str,
        automation_rate: Optional[int] = None,
        time_saved: Optional[str] = None
    ) -> Dict[str, Any]:
        """Record metrics for a workflow"""
        try:
            result = self.client.table("metrics").insert({
                "workflow_id": workflow_id,
                "automation_rate": automation_rate,
                "time_saved": time_saved
            }).execute()
            
            return result.data[0] if result.data else None
        except Exception as e:
            print(f"Error recording metrics: {e}")
            raise
    
    async def get_user_metrics(self, user_id: str) -> Dict[str, Any]:
        """Get aggregated metrics for a user"""
        try:
            # Get all user workflows
            workflows = await self.get_user_workflows(user_id)
            
            total_workflows = len(workflows)
            active_agents = 0
            total_automation = 0
            
            for workflow in workflows:
                if workflow.get("agents"):
                    active_agents += len([
                        a for a in workflow["agents"]
                        if a.get("status") in ["Active", "Deploying"]
                    ])
                
                if workflow.get("metrics") and workflow["metrics"]:
                    metrics = workflow["metrics"]
                    if metrics and len(metrics) > 0:
                        latest_metric = metrics[-1]
                        if latest_metric.get("automation_rate"):
                            total_automation += latest_metric["automation_rate"]
            
            avg_automation = total_automation // total_workflows if total_workflows > 0 else 0
            
            return {
                "totalWorkflows": total_workflows,
                "activeAgents": active_agents,
                "avgAutomation": avg_automation
            }
        except Exception as e:
            print(f"Error getting user metrics: {e}")
            return {
                "totalWorkflows": 0,
                "activeAgents": 0,
                "avgAutomation": 0
            }

# Create singleton instance
workflow_service = WorkflowService()
