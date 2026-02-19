from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api import workflow, auth, workflow_api, analysis_api, ml_api, metrics_api

app = FastAPI(
    title="CogniFloe API",
    description="AI-Powered Workflow Automation Platform with Advanced ML/DL Analysis",
    version="5.0.0"
)

# CORS - Allow frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "*",  # Allow Render deployed frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["authentication"])
app.include_router(workflow.router, prefix="/api/v1", tags=["workflows"])
app.include_router(workflow_api.router, prefix="/api/v1", tags=["workflow-management"])
app.include_router(analysis_api.router, prefix="/api/v1/analysis", tags=["ai-analysis"])
app.include_router(ml_api.router, prefix="/api/v1", tags=["machine-learning"])
app.include_router(metrics_api.router, prefix="/api/v1", tags=["metrics"])

@app.get("/")
async def root():
    return {
        "message": "CogniFloe API v5.0 - AI/ML Powered",
        "features": [
            "Workflow Automation",
            "AI Agent Deployment",
            "Real-time Analytics",
            "AI-Powered Deep Analysis",
            "Predictive Analytics (ML)",
            "Anomaly Detection (ML)",
            "Time Series Forecasting",
            "NLP Workflow Analysis",
            "Success Probability Prediction",
            "Intelligent Recommendations"
        ]
    }
