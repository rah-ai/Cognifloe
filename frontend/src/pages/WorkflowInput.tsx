import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, Mic, Sparkles, Bot, TrendingUp, CheckCircle2, Rocket, Brain, ArrowRight, Workflow, Shield, Info } from "lucide-react"
import { analyzeWorkflow } from "../lib/api"
import { useWorkflow } from "../context/WorkflowContext"
import { useNavigate } from "react-router-dom"
import { useVoiceInput } from "../hooks/useVoiceInput"
import { GlassCard } from "../components/ui/GlassCard"
import { Button3D } from "../components/ui/Button3D"
import { FileUploader } from "../components/ui/FileUploader"
import AgentDetailModal from "../components/dashboard/AgentDetailModal"

interface AgentSuggestion {
    role: string;
    description: string;
    rationale?: string;
    efficiency_gain?: string;
    internal_flow?: any[];
    dependencies?: any[];
    performance_metric?: number;
    executions_count?: number;
    capabilities?: string[];
    mlModels?: string[];
}

interface AnalysisResult {
    suggestedAgents: AgentSuggestion[];
    workflowSteps: string[];
    automationDetails: {
        totalSteps: number;
        automatedSteps: number;
        manualSteps: number;
        estimatedTimeSaved: string;
        accuracy: string;
    }
}

