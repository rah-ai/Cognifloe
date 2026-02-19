import { motion } from "framer-motion"
import { Brain, TrendingUp, AlertTriangle, DollarSign, Target, CheckCircle2, ArrowRight } from "lucide-react"

interface AnalysisResult {
    complexity: {
        score: number
        level: string
        color: string
        factors: string[]
        description: string
    }
    bottlenecks: {
        count: number
        detected: Array<{
            type: string
            indicator: string
            severity: string
            description: string
            suggestion: string
        }>
        hasBottlenecks: boolean
    }
    optimizations: Array<{
        title: string
        description: string
        impact: string
        effort: string
        time_savings: string
    }>
    cost_benefit: {
        manual_hours_per_execution: number
        automated_hours_per_execution: number
        time_saved_percentage: number
        monthly_time_savings_hours: number
        monthly_cost_savings: number
        annual_cost_savings: number
        roi_months: number
        productivity_boost: string
    }
    risks: {
        score: number
        level: string
        color: string
        identified_risks: Array<{
            type: string
            description: string
            severity: string
            mitigation: string
        }>
        risk_count: number
    }
    overall_score: {
        score: number
        status: string
        color: string
        recommendation: string
    }
}

interface WorkflowAnalysisResultsProps {
    analysis: AnalysisResult
    workflowName: string
    onClose?: () => void
}

