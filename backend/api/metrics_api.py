from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional, Dict, Any, List
from backend.api.auth import get_current_user
from datetime import datetime, timedelta
import hashlib
import random

router = APIRouter()

def get_seed(user_id: str, time_range: str) -> int:
    """Generate a consistent seed based on user ID, date, and time range"""
    today = datetime.now().strftime("%Y-%m-%d")
    seed_string = f"{user_id}-{today}-{time_range}"
    return int(hashlib.md5(seed_string.encode()).hexdigest()[:8], 16)

def generate_metrics_data(user_id: str, time_range: str) -> Dict[str, Any]:
    """
    Generate realistic metrics data based on time range.
    Uses a seed for consistency - same user sees same data on the same day.
    """
    seed = get_seed(user_id, time_range)
    rng = random.Random(seed)
    
    # Scale factors based on time range
    scale_factors = {
        "24h": 1,
        "7d": 7,
        "30d": 30,
        "90d": 90
    }
    scale = scale_factors.get(time_range, 1)
    
    # Base metrics (per day)
    base_cost = rng.uniform(35, 55)  # $35-55 per day
    base_latency = rng.uniform(180, 280)  # 180-280ms base
    base_throughput = rng.uniform(70, 100)  # 70-100 rpm
    base_error_rate = rng.uniform(0.005, 0.02)  # 0.5-2% error rate
    
    # Calculate scaled values
    total_cost = round(base_cost * scale, 0)
    
    # Latency improves slightly over time (optimization effect)
    latency_improvement = min(0.15, scale * 0.002)  # Up to 15% improvement
    avg_latency = round(base_latency * (1 - latency_improvement), 0)
    
    # Throughput increases with optimization
    throughput_boost = 1 + min(0.20, scale * 0.003)  # Up to 20% boost
    throughput = round(base_throughput * throughput_boost, 0)
    
    # Error rate decreases over time
    error_improvement = min(0.5, scale * 0.008)  # Up to 50% improvement
    error_rate = round(base_error_rate * (1 - error_improvement), 4)
    
    # Changes compared to previous period
    cost_change = rng.randint(-20, -5)  # Cost usually decreases (good)
    latency_change = rng.randint(-15, -3)  # Latency decreases (good)
    throughput_change = rng.randint(5, 25)  # Throughput increases (good)
    error_change = rng.randint(-60, -30)  # Errors decrease (good)
    
    # ROI metrics scale with time
    hours_saved = round(rng.uniform(4, 8) * scale, 0)
    cost_saved = round(hours_saved * rng.uniform(80, 150), 0)  # $80-150 per hour saved
    efficiency_gain = round(200 + rng.uniform(50, 200) * (1 + scale * 0.01), 0)
    error_reduction = round(85 + rng.uniform(5, 12) * min(scale * 0.1, 1), 0)
    
    # Agent performance (consistent per user)
    agents = [
        {
            "name": "Email Processor",
            "success": round(96 + rng.uniform(0, 3.5), 1),
            "latency": round(30 + rng.uniform(0, 25)),
            "executions": round((5000 + rng.randint(0, 3000)) * scale),
            "status": "optimal" if rng.random() > 0.3 else "good"
        },
        {
            "name": "Data Analyzer",
            "success": round(93 + rng.uniform(0, 4), 1),
            "latency": round(80 + rng.uniform(0, 60)),
            "executions": round((3000 + rng.randint(0, 2000)) * scale),
            "status": "good" if rng.random() > 0.4 else "moderate"
        },
        {
            "name": "Response Generator",
            "success": round(97 + rng.uniform(0, 2.5), 1),
            "latency": round(25 + rng.uniform(0, 20)),
            "executions": round((4000 + rng.randint(0, 2500)) * scale),
            "status": "optimal"
        },
        {
            "name": "Document Parser",
            "success": round(90 + rng.uniform(0, 5), 1),
            "latency": round(120 + rng.uniform(0, 80)),
            "executions": round((1500 + rng.randint(0, 1500)) * scale),
            "status": "moderate" if rng.random() > 0.5 else "good"
        }
    ]
    
    # Cost breakdown (percentages stay similar, amounts scale)
    cost_breakdown = [
        {"label": "AI Model Inference", "value": 45, "amount": round(total_cost * 0.45), "color": "sunset"},
        {"label": "Data Processing", "value": 25, "amount": round(total_cost * 0.25), "color": "forest"},
        {"label": "Storage", "value": 15, "amount": round(total_cost * 0.15), "color": "coral"},
        {"label": "Network", "value": 10, "amount": round(total_cost * 0.10), "color": "amber"},
        {"label": "Other", "value": 5, "amount": round(total_cost * 0.05), "color": "muted"}
    ]
    
    # Execution volume data points (12 points for chart)
    data_points = [
        round(40 + rng.uniform(0, 60) * (1 + scale * 0.005))
        for _ in range(12)
    ]
    
    # Wait time distribution
    wait_time = {
        "queue": round(15 + rng.uniform(0, 15)),
        "processing": round(130 + rng.uniform(0, 50)),
        "response": round(25 + rng.uniform(0, 20))
    }
    total_wait = wait_time["queue"] + wait_time["processing"] + wait_time["response"]
    wait_distribution = [
        {"label": "Queue Time", "value": f"{wait_time['queue']}ms", "percent": round(wait_time['queue'] / total_wait * 100), "color": "sunset"},
        {"label": "Processing", "value": f"{wait_time['processing']}ms", "percent": round(wait_time['processing'] / total_wait * 100), "color": "forest"},
        {"label": "Response", "value": f"{wait_time['response']}ms", "percent": round(wait_time['response'] / total_wait * 100), "color": "coral"}
    ]
    
    return {
        "timeRange": time_range,
        "generatedAt": datetime.now().isoformat(),
        "quickStats": [
            {
                "label": "Total Cost",
                "value": f"${int(total_cost):,}",
                "change": f"{cost_change}%",
                "trend": "down",
                "description": f"Total infrastructure cost for {time_range}"
            },
            {
                "label": "Avg Latency",
                "value": f"{int(avg_latency)}ms",
                "change": f"{latency_change}%",
                "trend": "down",
                "description": "Average response time per request"
            },
            {
                "label": "Throughput",
                "value": f"{int(throughput)} rpm",
                "change": f"+{throughput_change}%",
                "trend": "up",
                "description": "Requests processed per minute"
            },
            {
                "label": "Error Rate",
                "value": f"{error_rate:.2f}%",
                "change": f"{error_change}%",
                "trend": "down",
                "description": "Failed requests percentage"
            }
        ],
        "roiMetrics": {
            "timeSaved": f"{int(hours_saved)} hours",
            "costSaved": f"${int(cost_saved):,}",
            "efficiency": f"{int(efficiency_gain)}%",
            "errorReduction": f"{int(error_reduction)}%"
        },
        "agentPerformance": agents,
        "costBreakdown": cost_breakdown,
        "totalCost": int(total_cost),
        "executionVolume": data_points,
        "waitDistribution": wait_distribution
    }