const AGENT_TEMPLATES: Record<string, AgentSuggestion> = {
    email: {
        role: "Email Processor Agent",
        description: "Intelligent email triage, classification, and response drafting with sentiment analysis.",
        rationale: "Handles high-volume email processing, eliminating manual sorting and reading time.",
        efficiency_gain: "Manual: 5min/email → AI: 2sec (150x faster)",
        capabilities: ["Email parsing", "Intent detection", "Priority classification", "Draft generation"],
        mlModels: ["GPT-4", "Custom NER Model"],
        performance_metric: 97,
        executions_count: 15420,
        internal_flow: [
            { id: "1", label: "Receive Email", type: "trigger" },
            { id: "2", label: "Parse Headers & Body", type: "action" },
            { id: "3", label: "Detect Intent", type: "action" },
            { id: "4", label: "Classify Priority", type: "condition" },
            { id: "5", label: "Generate Response", type: "output" }
        ],
        dependencies: [
            { name: "Email Gateway API", status: "Connected", version: "v3.2" },
            { name: "NLP Engine", status: "Connected", version: "v2.1" }
        ]
    },
    document: {
        role: "Document Intelligence Agent",
        description: "Extracts structured data from PDFs, images, and scanned documents with OCR and layout analysis.",
        rationale: "Automatically parses complex document layouts, eliminating manual data entry errors.",
        efficiency_gain: "Manual: 10min/doc → AI: 3sec (200x faster)",
        capabilities: ["OCR", "Table Extraction", "Key-Value Recognition", "Layout Analysis"],
        mlModels: ["LayoutLMv3", "Donut", "Tesseract"],
        performance_metric: 98,
        executions_count: 8760,
        internal_flow: [
            { id: "1", label: "Receive Document", type: "trigger" },
            { id: "2", label: "OCR Processing", type: "action" },
            { id: "3", label: "Layout Analysis", type: "action" },
            { id: "4", label: "Extract Fields", type: "action" },
            { id: "5", label: "Validate Data", type: "condition" },
            { id: "6", label: "Structured Output", type: "output" }
        ],
        dependencies: [
            { name: "OCR Engine", status: "Connected", version: "v4.0" },
            { name: "Document Parser", status: "Connected", version: "v2.5" }
        ]
    },
    data: {
        role: "Data Analyzer Agent",
        description: "Performs statistical analysis, pattern recognition, and generates insights from datasets.",
        rationale: "Performs complex pattern recognition that is error-prone and time-consuming for humans.",
        efficiency_gain: "Manual: 1h/batch → AI: 5sec (720x faster)",
        capabilities: ["Statistical Analysis", "Trend Detection", "Anomaly Detection", "Visualization"],
        mlModels: ["XGBoost", "Prophet", "Custom ML"],
        performance_metric: 95,
        executions_count: 12345,
        internal_flow: [
            { id: "1", label: "Receive Dataset", type: "trigger" },
            { id: "2", label: "Data Cleaning", type: "action" },
            { id: "3", label: "Statistical Analysis", type: "action" },
            { id: "4", label: "Pattern Detection", type: "action" },
            { id: "5", label: "Generate Insights", type: "output" }
        ],
        dependencies: [
            { name: "Analytics Engine", status: "Connected", version: "v3.0" },
            { name: "ML Pipeline", status: "Connected", version: "v2.2" }
        ]
    },
    api: {
        role: "API Orchestrator Agent",
        description: "Coordinates multiple API calls with rate limiting, error handling, and response aggregation.",
        rationale: "Manages complex API integrations with built-in retry logic and failover.",
        efficiency_gain: "Reduces integration errors by 95%",
        capabilities: ["API Chaining", "Rate Limiting", "Error Recovery", "Response Mapping"],
        mlModels: ["Latency Predictor"],
        performance_metric: 99,
        executions_count: 25600,
        internal_flow: [
            { id: "1", label: "Receive Request", type: "trigger" },
            { id: "2", label: "Rate Limit Check", type: "condition" },
            { id: "3", label: "Execute API Calls", type: "action" },
            { id: "4", label: "Handle Errors", type: "condition" },
            { id: "5", label: "Aggregate Response", type: "output" }
        ],
        dependencies: [
            { name: "API Gateway", status: "Connected", version: "v4.1" },
            { name: "Rate Limiter", status: "Connected", version: "v1.5" }
        ]
    },
    crm: {
        role: "CRM Integration Agent",
        description: "Syncs data with CRM systems, updates records, and triggers sales workflows automatically.",
        rationale: "Keeps CRM data current without manual intervention, improving sales team efficiency.",
        efficiency_gain: "Manual: 15min/update → AI: Instant",
        capabilities: ["Record Sync", "Lead Scoring", "Activity Logging", "Pipeline Updates"],
        mlModels: ["Entity Matcher"],
        performance_metric: 96,
        executions_count: 9800,
        internal_flow: [
            { id: "1", label: "Detect Change", type: "trigger" },
            { id: "2", label: "Match Entity", type: "action" },
            { id: "3", label: "Update Record", type: "action" },
            { id: "4", label: "Trigger Workflow", type: "action" },
            { id: "5", label: "Sync Complete", type: "output" }
        ],
        dependencies: [
            { name: "Salesforce API", status: "Connected", version: "v58.0" },
            { name: "HubSpot API", status: "Connected", version: "v3" }
        ]
    },
    notification: {
        role: "Notification Dispatcher Agent",
        description: "Sends targeted notifications across email, SMS, push, and Slack with personalization.",
        rationale: "Ensures timely, personalized communication across all channels.",
        efficiency_gain: "100% delivery rate with smart retry",
        capabilities: ["Multi-channel Delivery", "Personalization", "A/B Testing", "Scheduling"],
        mlModels: ["Timing Optimizer"],
        performance_metric: 99,
        executions_count: 45000,
        internal_flow: [
            { id: "1", label: "Receive Message", type: "trigger" },
            { id: "2", label: "Personalize Content", type: "action" },
            { id: "3", label: "Select Channel", type: "condition" },
            { id: "4", label: "Send Notification", type: "action" },
            { id: "5", label: "Confirm Delivery", type: "output" }
        ],
        dependencies: [
            { name: "SendGrid API", status: "Connected", version: "v3" },
            { name: "Twilio API", status: "Connected", version: "v2022" },
            { name: "Slack API", status: "Connected", version: "v2" }
        ]
    },
    validation: {
        role: "Data Validator Agent",
        description: "Validates data against schemas, rules, and cross-references for accuracy and completeness.",
        rationale: "Catches data quality issues before they propagate through systems.",
        efficiency_gain: "Reduces data errors by 98%",
        capabilities: ["Schema Validation", "Cross-reference Check", "Format Normalization", "Duplicate Detection"],
        mlModels: ["Data Quality Scorer"],
        performance_metric: 98,
        executions_count: 18700,
        internal_flow: [
            { id: "1", label: "Receive Data", type: "trigger" },
            { id: "2", label: "Schema Check", type: "condition" },
            { id: "3", label: "Business Rules", type: "condition" },
            { id: "4", label: "Cross-Reference", type: "action" },
            { id: "5", label: "Quality Report", type: "output" }
        ],
        dependencies: [
            { name: "Schema Registry", status: "Connected", version: "v2.0" },
            { name: "Rules Engine", status: "Connected", version: "v3.1" }
        ]
    },
    report: {
        role: "Report Generator Agent",
        description: "Generates formatted reports, summaries, and dashboards from structured data.",
        rationale: "Automates recurring reporting tasks with consistent quality.",
        efficiency_gain: "Manual: 2h/report → AI: 30sec",
        capabilities: ["Template Generation", "Chart Creation", "PDF Export", "Scheduling"],
        mlModels: ["GPT-4", "Chart AI"],
        performance_metric: 94,
        executions_count: 7650,
        internal_flow: [
            { id: "1", label: "Collect Data", type: "trigger" },
            { id: "2", label: "Apply Template", type: "action" },
            { id: "3", label: "Generate Charts", type: "action" },
            { id: "4", label: "Format Document", type: "action" },
            { id: "5", label: "Export Report", type: "output" }
        ],
        dependencies: [
            { name: "Template Engine", status: "Connected", version: "v2.5" },
            { name: "Chart Generator", status: "Connected", version: "v1.8" }
        ]
    },
    sentiment: {
        role: "Sentiment Analyzer Agent",
        description: "Analyzes text for emotional tone, opinion mining, and customer satisfaction scoring.",
        rationale: "Provides real-time insights into customer sentiment at scale.",
        efficiency_gain: "Processes 1000 reviews/minute",
        capabilities: ["Emotion Detection", "Opinion Mining", "Satisfaction Scoring", "Trend Analysis"],
        mlModels: ["DistilBERT", "VADER"],
        performance_metric: 93,
        executions_count: 32100,
        internal_flow: [
            { id: "1", label: "Receive Text", type: "trigger" },
            { id: "2", label: "Tokenize", type: "action" },
            { id: "3", label: "Sentiment Analysis", type: "action" },
            { id: "4", label: "Score Satisfaction", type: "action" },
            { id: "5", label: "Sentiment Report", type: "output" }
        ],
        dependencies: [
            { name: "NLP Pipeline", status: "Connected", version: "v4.2" },
            { name: "BERT Service", status: "Connected", version: "v3.0" }
        ]
    },
    security: {
        role: "Security Monitor Agent",
        description: "Monitors for security threats, validates access, and enforces compliance policies.",
        rationale: "Provides 24/7 security monitoring without human fatigue.",
        efficiency_gain: "Detects threats 50x faster than manual review",
        capabilities: ["Threat Detection", "Access Validation", "Compliance Check", "Audit Logging"],
        mlModels: ["Anomaly Detector", "Risk Scorer"],
        performance_metric: 99,
        executions_count: 89000,
        internal_flow: [
            { id: "1", label: "Monitor Events", type: "trigger" },
            { id: "2", label: "Threat Analysis", type: "action" },
            { id: "3", label: "Risk Assessment", type: "condition" },
            { id: "4", label: "Alert/Block", type: "action" },
            { id: "5", label: "Audit Log", type: "output" }
        ],
        dependencies: [
            { name: "SIEM System", status: "Connected", version: "v5.0" },
            { name: "IAM Gateway", status: "Connected", version: "v3.2" }
        ]
    },
    scheduler: {
        role: "Task Scheduler Agent",
        description: "Manages task scheduling, deadlines, and resource allocation with intelligent prioritization.",
        rationale: "Optimizes task execution timing for maximum efficiency.",
        efficiency_gain: "Improves throughput by 40%",
        capabilities: ["Priority Queue", "Deadline Tracking", "Load Balancing", "Retry Logic"],
        mlModels: ["Load Predictor"],
        performance_metric: 98,
        executions_count: 56000,
        internal_flow: [
            { id: "1", label: "Receive Task", type: "trigger" },
            { id: "2", label: "Calculate Priority", type: "action" },
            { id: "3", label: "Check Resources", type: "condition" },
            { id: "4", label: "Schedule Execution", type: "action" },
            { id: "5", label: "Track Completion", type: "output" }
        ],
        dependencies: [
            { name: "Queue Manager", status: "Connected", version: "v2.0" },
            { name: "Resource Monitor", status: "Connected", version: "v1.5" }
        ]
    },
    orchestrator: {
        role: "Workflow Orchestrator Agent",
        description: "Coordinates all agents, manages state, handles errors, and ensures workflow completion.",
        rationale: "Ensures reliable end-to-end workflow execution with monitoring.",
        efficiency_gain: "99.9% workflow completion rate",
        capabilities: ["Agent Coordination", "State Management", "Error Recovery", "Progress Tracking"],
        mlModels: ["Resource Allocator"],
        performance_metric: 99,
        executions_count: 120000,
        internal_flow: [
            { id: "1", label: "Start Workflow", type: "trigger" },
            { id: "2", label: "Route to Agents", type: "action" },
            { id: "3", label: "Monitor Progress", type: "action" },
            { id: "4", label: "Handle Errors", type: "condition" },
            { id: "5", label: "Complete Workflow", type: "output" }
        ],
        dependencies: [
            { name: "State Manager", status: "Connected", version: "v3.0" },
            { name: "Agent Registry", status: "Connected", version: "v2.1" }
        ]
    }
};

