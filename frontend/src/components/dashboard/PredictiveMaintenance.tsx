import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertTriangle,
    TrendingUp,
    Clock,
    Activity,
    CheckCircle,
    XCircle,
    RefreshCw,
    ChevronRight,
    Zap
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

interface WorkflowRisk {
    id: string;
    name: string;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    riskScore: number;
    predictedIssues: string[];
    recommendations: string[];
    lastRun: string;
    successRate: number;
    trend: 'improving' | 'stable' | 'declining';
}

// Mock predictive data - in production this would come from ML backend
const mockWorkflowRisks: WorkflowRisk[] = [
    {
        id: '1',
        name: 'Invoice Processing Pipeline',
        riskLevel: 'low',
        riskScore: 15,
        predictedIssues: [],
        recommendations: ['Continue monitoring'],
        lastRun: '2 hours ago',
        successRate: 98.5,
        trend: 'improving'
    },
    {
        id: '2',
        name: 'Email Classification System',
        riskLevel: 'medium',
        riskScore: 45,
        predictedIssues: ['Email volume spike expected', 'API rate limit approaching'],
        recommendations: ['Scale up processing capacity', 'Cache frequent classifications'],
        lastRun: '30 mins ago',
        successRate: 92.3,
        trend: 'stable'
    },
    {
        id: '3',
        name: 'Customer Data Sync',
        riskLevel: 'high',
        riskScore: 72,
        predictedIssues: ['Database connection timeout risk', 'Memory usage trending high'],
        recommendations: ['Increase connection pool', 'Schedule cleanup job'],
        lastRun: '1 hour ago',
        successRate: 85.1,
        trend: 'declining'
    }
];

const riskColors = {
    low: { bg: 'bg-forest-500/10', border: 'border-forest-500/30', text: 'text-forest-500', badge: 'bg-forest-500' },
    medium: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-500', badge: 'bg-amber-500' },
    high: { bg: 'bg-sunset-500/10', border: 'border-sunset-500/30', text: 'text-sunset-500', badge: 'bg-sunset-500' },
    critical: { bg: 'bg-coral-500/10', border: 'border-coral-500/30', text: 'text-coral-500', badge: 'bg-coral-500' }
};

export function PredictiveMaintenance() {
    const [workflows] = useState<WorkflowRisk[]>(mockWorkflowRisks);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowRisk | null>(null);

    const refreshPredictions = async () => {
        setIsRefreshing(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        // In production: fetch from ML prediction endpoint
        setIsRefreshing(false);
    };

    const overallHealth = workflows.reduce((acc, w) => acc + (100 - w.riskScore), 0) / workflows.length;
    const criticalCount = workflows.filter(w => w.riskLevel === 'critical' || w.riskLevel === 'high').length;

    return (
        <GlassCard className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-sunset-500/20 to-coral-500/20">
                        <Activity className="w-5 h-5 text-sunset-500" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground">Predictive Maintenance</h3>
                        <p className="text-sm text-muted-foreground">ML-powered workflow health monitoring</p>
                    </div>
                </div>
                <motion.button
                    onClick={refreshPredictions}
                    disabled={isRefreshing}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                    <RefreshCw className={`w-4 h-4 text-muted-foreground ${isRefreshing ? 'animate-spin' : ''}`} />
                </motion.button>
            </div>

            {/* Overall Health Score */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-muted/30 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-forest-500" />
                        <span className="text-sm text-muted-foreground">System Health</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-foreground">{overallHealth.toFixed(0)}%</span>
                        <span className="text-xs text-forest-500">Good</span>
                    </div>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        <span className="text-sm text-muted-foreground">At Risk</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-foreground">{criticalCount}</span>
                        <span className="text-xs text-muted-foreground">workflows</span>
                    </div>
                </div>
            </div>

            {/* Workflow List */}
            <div className="space-y-3">
                {workflows.map((workflow, index) => {
                    const colors = riskColors[workflow.riskLevel];
                    return (
                        <motion.button
                            key={workflow.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => setSelectedWorkflow(selectedWorkflow?.id === workflow.id ? null : workflow)}
                            className={`w-full text-left p-4 rounded-xl border transition-all ${colors.bg} ${colors.border} hover:scale-[1.01]`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${colors.badge}`} />
                                    <span className="font-medium text-foreground">{workflow.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`text-sm font-medium ${colors.text}`}>
                                        {workflow.riskScore}% risk
                                    </span>
                                    <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${selectedWorkflow?.id === workflow.id ? 'rotate-90' : ''}`} />
                                </div>
                            </div>

                            {/* Expanded Details */}
                            <AnimatePresence>
                                {selectedWorkflow?.id === workflow.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pt-4 mt-4 border-t border-border/50 space-y-4">
                                            {/* Stats */}
                                            <div className="flex gap-4 text-sm">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3 text-muted-foreground" />
                                                    <span className="text-muted-foreground">{workflow.lastRun}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <CheckCircle className="w-3 h-3 text-forest-500" />
                                                    <span className="text-muted-foreground">{workflow.successRate}% success</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <TrendingUp className={`w-3 h-3 ${workflow.trend === 'improving' ? 'text-forest-500' : workflow.trend === 'declining' ? 'text-coral-500' : 'text-muted-foreground'}`} />
                                                    <span className="text-muted-foreground capitalize">{workflow.trend}</span>
                                                </div>
                                            </div>

                                            {/* Predicted Issues */}
                                            {workflow.predictedIssues.length > 0 && (
                                                <div>
                                                    <p className="text-xs font-medium text-muted-foreground mb-2">Predicted Issues</p>
                                                    <div className="space-y-1">
                                                        {workflow.predictedIssues.map((issue, i) => (
                                                            <div key={i} className="flex items-center gap-2 text-sm">
                                                                <XCircle className="w-3 h-3 text-coral-500" />
                                                                <span className="text-foreground">{issue}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Recommendations */}
                                            <div>
                                                <p className="text-xs font-medium text-muted-foreground mb-2">Recommendations</p>
                                                <div className="space-y-1">
                                                    {workflow.recommendations.map((rec, i) => (
                                                        <div key={i} className="flex items-center gap-2 text-sm">
                                                            <CheckCircle className="w-3 h-3 text-forest-500" />
                                                            <span className="text-foreground">{rec}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    );
                })}
            </div>
        </GlassCard>
    );
}
