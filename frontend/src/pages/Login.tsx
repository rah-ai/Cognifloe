import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, AlertCircle, Github } from "lucide-react";
import { ThemeToggle } from "../components/ThemeToggle";
import { authApi } from "../lib/auth-api";
import NeuralNetworkScene from "../components/home/NeuralNetworkScene";
import { GlassCard } from "../components/ui/GlassCard";
import { Button3D } from "../components/ui/Button3D";
import Logo from "../components/Logo";

export default function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await authApi.login({ email, password });
            localStorage.setItem('token', response.access_token);
            navigate("/dashboard");
        } catch (err: any) {
            setError(err.message || "Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

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
                <Link to="/" className="flex items-center gap-2 text-white/80 dark:text-muted-foreground hover:text-white dark:hover:text-foreground transition-colors">
                    <Logo size="sm" animated={false} showText={true} />
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
                        <h1 className="text-3xl font-bold text-white dark:text-foreground mb-2">Welcome Back</h1>
                        <p className="text-white/80 dark:text-muted-foreground text-sm">
                            Sign in to continue to your dashboard
                        </p>
                    </div>

                    {/* Login Form Card */}
                    <GlassCard className="p-8 bg-white/95 dark:bg-card backdrop-blur-xl border-white/30 dark:border-border shadow-2xl">
                        <form onSubmit={handleLogin} className="space-y-5">
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
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium ml-1 text-foreground">Password</label>
                                    <a href="#" className="text-xs text-primary hover:underline">
                                        Forgot password?
                                    </a>
                                </div>
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
                            </div>

                            <Button3D
                                type="submit"
                                variant="organic"
                                className="w-full"
                                isLoading={isLoading}
                                rightIcon={!isLoading && <ArrowRight className="w-4 h-4" />}
                            >
                                Sign In
                            </Button3D>

                            {/* Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-border"></div>
                                </div>
                                <div className="relative flex justify-center text-xs">
                                    <span className="px-4 bg-white dark:bg-card text-muted-foreground">OR CONTINUE WITH</span>
                                </div>
                            </div>

                            {/* Social Login */}
                            <Button3D
                                type="button"
                                variant="outline"
                                className="w-full"
                                leftIcon={<Github className="w-4 h-4" />}
                            >
                                Github
                            </Button3D>
                        </form>

                        <p className="mt-6 text-center text-sm text-muted-foreground">
                            Don't have an account?{" "}
                            <Link to="/signup" className="text-primary hover:underline font-semibold">
                                Sign up now
                            </Link>
                        </p>
                    </GlassCard>
                </motion.div>
            </div>
        </div>
    );
}
