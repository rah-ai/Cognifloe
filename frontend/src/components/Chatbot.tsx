import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X, Send, Mic, Minimize2, Volume2, VolumeX, Sparkles, User, AudioLines } from "lucide-react"
import { useVoiceAssistant } from "../hooks/useVoiceAssistant"
import { useWorkflow } from "../context/WorkflowContext"
import { GlassCard } from "./ui/GlassCard"

interface Message {
    id: string
    text: string
    sender: "user" | "bot"
    timestamp: Date
}

export default function Chatbot() {
    const { workflows, getMetrics } = useWorkflow()
    const metrics = getMetrics()
    const [isOpen, setIsOpen] = useState(false)
    const [isMinimized, setIsMinimized] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            text: "System Online. I am your CogniFloe tactical assistant. Ready for instructions.",
            sender: "bot",
            timestamp: new Date()
        }
    ])
    const [inputValue, setInputValue] = useState("")
    const [isVoiceEnabled, setIsVoiceEnabled] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const {
        isListening,
        transcript,
        startListening,
        stopListening,
        speak,
        cancelSpeech
    } = useVoiceAssistant()

    useEffect(() => {
        if (transcript) {
            setInputValue(transcript)
        }
    }, [transcript])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isOpen])

    const handleSend = async () => {
        if (!inputValue.trim()) return

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: "user",
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInputValue("")

        // Simulate AI processing
        setTimeout(() => {
            const botResponse = getBotResponse(userMessage.text)
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: botResponse,
                sender: "bot",
                timestamp: new Date()
            }
            setMessages(prev => [...prev, botMessage])

            if (isVoiceEnabled) {
                speak(botResponse)
            }
        }, 1000)
    }

    const getBotResponse = (input: string): string => {
        const lowerInput = input.toLowerCase()

        if (lowerInput.includes("workflow")) {
            if (workflows.length === 0) return "No workflows detected in sector 4. Recommend initializing new sequence."
            return `Detected ${workflows.length} active sequences. Latest designation: '${workflows[0].name}'.`
        }

        if (lowerInput.includes("agent")) {
            const activeAgents = metrics.activeAgents
            if (activeAgents === 0) return "Agent cluster inactive. Deploy workflow to instantiate units."
            return `Cluster status: ${activeAgents} agents online. Functioning within normal parameters.`
        }

        if (lowerInput.includes("metric") || lowerInput.includes("stat")) {
            return `System efficiency at ${metrics.avgAutomation}%. Throughput count: ${metrics.totalWorkflows} cycles.`
        }

        if (lowerInput.includes("help")) {
            return "Command Interface capabilities: \n1. Workflow status checks \n2. Agent health monitoring \n3. Metric analysis \n4. Automation initialization"
        }

        return "Input received. Please clarify directive regarding 'workflows', 'agents', or 'system metrics'."
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: "bottom right" }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            height: isMinimized ? "auto" : 520
                        }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="pointer-events-auto w-[380px] mb-4 flex flex-col"
                    >
                        <GlassCard className="flex flex-col h-full overflow-hidden p-0 border-primary/20 shadow-2xl" variant="heavy">
                            {/* Header */}
                            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-primary/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/25 border border-white/10">
                                        <Sparkles className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                                            Cortex AI
                                            <span className="text-[9px] font-mono bg-primary/20 text-primary px-1.5 py-0.5 rounded border border-primary/30">V.3.1</span>
                                        </h3>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Online</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => {
                                            if (isVoiceEnabled) cancelSpeech()
                                            setIsVoiceEnabled(!isVoiceEnabled)
                                        }}
                                        className={`p-1.5 hover:bg-white/10 rounded-md transition-colors ${isVoiceEnabled ? 'text-primary' : 'text-muted-foreground'}`}
                                        title={isVoiceEnabled ? "Disable Voice" : "Enable Voice"}
                                    >
                                        {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                                    </button>
                                    <button
                                        onClick={() => setIsMinimized(!isMinimized)}
                                        className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-muted-foreground"
                                    >
                                        <Minimize2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-muted-foreground hover:text-red-400"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Messages */}
                            {!isMinimized && (
                                <>
                                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                        {messages.map((msg) => (
                                            <div
                                                key={msg.id}
                                                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                                            >
                                                <div className={`flex gap-3 max-w-[85%] ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${msg.sender === "user" ? "bg-white/10" : "bg-primary/20"}`}>
                                                        {msg.sender === "user" ? <User className="w-3 h-3 text-muted-foreground" /> : <Sparkles className="w-3 h-3 text-primary" />}
                                                    </div>
                                                    <div
                                                        className={`p-3 rounded-2xl text-sm leading-relaxed border ${msg.sender === "user"
                                                            ? "bg-primary/10 text-foreground rounded-tr-none border-primary/20"
                                                            : "bg-white/5 text-muted-foreground rounded-tl-none border-white/5"
                                                            }`}
                                                    >
                                                        {msg.text}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </div>

                                    {/* Input */}
                                    <div className="p-4 border-t border-white/5 bg-black/20">
                                        {isVoiceEnabled && isListening && (
                                            <div className="mb-2 flex items-center justify-center gap-1 h-6">
                                                {[1, 2, 3, 4, 5].map((i) => (
                                                    <motion.div
                                                        key={i}
                                                        animate={{ height: ["20%", "100%", "20%"] }}
                                                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                                                        className="w-1 bg-primary rounded-full h-full"
                                                    />
                                                ))}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={isListening ? stopListening : startListening}
                                                className={`p-2.5 rounded-xl transition-all duration-300 border ${isListening
                                                    ? "bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                                                    : "bg-white/5 hover:bg-white/10 text-muted-foreground border-transparent"
                                                    }`}
                                            >
                                                {isListening ? <AudioLines className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                            </button>
                                            <input
                                                type="text"
                                                value={inputValue}
                                                onChange={(e) => setInputValue(e.target.value)}
                                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                                placeholder="Enter command..."
                                                className="flex-1 bg-white/5 border border-white/5 rounded-xl px-3 py-2.5 focus:outline-none focus:border-primary/50 focus:bg-white/10 text-sm placeholder:text-muted-foreground/30 transition-all font-mono"
                                            />
                                            <button
                                                onClick={handleSend}
                                                disabled={!inputValue.trim()}
                                                className="p-2.5 bg-primary/20 text-primary border border-primary/20 rounded-xl hover:bg-primary/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-[0_0_15px_-3px_rgba(var(--primary-rgb),0.3)]"
                                            >
                                                <Send className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className={`w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary text-white shadow-2xl shadow-primary/40 flex items-center justify-center pointer-events-auto transition-all duration-500 z-50 group border border-white/20 ${isOpen ? 'translate-y-24 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}
            >
                <div className="absolute inset-0 bg-white/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                <MessageSquare className="w-6 h-6 relative z-10" />
                {/* Notification Dot */}
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-black flex items-center justify-center text-[9px] font-bold">1</span>
            </motion.button>
        </div>
    )
}
