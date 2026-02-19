import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Check, Bot, Zap, Brain, Database, Mail, FileText, Shield, Code, Cpu, Network, Eye, Cog, TrendingUp, Sparkles, X, Workflow } from "lucide-react";
import { GlassCard } from "../components/ui/GlassCard";
import { Button3D } from "../components/ui/Button3D";
import { useNavigate } from "react-router-dom";
import { useWorkflow } from "../context/WorkflowContext";

interface AgentTemplate {
    id: string;
    name: string;
    description: string;
    category: "AI/ML" | "Communication" | "Data" | "Document" | "Security" | "DevOps" | "Integration" | "Automation";
    capabilities: string[];
    popularity: number;
    complexity: "Low" | "Medium" | "High";
    mlModels?: string[];
    successRate: number;
    avgExecutionTime: string;
}

const AGENT_CATALOG: AgentTemplate[] = [
    // AI/ML Category
    {
        id: "deep-learning-vision",
        name: "Deep Learning Vision Agent",
        description: "Advanced computer vision agent using CNNs for image classification, object detection, and visual analysis.",
        category: "AI/ML",
        capabilities: ["Image Classification", "Object Detection", "OCR", "Face Recognition"],
        mlModels: ["ResNet-50", "YOLO v8", "EfficientNet"],
        popularity: 96,
        complexity: "High",
        successRate: 97.5,
        avgExecutionTime: "1.2s"
    },
    {
        id: "nlp-transformer",
        name: "NLP Transformer Agent",
        description: "State-of-the-art natural language processing with transformer models for text understanding and generation.",
        category: "AI/ML",
        capabilities: ["Text Embeddings", "Semantic Search", "Named Entity Recognition", "Question Answering"],
        mlModels: ["GPT-4", "BERT", "RoBERTa"],
        popularity: 98,
        complexity: "High",
        successRate: 96.8,
        avgExecutionTime: "0.8s"
    },
    {
        id: "predictive-analytics",
        name: "Predictive Analytics Agent",
        description: "Time-series forecasting and predictive modeling for business intelligence and demand planning.",
        category: "AI/ML",
        capabilities: ["Time-Series Forecasting", "Regression Analysis", "Trend Detection", "Anomaly Prediction"],
        mlModels: ["Prophet", "ARIMA", "XGBoost", "LSTM"],
        popularity: 94,
        complexity: "High",
        successRate: 92.3,
        avgExecutionTime: "2.5s"
    },
    {
        id: "sentiment-analyzer",
        name: "Sentiment Analysis Agent",
        description: "Real-time sentiment detection from text, social media, and customer feedback with emotion classification.",
        category: "AI/ML",
        capabilities: ["Sentiment Scoring", "Emotion Detection", "Opinion Mining", "Social Listening"],
        mlModels: ["DistilBERT", "VADER", "Custom Sentiment Model"],
        popularity: 91,
        complexity: "Medium",
        successRate: 94.2,
        avgExecutionTime: "0.3s"
    },
    {
        id: "recommendation-engine",
        name: "Recommendation Engine Agent",
        description: "Personalized recommendations using collaborative filtering and content-based algorithms.",
        category: "AI/ML",
        capabilities: ["Collaborative Filtering", "Content-Based Filtering", "Hybrid Recommendations", "A/B Testing"],
        mlModels: ["Matrix Factorization", "Neural CF", "Wide & Deep"],
        popularity: 89,
        complexity: "High",
        successRate: 88.5,
        avgExecutionTime: "0.5s"
    },
    {
        id: "anomaly-detection",
        name: "Anomaly Detection Agent",
        description: "ML-powered monitoring for detecting unusual patterns, fraud, and system anomalies in real-time.",
        category: "AI/ML",
        capabilities: ["Outlier Detection", "Fraud Detection", "System Monitoring", "Pattern Recognition"],
        mlModels: ["Isolation Forest", "Autoencoder", "One-Class SVM"],
        popularity: 87,
        complexity: "Medium",
        successRate: 95.1,
        avgExecutionTime: "0.4s"
    },

    // Communication Category
    {
        id: "email-processor",
        name: "Email Processor Agent",
        description: "Intelligent email triage, response drafting, and inbox management with sentiment analysis.",
        category: "Communication",
        capabilities: ["Sentiment Analysis", "Intent Detection", "Draft Generation", "Priority Routing"],
        mlModels: ["GPT-4", "Custom NER"],
        popularity: 98,
        complexity: "Medium",
        successRate: 96.7,
        avgExecutionTime: "0.6s"
    },
    {
        id: "chatbot-orchestrator",
        name: "Chatbot Orchestrator Agent",
        description: "Multi-turn conversational AI for customer support, sales, and information retrieval.",
        category: "Communication",
        capabilities: ["Multi-turn Dialog", "Context Retention", "Intent Routing", "Escalation Handling"],
        mlModels: ["GPT-4", "DialogFlow", "Rasa"],
        popularity: 95,
        complexity: "High",
        successRate: 93.4,
        avgExecutionTime: "0.7s"
    },
    {
        id: "content-writer",
        name: "Content Writer Agent",
        description: "AI-powered content generation for blogs, social media, marketing copy, and documentation.",
        category: "Communication",
        capabilities: ["SEO Optimization", "Tone Adaptation", "Multi-format Writing", "Brand Voice"],
        mlModels: ["GPT-4", "Claude", "Custom Fine-tuned"],
        popularity: 92,
        complexity: "Low",
        successRate: 91.2,
        avgExecutionTime: "1.5s"
    },
    {
        id: "notification-dispatcher",
        name: "Notification Dispatcher Agent",
        description: "Smart notification delivery across email, SMS, push, and in-app channels with personalization.",
        category: "Communication",
        capabilities: ["Multi-channel Delivery", "Personalization", "A/B Testing", "Delivery Optimization"],
        mlModels: ["Timing Optimizer", "Engagement Predictor"],
        popularity: 86,
        complexity: "Low",
        successRate: 99.1,
        avgExecutionTime: "0.2s"
    },

    // Data Category
    {
        id: "data-analyst",
        name: "Data Analyst Agent",
        description: "Statistical analysis, visualization generation, and insights extraction from complex datasets.",
        category: "Data",
        capabilities: ["Statistical Analysis", "Trend Forecasting", "Chart Generation", "Report Building"],
        mlModels: ["Custom ML", "Statistical Models"],
        popularity: 94,
        complexity: "High",
        successRate: 95.3,
        avgExecutionTime: "3.0s"
    },
    {
        id: "etl-pipeline",
        name: "ETL Pipeline Agent",
        description: "Automated data extraction, transformation, and loading with schema validation and error handling.",
        category: "Data",
        capabilities: ["Data Extraction", "Schema Mapping", "Data Cleansing", "Batch Processing"],
        mlModels: ["Data Quality Scorer"],
        popularity: 90,
        complexity: "Medium",
        successRate: 98.2,
        avgExecutionTime: "5.0s"
    },
    {
        id: "database-optimizer",
        name: "Database Optimizer Agent",
        description: "Query optimization, index recommendations, and performance tuning for SQL and NoSQL databases.",
        category: "Data",
        capabilities: ["Query Analysis", "Index Suggestions", "Performance Monitoring", "Schema Optimization"],
        mlModels: ["Query Cost Predictor"],
        popularity: 85,
        complexity: "High",
        successRate: 94.7,
        avgExecutionTime: "1.0s"
    },

    // Document Category
    {
        id: "invoice-extractor",
        name: "Invoice Extractor Agent",
        description: "Intelligent document processing for invoices, receipts, and financial documents with OCR and validation.",
        category: "Document",
        capabilities: ["OCR", "Table Extraction", "Currency Normalization", "Validation"],
        mlModels: ["LayoutLMv3", "Donut", "Custom Table Extractor"],
        popularity: 96,
        complexity: "High",
        successRate: 97.8,
        avgExecutionTime: "2.0s"
    },
    {
        id: "contract-analyzer",
        name: "Contract Analyzer Agent",
        description: "Legal document analysis, clause extraction, and risk identification for contracts and agreements.",
        category: "Document",
        capabilities: ["Clause Extraction", "Risk Identification", "Compliance Check", "Summary Generation"],
        mlModels: ["Legal-BERT", "GPT-4", "Custom NER"],
        popularity: 88,
        complexity: "High",
        successRate: 93.1,
        avgExecutionTime: "4.0s"
    },
    {
        id: "form-processor",
        name: "Form Processor Agent",
        description: "Automated form data extraction and validation from PDFs, images, and scanned documents.",
        category: "Document",
        capabilities: ["Field Detection", "Handwriting Recognition", "Checkbox Detection", "Signature Verification"],
        mlModels: ["Form Recognizer", "Tesseract", "Custom CNN"],
        popularity: 91,
        complexity: "Medium",
        successRate: 95.6,
        avgExecutionTime: "1.8s"
    },

    // Security Category
    {
        id: "security-auditor",
        name: "Security Auditor Agent",
        description: "Code and infrastructure vulnerability scanning with compliance reporting and remediation suggestions.",
        category: "Security",
        capabilities: ["Vulnerability Scanning", "Compliance Check", "Report Generation", "Remediation"],
        mlModels: ["Pattern Matcher", "CVE Analyzer"],
        popularity: 89,
        complexity: "High",
        successRate: 96.4,
        avgExecutionTime: "8.0s"
    },
    {
        id: "access-controller",
        name: "Access Controller Agent",
        description: "Intelligent access management with anomaly detection and policy enforcement.",
        category: "Security",
        capabilities: ["Access Validation", "Anomaly Detection", "Policy Enforcement", "Audit Logging"],
        mlModels: ["Behavior Analyzer", "Risk Scorer"],
        popularity: 84,
        complexity: "Medium",
        successRate: 99.2,
        avgExecutionTime: "0.1s"
    },

    // DevOps Category
    {
        id: "code-reviewer",
        name: "Code Review Agent",
        description: "AI-powered code review with style checking, bug detection, and improvement suggestions.",
        category: "DevOps",
        capabilities: ["Static Analysis", "Bug Detection", "Style Enforcement", "Refactoring Suggestions"],
        mlModels: ["CodeBERT", "GPT-4", "Custom AST Analyzer"],
        popularity: 93,
        complexity: "Medium",
        successRate: 91.8,
        avgExecutionTime: "2.5s"
    },
    {
        id: "cicd-automation",
        name: "CI/CD Automation Agent",
        description: "Intelligent build, test, and deployment automation with failure prediction and rollback.",
        category: "DevOps",
        capabilities: ["Build Automation", "Test Orchestration", "Deployment", "Rollback Management"],
        mlModels: ["Failure Predictor", "Test Prioritizer"],
        popularity: 90,
        complexity: "High",
        successRate: 97.3,
        avgExecutionTime: "Varies"
    },

    // Integration Category
    {
        id: "api-orchestrator",
        name: "API Orchestrator Agent",
        description: "Multi-service API coordination with rate limiting, retry logic, and response aggregation.",
        category: "Integration",
        capabilities: ["API Chaining", "Rate Limiting", "Error Handling", "Response Aggregation"],
        mlModels: ["Latency Predictor"],
        popularity: 92,
        complexity: "Medium",
        successRate: 98.5,
        avgExecutionTime: "0.8s"
    },
    {
        id: "webhook-manager",
        name: "Webhook Manager Agent",
        description: "Reliable webhook delivery with signature validation, retry logic, and event transformation.",
        category: "Integration",
        capabilities: ["Event Routing", "Signature Validation", "Retry Logic", "Payload Transformation"],
        mlModels: ["Delivery Optimizer"],
        popularity: 83,
        complexity: "Low",
        successRate: 99.5,
        avgExecutionTime: "0.1s"
    },

    // Automation Category
    {
        id: "workflow-orchestrator",
        name: "Workflow Orchestrator Agent",
        description: "Master orchestration agent that coordinates multiple agents and manages complex workflow execution.",
        category: "Automation",
        capabilities: ["Agent Coordination", "State Management", "Error Recovery", "Parallel Execution"],
        mlModels: ["Scheduling Optimizer", "Resource Allocator"],
        popularity: 97,
        complexity: "High",
        successRate: 99.0,
        avgExecutionTime: "Varies"
    },
    {
        id: "scheduler-agent",
        name: "Scheduler Agent",
        description: "Intelligent task scheduling with priority management, deadline tracking, and resource optimization.",
        category: "Automation",
        capabilities: ["Cron Scheduling", "Priority Queue", "Deadline Management", "Load Balancing"],
        mlModels: ["Load Predictor", "Priority Optimizer"],
        popularity: 88,
        complexity: "Medium",
        successRate: 99.4,
        avgExecutionTime: "0.05s"
    }
];

