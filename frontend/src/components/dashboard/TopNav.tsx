import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    FileInput,
    BookOpen,
    Bot,
    Brain,
    Eye,
    BarChart3,
    Settings,
    User,
    LogOut,
    ChevronDown,
    Menu,
    X,
} from "lucide-react";
import Logo from "../Logo";
import { ThemeToggle } from "../ThemeToggle";
import GlobalSearch from "../GlobalSearch";

const navItems = [
    { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
    { icon: FileInput, label: "Workflow", path: "/dashboard/input" },
    { icon: BookOpen, label: "Agents", path: "/dashboard/catalog" },
    { icon: Bot, label: "Architectures", path: "/dashboard/agents" },
    { icon: Brain, label: "AI Predictions", path: "/dashboard/ml-predictions" },
    { icon: Eye, label: "Shadow Mode", path: "/dashboard/shadow-mode" },
    { icon: BarChart3, label: "Metrics", path: "/dashboard/metrics" },
];

interface TopNavProps {
    handleLogout: () => void;
}

function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(" ");
}

export function TopNav({ handleLogout }: TopNavProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <>
            {/* Main Navigation Bar */}
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="sticky top-0 z-50 w-full"
            >
                {/* Glassmorphic Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/90 to-background/80 backdrop-blur-xl border-b border-white/10" />

                {/* Subtle gradient line at top */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-sunset-500/50 to-transparent" />

                <div className="relative max-w-[1800px] mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo Section with Tagline */}
                        <Link to="/dashboard" className="flex items-center gap-2 group flex-shrink-0">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center"
                            >
                                <Logo size="sm" showText={true} animated={false} />
                            </motion.div>
                        </Link>

                        {/* Center Navigation - Desktop */}
                        <nav className="hidden lg:flex items-center bg-muted/40 dark:bg-white/5 rounded-xl p-1.5 border border-border/40 dark:border-white/10">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end={item.path === "/dashboard"}
                                    className="relative flex-shrink-0"
                                >
                                    {({ isActive }) => (
                                        <motion.div
                                            className={cn(
                                                "flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap",
                                                isActive
                                                    ? "bg-gradient-to-r from-sunset-500 to-coral-500 text-white shadow-sm"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                                            )}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <span>{item.label}</span>
                                        </motion.div>
                                    )}
                                </NavLink>
                            ))}
                        </nav>

                        {/* Right Side Actions */}
                        <div className="flex items-center gap-3">
                            {/* Global Search */}
                            <GlobalSearch />

                            {/* Settings */}
                            <NavLink to="/dashboard/settings">
                                {({ isActive }) => (
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={cn(
                                            "p-2.5 rounded-xl transition-colors",
                                            isActive
                                                ? "bg-sunset-500/20 text-sunset-500"
                                                : "text-muted-foreground hover:bg-white/10 hover:text-foreground"
                                        )}
                                    >
                                        <Settings className="w-5 h-5" />
                                    </motion.div>
                                )}
                            </NavLink>

                            {/* Theme Toggle */}
                            <ThemeToggle />

                            {/* Profile Dropdown */}
                            <div className="relative">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 p-2 pr-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sunset-500 to-coral-500 flex items-center justify-center">
                                        <User className="w-4 h-4 text-white" />
                                    </div>
                                    <ChevronDown className={cn(
                                        "w-4 h-4 text-muted-foreground transition-transform duration-200",
                                        isProfileOpen && "rotate-180"
                                    )} />
                                </motion.button>

                                {/* Profile Dropdown Menu */}
                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-2 w-56 bg-card/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl overflow-hidden"
                                        >
                                            <div className="p-2">
                                                <NavLink
                                                    to="/dashboard/settings"
                                                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
                                                    onClick={() => setIsProfileOpen(false)}
                                                >
                                                    <Settings className="w-4 h-4" />
                                                    Settings
                                                </NavLink>
                                                <button
                                                    onClick={() => {
                                                        setIsProfileOpen(false);
                                                        handleLogout();
                                                    }}
                                                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    Logout
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
                            >
                                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Navigation Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden fixed top-16 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border z-40"
                    >
                        <nav className="p-4 space-y-1">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end={item.path === "/dashboard"}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={({ isActive }) =>
                                        cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors",
                                            isActive
                                                ? "bg-gradient-to-r from-sunset-500 to-coral-500 text-white"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                        )
                                    }
                                >
                                    {item.label}
                                </NavLink>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default TopNav;
