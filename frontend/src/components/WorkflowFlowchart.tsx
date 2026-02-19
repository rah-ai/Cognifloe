import { useCallback, useState, useEffect } from 'react'
import ReactFlow, {
    type Node,
    type Edge,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    type Connection,
    MarkerType,
    BackgroundVariant,
    MiniMap,
    Panel,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { motion } from 'framer-motion'
import { Bot, Play, CheckCircle2, Loader2, AlertCircle, Maximize2, Minimize2 } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

interface Agent {
    id?: string
    role: string
    description: string
    status?: 'Active' | 'Idle' | 'Deploying'
    confidence_score?: number
}

interface WorkflowFlowchartProps {
    agents: Agent[]
    workflowSteps?: Array<{ description: string; actor?: string }>
}

const getStatusIcon = (status?: string) => {
    switch (status) {
        case 'Active':
            return <Play className="w-4 h-4 text-green-400" />
        case 'Deploying':
            return <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
        case 'Idle':
            return <AlertCircle className="w-4 h-4 text-gray-400" />
        default:
            return <Bot className="w-4 h-4 text-purple-400" />
    }
}

const getStatusColor = (status?: string) => {
    switch (status) {
        case 'Active':
            return 'border-green-500 bg-green-500/20 shadow-green-500/50'
        case 'Deploying':
            return 'border-blue-500 bg-blue-500/20 shadow-blue-500/50'
        case 'Idle':
            return 'border-gray-500 bg-gray-500/10'
        default:
            return 'border-purple-500 bg-purple-500/10'
    }
}

// Enhanced custom node component with better animations
const CustomNode = ({ data }: { data: any }) => {
    const [isHovered, setIsHovered] = useState(false)
    const { theme } = useTheme()
    const isDark = theme === 'dark'

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05, y: -3 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`px-5 py-4 rounded-2xl border-2 backdrop-blur-md shadow-2xl ${getStatusColor(data.status)} cursor-move`}
            style={{
                backgroundColor: isDark ? undefined : 'rgba(255, 255, 255, 0.95)',
                minWidth: '180px',
                maxWidth: '240px',
            }}
        >
            <div className="flex items-center gap-3 mb-2">
                <motion.div
                    animate={{ rotate: isHovered ? 360 : 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex-shrink-0"
                >
                    {data.icon || <Bot className="w-5 h-5 text-blue-400" />}
                </motion.div>
                <span className={`font-bold text-sm leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {data.label}
                </span>
            </div>
            {data.description && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-xs mb-2 leading-relaxed line-clamp-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                >
                    {data.description}
                </motion.p>
            )}
            {data.confidence && (
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                        <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Confidence</span>
                        <span className="text-green-600 dark:text-green-400 font-semibold">{Math.round(data.confidence * 100)}%</span>
                    </div>
                    <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-gray-700/50' : 'bg-gray-300/70'}`}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${data.confidence * 100}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-blue-500 via-green-500 to-emerald-500 rounded-full"
                        />
                    </div>
                </div>
            )}
            {data.status && (
                <div className={`flex items-center gap-2 mt-2.5 pt-2.5 border-t ${isDark ? 'border-white/10' : 'border-gray-300/50'}`}>
                    <motion.div
                        animate={data.status === 'Deploying' ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ repeat: Infinity, duration: 1 }}
                    >
                        {getStatusIcon(data.status)}
                    </motion.div>
                    <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{data.status}</span>
                </div>
            )}
        </motion.div>
    )
}

const nodeTypes = {
    custom: CustomNode,
}

