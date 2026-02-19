import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";

const features = [
    {
        title: "Deep Learning Analysis",
        desc: "Extract logic from PDFs, flowcharts, and diagrams using advanced computer vision and NLP models.",
        details: [
            "GPT-4 Vision for document understanding",
            "Automatic workflow extraction",
            "Multi-format support (PDF, Images, Diagrams)"
        ],
        benefit: "Reduces manual process documentation by 90%"
    },
    {
        title: "Autonomous AI Agents",
        desc: "Auto-generate intelligent agents that execute your workflows without human intervention.",
        details: [
            "Self-learning from your data",
            "Real-time decision making",
            "Continuous improvement"
        ],
        benefit: "24/7 automated operations"
    },
    {
        title: "Multi-Agent Orchestration",
        desc: "Coordinate complex workflows where multiple AI agents collaborate to solve problems together.",
        details: [
            "Agent-to-agent communication",
            "Task delegation & prioritization",
            "Conflict resolution"
        ],
        benefit: "Handle 10x more complex workflows"
    },
    {
        title: "Shadow Mode Testing",
        desc: "Validate new agent behaviors in a risk-free parallel environment before production deployment.",
        details: [
            "Zero-risk testing environment",
            "Side-by-side comparison",
            "Human approval workflow"
        ],
        benefit: "100% safe deployments"
    },
    {
        title: "Real-time Monitoring",
        desc: "Track agent performance, cost, and latency with live dashboards and instant alerts.",
        details: [
            "Live performance metrics",
            "Cost tracking & optimization",
            "Anomaly detection"
        ],
        benefit: "Complete visibility into automation"
    },
    {
        title: "Enterprise Integration",
        desc: "Seamlessly connect with your existing ERP, CRM, and internal tools via secure APIs.",
        details: [
            "200+ pre-built connectors",
            "Custom API support",
            "SSO & security compliance"
        ],
        benefit: "Works with your existing tools"
    }
];

export default function Features() {
    return (
        <section id="features" className="py-24 bg-background">
            <div className="container mx-auto px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <p className="text-sm font-medium text-primary mb-4 uppercase tracking-wide">
                        Comprehensive Features
                    </p>

                    <h2 className="text-4xl md:text-5xl mb-6">
                        Everything You Need for{" "}
                        <span className="text-primary">
                            Intelligent Automation
                        </span>
                    </h2>
                    <p className="text-xl text-muted-foreground">
                        Our platform doesn't just automate tasks—it understands the intent behind your workflows
                        and continuously optimizes for better results.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow"
                        >
                            {/* Title & Description */}
                            <h3 className="text-xl font-semibold mb-3 text-foreground">
                                {feature.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                {feature.desc}
                            </p>

                            {/* Feature Details */}
                            <div className="space-y-2 pt-4 border-t border-border">
                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Key Capabilities
                                </p>
                                {feature.details.map((detail, j) => (
                                    <div key={j} className="flex items-start gap-2 text-sm">
                                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600 dark:text-green-400" />
                                        <span className="text-foreground">{detail}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Benefit Tag */}
                            <div className="mt-4 px-3 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium flex items-center justify-between">
                                <span>{feature.benefit}</span>
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Documentation Link */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                >
                    <p className="text-muted-foreground mb-2">
                        Want to learn more about each feature?
                    </p>
                    <a
                        href="#"
                        className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
                    >
                        Read our detailed documentation
                        <ArrowRight className="w-4 h-4" />
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
