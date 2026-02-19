from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class WorkflowStep(BaseModel):
    id: str
    description: str
    actor: str
    inputs: List[str] = []
    outputs: List[str] = []
    estimated_time: Optional[str] = None

class DecisionPoint(BaseModel):
    id: str
    condition: str
    true_next_step_id: str
    false_next_step_id: str

class AgentSuggestion(BaseModel):
    role: str
    description: str
    suggested_model: str
    confidence_score: float
    triggers: List[str] = []

class AgentBlueprint(BaseModel):
    agent_id: str
    name: str
    role: str
    system_prompt: str
    tools: List[str] = []
    inputs: Dict[str, Any] = {}
    outputs: Dict[str, Any] = {}
    
    # New fields for detailed dynamic analysis
    rationale: Optional[str] = None  # Why is this agent needed?
    efficiency_gain: Optional[str] = None  # Before vs After comparison
    model: Optional[str] = "gpt-4"
    
    # Deep Dive Data (for Modal)
    internal_flow: List[Dict[str, str]] = []  # e.g., [{"id": "1", "label": "Fetch Email", "type": "trigger"}]
    dependencies: List[Dict[str, str]] = []   # e.g., [{"name": "SAP", "status": "Connected"}]
    performance_metric: int = 95
    executions_count: int = 1200

class WorkflowAnalysisResult(BaseModel):
    workflow_steps: List[WorkflowStep] = []
    decision_points: List[DecisionPoint] = []
    actors: List[str] = []
    legacy_flowchart_json: Dict[str, Any] = {}
    
    agent_suggestions: List[AgentSuggestion] = []
    agent_blueprints: List[AgentBlueprint] = []
    agent_graph: Dict[str, Any] = {}
    
    automated_percentage: float = 0.0
    time_saving_estimate: str = ""
    scalability_score: int = 0
    
    model_suggestions: List[str] = []
    model_monitoring_plan: Dict[str, Any] = {}
    explainability_notes: str = ""
    security_requirements: Dict[str, Any] = {}
    
    final_agentic_architecture_json: Dict[str, Any] = {}

class WorkflowInput(BaseModel):
    description: Optional[str] = None
    text_content: Optional[str] = None
    file_url: Optional[str] = None
    workflow_type: str = "generic"