const CATEGORY_ICONS: Record<string, any> = {
    "AI/ML": Brain,
    "Communication": Mail,
    "Data": Database,
    "Document": FileText,
    "Security": Shield,
    "DevOps": Code,
    "Integration": Network,
    "Automation": Cog
};

const CATEGORY_STYLES: Record<string, { bg: string, text: string, border: string, glow: string }> = {
    "AI/ML": { bg: "bg-violet-500/10", text: "text-violet-500", border: "border-violet-500/20", glow: "violet" },
    "Communication": { bg: "bg-orange-500/10", text: "text-orange-500", border: "border-orange-500/20", glow: "orange" },
    "Data": { bg: "bg-emerald-500/10", text: "text-emerald-500", border: "border-emerald-500/20", glow: "emerald" },
    "Document": { bg: "bg-rose-500/10", text: "text-rose-500", border: "border-rose-500/20", glow: "rose" },
    "Security": { bg: "bg-red-500/10", text: "text-red-500", border: "border-red-500/20", glow: "red" },
    "DevOps": { bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/20", glow: "amber" },
    "Integration": { bg: "bg-cyan-500/10", text: "text-cyan-500", border: "border-cyan-500/20", glow: "cyan" },
    "Automation": { bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/20", glow: "blue" }
};

const AgentCard = React.memo(function AgentCard({
    agent,
    isSelected,
    onToggle
}: {
    agent: AgentTemplate;
    isSelected: boolean;
    onToggle: () => void;
}) {
    const CategoryIcon = CATEGORY_ICONS[agent.category] || Bot;
    const styles = CATEGORY_STYLES[agent.category] || CATEGORY_STYLES["Automation"];

    return (
        <GlassCard className={`p-6 flex flex-col h-full group transition-all duration-300 ${isSelected ? `border-${styles.glow}-500/50 ring-1 ring-${styles.glow}-500/50` : 'hover:border-primary/30'}`}>
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${styles.bg} ${styles.text} group-hover:scale-110 transition-transform`}>
                    <CategoryIcon className="w-6 h-6" />
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className="text-[10px] font-mono text-muted-foreground px-2 py-1 rounded-full bg-white/5 border border-white/10 uppercase tracking-wider">
                        {agent.category}
                    </span>
                    <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${agent.complexity === "High" ? "bg-rose-500" :
                            agent.complexity === "Medium" ? "bg-amber-500" : "bg-emerald-500"
                            }`} />
                        <span className="text-xs text-muted-foreground">{agent.complexity}</span>
                    </div>
                </div>
            </div>

            <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                {agent.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 flex-grow line-clamp-2">
                {agent.description}
            </p>

            {agent.mlModels && (
                <div className="mb-3">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                        <Cpu className="w-3 h-3" /> Models
                    </p>
                    <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400 truncate">
                        {agent.mlModels.join(" • ")}
                    </p>
                </div>
            )}

            <div className="flex flex-wrap gap-1.5 mb-4">
                {agent.capabilities.slice(0, 3).map(cap => (
                    <span key={cap} className="text-xs px-2 py-0.5 rounded bg-white/5 text-foreground/80 border border-white/5">
                        {cap}
                    </span>
                ))}
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground mb-4 pt-3 border-t border-white/5">
                <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                    <span>{agent.successRate}% success</span>
                </div>
                <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-500" />
                    <span>{agent.avgExecutionTime}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3 text-rose-500" />
                    <span>{agent.popularity}% pop</span>
                </div>
            </div>

            <Button3D
                onClick={onToggle}
                variant={isSelected ? "organic" : "outline"}
                className="w-full"
                leftIcon={isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            >
                {isSelected ? "Selected" : "Add Agent"}
            </Button3D>
        </GlassCard>
    );
});

export default function AgentCatalog() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<"popularity" | "name" | "successRate">("popularity");
    const navigate = useNavigate();
    const { workflows, addAgentToWorkflow } = useWorkflow();
    const [showWorkflowModal, setShowWorkflowModal] = useState(false);
    const [showCustomAgentModal, setShowCustomAgentModal] = useState(false);
    const [customAgent, setCustomAgent] = useState({
        name: "",
        description: "",
        category: "Automation" as const,
        capabilities: ""
    });

    const categories = useMemo(() =>
        ["All", ...Array.from(new Set(AGENT_CATALOG.map(a => a.category)))],
        []
    );

    const filteredAgents = useMemo(() => {
        let agents = AGENT_CATALOG.filter(agent => {
            const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                agent.capabilities.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesCategory = selectedCategory === "All" || agent.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });

        agents.sort((a, b) => {
            if (sortBy === "popularity") return b.popularity - a.popularity;
            if (sortBy === "successRate") return b.successRate - a.successRate;
            return a.name.localeCompare(b.name);
        });

        return agents;
    }, [searchQuery, selectedCategory, sortBy]);

    const toggleAgent = useCallback((id: string) => {
        setSelectedAgents(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    }, []);

    const handleDeployToNewWorkflow = useCallback(() => {
        const selected = AGENT_CATALOG.filter(a => selectedAgents.includes(a.id));
        sessionStorage.setItem('selectedCatalogAgents', JSON.stringify(selected));
        navigate('/dashboard/input');
    }, [selectedAgents, navigate]);

    const handleDeployToExistingWorkflow = useCallback((workflowId: string) => {
        const selected = AGENT_CATALOG.filter(a => selectedAgents.includes(a.id));
        selected.forEach(agent => {
            addAgentToWorkflow(workflowId, {
                role: agent.name,
                description: agent.description,
                status: 'Pending',
                capabilities: agent.capabilities,
                mlModels: agent.mlModels || []
            });
        });
        setSelectedAgents([]);
        setShowWorkflowModal(false);
        alert(`✅ ${selected.length} agent(s) added to workflow successfully!`);
        navigate('/dashboard/agents');
    }, [selectedAgents, addAgentToWorkflow, navigate]);

    const handleAddCustomAgent = useCallback(() => {
        if (!customAgent.name || !customAgent.description) {
            alert("Please fill in agent name and description");
            return;
        }
        const newAgentId = `custom-${Date.now()}`;
        const newAgent = {
            id: newAgentId,
            name: customAgent.name,
            description: customAgent.description,
            category: customAgent.category,
            capabilities: customAgent.capabilities.split(',').map(c => c.trim()).filter(Boolean),
            popularity: 0,
            complexity: "Medium" as const,
            successRate: 95,
            avgExecutionTime: "~2s"
        };
        sessionStorage.setItem('customAgent', JSON.stringify(newAgent));
        setShowCustomAgentModal(false);
        setCustomAgent({ name: "", description: "", category: "Automation", capabilities: "" });
        navigate('/dashboard/input');
    }, [customAgent, navigate]);

    const handleDeployAgents = useCallback(() => {
        if (workflows.length === 0) {
            handleDeployToNewWorkflow();
        } else {
            setShowWorkflowModal(true);
        }
    }, [workflows.length, handleDeployToNewWorkflow]);

    return (
        <div className="w-full space-y-8 relative pb-24">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
                <div className="flex items-center justify-end mb-2">
                    <Button3D variant="organic" size="sm" onClick={() => setShowCustomAgentModal(true)} leftIcon={<Plus className="w-4 h-4" />}>
                        Create Custom Agent
                    </Button3D>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm">
                    <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">AI Agent Marketplace</span>
                </div>
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 via-primary to-secondary font-display leading-normal pb-1">
                    Agent Mode
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Browse {AGENT_CATALOG.length}+ specialized AI agents. Select and deploy the perfect team.
                </p>
            </motion.div>

            <GlassCard className="p-4 flex flex-col lg:flex-row gap-4 items-center justify-between sticky top-20 z-20 backdrop-blur-xl">
                <div className="relative w-full lg:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search agents, capabilities, models..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted/50 dark:bg-white/5 border border-border dark:border-white/10 focus:outline-none focus:border-primary/50 text-foreground placeholder:text-muted-foreground transition-colors"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
                    {categories.map(cat => {
                        const Icon = CATEGORY_ICONS[cat] || Bot;
                        const isSelected = selectedCategory === cat;
                        return (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${isSelected
                                    ? "bg-sunset-500 text-white shadow-lg"
                                    : "bg-muted/50 dark:bg-white/5 text-muted-foreground hover:bg-muted dark:hover:bg-white/10 border border-border/50 dark:border-white/10"
                                    }`}
                            >
                                {cat !== "All" && <Icon className="w-4 h-4" />}
                                {cat}
                            </button>
                        );
                    })}
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Sort:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="bg-muted dark:bg-stone-800 border border-border dark:border-white/10 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50 cursor-pointer"
                        style={{ colorScheme: 'dark' }}
                    >
                        <option value="popularity" className="bg-stone-800 text-foreground">Popularity</option>
                        <option value="successRate" className="bg-stone-800 text-foreground">Success Rate</option>
                        <option value="name" className="bg-stone-800 text-foreground">Name</option>
                    </select>
                </div>
            </GlassCard>

            <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                    Showing <span className="font-bold text-foreground">{filteredAgents.length}</span> agents
                </span>
                <div className="flex items-center gap-4 text-muted-foreground">
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Low</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500" /> Medium</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-500" /> High Complexity</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredAgents.map((agent, i) => (
                        <motion.div
                            key={agent.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: i * 0.03 }}
                            layout
                        >
                            <AgentCard agent={agent} isSelected={selectedAgents.includes(agent.id)} onToggle={() => toggleAgent(agent.id)} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filteredAgents.length === 0 && (
                <div className="text-center py-16">
                    <Bot className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-foreground mb-2">No agents found</h3>
                    <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </div>
            )}

            <AnimatePresence>
                {selectedAgents.length > 0 && (
                    <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg">
                        <GlassCard className="mx-4 p-4 flex items-center justify-between border-primary/30 bg-background/95 backdrop-blur-xl shadow-2xl shadow-primary/20">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center font-black text-white text-xl shadow-lg drop-shadow-md">
                                    {selectedAgents.length}
                                </div>
                                <div>
                                    <p className="font-bold text-foreground">Agents Selected</p>
                                    <p className="text-xs text-muted-foreground">Ready to deploy</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button3D variant="ghost" size="sm" onClick={() => setSelectedAgents([])}>Clear</Button3D>
                                <Button3D variant="organic" size="sm" rightIcon={<Zap className="w-4 h-4" />} onClick={handleDeployAgents}>Deploy Agents</Button3D>
                            </div>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showWorkflowModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowWorkflowModal(false)}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md">
                            <GlassCard className="p-6 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <Workflow className="w-5 h-5 text-primary" />
                                        </div>
                                        <h3 className="text-lg font-bold text-foreground">Choose Workflow</h3>
                                    </div>
                                    <button onClick={() => setShowWorkflowModal(false)} className="p-1 hover:bg-white/10 rounded-lg">
                                        <X className="w-5 h-5 text-muted-foreground" />
                                    </button>
                                </div>
                                <p className="text-sm text-muted-foreground">Select an existing workflow or create a new one.</p>
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {workflows.map((wf) => (
                                        <button key={wf.id} onClick={() => handleDeployToExistingWorkflow(wf.id)} className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/50 transition-all text-left flex items-center justify-between group">
                                            <div>
                                                <p className="font-medium text-foreground group-hover:text-primary transition-colors">{wf.name}</p>
                                                <p className="text-xs text-muted-foreground">{wf.agents?.length || 0} agents</p>
                                            </div>
                                            <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </button>
                                    ))}
                                </div>
                                <div className="pt-2 border-t border-white/10">
                                    <Button3D variant="organic" className="w-full" onClick={handleDeployToNewWorkflow} leftIcon={<Plus className="w-4 h-4" />}>Create New Workflow</Button3D>
                                </div>
                            </GlassCard>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showCustomAgentModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowCustomAgentModal(false)}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md">
                            <GlassCard className="p-6 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <Bot className="w-5 h-5 text-primary" />
                                        </div>
                                        <h3 className="text-lg font-bold text-foreground">Create Custom Agent</h3>
                                    </div>
                                    <button onClick={() => setShowCustomAgentModal(false)} className="p-1 hover:bg-white/10 rounded-lg">
                                        <X className="w-5 h-5 text-muted-foreground" />
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-muted-foreground mb-1 block">Agent Name *</label>
                                        <input type="text" placeholder="e.g., Invoice Processor Agent" value={customAgent.name} onChange={(e) => setCustomAgent(prev => ({ ...prev, name: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-primary/50 text-foreground" />
                                    </div>
                                    <div>
                                        <label className="text-sm text-muted-foreground mb-1 block">Description *</label>
                                        <textarea placeholder="Describe what this agent does..." rows={3} value={customAgent.description} onChange={(e) => setCustomAgent(prev => ({ ...prev, description: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-primary/50 text-foreground resize-none" />
                                    </div>
                                    <div>
                                        <label className="text-sm text-muted-foreground mb-1 block">Category</label>
                                        <select value={customAgent.category} onChange={(e) => setCustomAgent(prev => ({ ...prev, category: e.target.value as any }))} className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-primary/50 text-foreground">
                                            {categories.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm text-muted-foreground mb-1 block">Capabilities (comma-separated)</label>
                                        <input type="text" placeholder="e.g., OCR, Data extraction" value={customAgent.capabilities} onChange={(e) => setCustomAgent(prev => ({ ...prev, capabilities: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-primary/50 text-foreground" />
                                    </div>
                                </div>
                                <Button3D variant="organic" className="w-full" onClick={handleAddCustomAgent} leftIcon={<Zap className="w-4 h-4" />}>Create & Deploy Agent</Button3D>
                            </GlassCard>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