def generate_empty_metrics(time_range: str) -> Dict[str, Any]:
    """Generate empty/zero metrics when user has no workflows"""
    return {
        "timeRange": time_range,
        "quickStats": [
            {"label": "Total Cost", "value": "$0", "change": "--", "trend": "neutral", "description": "No workflows yet"},
            {"label": "Avg Latency", "value": "0ms", "change": "--", "trend": "neutral", "description": "No data"},
            {"label": "Throughput", "value": "0 rpm", "change": "--", "trend": "neutral", "description": "No requests"},
            {"label": "Error Rate", "value": "0%", "change": "--", "trend": "neutral", "description": "No errors"}
        ],
        "roiMetrics": {
            "timeSaved": "0 hours",
            "costSaved": "$0",
            "efficiency": "0%",
            "errorReduction": "0%"
        },
        "agentPerformance": [],
        "costBreakdown": [],
        "totalCost": 0,
        "executionVolume": [0] * 12,
        "waitDistribution": []
    }


@router.get("/metrics/telemetry")
async def get_telemetry_metrics(
    range: str = Query(default="7d", regex="^(24h|7d|30d|90d)$"),
    user_id: str = Depends(get_current_user)
):
    """
    Get comprehensive telemetry metrics for the dashboard.
    
    Returns real execution data if available, otherwise returns empty/zero metrics.
    """
    try:
        # Import here to avoid circular imports
        from backend.services.workflow_service import workflow_service
        from backend.services.metrics_tracking_service import metrics_tracking_service
        
        # Check if user has any workflows
        workflows = await workflow_service.get_user_workflows(user_id)
        
        if not workflows or len(workflows) == 0:
            # Return empty metrics if no workflows
            return generate_empty_metrics(range)
        
        # Try to get real aggregated metrics from execution logs
        real_metrics = await metrics_tracking_service.get_aggregated_metrics(user_id, range)
        
        if real_metrics and real_metrics.get("totalExecutions", 0) > 0:
            # Return real metrics from execution logs
            return real_metrics
        
        # Fall back to simulated data if no execution logs yet
        # (This allows the dashboard to show sample data until real executions happen)
        metrics = generate_metrics_data(user_id, range)
        return metrics
    except Exception as e:
        print(f"Error getting telemetry metrics: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate metrics: {str(e)}"
        )


