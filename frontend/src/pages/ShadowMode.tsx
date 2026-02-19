import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, Play, AlertTriangle, CheckCircle, Zap, Shield, UserCheck, Bot, ArrowRight, X, Check, Clock, TrendingUp, BookOpen, Pause } from "lucide-react"
import { GlassCard } from "../components/ui/GlassCard"
import { Button3D } from "../components/ui/Button3D"
import { useWorkflow } from "../context/WorkflowContext"

// Dynamic comparison view component that generates unique logs each session
function ComparisonView({ workflows }: { workflows: any[] }) {
    // Generate dynamic values on mount (new each time simulation starts)
    const dynamicData = useMemo(() => {
        const requestId = Math.floor(Math.random() * 9000) + 1000;
        const prodLatency = Math.floor(Math.random() * 80) + 100; // 100-180ms
        const shadowLatency = Math.floor(prodLatency * (0.6 + Math.random() * 0.25)); // 15-40% faster
        const improvement = Math.round(((prodLatency - shadowLatency) / prodLatency) * 100);
        const workflowName = workflows[0]?.name || "Data Processing";

        const intents = ["Invoice Processing", "Email Routing", "Document Classification", "Data Validation", "Report Generation"];
        const intent = intents[Math.floor(Math.random() * intents.length)];

        const optimizations = [
            "Skipping step 3 (Redundant)",
            "Parallel processing enabled",
            "Cached result reused",
            "Smart batching applied",
            "Index optimization used"
        ];
        const optimization = optimizations[Math.floor(Math.random() * optimizations.length)];

        return { requestId, prodLatency, shadowLatency, improvement, workflowName, intent, optimization };
    }, []); // Only generate once per mount

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* Production Column */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h3 className="font-semibold text-muted-foreground uppercase text-xs tracking-widest">Production (v1.2)</h3>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs text-emerald-500">Live</span>
                    </div>
                </div>
                <GlassCard className="h-80 relative overflow-hidden bg-muted/10 border-white/5">
                    <div className="absolute inset-0 p-6 font-mono text-sm text-foreground/60 overflow-y-auto">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                            [PROD] Processing request #{dynamicData.requestId}...
                        </motion.div>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
                            [PROD] Executing step 1: Fetch data
                        </motion.div>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}>
                            [PROD] Executing step 2: Validate
                        </motion.div>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.5 }}>
                            [PROD] Executing step 3: Process
                        </motion.div>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4.5 }}>
                            [PROD] Complete. Duration: {dynamicData.prodLatency}ms
                        </motion.div>
                    </div>
                    <div className="absolute top-4 right-4 text-emerald-500 font-mono text-xs">Latency: {dynamicData.prodLatency}ms</div>
                </GlassCard>
            </div>

            {/* Shadow Column */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h3 className="font-semibold text-amber-600 dark:text-amber-400 uppercase text-xs tracking-widest">Shadow (v1.3-beta)</h3>
                    <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-500" />
                        <span className="text-xs text-amber-500">Testing</span>
                    </div>
                </div>
                <GlassCard className="h-80 relative overflow-hidden bg-amber-500/5 border-amber-500/20">
                    <div className="absolute inset-0 p-6 font-mono text-sm text-foreground/80 overflow-y-auto">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                            [SHADOW] Ingesting request #{dynamicData.requestId}...
                        </motion.div>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                            [SHADOW] Analyzing intent: "{dynamicData.intent}"
                        </motion.div>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 }} className="text-emerald-400">
                            [SHADOW] ✓ OPTIMIZATION: {dynamicData.optimization}
                        </motion.div>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8 }}>
                            [SHADOW] Executing optimized pipeline...
                        </motion.div>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.5 }} className="text-emerald-400">
                            [SHADOW] Complete. Duration: {dynamicData.shadowLatency}ms (-{dynamicData.improvement}% vs Prod)
                        </motion.div>
                    </div>
                    <div className="absolute top-4 right-4 text-amber-500 font-mono text-xs">Latency: {dynamicData.shadowLatency}ms (-{dynamicData.improvement}%)</div>
                </GlassCard>
            </div>
        </div>
    );
}