const KEYWORD_PATTERNS: Record<string, string[]> = {
    email: ["email", "inbox", "mail", "message", "gmail", "outlook", "correspondence"],
    document: ["document", "pdf", "invoice", "receipt", "form", "scan", "ocr", "extract", "paper"],
    data: ["data", "database", "analyze", "analysis", "statistics", "pattern", "trend", "insight", "sql"],
    api: ["api", "integrate", "integration", "service", "endpoint", "rest", "webhook"],
    crm: ["crm", "salesforce", "hubspot", "customer", "lead", "sales", "contact", "client"],
    notification: ["notify", "notification", "alert", "slack", "sms", "push", "message", "send"],
    validation: ["validate", "validation", "check", "verify", "audit", "quality", "accuracy"],
    report: ["report", "summary", "dashboard", "visualization", "chart", "export", "generate"],
    sentiment: ["sentiment", "opinion", "feedback", "review", "social", "twitter", "emotion"],
    security: ["security", "secure", "compliance", "audit", "access", "threat", "monitor"],
    scheduler: ["schedule", "cron", "timer", "deadline", "queue", "batch", "periodic"]
};

function generateContextualAgents(description: string, files: File[]): AgentSuggestion[] {
    const descLower = description.toLowerCase();
    const matchedAgents: AgentSuggestion[] = [];
    const matchedKeys = new Set<string>();

    for (const [key, keywords] of Object.entries(KEYWORD_PATTERNS)) {
        for (const keyword of keywords) {
            if (descLower.includes(keyword) && !matchedKeys.has(key)) {
                matchedKeys.add(key);
                matchedAgents.push({ ...AGENT_TEMPLATES[key] });
                break;
            }
        }
    }

    if (files.length > 0) {
        const hasPDF = files.some(f => f.name.toLowerCase().endsWith('.pdf') || f.type.includes('pdf'));
        const hasCSV = files.some(f => f.name.toLowerCase().endsWith('.csv'));
        const hasImage = files.some(f => f.type.startsWith('image/'));

        if ((hasPDF || hasImage) && !matchedKeys.has('document')) {
            matchedAgents.push({ ...AGENT_TEMPLATES.document });
            matchedKeys.add('document');
        }
        if (hasCSV && !matchedKeys.has('data')) {
            matchedAgents.push({ ...AGENT_TEMPLATES.data });
            matchedKeys.add('data');
        }
    }

    if (matchedAgents.length >= 2 && !matchedKeys.has('orchestrator')) {
        matchedAgents.push({ ...AGENT_TEMPLATES.orchestrator });
    }

    if (matchedAgents.length === 0) {
        matchedAgents.push(
            { ...AGENT_TEMPLATES.data },
            { ...AGENT_TEMPLATES.report },
            { ...AGENT_TEMPLATES.notification }
        );
    }

    return matchedAgents;
}