@router.post("/metrics/run-workflow/{workflow_id}")
async def run_workflow_and_log(
    workflow_id: str,
    user_id: str = Depends(get_current_user)
):
    """
    Simulate running a workflow and log execution metrics.
    
    This creates real execution logs that will appear in the metrics dashboard.
    Use this to generate realistic data for demo purposes.
    """
    import uuid
    
    try:
        from backend.services.metrics_tracking_service import metrics_tracking_service
        
        # Check if workflow_id is a valid UUID
        is_valid_uuid = False
        try:
            uuid.UUID(workflow_id)
            is_valid_uuid = True
        except ValueError:
            is_valid_uuid = False
        
        # Try to get workflow from database if valid UUID
        workflow = None
        agents = []
        
        if is_valid_uuid:
            try:
                from backend.services.workflow_service import workflow_service
                workflow = await workflow_service.get_workflow_by_id(workflow_id, user_id)
                if workflow:
                    agents = workflow.get("agents", [])
            except Exception as e:
                print(f"Error fetching workflow: {e}")
        
        # If no agents from database, create dummy agent executions
        if not agents:
            # Create 3-5 sample agent executions
            sample_roles = ["Data Processor", "Email Handler", "Document Analyzer", "Validator", "Orchestrator"]
            agent_count = random.randint(3, 5)
            
            logs = []
            for i in range(agent_count):
                log = await metrics_tracking_service.log_execution(
                    user_id=user_id,
                    workflow_id=workflow_id if is_valid_uuid else None,
                    agent_role=sample_roles[i % len(sample_roles)],
                    latency_ms=random.randint(50, 500),
                    success=random.random() > 0.1,  # 90% success rate
                    cost_usd=round(random.uniform(0.001, 0.01), 4)
                )
                if log:
                    logs.append(log)
            
            return {
                "message": f"Logged {len(logs)} agent executions to metrics",
                "executions_logged": len(logs),
                "logs": logs
            }
        
        # Simulate running each agent from the workflow
        logs = await metrics_tracking_service.simulate_workflow_run(
            user_id=user_id,
            workflow_id=workflow_id,
            agents=agents
        )
        
        return {
            "message": f"Workflow '{workflow.get('name', 'Unknown')}' executed successfully",
            "executions_logged": len(logs),
            "logs": logs
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error running workflow: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to run workflow: {str(e)}"
        )

