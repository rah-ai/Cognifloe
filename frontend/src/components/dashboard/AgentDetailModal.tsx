import { motion } from "framer-motion"
import { X, Activity, GitBranch, Database, CheckCircle, AlertCircle, Clock, ExternalLink } from "lucide-react"
import { GlassCard } from "../ui/GlassCard"

interface AgentDetailModalProps {
    agent: any
    isOpen: boolean
    onClose: () => void
}

export default function AgentDetailModal({ agent, isOpen, onClose }: AgentDetailModalProps) {
    if (!isOpen || !agent) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-5xl h-[85vh] overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-background/95 flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-neural-purple/20 flex items-center justify-center border border-neural-purple/30">
                            <Activity className="w-6 h-6 text-neural-purple" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold font-display">{agent.role}</h2>
                            <p className="text-sm text-muted-foreground">{agent.description}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-500 text-xs font-bold border border-green-500/30">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            ACTIVE
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <X className="w-5 h-5 text-muted-foreground" />
                        </button>
                    </div>
                </div>

                {/* Body - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">

                    {/* Top Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <GlassCard className="p-4 flex items-center justify-between bg-neural-purple/5">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-bold">Performance</p>
                                <p className="text-3xl font-bold text-neural-purple">{agent.performance_metric || 98}%</p>
                            </div>
                            <Activity className="w-8 h-8 text-neural-purple/30" />
                        </GlassCard>
                        <GlassCard className="p-4 flex items-center justify-between bg-neural-cyan/5">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-bold">Total Executions</p>
                                <p className="text-3xl font-bold text-neural-cyan">{(agent.executions_count || 12450).toLocaleString()}</p>
                            </div>
                            <Clock className="w-8 h-8 text-neural-cyan/30" />
                        </GlassCard>
                        <GlassCard className="p-4 flex items-center justify-between bg-neural-pink/5">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-bold">Avg Response</p>
                                <p className="text-3xl font-bold text-neural-pink">124ms</p>
                            </div>
                            <GitBranch className="w-8 h-8 text-neural-pink/30" />
                        </GlassCard>
                    </div>

                    {/* Internal Logic Flowchart */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
                        <div className="lg:col-span-2 space-y-4">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <GitBranch className="w-5 h-5 text-neural-cyan" />
                                Internal Logic Flow
                            </h3>
                            <GlassCard className="p-8 min-h-[400px] flex items-center justify-center relative overflow-hidden bg-grid-white/5">
                                <div className="absolute inset-0 bg-gradient-to-br from-background/50 to-transparent pointer-events-none" />

                                <div className="relative z-10 flex flex-wrap items-center justify-center gap-8">
                                    {/* Visual Representation of Steps */}
                                    {agent.internal_flow?.map((step: any, i: number) => (
                                        <div key={i} className="flex items-center gap-4">
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: i * 0.2 }}
                                                className={`relative p-4 rounded-xl border backdrop-blur-md w-40 text-center
                                                    ${step.type === 'trigger' ? 'border-neural-purple/50 bg-neural-purple/10' :
                                                        step.type === 'condition' ? 'border-yellow-500/50 bg-yellow-500/10' :
                                                            step.type === 'output' ? 'border-green-500/50 bg-green-500/10' :
                                                                'border-neural-cyan/50 bg-neural-cyan/10'}`}
                                            >
                                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 p-1.5 rounded-full bg-background border border-white/10 shadow-lg">
                                                    {step.type === 'trigger' ? <Activity className="w-3 h-3 text-neural-purple" /> :
                                                        step.type === 'condition' ? <AlertCircle className="w-3 h-3 text-yellow-500" /> :
                                                            step.type === 'output' ? <CheckCircle className="w-3 h-3 text-green-500" /> :
                                                                <Database className="w-3 h-3 text-neural-cyan" />}
                                                </div>
                                                <p className="text-xs font-bold uppercase opacity-70 mb-1">{step.type}</p>
                                                <p className="text-sm font-medium">{step.label}</p>
                                            </motion.div>

                                            {i < agent.internal_flow.length - 1 && (
                                                <div className="w-12 h-[2px] bg-white/10 relative">
                                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-white/10 rotate-45" />
                                                </div>
                                            )}
                                        </div>
                                    )) || (
                                            <p className="text-muted-foreground">No internal flow details available.</p>
                                        )}
                                </div>
                            </GlassCard>
                        </div>

                        {/* Dependency Mapping */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <Database className="w-5 h-5 text-neural-pink" />
                                Integrations
                            </h3>
                            <div className="space-y-3">
                                {agent.dependencies?.map((dep: any, i: number) => (
                                    <GlassCard key={i} className="p-4 hover:border-neural-pink/30 transition-colors group cursor-pointer">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-neural-pink/20 transition-colors">
                                                    <ExternalLink className="w-4 h-4 text-neural-pink" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-sm">{dep.name}</h4>
                                                    <p className="text-xs text-muted-foreground">Ver {dep.version || '1.0'}</p>
                                                </div>
                                            </div>
                                            <span className="px-2 py-0.5 rounded text-[10px] bg-green-500/10 text-green-500 border border-green-500/20">
                                                {dep.status || 'Connected'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-xs text-muted-foreground mt-3 pt-3 border-t border-white/5">
                                            <span>Usage</span>
                                            <span className="text-foreground">{dep.active_users || '2.5k'} req/mo</span>
                                        </div>
                                    </GlassCard>
                                )) || (
                                        <p className="text-muted-foreground text-sm">No external dependencies.</p>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
