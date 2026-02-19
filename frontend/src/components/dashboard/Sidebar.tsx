import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    FileInput,
    Bot,
    BarChart3,
    Activity,
    FlaskConical,
    Settings,
    ChevronLeft,
    Store,
    LogOut,
} from "lucide-react";
import Logo from "../Logo";

interface SidebarProps {
    isOpen: boolean;
    onToggle: () => void;
}

const navItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Overview", end: true },
    { path: "/dashboard/input", icon: FileInput, label: "Workflow Input" },
    { path: "/dashboard/agents", icon: Bot, label: "Agents" },
    { path: "/dashboard/catalog", icon: Store, label: "Agent Catalog" },
    { path: "/dashboard/ml-predictions", icon: BarChart3, label: "ML Predictions" },
    { path: "/dashboard/metrics", icon: Activity, label: "Metrics" },
    { path: "/dashboard/shadow-mode", icon: FlaskConical, label: "Shadow Mode" },
    { path: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onToggle}
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isOpen ? 256 : 80 }}
                className={`fixed left-0 top-0 h-screen bg-card border-r border-border z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="h-16 flex items-center justify-between px-4 border-b border-border">
                        <AnimatePresence mode="wait">
                            {isOpen ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <Logo size="sm" showText showTagline={false} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <Logo size="sm" showText={false} />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            onClick={onToggle}
                            className="hidden lg:flex w-8 h-8 items-center justify-center rounded-lg hover:bg-muted transition-colors"
                        >
                            <ChevronLeft
                                className={`w-5 h-5 transition-transform ${!isOpen && "rotate-180"}`}
                            />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.end}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                  ${isActive
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                    }`
                                }
                            >
                                <item.icon className="w-5 h-5 flex-shrink-0" />
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.span
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: "auto" }}
                                            exit={{ opacity: 0, width: 0 }}
                                            className="font-medium text-sm whitespace-nowrap overflow-hidden"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </NavLink>
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className="p-3 border-t border-border">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                            <LogOut className="w-5 h-5 flex-shrink-0" />
                            <AnimatePresence>
                                {isOpen && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="font-medium text-sm"
                                    >
                                        Logout
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>
                    </div>
                </div>
            </motion.aside>
        </>
    );
}
