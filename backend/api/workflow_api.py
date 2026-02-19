from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from backend.services.workflow_service import workflow_service
from backend.api.auth import get_current_user

router = APIRouter()

class WorkflowCreate(BaseModel):
    name: str
    description: Optional[str] = None
    steps: List[Dict[str, Any]] = []
    agents: List[Dict[str, Any]] = []
    metrics: Optional[Dict[str, Any]] = None

class WorkflowUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

class AgentCreate(BaseModel):
    workflow_id: str
    role: str
    description: Optional[str] = None
    confidence_score: float = 0.95

@router.post("/workflows", status_code=status.HTTP_201_CREATED)
async def create_workflow(
    workflow: WorkflowCreate,
    user_id: str = Depends(get_current_user)
):
    """Create a new workflow"""
    try:
        # Create workflow
        new_workflow = await workflow_service.create_workflow(
            user_id=user_id,
            name=workflow.name,
            description=workflow.description
        )
        
        if not new_workflow:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create workflow"
            )
        
        workflow_id = new_workflow["id"]
        
        # Add steps if provided
        if workflow.steps:
            await workflow_service.add_workflow_steps(workflow_id, workflow.steps)
        
        # Add agents if provided
        for agent_data in workflow.agents:
            await workflow_service.add_agent(
                workflow_id=workflow_id,
                role=agent_data.get("role", ""),
                description=agent_data.get("description"),
                status=agent_data.get("status", "Idle"),
                confidence_score=agent_data.get("confidence_score", 0.95)
            )
        
        # Record metrics if provided
        if workflow.metrics:
            await workflow_service.record_metrics(
                workflow_id=workflow_id,
                automation_rate=workflow.metrics.get("automation_rate"),
                time_saved=workflow.metrics.get("time_saved")
            )
        
        # Get complete workflow with all relations
        complete_workflow = await workflow_service.get_workflow_by_id(workflow_id, user_id)
        
        return complete_workflow
    
    except Exception as e:
        print(f"Error creating workflow: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/workflows")
async def get_workflows(user_id: str = Depends(get_current_user)):
    """Get all workflows for the current user"""
    try:
        workflows = await workflow_service.get_user_workflows(user_id)
        return workflows
    except Exception as e:
        print(f"Error fetching workflows: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/workflows/{workflow_id}")
async def get_workflow(
    workflow_id: str,
    user_id: str = Depends(get_current_user)
):
    """Get a specific workflow"""
    try:
        workflow = await workflow_service.get_workflow_by_id(workflow_id, user_id)
        
        if not workflow:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Workflow not found"
            )
        
        return workflow
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching workflow: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.put("/workflows/{workflow_id}")
async def update_workflow(
    workflow_id: str,
    workflow: WorkflowUpdate,
    user_id: str = Depends(get_current_user)
):
    """Update a workflow"""
    try:
        updates = workflow.dict(exclude_unset=True)
        
        if not updates:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No update data provided"
            )
        
        updated_workflow = await workflow_service.update_workflow(
            workflow_id=workflow_id,
            user_id=user_id,
            updates=updates
        )
        
        if not updated_workflow:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Workflow not found"
            )
        
        return updated_workflow
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating workflow: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.delete("/workflows/{workflow_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_workflow(
    workflow_id: str,
    user_id: str = Depends(get_current_user)
):
    """Delete a workflow"""
    try:
        success = await workflow_service.delete_workflow(workflow_id, user_id)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Workflow not found"
            )
        
        return None
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting workflow: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/workflows/{workflow_id}/agents")
async def add_agent_to_workflow(
    workflow_id: str,
    agent: AgentCreate,
    user_id: str = Depends(get_current_user)
):
    """Add an agent to a workflow"""
    try:
        # Verify workflow belongs to user
        workflow = await workflow_service.get_workflow_by_id(workflow_id, user_id)
        if not workflow:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Workflow not found"
            )
        
        new_agent = await workflow_service.add_agent(
            workflow_id=workflow_id,
            role=agent.role,
            description=agent.description,
            confidence_score=agent.confidence_score
        )
        
        return new_agent
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error adding agent: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.patch("/agents/{agent_id}/deploy")
async def deploy_agent(
    agent_id: str,
    user_id: str = Depends(get_current_user)
):
    """Deploy an agent (change status to Active)"""
    try:
        updated_agent = await workflow_service.update_agent_status(
            agent_id=agent_id,
            status="Active"
        )
        
        if not updated_agent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Agent not found"
            )
        
        return updated_agent
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deploying agent: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/metrics")
async def get_user_metrics(user_id: str = Depends(get_current_user)):
    """Get aggregated metrics for the current user"""
    try:
        metrics = await workflow_service.get_user_metrics(user_id)
        return metrics
    except Exception as e:
        print(f"Error fetching metrics: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
