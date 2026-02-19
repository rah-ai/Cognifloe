import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";
import { Link } from "react-router-dom";
import NeuralNetworkScene from "./NeuralNetworkScene";

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-background">
            {/* 3D Background */}
            <NeuralNetworkScene />

            {/* Simple subtle gradient overlay */}
            <div className="absolute inset-0 z-[1] pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 to-transparent" />
            </div>

            <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="space-y-8"
                >
                    {/* Simple Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                        <span className="text-sm font-medium text-primary">
                            AI-Powered Workflow Automation
                        </span>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.1]">
                        Transform Your{" "}
                        <br className="hidden sm:block" />
                        <span className="text-primary">
                            Business Workflows
                        </span>
                        <br />
                        Into Intelligent{" "}
                        <br className="hidden sm:block" />
                        <span className="text-foreground">AI Agents</span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                        CogniFloe analyzes your business processes, identifies automation opportunities,
                        and deploys autonomous AI agents that work 24/7 to save you time and reduce errors.
                    </p>

                    {/* Stats Row - Simple text only */}
                    <div className="flex flex-wrap gap-8 pt-2">
                        <div>
                            <p className="text-3xl font-semibold text-foreground">85%</p>
                            <p className="text-sm text-muted-foreground">Time Saved</p>
                        </div>
                        <div>
                            <p className="text-3xl font-semibold text-foreground">24/7</p>
                            <p className="text-sm text-muted-foreground">AI Working</p>
                        </div>
                        <div>
                            <p className="text-3xl font-semibold text-foreground">99.9%</p>
                            <p className="text-sm text-muted-foreground">Accuracy</p>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap gap-4 pt-4">
                        <Link to="/login">
                            <Button variant="primary" size="lg" className="gap-2">
                                Start Automating
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </Link>
                        <Link to="#features">
                            <Button variant="outline" size="lg">
                                Learn How It Works
                            </Button>
                        </Link>
                    </div>

                    {/* Trust Indicators - Simple text */}
                    <motion.p
                        className="pt-6 text-sm text-muted-foreground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        Trusted by 500+ enterprises worldwide
                    </motion.p>
                </motion.div>

                {/* Right Content - Simple Feature Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="hidden lg:block"
                >
                    <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-foreground mb-1">Email Agent</h3>
                            <p className="text-sm text-green-600 dark:text-green-400">Active • Processing</p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Tasks Completed</span>
                                <span className="font-semibold text-foreground">1,247</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full" style={{ width: "87%" }} />
                            </div>
                            <p className="text-sm text-muted-foreground">87% automation rate</p>
                        </div>

                        <div className="mt-6 pt-6 border-t border-border">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Time saved today</span>
                                <span className="text-lg font-semibold text-green-600 dark:text-green-400">+24 hours</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
