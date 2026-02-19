import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, AlertCircle, ArrowLeft, CheckCircle } from "lucide-react";
import { ThemeToggle } from "../components/ThemeToggle";
import { authApi } from "../lib/auth-api";
import NeuralNetworkScene from "../components/home/NeuralNetworkScene";
import { GlassCard } from "../components/ui/GlassCard";
import { Button3D } from "../components/ui/Button3D";
import Logo from "../components/Logo";

export default function Signup() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await authApi.signup({ email, password, full_name: fullName });
            localStorage.setItem('token', response.access_token);
            navigate("/dashboard");
        } catch (err: any) {
            setError(err.message || "Signup failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const benefits = [
        "Deploy AI agents in minutes",
        "85% average time savings",
        "No coding required",
        "Free 14-day trial"
    ];

    return (
        <div className="min-h-screen w-full relative overflow-hidden">
            {/* Theme-Aware Background with NeuralNetworkScene */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-primary/20 to-background dark:from-stone-900 dark:via-stone-950 dark:to-stone-900" />
                <div className="absolute inset-0">
                    <NeuralNetworkScene />
                </div>
            </div>

            {/* Top Navigation Bar */}
            <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-6">
                <Link to="/login" className="flex items-center gap-2 text-white/80 dark:text-muted-foreground hover:text-white dark:hover:text-foreground transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Back to Login</span>
                </Link>
                <ThemeToggle />
            </div>

            {/* Centered Form Container */}
            <div className="relative z-20 min-h-screen flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md"
                >
                    {/* CogniFloe Branding - Above Form */}
                    <div className="text-center mb-6">
                        <motion.div
                            className="flex justify-center mb-4"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                        >
                            <div className="p-4 rounded-2xl bg-white/90 dark:bg-transparent shadow-lg dark:shadow-none">
                                <Logo size="lg" animated={true} showText={false} />
                            </div>
                        </motion.div>
                        <h1 className="text-3xl font-bold text-white dark:text-foreground mb-2">Create Account</h1>
                        <p className="text-white/80 dark:text-muted-foreground text-sm">
                            Join to automate your enterprise workflows
                        </p>
                    </div>

                    {/* Signup Form Card */}
                    <GlassCard className="p-8 bg-white/95 dark:bg-card backdrop-blur-xl border-white/30 dark:border-border shadow-2xl">
                        <form onSubmit={handleSignup} className="space-y-4">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-2 text-destructive text-sm"
                                >
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </motion.div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1 text-foreground">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Enter Name"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/50 border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1 text-foreground">Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@example.com"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/50 border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1 text-foreground">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/50 border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        required
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground ml-1">Must be at least 8 characters</p>
                            </div>

                            <Button3D
                                type="submit"
                                variant="organic"
                                className="w-full mt-2"
                                isLoading={isLoading}
                                rightIcon={!isLoading && <ArrowRight className="w-4 h-4" />}
                            >
                                Create Account
                            </Button3D>
                        </form>

                        <p className="mt-6 text-center text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link to="/login" className="text-primary hover:underline font-semibold">
                                Sign in
                            </Link>
                        </p>
                    </GlassCard>

                    {/* Benefits List - Below Form */}
                    <motion.div
                        className="mt-6 p-4 rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-border"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="grid grid-cols-2 gap-3">
                            {benefits.map((benefit, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + i * 0.1 }}
                                    className="flex items-center gap-2 text-white dark:text-foreground"
                                >
                                    <CheckCircle className="w-4 h-4 text-white dark:text-green-500 flex-shrink-0" />
                                    <span className="text-xs">{benefit}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* CogniFloe Tagline */}
                    <motion.p
                        className="mt-4 text-center text-white/70 dark:text-muted-foreground text-sm italic"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        "The bridge between human intent and autonomous execution"
                    </motion.p>
                </motion.div>
            </div>
        </div>
    );
}