const STEP_PATTERNS: Record<string, string[]> = {
    extract: ["Extract data from source", "Parse and structure extracted content", "Validate extracted data integrity"],
    analyze: ["Load data for analysis", "Perform statistical analysis", "Identify key patterns and anomalies"],
    process: ["Queue items for processing", "Apply transformation rules", "Verify processing results"],
    send: ["Prepare message content", "Validate recipient list", "Dispatch through appropriate channel"],
    notify: ["Generate notification payload", "Route to notification service", "Log delivery confirmation"],
    email: ["Parse incoming emails", "Classify by priority and intent", "Route to appropriate handler"],
    invoice: ["Scan and OCR invoice document", "Extract line items and totals", "Match against purchase orders", "Flag discrepancies for review"],
    document: ["Ingest document for processing", "Extract structured data", "Cross-validate against schema"],
    report: ["Aggregate data from sources", "Apply formatting templates", "Generate final report output"],
    sync: ["Fetch data from source system", "Transform to target format", "Push to destination system"],
    integrate: ["Establish API connections", "Transform data between schemas", "Execute bidirectional sync"],
    validate: ["Apply validation rules", "Cross-reference with master data", "Generate validation report"],
    audit: ["Collect audit trail entries", "Analyze for compliance gaps", "Generate audit summary"]
};

