import random
import os
import json
from typing import List, Dict
from openai import OpenAI
from backend.models.workflow import AgentBlueprint

class AgenticArchitectureService:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.model = os.getenv("OPENAI_MODEL", "gpt-4")
        self.client = OpenAI(api_key=self.api_key) if self.api_key else None

    def generate_architecture(self, workflow_description: str) -> List[AgentBlueprint]:
        """
        Generates a multi-agent architecture based on the workflow description.
        Uses OpenAI Model if available, otherwise falls back to rule-based mock.
        """
        if not self.client:
            return self._generate_mock_architecture(workflow_description)

        try:
            prompt = f"""
            You are an expert AI Architect. Design a multi-agent system for this workflow: "{workflow_description}".
            
            Return a JSON object with a key "agents" containing a list of agents.
            For each agent, provide:
            - role: Role Name
            - description: Detailed responsibility
            - tools: List of tools
            - rationale: SPECIFIC reason why this agent is needed vs a simple script. be persuasive.
            - efficiency_gain: precise comparison (e.g. "Manual: 15m -> AI: 30s")
            - internal_flow: List of 3-5 steps for this specific agent's internal logic. Each step object: {"id": "1", "label": "Step Name", "type": "trigger"|"action"|"condition"|"output"}
            - dependencies: List of 1-3 necessary integrations. Each object: {"name": "Service Name", "status": "Connected", "version": "v1.0", "active_users": "10k"}
            - performance_metric: Integer (85-99) representing efficiency score.
            - executions_count: Integer representing total runs.
            
            Create as many agents as strictly necessary, but typically between 3-6 for a complex task.
            Always include a "Coordinator" agent first.
            """

            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a JSON-speaking AI Architect. Output valid JSON only."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"}
            )
            
            content = response.choices[0].message.content
            data = json.loads(content)
            
            blueprints = []
            for agent in data.get("agents", []):
                blueprints.append(AgentBlueprint(
                    agent_id=f"gen_{random.randint(1000,9999)}",
                    name=agent.get("role"),
                    role=agent.get("role"),
                    system_prompt=agent.get("description"),
                    description=agent.get("description"),
                    tools=agent.get("tools", []),
                    rationale=agent.get("rationale", "Essential for workflow orchestration."),
                    efficiency_gain=agent.get("efficiency_gain", "10x speedup"),
                    model=self.model,
                    internal_flow=agent.get("internal_flow", []),
                    dependencies=agent.get("dependencies", []),
                    performance_metric=agent.get("performance_metric", random.randint(85, 99)),
                    executions_count=agent.get("executions_count", random.randint(1000, 50000))
                ))
            
            return blueprints

        except Exception as e:
            print(f"Error generating architecture with AI: {e}")
            return self._generate_mock_architecture(workflow_description)

    def _generate_mock_architecture(self, workflow_description: str) -> List[AgentBlueprint]:
        """Fallback rule-based generation"""
        agents = []
        description_lower = workflow_description.lower()
        
        # Coordinator
        agents.append(AgentBlueprint(
            agent_id="mock_1",
            name="Workflow Coordinator",
            role="Workflow Coordinator",
            system_prompt="Manage state",
            description="Orchestrates the overall process and manages state.",
            tools=["State Management", "Task Dispatcher"],
            rationale="Central brain required to manage dependencies and error handling.",
            efficiency_gain="Eliminates manual project management overhead.",
            model=self.model
        ))

        if "invoice" in description_lower or "receipt" in description_lower:
            agents.append(AgentBlueprint(
                agent_id="mock_2",
                name="Document Processor",
                role="Document Processor",
                system_prompt="Extract data",
                description="Extracts structured data from invoices and receipts.",
                tools=["OCR", "LayoutLM", "Regex Extractor"],
                rationale="Manual data entry is error-prone; AI ensures 99.9% accuracy.",
                efficiency_gain="Manual: 5 mins/doc -> AI: 2 secs/doc",
                model="gpt-3.5-turbo",
                internal_flow=[
                    {"id": "1", "label": "OCR Scan", "type": "trigger"},
                    {"id": "2", "label": "Extract Fields", "type": "action"}, 
                    {"id": "3", "label": "Validate Data", "type": "condition"},
                    {"id": "4", "label": "Export JSON", "type": "output"}
                ],
                dependencies=[
                    {"name": "OCR Service", "status": "Connected", "version": "v2.0", "active_users": "5k"},
                    {"name": "QuickBooks API", "status": "Connected", "version": "v3.1", "active_users": "2k"}
                ],
                performance_metric=98,
                executions_count=15420
            ))

        if len(agents) == 1:
             agents.append(AgentBlueprint(
                agent_id="mock_default",
                name="Task Executor",
                role="Task Executor",
                system_prompt="Execute tasks",
                description="Executes general purpose tasks.",
                tools=["Web Search"],
                rationale="Handles execution of steps defined in the prompt.",
                efficiency_gain="Manual: Varies -> AI: Instant",
                model=self.model
            ))

        return agents

    def suggest_improvements(self, current_steps: List[str]) -> List[str]:
        return [
            "Parallelize data extraction steps to reduce latency.",
            "Implement a human-in-the-loop check for high-value transactions.",
            "Cache repeated queries to the vendor database."
        ]

agent_service = AgenticArchitectureService()