export default function WorkflowFlowchart({ agents }: WorkflowFlowchartProps) {
    const { theme } = useTheme()
    const isDark = theme === 'dark'
    const [isFullscreen, setIsFullscreen] = useState(false)

    // Generate nodes from agents and steps with improved layout
    const generateNodes = (): Node[] => {
        const nodes: Node[] = []
        const horizontalSpacing = 280  // Space between nodes horizontally
        const verticalSpacing = 180    // Space between rows

        // Calculate grid layout for agents
        const agentCount = agents.length
        const nodesPerRow = Math.min(3, agentCount)  // Max 3 nodes per row
        const totalWidth = nodesPerRow * horizontalSpacing
        const startX = 100  // Starting X position

        // Start node
        nodes.push({
            id: 'start',
            type: 'custom',
            position: { x: startX + totalWidth / 2 - 110, y: 30 },
            data: {
                label: 'Start',
                icon: <Play className="w-6 h-6 text-green-400" />,
            },
        })

        // Agent nodes with horizontal flow layout
        agents.forEach((agent, index) => {
            const row = Math.floor(index / nodesPerRow)
            const col = index % nodesPerRow

            // Offset odd rows for better visual flow
            const rowOffset = row % 2 === 1 ? horizontalSpacing / 2 : 0

            const x = startX + col * horizontalSpacing + rowOffset
            const y = 180 + row * verticalSpacing

            nodes.push({
                id: `agent-${index}`,
                type: 'custom',
                position: { x, y },
                data: {
                    label: agent.role,
                    description: agent.description,
                    status: agent.status,
                    confidence: agent.confidence_score,
                    icon: <Bot className="w-6 h-6 text-purple-400" />,
                },
            })
        })

        // End node - position below all agent rows
        const totalRows = Math.ceil(agentCount / nodesPerRow)
        const endY = 180 + totalRows * verticalSpacing
        nodes.push({
            id: 'end',
            type: 'custom',
            position: { x: startX + totalWidth / 2 - 110, y: endY },
            data: {
                label: 'Complete',
                icon: <CheckCircle2 className="w-6 h-6 text-green-400" />,
            },
        })

        return nodes
    }

    // Generate edges with enhanced animations
    const generateEdges = (): Edge[] => {
        const edges: Edge[] = []

        // Connect start to first agent
        if (agents.length > 0) {
            edges.push({
                id: 'e-start-agent0',
                source: 'start',
                target: 'agent-0',
                type: 'smoothstep',
                animated: true,
                style: { stroke: '#3B82F6', strokeWidth: 3 },
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: '#3B82F6',
                    width: 25,
                    height: 25,
                },
            })
        }

        // Connect agents sequentially with varying colors
        agents.forEach((_, index) => {
            if (index < agents.length - 1) {
                const colors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B']
                const color = colors[index % colors.length]
                edges.push({
                    id: `e-agent${index}-agent${index + 1}`,
                    source: `agent-${index}`,
                    target: `agent-${index + 1}`,
                    type: 'smoothstep',
                    animated: true,
                    style: { stroke: color, strokeWidth: 3 },
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        color: color,
                        width: 25,
                        height: 25,
                    },
                })
            }
        })

        // Connect last agent to end
        if (agents.length > 0) {
            edges.push({
                id: `e-agent${agents.length - 1}-end`,
                source: `agent-${agents.length - 1}`,
                target: 'end',
                type: 'smoothstep',
                animated: true,
                style: { stroke: '#10B981', strokeWidth: 3 },
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: '#10B981',
                    width: 25,
                    height: 25,
                },
            })
        }

        return edges
    }

    const [nodes, , onNodesChange] = useNodesState(generateNodes())
    const [edges, setEdges, onEdgesChange] = useEdgesState(generateEdges())

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    )

    // Auto-fit view on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            const fitViewBtn = document.querySelector('.react-flow__controls-fitview')
            if (fitViewBtn) (fitViewBtn as HTMLElement).click()
        }, 100)
        return () => clearTimeout(timer)
    }, [])

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`${isFullscreen ? 'fixed inset-0 z-50' : 'h-[700px]'
                } ${isDark ? 'bg-gray-900/50 border-white/10' : 'bg-gray-50/95 border-gray-300'
                } rounded-2xl border backdrop-blur-sm overflow-hidden shadow-2xl`}
        >
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={false}
                panOnDrag={false}
                zoomOnScroll={false}
                zoomOnPinch={false}
                zoomOnDoubleClick={false}
                style={{
                    background: 'transparent',
                }}
            >
                <Controls
                    className={isDark
                        ? "!bg-gray-800/90 !border-white/20 [&>button]:!bg-gray-700/80 [&>button]:!border-white/10 [&>button]:!text-white hover:[&>button]:!bg-gray-600/80 !shadow-xl"
                        : "!bg-white !border-gray-400 [&>button]:!bg-white [&>button]:!border-gray-300 [&>button]:!text-gray-800 hover:[&>button]:!bg-gray-100 !shadow-xl"
                    }
                    showInteractive={false}
                />
                <MiniMap
                    className={isDark
                        ? "!bg-gray-800/90 !border-2 !border-white/20 rounded-lg !shadow-xl"
                        : "!bg-white !border-2 !border-gray-400 rounded-lg !shadow-xl"
                    }
                    nodeColor={(node) => {
                        if (node.id === 'start') return '#10B981'
                        if (node.id === 'end') return '#10B981'
                        return '#8B5CF6'
                    }}
                    maskColor={isDark ? "rgba(0, 0, 0, 0.6)" : "rgba(255, 255, 255, 0.6)"}
                />
                <Background
                    variant={BackgroundVariant.Dots}
                    gap={20}
                    size={1.5}
                    color={isDark ? "#ffffff" : "#000000"}
                    style={{ opacity: isDark ? 0.15 : 0.2 }}
                />
                <Panel position="top-right" className="m-2">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className={isDark
                            ? "p-3 rounded-xl bg-gray-800/90 border border-white/20 text-white hover:bg-gray-700/90 transition-all shadow-xl"
                            : "p-3 rounded-xl bg-white border border-gray-400 text-gray-800 hover:bg-gray-100 transition-all shadow-xl"
                        }
                    >
                        {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                    </motion.button>
                </Panel>
            </ReactFlow>
        </motion.div>
    )
}