interface AgentDecision {
    id: string;
    agentName: string;
    workflowId: string;
    action: string;
    recommendation: "keep" | "remove" | "modify";
    reason: string;
    efficiency: string;
    riskLevel: "low" | "medium" | "high";
    status: "pending" | "approved" | "rejected";
}

export default function ShadowMode() {
    const { workflows, removeAgentFromWorkflow } = useWorkflow();
    const [isEnabled, setIsEnabled] = useState(false)
    const [isRunning, setIsRunning] = useState(false)
    const [decisions, setDecisions] = useState<AgentDecision[]>([])

    // Generate decisions from actual deployed agents
    useEffect(() => {
        const allAgents: AgentDecision[] = [];

        workflows.forEach(wf => {
            (wf.agents || []).forEach((agent: any, index: number) => {
                // Generate realistic recommendations and actions
                const recommendations: ("keep" | "remove" | "modify")[] = ["keep", "keep", "keep", "modify"];
                const risks: ("low" | "medium" | "high")[] = ["low", "low", "medium"];
                const actions = [
                    `Processing ${wf.name} tasks`,
                    `Handling incoming data for ${wf.name}`,
                    `Executing ${agent.role || 'Agent'} operations`,
                    `Managing ${wf.name} workflow step ${index + 1}`
                ];
                const efficiencies = ["+85% faster", "+72% faster", "+90% faster", "+65% faster"];
                const reasons = [
                    "Agent performing optimally with high accuracy",
                    "Processing data correctly with minimal errors",
                    "May need threshold adjustment for edge cases",
                    "Excellent performance in all test scenarios"
                ];

                allAgents.push({
                    id: agent.id || `agent-${wf.id}-${index}`,
                    agentName: agent.role || `Agent ${index + 1}`,
                    workflowId: wf.id,
                    action: actions[index % actions.length],
                    recommendation: recommendations[index % recommendations.length],
                    reason: reasons[index % reasons.length],
                    efficiency: efficiencies[index % efficiencies.length],
                    riskLevel: risks[index % risks.length],
                    status: "pending"
                });
            });
        });

        setDecisions(allAgents);
    }, [workflows]);

    const handleToggle = () => {
        setIsEnabled(!isEnabled)
        if (isEnabled) setIsRunning(false)
    }

    const handleDecision = (id: string, status: "approved" | "rejected") => {
        const decision = decisions.find(d => d.id === id);

        if (status === "rejected" && decision) {
            // Actually remove the agent from the workflow
            removeAgentFromWorkflow(decision.workflowId, decision.id);
        }

        setDecisions(prev => prev.map(d => d.id === id ? { ...d, status } : d))
    }

    const riskColors = {
        low: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/20" },
        medium: { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", border: "border-amber-500/20" },
        high: { bg: "bg-rose-500/10", text: "text-rose-600 dark:text-rose-400", border: "border-rose-500/20" }
    }

    const recommendationConfig = {
        keep: { icon: Check, color: "emerald", label: "Keep in Workflow" },
        remove: { icon: X, color: "rose", label: "Remove from Workflow" },
        modify: { icon: AlertTriangle, color: "amber", label: "Needs Adjustment" }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-8 w-full pb-8"
        >
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-500 pb-1 font-display">
                        Shadow Mode
                    </h1>
                    <p className="text-muted-foreground">
                        Test agents in parallel with production data. You decide what stays.
                    </p>
                </div>

                {/* Toggle Switch */}
                <div
                    onClick={handleToggle}
                    className={`w-20 h-10 rounded-full p-1 cursor-pointer transition-all duration-300 relative shadow-inner ${isEnabled
                        ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-2 border-amber-500/50'
                        : 'bg-muted border-2 border-white/10'
                        }`}
                >
                    <motion.div
                        className={`w-8 h-8 rounded-full shadow-lg ${isEnabled
                            ? 'bg-gradient-to-br from-amber-500 to-orange-500'
                            : 'bg-muted-foreground/50'
                            }`}
                        layout
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        style={{ x: isEnabled ? 40 : 0 }}
                    />
                </div>
            </div>

            {/* What is Shadow Mode Documentation */}
            <GlassCard className="p-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-lg text-foreground mb-2">What is Shadow Mode?</h3>
                        <p className="text-muted-foreground text-sm mb-4">
                            Shadow Mode allows you to <strong className="text-foreground">safely test new AI agents</strong> by running them in parallel with your production workflow.
                            Agents process real data but <strong className="text-foreground">don't execute any external actions</strong> until you approve them.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-start gap-2">
                                <Shield className="w-4 h-4 text-emerald-500 mt-1" />
                                <div>
                                    <p className="text-sm font-medium text-foreground">Zero Risk</p>
                                    <p className="text-xs text-muted-foreground">No external actions until approved</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <TrendingUp className="w-4 h-4 text-orange-500 mt-1" />
                                <div>
                                    <p className="text-sm font-medium text-foreground">Compare Performance</p>
                                    <p className="text-xs text-muted-foreground">Side-by-side with production</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <UserCheck className="w-4 h-4 text-rose-500 mt-1" />
                                <div>
                                    <p className="text-sm font-medium text-foreground">Human Control</p>
                                    <p className="text-xs text-muted-foreground">You decide what gets deployed</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </GlassCard>

            {/* Status Card */}
            <GlassCard className={`p-8 border-l-4 ${isEnabled ? 'border-l-amber-500' : 'border-l-muted-foreground'}`}>
                <div className="flex items-center gap-4 flex-wrap">
                    <div className={`p-4 rounded-full ${isEnabled ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' : 'bg-muted text-muted-foreground'}`}>
                        {isEnabled ? <Eye className="w-8 h-8" /> : <EyeOff className="w-8 h-8" />}
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-foreground">{isEnabled ? "Shadow Execution Active" : "Shadow Mode Disabled"}</h2>
                        <p className="text-muted-foreground">
                            {isEnabled
                                ? "Agents are mirroring production traffic. Review their decisions below before approving."
                                : "Enable Shadow Mode to validate new agent versions safely before deployment."}
                        </p>
                    </div>
                    {isEnabled && (
                        <div className="flex gap-2">
                            <Button3D
                                variant={isRunning ? "outline" : "organic"}
                                onClick={() => setIsRunning(!isRunning)}
                                leftIcon={isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            >
                                {isRunning ? "Pause Simulation" : "Start Simulation"}
                            </Button3D>
                        </div>
                    )}
                </div>
            </GlassCard>

            {/* Agent Decisions - Human Control Interface */}
            <AnimatePresence>
                {isEnabled && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                                <UserCheck className="w-5 h-5 text-orange-500" />
                                Agent Decisions Awaiting Your Approval
                            </h3>
                            <span className="text-sm text-muted-foreground">
                                {decisions.filter(d => d.status === "pending").length} pending decisions
                            </span>
                        </div>

                        {decisions.map((decision, i) => {
                            const risk = riskColors[decision.riskLevel]
                            const recConfig = recommendationConfig[decision.recommendation]
                            const RecIcon = recConfig.icon

                            return (
                                <motion.div
                                    key={decision.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <GlassCard className={`p-6 ${decision.status !== "pending" ? 'opacity-60' : ''}`}>
                                        <div className="flex flex-col lg:flex-row gap-6">
                                            {/* Agent Info */}
                                            <div className="flex-1 space-y-4">
                                                <div className="flex items-start gap-4">
                                                    <div className="p-3 rounded-xl bg-orange-500/10">
                                                        <Bot className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 flex-wrap">
                                                            <h4 className="font-bold text-lg text-foreground">{decision.agentName}</h4>
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${risk.bg} ${risk.text} ${risk.border} border`}>
                                                                {decision.riskLevel.toUpperCase()} RISK
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground mt-1">{decision.action}</p>
                                                    </div>
                                                </div>

                                                {/* AI Recommendation */}
                                                <div className={`p-4 rounded-xl bg-${recConfig.color}-500/5 border border-${recConfig.color}-500/20`}>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <RecIcon className={`w-4 h-4 text-${recConfig.color}-600 dark:text-${recConfig.color}-400`} />
                                                        <p className={`text-sm font-bold text-${recConfig.color}-600 dark:text-${recConfig.color}-400`}>
                                                            AI Recommendation: {recConfig.label}
                                                        </p>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">{decision.reason}</p>
                                                </div>

                                                {/* Metrics */}
                                                <div className="flex gap-4 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                                                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">{decision.efficiency}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4 text-muted-foreground" />
                                                        <span className="text-muted-foreground">Processing: 45ms avg</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Decision Buttons */}
                                            <div className="flex lg:flex-col gap-3 lg:w-48 justify-end lg:justify-center">
                                                {decision.status === "pending" ? (
                                                    <>
                                                        <Button3D
                                                            variant="success"
                                                            size="sm"
                                                            className="flex-1 lg:w-full"
                                                            onClick={() => handleDecision(decision.id, "approved")}
                                                            leftIcon={<Check className="w-4 h-4" />}
                                                        >
                                                            Keep Agent
                                                        </Button3D>
                                                        <Button3D
                                                            variant="outline"
                                                            size="sm"
                                                            className="flex-1 lg:w-full border-rose-500/50 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
                                                            onClick={() => handleDecision(decision.id, "rejected")}
                                                            leftIcon={<X className="w-4 h-4" />}
                                                        >
                                                            Remove Agent
                                                        </Button3D>
                                                    </>
                                                ) : (
                                                    <div className={`p-3 rounded-xl text-center ${decision.status === "approved"
                                                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                                        }`}>
                                                        <div className="flex items-center justify-center gap-2">
                                                            {decision.status === "approved" ? (
                                                                <CheckCircle className="w-5 h-5" />
                                                            ) : (
                                                                <X className="w-5 h-5" />
                                                            )}
                                                            <span className="font-medium capitalize">{decision.status}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            )
                        })}

                        {/* Deploy All Button */}
                        {decisions.some(d => d.status === "approved") && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex justify-center pt-4"
                            >
                                <Button3D
                                    variant="organic"
                                    size="lg"
                                    rightIcon={<ArrowRight className="w-5 h-5" />}
                                    onClick={() => {
                                        const approved = decisions.filter(d => d.status === "approved");
                                        if (approved.length === 0) {
                                            alert("No agents approved yet. Please approve at least one agent first.");
                                            return;
                                        }

                                        const confirmation = confirm(
                                            `Deploy ${approved.length} approved agent(s) to production?\n\n` +
                                            approved.map(a => `• ${a.agentName}`).join('\n') +
                                            `\n\nThis action will update your live environment.`
                                        );

                                        if (confirmation) {
                                            // Simulate deployment
                                            alert(
                                                `✅ Deployment Successful!\n\n` +
                                                `${approved.length} agent(s) have been deployed to production:\n` +
                                                approved.map(a => `• ${a.agentName} - LIVE`).join('\n') +
                                                `\n\nYour shadow testing session has been completed.`
                                            );
                                            setIsEnabled(false);
                                            setIsRunning(false);
                                            setDecisions(prev => prev.map(d => ({ ...d, status: "pending" as const })));
                                        }
                                    }}
                                >
                                    Deploy Approved Agents to Production
                                </Button3D>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Comparison View */}
            {isEnabled && isRunning && (
                <ComparisonView workflows={workflows} />
            )}
        </motion.div>
    )
}
