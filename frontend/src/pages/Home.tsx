import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import WorkflowJourney from "../components/home/WorkflowJourney";
import { ThemeToggle } from "../components/ThemeToggle";
import { Link } from "react-router-dom";
import { Button3D } from "../components/ui/Button3D";
import Logo from "../components/Logo";
import { ArrowRight, CheckCircle, Star } from "lucide-react";

export default function Home() {
    const { scrollYProgress, scrollY } = useScroll();
    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

    // Track scroll for shrinking navbar
    const [isScrolled, setIsScrolled] = useState(false);
    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50);
    });

    return (
        <div className="min-h-screen bg-background text-foreground overflow-hidden relative selection:bg-sunset-500/30">
            {/* Parallax Background Elements - Warm Organic Blurs */}
            <motion.div
                style={{ y: backgroundY }}
                className="fixed inset-0 z-[-1] pointer-events-none"
            >
                <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] rounded-full bg-sunset-500/8 blur-[150px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[700px] h-[700px] rounded-full bg-forest-500/8 blur-[150px]" />
                <div className="absolute top-[40%] left-[30%] w-[500px] h-[500px] rounded-full bg-coral-500/5 blur-[120px]" />
                <div className="absolute top-[60%] right-[20%] w-[400px] h-[400px] rounded-full bg-amber-500/5 blur-[100px]" />
            </motion.div>

            {/* Scroll-Aware Navbar */}
            <motion.nav
                className={`fixed top-0 w-full z-50 backdrop-blur-xl border-b transition-all duration-200 ${isScrolled
                    ? "bg-white/95 dark:bg-stone-900/95 border-sunset-200/30 dark:border-sunset-500/20 shadow-md"
                    : "bg-white/80 dark:bg-stone-900/80 border-sunset-200/20 dark:border-sunset-500/10"
                    }`}
                initial={false}
                animate={{ height: isScrolled ? 56 : 72 }}
                transition={{ duration: 0.15 }}
            >
                <div className="container mx-auto px-6 h-full flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-3">
                        <Logo size="md" animated={true} showText={true} />
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-sunset-600 dark:hover:text-sunset-400 transition-colors">
                            Features
                        </a>
                        <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-sunset-600 dark:hover:text-sunset-400 transition-colors">
                            How It Works
                        </a>
                        <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-sunset-600 dark:hover:text-sunset-400 transition-colors">
                            Pricing
                        </a>
                    </div>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <Link to="/login">
                            <Button3D variant="ghost" size="sm">Login</Button3D>
                        </Link>
                        <Link to="/signup">
                            <Button3D variant="organic" size="sm">Get Started</Button3D>
                        </Link>
                    </div>
                </div>
            </motion.nav>

            <main>
                <Hero />
                <div id="features">
                    <Features />
                </div>
                <div id="how-it-works">
                    <WorkflowJourney />
                </div>

                {/* Testimonials Section */}
                <section className="py-24 relative">
                    <div className="container mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
                                Trusted by{" "}
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-sunset-500 to-coral-500">
                                    Industry Leaders
                                </span>
                            </h2>
                            <p className="text-muted-foreground">
                                See what enterprises are saying about CogniFloe
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    quote: "CogniFloe reduced our invoice processing time by 85%. The AI agents work flawlessly around the clock.",
                                    author: "Sarah Chen",
                                    role: "CFO, TechCorp Inc",
                                    rating: 5
                                },
                                {
                                    quote: "The shadow mode testing gave us complete confidence before deploying to production. Game changer.",
                                    author: "Michael Rodriguez",
                                    role: "CTO, FinanceHub",
                                    rating: 5
                                },
                                {
                                    quote: "We automated 40+ workflows in the first month. The ROI was visible within weeks.",
                                    author: "Emily Watson",
                                    role: "Operations Director, RetailMax",
                                    rating: 5
                                }
                            ].map((testimonial, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl border border-sunset-200/20 dark:border-sunset-500/10 rounded-2xl p-8"
                                >
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(testimonial.rating)].map((_, j) => (
                                            <Star key={j} className="w-5 h-5 fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>
                                    <p className="text-foreground mb-6 italic">"{testimonial.quote}"</p>
                                    <div>
                                        <p className="font-bold text-foreground">{testimonial.author}</p>
                                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section id="pricing" className="py-32 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-sunset-500 via-coral-500 to-amber-500 opacity-95" />

                    {/* Organic decorative shapes */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                        <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                        <motion.div
                            className="absolute top-1/2 left-1/4 w-4 h-4 bg-white/30 rounded-full"
                            animate={{ y: [0, -20, 0], scale: [1, 1.2, 1] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        />
                        <motion.div
                            className="absolute top-1/3 right-1/3 w-3 h-3 bg-white/40 rounded-full"
                            animate={{ y: [0, 15, 0], scale: [1, 0.8, 1] }}
                            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                        />
                    </div>

                    <div className="container mx-auto px-6 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 tracking-tight font-display">
                                Ready to Transform?
                            </h2>
                            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
                                Join 500+ enterprises already automating their workflows with intelligent AI agents.
                            </p>

                            {/* Benefits list */}
                            <div className="flex flex-wrap justify-center gap-6 mb-12 text-white/90">
                                {["Free 14-day trial", "No credit card required", "Setup in 5 minutes"].map((benefit, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5" />
                                        <span>{benefit}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-center gap-6">
                                <Link to="/signup">
                                    <Button3D
                                        variant="secondary"
                                        size="lg"
                                        className="bg-white text-sunset-600 hover:bg-white/90 shadow-lg"
                                        rightIcon={<ArrowRight className="w-5 h-5" />}
                                    >
                                        Start Free Trial
                                    </Button3D>
                                </Link>
                                <Link to="/login">
                                    <Button3D
                                        variant="outline"
                                        size="lg"
                                        className="border-white/30 text-white hover:bg-white/10"
                                    >
                                        Contact Sales
                                    </Button3D>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-16 border-t border-sunset-200/20 dark:border-sunset-500/10 bg-cream-50/50 dark:bg-stone-900/50">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div className="md:col-span-1">
                            <Logo size="md" animated={false} showText={true} />
                            <p className="text-muted-foreground text-sm mt-4">
                                Transforming business processes into intelligent automation.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4 text-foreground">Product</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><a href="#" className="hover:text-sunset-600 transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-sunset-600 transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-sunset-600 transition-colors">Documentation</a></li>
                                <li><a href="#" className="hover:text-sunset-600 transition-colors">API</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4 text-foreground">Company</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><a href="#" className="hover:text-sunset-600 transition-colors">About</a></li>
                                <li><a href="#" className="hover:text-sunset-600 transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-sunset-600 transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-sunset-600 transition-colors">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4 text-foreground">Legal</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><a href="#" className="hover:text-sunset-600 transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-sunset-600 transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-sunset-600 transition-colors">Security</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-sunset-200/20 dark:border-sunset-500/10 text-center text-muted-foreground text-sm">
                        <p>&copy; 2025 CogniFloe. All rights reserved. Built with ❤️ for automation.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