function generateWorkflowSteps(description: string, agents: AgentSuggestion[]): string[] {
    const descLower = description.toLowerCase();
    const steps: string[] = [];
    const addedSteps = new Set<string>();

    const addStep = (step: string) => {
        if (!addedSteps.has(step)) {
            addedSteps.add(step);
            steps.push(step);
        }
    };

    if (descLower.includes('schedule') || descLower.includes('daily') || descLower.includes('weekly')) {
        addStep("⏰ Trigger workflow on scheduled interval");
    } else if (descLower.includes('webhook') || descLower.includes('api')) {
        addStep("🔗 Receive webhook/API trigger");
    } else if (descLower.includes('email') || descLower.includes('inbox')) {
        addStep("📧 Monitor inbox for new messages");
    } else if (descLower.includes('upload') || descLower.includes('file')) {
        addStep("📁 Receive uploaded file");
    } else {
        addStep("▶️ Initialize workflow and validate inputs");
    }

    for (const [pattern, patternSteps] of Object.entries(STEP_PATTERNS)) {
        if (descLower.includes(pattern)) {
            patternSteps.forEach(s => addStep(s));
        }
    }

    agents.forEach(agent => {
        const roleLower = agent.role.toLowerCase();

        if (roleLower.includes('email')) {
            addStep("📧 " + agent.role + ": Triage and classify messages");
        } else if (roleLower.includes('document') || roleLower.includes('ocr')) {
            addStep("📄 " + agent.role + ": Extract structured data from documents");
        } else if (roleLower.includes('data') || roleLower.includes('analyzer')) {
            addStep("📊 " + agent.role + ": Process and analyze datasets");
        } else if (roleLower.includes('api') || roleLower.includes('orchestrator')) {
            addStep("🔌 " + agent.role + ": Coordinate API integrations");
        } else if (roleLower.includes('notification') || roleLower.includes('dispatcher')) {
            addStep("🔔 " + agent.role + ": Send notifications to stakeholders");
        } else if (roleLower.includes('validator') || roleLower.includes('validation')) {
            addStep("✅ " + agent.role + ": Validate data accuracy and completeness");
        } else if (roleLower.includes('report') || roleLower.includes('generator')) {
            addStep("📋 " + agent.role + ": Generate formatted reports");
        } else if (roleLower.includes('security') || roleLower.includes('monitor')) {
            addStep("🛡️ " + agent.role + ": Monitor for security compliance");
        } else if (roleLower.includes('sentiment') || roleLower.includes('nlp')) {
            addStep("🧠 " + agent.role + ": Analyze sentiment and intent");
        } else if (roleLower.includes('crm') || roleLower.includes('customer')) {
            addStep("👤 " + agent.role + ": Update CRM records");
        } else {
            addStep("⚙️ Execute " + agent.role.replace(" Agent", ""));
        }
    });

    if (descLower.includes('report') || descLower.includes('summary')) {
        addStep("📊 Compile results into summary report");
    }
    if (descLower.includes('notify') || descLower.includes('alert') || descLower.includes('send')) {
        addStep("📨 Notify stakeholders of completion");
    }
    if (descLower.includes('save') || descLower.includes('store') || descLower.includes('database')) {
        addStep("💾 Persist results to database");
    }

    addStep("✅ Complete workflow and log execution metrics");

    return steps;
}

