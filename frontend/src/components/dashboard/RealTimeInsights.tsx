import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { Bell, Cpu, Database, Globe, Layers, Layout, RefreshCw, Shield, User, Zap } from "lucide-react";
import { useState, useEffect } from "react";

export function RealTimeInsights() {
    const [activeGridIndex, setActiveGridIndex] = useState<number | null>(null);

    // Randomize grid activity
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveGridIndex(Math.floor(Math.random() * 9));
            setTimeout(() => setActiveGridIndex(null), 1000); // Highlight lasts 1s
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const alerts = [
        { title: "Yuna Alert", status: "PROCESSING", color: "text-emerald-500", icon: Zap },
        { title: "Figma Update", status: "SYNCING", color: "text-blue-500", icon: Layers },
        { title: "Facebook Alert", status: "UPDATING", color: "text-orange-500", icon: Globe },
        { title: "LinkedIn Notification", status: "CHECKING", color: "text-indigo-500", icon: User },
    ];

    const gridIcons = [
        User, RefreshCw, Shield,
        Database, Layers, Layout,
        Cpu, Globe, Bell
    ];

    return (
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1: Intelligent Orchestration (Radar) */}
            <div className="flex flex-col items-center justify-center p-6 space-y-8 relative overflow-hidden rounded-2xl border border-white/5 bg-black/40">
                {/* Radar Animation */}
                <div className="relative w-48 h-48 flex items-center justify-center">
                    {/* Concentric Circles */}
                    <div className="absolute inset-0 rounded-full border border-emerald-500/10" />
                    <div className="absolute inset-8 rounded-full border border-emerald-500/10" />
                    <div className="absolute inset-16 rounded-full border border-emerald-500/10" />

                    {/* Scanning Line (Sweep) */}
                    <motion.div
                        className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-transparent to-emerald-500/20"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        style={{ clipPath: "polygon(50% 50%, 100% 0, 100% 50%)" }} // Simple wedge shape via clip-path
                    />

                    {/* Alternative standard CSS conical gradient approach for smoother beam */}
                    <motion.div
                        className="absolute w-full h-full rounded-full"
                        style={{
                            background: "conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 300deg, rgba(16, 185, 129, 0.4) 360deg)"
                        }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Blip */}
                    <motion.div
                        className="absolute top-10 right-10 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,1)]"
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
                    />
                </div>

                <div className="text-center pb-4">
                    <h3 className="text-lg font-bold text-foreground mb-1">INTELLIGENT INTEGRATION</h3>
                    <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">
                        CogniFloe organizes and prioritizes every task to ensure efficient execution.
                    </p>
                </div>
            </div>

            {/* Column 2: Real-time Insights (List) */}
            <div className="p-6 rounded-2xl border border-white/5 bg-black/40 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="font-bold text-foreground">REAL-TIME INSIGHTS</h3>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse" />
                        <span className="text-xs font-bold text-lime-500">LIVE</span>
                    </div>
                </div>

                <p className="text-xs text-muted-foreground mb-6">
                    Stay updated with CogniFloe's live notifications across all your platforms.
                </p>

                <div className="space-y-6 flex-1">
                    {alerts.map((alert, i) => (
                        <div key={i} className="group">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded bg-white/5 border border-white/10 ${alert.color}`}>
                                        <alert.icon className="w-4 h-4" />
                                    </div>
                                    <span className={`text-sm font-medium ${alert.color}`}>{alert.title}</span>
                                </div>
                                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{alert.status}</span>
                            </div>
                            {/* Progress bar */}
                            <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    className={cn("h-full", alert.color.replace('text-', 'bg-'))}
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                        delay: i * 0.5,
                                        ease: "easeInOut"
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Column 3: Grid (System Activity) */}
            <div className="p-6 rounded-2xl border border-white/5 bg-black/40 flex items-center justify-center">
                <div className="grid grid-cols-3 gap-6">
                    {gridIcons.map((Icon, i) => {
                        const isActive = activeGridIndex === i;
                        return (
                            <div key={i} className="relative group">
                                <motion.div
                                    className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300",
                                        isActive
                                            ? "bg-lime-500/20 border-lime-500 shadow-[0_0_15px_rgba(132,204,22,0.3)]"
                                            : "bg-white/5 border-white/5 group-hover:bg-white/10"
                                    )}
                                    animate={{
                                        scale: isActive ? 1.1 : 1,
                                    }}
                                >
                                    <Icon className={cn(
                                        "w-5 h-5 transition-colors",
                                        isActive ? "text-lime-500" : "text-muted-foreground"
                                    )} />
                                </motion.div>

                                {/* Connection lines (visual decoration) */}
                                {i % 3 !== 2 && ( // Horizontal connections
                                    <div className="absolute top-1/2 -right-6 w-6 h-[1px] bg-white/5" />
                                )}
                                {i < 6 && ( // Vertical connections
                                    <div className="absolute -bottom-6 left-1/2 w-[1px] h-6 bg-white/5" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
