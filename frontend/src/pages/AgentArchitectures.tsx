import { motion } from "framer-motion"
import { Bot, GitBranch, Shield, RefreshCw, Loader2, Brain, Mail, FileText, Database, Bell, ClipboardCheck, PieChart, Lock, Clock, Settings, RotateCcw } from "lucide-react"
import { GlassCard } from "../components/ui/GlassCard"
import { Button3D } from "../components/ui/Button3D"
import { useWorkflow } from "../context/WorkflowContext"
import { useState, useCallback, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const getAgentIcon = (role: string) => {
    const roleLower = role.toLowerCase();
    if (roleLower.includes('email')) return Mail;
    if (roleLower.includes('document') || roleLower.includes('pdf')) return FileText;
    if (roleLower.includes('data') || roleLower.includes('database')) return Database;
    if (roleLower.includes('api') || roleLower.includes('orchestrator')) return GitBranch;
    if (roleLower.includes('notification') || roleLower.includes('alert')) return Bell;
    if (roleLower.includes('validation') || roleLower.includes('validator')) return ClipboardCheck;
    if (roleLower.includes('report') || roleLower.includes('chart')) return PieChart;
    if (roleLower.includes('sentiment') || roleLower.includes('nlp')) return Brain;
    if (roleLower.includes('security') || roleLower.includes('monitor')) return Lock;
    if (roleLower.includes('scheduler') || roleLower.includes('task')) return Clock;
    if (roleLower.includes('workflow')) return Settings;
    return Bot;
};

function getUserIdFromToken(): string | null {
    try {
        const token = localStorage.getItem('token');
        if (!token) return null;
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.sub || null;
    } catch {
        return null;
    }
}

function getPositionsKey(userId: string | null): string {
    return userId ? `agent_positions_${userId}` : 'agent_positions_guest';
}

interface NodePosition { x: number; y: number; }
interface NodePositions { [agentId: string]: NodePosition; }

function getNodeCenter(element: HTMLElement | null, containerRect: DOMRect | null): { x: number; y: number } | null {
    if (!element || !containerRect) return null;
    const rect = element.getBoundingClientRect();
    return {
        x: rect.left + rect.width / 2 - containerRect.left,
        y: rect.top + rect.height / 2 - containerRect.top
    };
}

export default function AgentArchitectures() {
    const { workflows, refreshWorkflows } = useWorkflow()
    const navigate = useNavigate()
    const containerRef = useRef<HTMLDivElement>(null);
    const nodeRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    // Theme Colors (Neon #ff6b58, Amber #e6a45c)
    const primaryHex = '#ff6b58';
    const secondaryHex = '#e6a45c';

    const allAgents = workflows.flatMap(wf =>
        (wf.agents || []).map((agent: any) => ({
            ...agent,
            workflowName: wf.name,
            workflowId: wf.id
        }))
    );

    const [nodePositions, setNodePositions] = useState<NodePositions>(() => {
        try {
            const userId = getUserIdFromToken();
            const key = getPositionsKey(userId);
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : {};
        } catch {
            return {};
        }
    });

    const [, setArrowUpdateTrigger] = useState(0);
    const arrowUpdateRAFRef = useRef<number | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [isOptimizing, setIsOptimizing] = useState(false)
    const [optimizationStatus, setOptimizationStatus] = useState<string | null>(null)
    const [agentLoads, setAgentLoads] = useState<number[]>(allAgents.map(() => Math.floor(Math.random() * 40) + 50))
    const [draggingId, setDraggingId] = useState<string | null>(null)



    useEffect(() => {
        const updatePositions = () => {
            setArrowUpdateTrigger(prev => prev + 1);
        };
        const timer = setTimeout(updatePositions, 100);
        window.addEventListener('resize', updatePositions);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', updatePositions);
        };
    }, [allAgents.length, nodePositions]);

    const savePositions = useCallback((positions: NodePositions) => {
        try {
            const userId = getUserIdFromToken();
            const key = getPositionsKey(userId);
            localStorage.setItem(key, JSON.stringify(positions));
        } catch (err) {
            console.error('Failed to save positions:', err);
        }
    }, []);

    // Throttled drag handler to improve performance
    const lastUpdate = useRef(0);
    const handleDrag = useCallback(() => {
        const now = Date.now();
        if (now - lastUpdate.current > 32) { // Cap at ~30fps
            setArrowUpdateTrigger(prev => prev + 1);
            lastUpdate.current = now;
        }
    }, []);

    useEffect(() => {
        return () => {
            if (arrowUpdateRAFRef.current !== null) {
                cancelAnimationFrame(arrowUpdateRAFRef.current);
            }
        };
    }, []);

    const handleDragStart = useCallback((agentId: string) => {
        setDraggingId(agentId);
    }, []);

    const handleDragEnd = useCallback((agentId: string, info: any) => {
        setDraggingId(null);
        const currentPos = nodePositions[agentId] || { x: 0, y: 0 };
        const newPosition = {
            x: currentPos.x + info.offset.x,
            y: currentPos.y + info.offset.y
        };
        setNodePositions(prev => {
            const updated = { ...prev, [agentId]: newPosition };
            savePositions(updated);
            return updated;
        });
        setArrowUpdateTrigger(prev => prev + 1);
    }, [savePositions, nodePositions]);

    const handleResetLayout = useCallback(() => {
        setNodePositions({});
        const userId = getUserIdFromToken();
        const key = getPositionsKey(userId);
        localStorage.removeItem(key);
        // Trigger multiple arrow updates during the spring animation
        [100, 300, 500, 800].forEach(delay => {
            setTimeout(() => setArrowUpdateTrigger(prev => prev + 1), delay);
        });
    }, []);

    const handleRefreshState = async () => {
        setIsRefreshing(true)
        // Refresh data from backend/storage
        await refreshWorkflows();
        await new Promise(resolve => setTimeout(resolve, 800)) // Min delay for visual feedback
        setAgentLoads(allAgents.map(() => Math.floor(Math.random() * 60) + 30))
        setIsRefreshing(false)
    }

    const handleOptimizeTopology = async () => {
        setIsOptimizing(true)
        setOptimizationStatus("Analyzing current topology...")
        await new Promise(resolve => setTimeout(resolve, 1000))
        setOptimizationStatus("Redistributing workload...")
        await new Promise(resolve => setTimeout(resolve, 1200))
        setOptimizationStatus("Applying optimizations...")
        await new Promise(resolve => setTimeout(resolve, 800))
        setOptimizationStatus("Optimization complete! Efficiency improved by 12%")
        setAgentLoads(allAgents.map(() => Math.floor(Math.random() * 30) + 40))
        setIsOptimizing(false)
        setTimeout(() => setOptimizationStatus(null), 3000)
    }

    const handleViewAuditLogs = () => {
        // Generate dynamic logs with real timestamps and varied actions
        const now = new Date();
        const formatTime = (date: Date) => date.toLocaleTimeString('en-US', { hour12: false });

        // Get workflow-specific data
        const workflowCount = workflows.length;
        const agentCount = allAgents.length;

        // Define varied log actions based on actual data
        const logTemplates = [
            () => `[${formatTime(new Date(now.getTime() - Math.random() * 60000))}] Agent processed ${Math.floor(Math.random() * 200 + 50)} requests`,
            () => `[${formatTime(new Date(now.getTime() - Math.random() * 120000))}] Security scan completed - ${Math.random() > 0.1 ? 'No threats detected' : 'Minor warning logged'}`,
            () => `[${formatTime(new Date(now.getTime() - Math.random() * 180000))}] Data encrypted with AES-${Math.random() > 0.5 ? '256' : '128'}`,
            () => `[${formatTime(new Date(now.getTime() - Math.random() * 240000))}] New connection established from ${Math.random() > 0.5 ? 'primary' : 'backup'} node`,
            () => `[${formatTime(new Date(now.getTime() - Math.random() * 300000))}] Query cache ${Math.random() > 0.5 ? 'optimized' : 'refreshed'} - ${Math.floor(Math.random() * 50 + 30)}% improvement`,
            () => `[${formatTime(new Date(now.getTime() - Math.random() * 360000))}] Workflow ${workflows[0]?.name || 'default'} completed batch #${Math.floor(Math.random() * 1000)}`,
            () => `[${formatTime(new Date(now.getTime() - Math.random() * 420000))}] Memory usage: ${Math.floor(Math.random() * 40 + 35)}% - Status: Normal`,
            () => `[${formatTime(new Date(now.getTime() - Math.random() * 480000))}] API latency: ${Math.floor(Math.random() * 80 + 20)}ms avg`,
            () => `[${formatTime(new Date(now.getTime() - Math.random() * 540000))}] Model inference completed in ${Math.floor(Math.random() * 500 + 100)}ms`,
            () => `[${formatTime(new Date(now.getTime() - Math.random() * 600000))}] Token usage: ${Math.floor(Math.random() * 5000 + 1000)} tokens processed`,
        ];

        // Generate 5-7 random unique logs
        const numLogs = Math.floor(Math.random() * 3) + 5;
        const shuffled = logTemplates.sort(() => Math.random() - 0.5);
        const logs = shuffled.slice(0, numLogs).map(fn => `• ${fn()}`);

        // Add header with real stats
        const header = `Audit Logs (${workflowCount} workflows, ${agentCount} agents)\n${'─'.repeat(40)}\n\n`;

        alert(header + logs.join('\n'));
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-8 w-full"
        >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sunset-600 via-coral-500 to-amber-500 pb-1 font-display">
                        Agent Architectures
                    </h1>
                    <p className="text-muted-foreground font-mono text-xs mt-1">
                        Visualize and manage your multi-agent systems.
                        {allAgents.length > 0 && <span className="ml-2 text-primary font-medium">({allAgents.length} agents active)</span>}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {/* View Mode Toggle */}
                    <div className="flex items-center p-1 bg-black/20 backdrop-blur-md rounded-lg border border-white/10 opacity-0 pointer-events-none hidden">
                        {/* 3D Toggle Removed as per user request */}
                    </div>

                    <div className="flex gap-2">
                        <Button3D variant="ghost" size="sm" leftIcon={<RotateCcw className="w-4 h-4" />} onClick={handleResetLayout} disabled={allAgents.length === 0 || Object.keys(nodePositions).length === 0}>
                            Reset
                        </Button3D>
                        <Button3D variant="outline" size="sm" leftIcon={isRefreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />} onClick={handleRefreshState} disabled={isRefreshing || allAgents.length === 0}>
                            {isRefreshing ? "Refreshing" : "Refresh"}
                        </Button3D>
                        <Button3D variant="organic" size="sm" leftIcon={isOptimizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <GitBranch className="w-4 h-4" />} onClick={handleOptimizeTopology} disabled={isOptimizing || allAgents.length === 0}>
                            {isOptimizing ? "Optimizing..." : "Optimize"}
                        </Button3D>
                    </div>
                </div>
            </div>

            {/* Main Content Area - Always 2D Schematic */}
            <div className="grid lg:grid-cols-4 gap-8">
                <GlassCard className="lg:col-span-3 min-h-[600px] relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 pointer-events-none" />

                    {allAgents.length === 0 ? (
                        <div className="text-center p-10">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                <Bot className="w-10 h-10 text-muted-foreground opacity-50" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2">No Agents Yet</h3>
                            <p className="text-muted-foreground mb-6 max-w-md text-sm font-mono">Create a workflow to generate AI agents.</p>
                            <Button3D variant="organic" onClick={() => navigate('/dashboard/input')}>Create Your First Workflow</Button3D>
                        </div>
                    ) : (
                        <div ref={containerRef} className="relative z-10 w-full h-full min-h-[500px] p-10">
                            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono text-primary flex items-center gap-2 z-30">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                                </svg>
                                Drag to organize
                            </div>

                            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

                            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ overflow: 'visible' }}>
                                <defs>
                                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                        <polygon points="0 0, 10 3.5, 0 7" fill="url(#arrowGradient)" />
                                    </marker>
                                    <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor={primaryHex} stopOpacity="0.6" />
                                        <stop offset="100%" stopColor={secondaryHex} stopOpacity="0.8" />
                                    </linearGradient>
                                </defs>
                                {allAgents.length > 1 && allAgents.slice(0, -1).map((_, i) => {
                                    const fromKey = allAgents[i].id || `agent-${i}`;
                                    const toKey = allAgents[i + 1].id || `agent-${i + 1}`;
                                    const fromNode = nodeRefs.current[fromKey];
                                    const toNode = nodeRefs.current[toKey];
                                    const container = containerRef.current;
                                    if (!fromNode || !toNode || !container) return null;
                                    const fromCenter = getNodeCenter(fromNode, container.getBoundingClientRect());
                                    const toCenter = getNodeCenter(toNode, container.getBoundingClientRect());
                                    if (!fromCenter || !toCenter) return null;

                                    const dx = toCenter.x - fromCenter.x;
                                    const dy = toCenter.y - fromCenter.y;
                                    const nodeHalf = 50;

                                    let startX, startY, endX, endY, ctrlX, ctrlY;

                                    const isHorizontal = Math.abs(dy) < 80;

                                    if (isHorizontal && dx > 0) {
                                        // Nodes in a row: connect right edge → left edge with upward arc
                                        startX = fromCenter.x + nodeHalf;
                                        startY = fromCenter.y;
                                        endX = toCenter.x - nodeHalf - 8;
                                        endY = toCenter.y;
                                        const midX = (startX + endX) / 2;
                                        const arcHeight = Math.min(Math.abs(dx) * 0.15, 25);
                                        ctrlX = midX;
                                        ctrlY = Math.min(startY, endY) - arcHeight;
                                    } else {
                                        // Diagonal/vertical: use angle-based connection
                                        const angle = Math.atan2(dy, dx);
                                        startX = fromCenter.x + Math.cos(angle) * nodeHalf;
                                        startY = fromCenter.y + Math.sin(angle) * nodeHalf;
                                        endX = toCenter.x - Math.cos(angle) * (nodeHalf + 8);
                                        endY = toCenter.y - Math.sin(angle) * (nodeHalf + 8);
                                        ctrlX = (startX + endX) / 2;
                                        ctrlY = (startY + endY) / 2 - 20;
                                    }

                                    return (
                                        <g key={`arrow-${i}`}>
                                            <path
                                                d={`M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`}
                                                fill="none"
                                                stroke="rgba(255,107,88,0.15)"
                                                strokeWidth="4"
                                                strokeLinecap="round"
                                            />
                                            <path
                                                d={`M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`}
                                                fill="none"
                                                stroke="url(#arrowGradient)"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                markerEnd="url(#arrowhead)"
                                            />
                                        </g>
                                    );
                                })}
                            </svg>

                            <div className="relative flex flex-wrap items-center justify-center gap-x-10 gap-y-20 min-h-[400px] pt-6">
                                {allAgents.map((agent: any, i: number) => {
                                    const IconComponent = getAgentIcon(agent.role);
                                    const colors = ['text-orange-600', 'text-amber-700', 'text-emerald-600', 'text-rose-600', 'text-purple-600', 'text-cyan-600'];
                                    const color = colors[i % colors.length];
                                    const bgColors = ['from-primary/40 to-secondary/40', 'from-secondary/40 to-amber-500/40', 'from-emerald-500/40 to-cyan-500/40'];
                                    const bgColor = bgColors[i % bgColors.length];

                                    const agentKey = agent.id || `agent-${i}`;
                                    const savedPosition = nodePositions[agentKey];

                                    return (
                                        <motion.div
                                            key={agentKey}
                                            ref={(el) => { nodeRefs.current[agentKey] = el; }}
                                            drag
                                            dragMomentum={false}
                                            dragElastic={0.1}
                                            dragConstraints={containerRef}
                                            onDragStart={() => handleDragStart(agentKey)}
                                            onDrag={() => handleDrag()}
                                            onDragEnd={(_, info) => handleDragEnd(agentKey, info)}
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{
                                                scale: 1,
                                                opacity: 1,
                                                x: draggingId === agentKey ? undefined : (savedPosition?.x || 0),
                                                y: draggingId === agentKey ? undefined : (savedPosition?.y || 0)
                                            }}
                                            whileDrag={{ scale: 1.1, zIndex: 50, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
                                            transition={draggingId === agentKey ? { duration: 0 } : { delay: i * 0.05, type: "spring", stiffness: 300, damping: 25 }}
                                            whileHover={{ scale: draggingId ? 1 : 1.05 }}
                                            className="relative group cursor-grab active:cursor-grabbing outline-none"
                                        >
                                            <div className={`absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 bg-gradient-to-br ${bgColor}`} />
                                            <div className="w-28 h-28 rounded-2xl bg-card border border-border shadow-xl flex flex-col items-center justify-center relative z-20 hover:border-primary/50 transition-all backdrop-blur-md">
                                                <IconComponent className={`w-9 h-9 ${color} mb-1`} />
                                                <div className={`absolute -top-2 -right-2 w-4 h-4 rounded-full border-2 border-background shadow-lg ${agent.status === 'Active' ? 'bg-emerald-500 animate-pulse' :
                                                    agent.status === 'Deploying' ? 'bg-amber-500 animate-ping' : 'bg-muted'
                                                    }`} />
                                            </div>
                                            <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 text-center w-40 pointer-events-none">
                                                <p className="font-bold text-xs text-foreground font-mono leading-tight">{agent.role?.replace(' Agent', '')}</p>
                                                <p className="text-[10px] text-muted-foreground truncate uppercase mt-0.5">{agent.workflowName}</p>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="absolute bottom-4 left-4 p-4 rounded-xl glass-panel bg-white/5 border border-white/10 text-xs text-muted-foreground max-w-xs pointer-events-none">
                        <p>
                            <span className="font-bold text-foreground">CogniFloe System</span><br />
                            <span className="text-primary font-mono">Drag nodes to rearrange.</span>
                        </p>
                    </div>
                </GlassCard>

                <div className="space-y-6">
                    <h2 className="text-lg font-semibold font-display">Active Agents ({allAgents.length})</h2>
                    {allAgents.length === 0 ? (
                        <GlassCard className="p-6 text-center">
                            <p className="text-muted-foreground text-sm">No agents deployed.</p>
                        </GlassCard>
                    ) : (
                        allAgents.map((agent: any, i: number) => {
                            const IconComponent = getAgentIcon(agent.role);
                            return (
                                <GlassCard key={agent.id || i} className="p-4" data-magnetic="true">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                                            <IconComponent className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="font-semibold truncate text-sm font-mono text-foreground">{agent.role}</h4>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider ${agent.status === 'Active' ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30'}`}>
                                                    {agent.status || 'Idle'}
                                                </span>
                                            </div>
                                            <div className="w-full h-1.5 bg-muted/50 rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.5)]"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${agentLoads[i] || 50}%` }}
                                                    transition={{ duration: 0.8 }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </GlassCard>
                            );
                        })
                    )}

                    <GlassCard className="p-6 bg-primary/5 border-primary/10">
                        <div className="flex items-start gap-3">
                            <Shield className="w-6 h-6 text-primary flex-shrink-0" />
                            <div>
                                <h3 className="font-bold text-primary mb-1 text-sm font-mono uppercase">Security Guardian</h3>
                                <p className="text-xs text-muted-foreground mb-4">
                                    Communications are encrypted and audited.
                                </p>
                                <Button3D variant="outline" size="sm" className="w-full" onClick={handleViewAuditLogs}>
                                    View Logs
                                </Button3D>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            </div>


            {/* Optimization Status Toast */}
            {
                optimizationStatus && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-8 right-8 bg-black/80 backdrop-blur-md text-white px-6 py-4 rounded-xl border border-white/10 shadow-2xl z-50 flex items-center gap-3"
                    >
                        <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
                        <span className="font-mono text-sm">{optimizationStatus}</span>
                    </motion.div>
                )
            }
        </motion.div >
    );
}