export default function WorkflowAnalysisResults({ analysis, workflowName, onClose }: WorkflowAnalysisResultsProps) {
    const getSeverityColor = (severity: string) => {
        switch (severity.toLowerCase()) {
            case 'high': return 'text-red-500'
            case 'medium': return 'text-yellow-500'
            case 'low': return 'text-green-500'
            default: return 'text-blue-500'
        }
    }

    const getImpactBadgeColor = (impact: string) => {
        switch (impact.toLowerCase()) {
            case 'high': return 'bg-green-500/20 text-green-300 border-green-500/30'
            case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
            case 'low': return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
            default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between"
                >
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">
                            <Brain className="inline w-10 h-10 mr-3 text-blue-400" />
                            Workflow Analysis Results
                        </h1>
                        <p className="text-gray-300">Deep AI analysis for: <span className="font-semibold text-blue-400">{workflowName}</span></p>
                    </div>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
                        >
                            Close
                        </button>
                    )}
                </motion.div>

                {/* Overall Score Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">Overall Health Score</h2>
                            <p className="text-gray-300">{analysis.overall_score.recommendation}</p>
                        </div>
                        <div className="text-center">
                            <div
                                className="text-6xl font-bold mb-2"
                                style={{ color: analysis.overall_score.color }}
                            >
                                {analysis.overall_score.score}
                            </div>
                            <div
                                className="px-4 py-2 rounded-full text-sm font-semibold"
                                style={{
                                    backgroundColor: `${analysis.overall_score.color}20`,
                                    color: analysis.overall_score.color,
                                    border: `2px solid ${analysis.overall_score.color}40`
                                }}
                            >
                                {analysis.overall_score.status}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Complexity */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">Complexity</h3>
                            <Brain className="w-6 h-6 text-blue-400" />
                        </div>
                        <div className="text-4xl font-bold mb-2" style={{ color: analysis.complexity.color }}>
                            {analysis.complexity.score}/10
                        </div>
                        <div className="text-sm font-semibold mb-3" style={{ color: analysis.complexity.color }}>
                            {analysis.complexity.level}
                        </div>
                        <p className="text-gray-300 text-sm">{analysis.complexity.description}</p>
                    </motion.div>

                    {/* Bottlenecks */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">Bottlenecks</h3>
                            <AlertTriangle className="w-6 h-6 text-yellow-400" />
                        </div>
                        <div className="text-4xl font-bold mb-2 text-yellow-400">
                            {analysis.bottlenecks.count}
                        </div>
                        <div className="text-sm font-semibold mb-3 text-yellow-300">
                            {analysis.bottlenecks.count === 0 ? 'None Found' : 'Detected'}
                        </div>
                        <p className="text-gray-300 text-sm">
                            {analysis.bottlenecks.hasBottlenecks
                                ? `Found ${analysis.bottlenecks.count} potential bottlenecks`
                                : 'No significant bottlenecks detected'}
                        </p>
                    </motion.div>

                    {/* Cost Savings */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">ROI</h3>
                            <DollarSign className="w-6 h-6 text-green-400" />
                        </div>
                        <div className="text-4xl font-bold mb-2 text-green-400">
                            ${analysis.cost_benefit.monthly_cost_savings.toLocaleString()}
                        </div>
                        <div className="text-sm font-semibold mb-3 text-green-300">
                            Monthly Savings
                        </div>
                        <p className="text-gray-300 text-sm">
                            {analysis.cost_benefit.time_saved_percentage}% time reduction
                        </p>
                    </motion.div>
                </div>

                {/* Detailed Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Optimization Suggestions */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
                    >
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                            <Target className="w-6 h-6 mr-2 text-blue-400" />
                            Optimization Opportunities
                        </h3>
                        <div className="space-y-4">
                            {analysis.optimizations.map((opt, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white/5 rounded-lg p-4 border border-white/10"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <h4 className="font-semibold text-white">{opt.title}</h4>
                                        <span className={`px-2 py-1 rounded text-xs font-semibold border ${getImpactBadgeColor(opt.impact)}`}>
                                            {opt.impact} Impact
                                        </span>
                                    </div>
                                    <p className="text-gray-300 text-sm mb-2">{opt.description}</p>
                                    <div className="flex items-center text-xs text-gray-400">
                                        <span className="mr-4">Effort: {opt.effort}</span>
                                        <span className="text-green-400">💡 {opt.time_savings}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Risks & Bottlenecks Detail */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
                    >
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                            <AlertTriangle className="w-6 h-6 mr-2 text-yellow-400" />
                            Identified Risks
                        </h3>
                        <div className="space-y-4">
                            {analysis.risks.identified_risks.length > 0 ? (
                                analysis.risks.identified_risks.map((risk, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-white/5 rounded-lg p-4 border border-white/10"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="font-semibold text-white">{risk.type}</h4>
                                            <span className={`text-xs font-semibold ${getSeverityColor(risk.severity)}`}>
                                                {risk.severity} Risk
                                            </span>
                                        </div>
                                        <p className="text-gray-300 text-sm mb-2">{risk.description}</p>
                                        <p className="text-blue-400 text-xs">
                                            <strong>Mitigation:</strong> {risk.mitigation}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-400">
                                    <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-400" />
                                    <p>No significant risks identified</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Cost-Benefit Analysis */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
                >
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                        <TrendingUp className="w-6 h-6 mr-2 text-green-400" />
                        Cost-Benefit Analysis
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-white/5 rounded-lg">
                            <div className="text-3xl font-bold text-white mb-1">
                                {analysis.cost_benefit.manual_hours_per_execution}h
                            </div>
                            <div className="text-sm text-gray-400">Manual Time</div>
                        </div>
                        <div className="text-center p-4 bg-white/5 rounded-lg">
                            <div className="text-3xl font-bold text-green-400 mb-1">
                                {analysis.cost_benefit.automated_hours_per_execution}h
                            </div>
                            <div className="text-sm text-gray-400">Automated Time</div>
                        </div>
                        <div className="text-center p-4 bg-white/5 rounded-lg">
                            <div className="text-3xl font-bold text-blue-400 mb-1">
                                ${analysis.cost_benefit.annual_cost_savings.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-400">Annual Savings</div>
                        </div>
                        <div className="text-center p-4 bg-white/5 rounded-lg">
                            <div className="text-3xl font-bold text-purple-400 mb-1">
                                {analysis.cost_benefit.productivity_boost}
                            </div>
                            <div className="text-sm text-gray-400">Faster</div>
                        </div>
                    </div>
                </motion.div>

                {/* Action Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-center"
                >
                    <button
                        onClick={onClose}
                        className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg text-white font-semibold transition-all transform hover:scale-105 flex items-center mx-auto"
                    >
                        Deploy Workflow
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                </motion.div>
            </div>
        </div>
    )
}