export default function WorkflowInput() {
    const [inputType, setInputType] = useState<"text" | "voice">("text")
    const [textInput, setTextInput] = useState("")
    const [files, setFiles] = useState<File[]>([])
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
    const [isListening, setIsListening] = useState(false)
    const [selectedAgent, setSelectedAgent] = useState<any>(null)
    const { addWorkflow } = useWorkflow()
    const navigate = useNavigate()

    const { startListening, stopListening } = useVoiceInput({
        onTranscript: (transcript) => setTextInput(transcript),
        isListening,
        setIsListening
    })

    const handleVoiceToggle = useCallback(() => {
        if (isListening) {
            stopListening()
        } else {
            startListening()
        }
    }, [isListening, startListening, stopListening])

    const handleAnalyze = useCallback(async () => {
        if (!textInput.trim() && files.length === 0) return

        setIsAnalyzing(true)
        try {
            const result = await analyzeWorkflow(textInput, files)
            setAnalysisResult({
                suggestedAgents: result.agent_suggestions?.map((agent: any) => ({
                    ...agent,
                    rationale: agent.rationale || "Critical for handling specific domain logic efficiently.",
                    efficiency_gain: agent.efficiency_gain || "Estimated 5x speedup vs manual processing.",
                    internal_flow: agent.internal_flow || [],
                    dependencies: agent.dependencies || [],
                    capabilities: agent.capabilities || ["Data Processing", "Decision Making", "API Integration"],
                    mlModels: agent.mlModels || ["GPT-4", "Custom ML"]
                })) || [],
                workflowSteps: result.workflow_steps?.map((s: any) => s.description) || [],
                automationDetails: {
                    totalSteps: result.workflow_steps?.length || 3,
                    automatedSteps: Math.ceil((result.workflow_steps?.length || 3) * 0.85),
                    manualSteps: Math.floor((result.workflow_steps?.length || 3) * 0.15),
                    estimatedTimeSaved: "4.5 hours/day",
                    accuracy: "99.2%"
                }
            })
        } catch (error) {
            console.error("Analysis failed, using intelligent fallback:", error)
            const suggestedAgents = generateContextualAgents(textInput, files);
            const workflowSteps = generateWorkflowSteps(textInput, suggestedAgents);

            setAnalysisResult({
                suggestedAgents,
                workflowSteps,
                automationDetails: {
                    totalSteps: workflowSteps.length,
                    automatedSteps: Math.ceil(workflowSteps.length * 0.85),
                    manualSteps: Math.max(1, Math.floor(workflowSteps.length * 0.15)),
                    estimatedTimeSaved: `${suggestedAgents.length * 1.5} hours/day`,
                    accuracy: "98.5%"
                }
            })
        } finally {
            setIsAnalyzing(false)
        }
    }, [textInput, files])

    const handleCreateWorkflow = useCallback(() => {
        if (!analysisResult) return

        const newWorkflow = {
            id: Date.now().toString(),
            name: `Workflow ${new Date().toLocaleTimeString()}`,
            status: 'Active' as const,
            date: 'Just now',
            steps: analysisResult.workflowSteps.map((step, i) => ({
                id: (i + 1).toString(),
                description: step,
                actor: "AI Agent"
            })),
            agents: analysisResult.suggestedAgents.map(agent => ({
                ...agent,
                status: 'Idle' as const,
                confidence_score: 0.95
            })),
            metrics: {
                automationRate: 85,
                timeSaved: analysisResult.automationDetails.estimatedTimeSaved
            }
        }

        addWorkflow(newWorkflow)
        navigate("/dashboard")
    }, [analysisResult, addWorkflow, navigate])

    return (
        <div className="w-full space-y-8 relative pb-20">
            <AgentDetailModal
                agent={selectedAgent}
                isOpen={!!selectedAgent}
                onClose={() => setSelectedAgent(null)}
            />

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-4">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">AI-Powered Workflow Analysis</span>
                </div>
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sunset-600 via-coral-500 to-amber-500 mb-3 pb-1 font-display">
                    Workflow Analyzer
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
                    Describe your business process. Our AI generates the perfect agent team based on your specific needs.
                </p>

                <div className="flex flex-wrap justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">1</div>
                        <span>Describe your workflow</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground hidden sm:block" />
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-xs font-bold">2</div>
                        <span>AI generates custom agents</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground hidden sm:block" />
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center text-secondary text-xs font-bold">3</div>
                        <span>Deploy to production</span>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="flex gap-4 justify-center"
            >
                <Button3D
                    onClick={() => setInputType('text')}
                    variant={inputType === 'text' ? 'organic' : 'outline'}
                    leftIcon={<FileText className="w-5 h-5" />}
                >
                    Text Input
                </Button3D>
                <Button3D
                    onClick={() => setInputType('voice')}
                    variant={inputType === 'voice' ? 'organic' : 'outline'}
                    leftIcon={<Mic className="w-5 h-5" />}
                >
                    Voice Input
                </Button3D>
            </motion.div>

            <GlassCard className="p-8 border-primary/20">
                <label className="block text-sm font-medium mb-3 text-foreground">
                    Describe Your Workflow
                    <span className="text-muted-foreground font-normal ml-2">(Be specific for better agent matching)</span>
                </label>

                {inputType === 'text' ? (
                    <textarea
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder="Example: 'Process customer emails, extract invoice data from PDF attachments, validate amounts against our database, update the CRM, and send Slack notifications to the finance team.'"
                        className="w-full h-48 p-4 rounded-xl bg-background/60 border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none resize-none transition-all placeholder:text-muted-foreground/50 text-lg leading-relaxed"
                    />
                ) : (
                    <div className="space-y-6">
                        <div className="w-full min-h-[280px] p-8 rounded-2xl bg-gradient-to-br from-background/80 to-background/60 border-2 border-primary/20 flex flex-col items-center justify-center gap-6 relative overflow-hidden transition-all">
                            {isListening && (
                                <>
                                    <motion.div
                                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        {[1, 2, 3, 4].map((ring) => (
                                            <motion.div
                                                key={ring}
                                                className="absolute w-32 h-32 border-2 border-primary/30 rounded-full"
                                                animate={{
                                                    scale: [1, 1.5 + ring * 0.3, 2 + ring * 0.4],
                                                    opacity: [0.6, 0.3, 0]
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    delay: ring * 0.3,
                                                    repeat: Infinity,
                                                    ease: "easeOut"
                                                }}
                                            />
                                        ))}
                                    </motion.div>

                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-end gap-1 h-12">
                                        {[...Array(12)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className="w-1.5 bg-gradient-to-t from-primary to-secondary rounded-full"
                                                animate={{
                                                    height: [8, 20 + Math.random() * 28, 12, 32 + Math.random() * 16, 8],
                                                }}
                                                transition={{
                                                    duration: 0.8 + Math.random() * 0.4,
                                                    repeat: Infinity,
                                                    delay: i * 0.05,
                                                    ease: "easeInOut"
                                                }}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}

                            <motion.button
                                onClick={handleVoiceToggle}
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.92 }}
                                className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${isListening
                                    ? 'bg-gradient-to-br from-primary to-red-600 shadow-[0_0_40px_rgba(255,107,88,0.5)]'
                                    : 'bg-gradient-to-br from-primary to-secondary shadow-[0_0_20px_rgba(255,107,88,0.3)] hover:shadow-[0_0_30px_rgba(255,107,88,0.4)]'
                                    }`}
                            >
                                <AnimatePresence mode="wait">
                                    {isListening ? (
                                        <motion.div
                                            key="stop"
                                            initial={{ scale: 0, rotate: -90 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            exit={{ scale: 0, rotate: 90 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <div className="w-8 h-8 bg-white rounded-md" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="mic"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Mic className="w-10 h-10 text-white" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.button>

                            <motion.div
                                className="text-center space-y-1"
                                animate={{ opacity: 1 }}
                            >
                                <motion.p
                                    className={`text-lg font-semibold ${isListening ? 'text-primary' : 'text-foreground'}`}
                                    animate={isListening ? { opacity: [1, 0.6, 1] } : { opacity: 1 }}
                                    transition={isListening ? { duration: 1.5, repeat: Infinity } : {}}
                                >
                                    {isListening ? "🎙️ Listening..." : "Click to Start Speaking"}
                                </motion.p>
                                <p className="text-sm text-muted-foreground">
                                    {isListening
                                        ? "Speak clearly – I'm transcribing everything you say"
                                        : "Describe your workflow using your voice"
                                    }
                                </p>
                            </motion.div>
                        </div>

                        <AnimatePresence>
                            {textInput && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20, height: 0 }}
                                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                                    exit={{ opacity: 0, y: -10, height: 0 }}
                                    className="p-5 rounded-xl bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-secondary" />
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Live Transcript</p>
                                    </div>
                                    <p className="text-foreground text-lg leading-relaxed italic pl-3">"{textInput}"</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                <div className="mt-6 space-y-4 border-t border-white/10 pt-6">
                    <FileUploader
                        onFilesSelected={setFiles}
                        maxFiles={3}
                        acceptedTypes={[".pdf", ".txt", ".csv", ".docx", ".png", ".jpg"]}
                    />
                </div>

                <div className="mt-8 flex justify-end">
                    <Button3D
                        onClick={handleAnalyze}
                        disabled={(!textInput.trim() && files.length === 0) || isAnalyzing}
                        variant="organic"
                        size="lg"
                        isLoading={isAnalyzing}
                        rightIcon={!isAnalyzing && <Sparkles className="w-5 h-5" />}
                        className="min-w-[200px]"
                    >
                        {isAnalyzing ? "Analyzing..." : "Generate AI Agents"}
                    </Button3D>
                </div>
            </GlassCard>

            <AnimatePresence>
                {analysisResult && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        className="space-y-8"
                    >
                        <GlassCard className="p-8">
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-foreground">
                                <Workflow className="w-7 h-7 text-primary" />
                                Automation Overview
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                <div className="text-center p-4 rounded-xl bg-primary/10 border border-primary/20 shadow-sm">
                                    <p className="text-3xl font-bold text-primary">{analysisResult.automationDetails.totalSteps}</p>
                                    <p className="text-sm text-muted-foreground">Steps</p>
                                </div>
                                <div className="text-center p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 shadow-sm">
                                    <p className="text-3xl font-bold text-emerald-500">{analysisResult.automationDetails.automatedSteps}</p>
                                    <p className="text-sm text-muted-foreground">Automated</p>
                                </div>
                                <div className="text-center p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 shadow-sm">
                                    <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{analysisResult.suggestedAgents.length}</p>
                                    <p className="text-sm text-muted-foreground">Agents</p>
                                </div>
                                <div className="text-center p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 shadow-sm">
                                    <p className="text-3xl font-bold text-rose-500">{analysisResult.automationDetails.estimatedTimeSaved}</p>
                                    <p className="text-sm text-muted-foreground">Saved</p>
                                </div>
                                <div className="text-center p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 shadow-sm">
                                    <p className="text-3xl font-bold text-emerald-500">{analysisResult.automationDetails.accuracy}</p>
                                    <p className="text-sm text-muted-foreground">Accuracy</p>
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard className="p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold flex items-center gap-3 text-foreground">
                                    <Bot className="w-7 h-7 text-emerald-500" />
                                    Generated Agents ({analysisResult.suggestedAgents.length})
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Info className="w-4 h-4" />
                                    <span>Click for details</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {analysisResult.suggestedAgents.map((agent, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        whileHover={{ scale: 1.02 }}
                                        onClick={() => setSelectedAgent(agent)}
                                        className="p-6 rounded-xl bg-white/50 dark:bg-stone-900/50 border border-primary/10 hover:border-primary/40 transition-all group cursor-pointer hover:shadow-lg"
                                    >
                                        <div className="flex items-start gap-4 mb-3">
                                            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:from-primary/30 group-hover:to-secondary/30 transition-colors">
                                                <Brain className="w-6 h-6 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{agent.role}</h4>
                                                <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
                                                    {agent.mlModels?.join(" • ")}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-3">{agent.description}</p>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {agent.capabilities?.slice(0, 3).map((cap, j) => (
                                                <span key={j} className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                                    {cap}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="pt-3 border-t border-border/50 flex justify-between items-center">
                                            <div className="bg-emerald-500/5 px-3 py-1 rounded-lg border border-emerald-500/10">
                                                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{agent.efficiency_gain}</span>
                                            </div>
                                            <span className="text-xs text-muted-foreground group-hover:text-primary">View details →</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </GlassCard>

                        <GlassCard className="p-8">
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-foreground">
                                <TrendingUp className="w-7 h-7 text-secondary" />
                                Workflow Steps
                            </h3>
                            <div className="space-y-3">
                                {analysisResult.workflowSteps.map((step, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/20 transition-all"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center text-white font-black text-sm shadow-lg drop-shadow-md">
                                            {i + 1}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-foreground">{step}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {i < analysisResult.automationDetails.automatedSteps ? "Automated" : "Human review"}
                                            </p>
                                        </div>
                                        {i < analysisResult.automationDetails.automatedSteps ? (
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                        ) : (
                                            <Shield className="w-5 h-5 text-secondary" />
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </GlassCard>

                        <div className="flex justify-center pt-4">
                            <Button3D onClick={handleCreateWorkflow} variant="organic" size="lg" className="min-w-[300px] h-16 text-xl" rightIcon={<Rocket className="w-6 h-6" />}>
                                Deploy to Production
                            </Button3D>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
