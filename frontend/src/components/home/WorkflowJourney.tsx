import { motion } from "framer-motion";
import { FileText, Brain, LayoutTemplate, Rocket, ArrowRight, Clock, Sparkles } from "lucide-react";

const steps = [
    {
        icon: <FileText className="w-10 h-10" />,
        title: "Input Your Workflow",
        desc: "Upload documents, describe your process via voice, or connect existing tools. Our AI understands natural language.",
        step: "01",
        color: "sunset",
        details: "Supports PDFs, flowcharts, audio, and text input",
        time: "< 2 min"
    },
    {
        icon: <Brain className="w-10 h-10" />,
        title: "AI Deep Analysis",
        desc: "Our neural engine extracts logic, identifies decision points, and maps dependencies automatically.",
        step: "02",
        color: "forest",
        details: "Uses GPT-4, computer vision, and custom ML models",
        time: "~30 sec"
    },
    {
        icon: <LayoutTemplate className="w-10 h-10" />,
        title: "Agent Architecture",
        desc: "Auto-constructs the optimal multi-agent system tailored to your specific workflow requirements.",
        step: "03",
        color: "coral",
        details: "Generates specialized agents with defined roles",
        time: "Instant"
    },
    {
        icon: <Rocket className="w-10 h-10" />,
        title: "Deploy & Monitor",
        desc: "One-click deploy to production or test safely in shadow mode with full observability.",
        step: "04",
        color: "amber",
        details: "Real-time metrics, alerts, and human oversight",
        time: "1-click"
    }
];

const colorClasses = {
    sunset: {
        bg: "bg-sunset-500",
        bgLight: "bg-sunset-500/10",
        text: "text-sunset-600 dark:text-sunset-400",
        border: "border-sunset-500/30",
        gradient: "from-sunset-500 to-sunset-600"
    },
    forest: {
        bg: "bg-forest-500",
        bgLight: "bg-forest-500/10",
        text: "text-forest-600 dark:text-forest-400",
        border: "border-forest-500/30",
        gradient: "from-forest-500 to-forest-600"
    },
    coral: {
        bg: "bg-coral-500",
        bgLight: "bg-coral-500/10",
        text: "text-coral-600 dark:text-coral-400",
        border: "border-coral-500/30",
        gradient: "from-coral-500 to-coral-600"
    },
    amber: {
        bg: "bg-amber-500",
        bgLight: "bg-amber-500/10",
        text: "text-amber-600 dark:text-amber-400",
        border: "border-amber-500/30",
        gradient: "from-amber-500 to-amber-600"
    }
};

export default function WorkflowJourney() {
    return (
        <section className="py-32 bg-gradient-to-b from-cream-50/50 to-transparent dark:from-stone-900/50 dark:to-transparent border-y border-sunset-200/20 dark:border-sunset-500/10 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-sunset-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-forest-500/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                            How It Works
                        </span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold font-display">
                        From Manual Chaos to{" "}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-sunset-500 to-coral-500">
                            Automated Intelligence
                        </span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mt-4">
                        Four simple steps to transform any business process into an intelligent, self-running system
                    </p>
                </motion.div>

                {/* Steps Timeline */}
                <div className="relative">
                    {/* Connecting Line - Desktop */}
                    <div className="hidden lg:block absolute top-32 left-0 w-full h-1 z-0">
                        <div className="h-full bg-gradient-to-r from-sunset-500/30 via-forest-500/30 via-coral-500/30 to-amber-500/30 rounded-full" />
                        {/* Animated flow */}
                        <motion.div
                            className="absolute top-0 left-0 h-full w-1/4 bg-gradient-to-r from-sunset-500 to-transparent rounded-full"
                            animate={{ left: ["0%", "75%", "0%"] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </div>

                    {/* Steps Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                        {steps.map((step, i) => {
                            const colors = colorClasses[step.color as keyof typeof colorClasses];

                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15 }}
                                    className="group relative"
                                >
                                    <div className={`bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl border ${colors.border} p-8 rounded-2xl hover:shadow-xl hover:shadow-${step.color}-500/10 transition-all duration-300 relative z-20 text-center h-full flex flex-col`}>
                                        {/* Step Number Badge */}
                                        <div className={`absolute -top-4 -right-4 w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-${step.color}-500/30 group-hover:scale-110 transition-transform`}>
                                            {step.step}
                                        </div>

                                        {/* Icon */}
                                        <div className={`w-20 h-20 mx-auto ${colors.bgLight} rounded-2xl border ${colors.border} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${colors.text}`}>
                                            {step.icon}
                                        </div>

                                        {/* Content */}
                                        <h3 className="text-xl font-bold mb-3 text-foreground">{step.title}</h3>
                                        <p className="text-muted-foreground text-sm mb-4 flex-1">{step.desc}</p>

                                        {/* Details */}
                                        <div className={`p-3 rounded-lg ${colors.bgLight} border ${colors.border} text-xs mb-3`}>
                                            <p className={`${colors.text} font-medium`}>{step.details}</p>
                                        </div>

                                        {/* Time indicator */}
                                        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                                            <Clock className="w-3 h-3" />
                                            <span>{step.time}</span>
                                        </div>
                                    </div>

                                    {/* Arrow connector - Desktop only */}
                                    {i < steps.length - 1 && (
                                        <div className="hidden lg:flex absolute top-32 -right-4 z-30">
                                            <ArrowRight className={`w-8 h-8 ${colors.text}`} />
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-16"
                >
                    <p className="text-muted-foreground mb-2">
                        Average time from input to deployment
                    </p>
                    <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sunset-500 to-forest-500">
                        Under 5 Minutes
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
