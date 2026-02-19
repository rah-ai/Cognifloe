"""
Workflow Analysis API Endpoints
Provides AI-powered analysis for workflows
"""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from backend.services.workflow_analyzer import workflow_analyzer
from backend.api.auth import get_current_user
from backend.database.supabase_client import get_supabase_client

router = APIRouter()

class AnalysisRequest(BaseModel):
    workflow_id: str
    workflow_description: str
    workflow_steps: Optional[List[str]] = []

class AnalysisResponse(BaseModel):
    workflow_id: str
    analysis: Dict[str, Any]
    generated_at: str

@router.post("/analyze", response_model=AnalysisResponse, status_code=status.HTTP_200_OK)
async def analyze_workflow(
    request: AnalysisRequest,
    user_id: str = Depends(get_current_user)
):
    """
    Perform comprehensive AI analysis on a workflow
    
    Returns:
        - Complexity analysis
        - Bottleneck detection
        - Optimization suggestions
        - Cost-benefit estimates
        - Risk assessment
        - Overall health score
    """
    try:
        # Perform AI analysis
        analysis_results = workflow_analyzer.analyze_workflow(
            workflow_description=request.workflow_description,
            workflow_steps=request.workflow_steps
        )
        
        # Store analysis results in database (optional)
        supabase = get_supabase_client()
        
        # You could store this in a new 'workflow_analyses' table
        # For now, we'll just return it
        
        return AnalysisResponse(
            workflow_id=request.workflow_id,
            analysis=analysis_results,
            generated_at=analysis_results['analyzed_at']
        )
    
    except Exception as e:
        import traceback
        print(f"Analysis error: {e}")
        print(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis failed: {str(e)}"
        )

@router.get("/workflows/{workflow_id}/insights")
async def get_workflow_insights(
    workflow_id: str,
    user_id: str = Depends(get_current_user)
):
    """Get cached insights for a workflow"""
    # TODO: Retrieve from database if we store analyses
    return {
        "message": "Insights endpoint - coming soon",
        "workflow_id": workflow_id
    }
