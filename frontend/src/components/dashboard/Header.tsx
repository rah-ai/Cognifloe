import { motion, AnimatePresence } from "framer-motion";
import { Menu, Smartphone, Settings, LogOut } from "lucide-react";
import { ThemeToggle } from "../ThemeToggle";
import { cn } from "../../lib/utils";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
    setIsMobileView: (open: boolean) => void;
    isMobileView: boolean;
    handleLogout: () => void;
}

interface UserInfo {
    name: string;
    email: string;
    initials: string;
}

function getUserFromToken(): UserInfo {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return { name: "Guest User", email: "guest@cognifloe.ai", initials: "GU" };
        }

        // Decode JWT token (base64)
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));

        const fullName = decoded.full_name || decoded.name || decoded.email?.split('@')[0] || "User";
        const email = decoded.email || "user@cognifloe.ai";

        // Get initials from name
        const nameParts = fullName.split(' ');
        const initials = nameParts.length >= 2
            ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
            : fullName.substring(0, 2).toUpperCase();

        return { name: fullName, email, initials };
    } catch {
        return { name: "User", email: "user@cognifloe.ai", initials: "U" };
    }
}

export function Header({ setIsMobileView, isMobileView, handleLogout }: HeaderProps) {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [user, setUser] = useState<UserInfo>(getUserFromToken());
    const profileMenuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Update user info when component mounts or token changes
    useEffect(() => {
        setUser(getUserFromToken());
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="h-20 border-b border-sunset-500/10 dark:border-white/10 bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-50 transition-all duration-300">
            <div className="flex items-center gap-4">
                <button className="md:hidden p-2 hover:bg-sunset-500/10 rounded-lg text-muted-foreground">
                    <Menu className="w-6 h-6" />
                </button>
                <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-sunset-600 to-coral-500 dark:from-sunset-400 dark:to-coral-400">
                    Dashboard
                </h2>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={() => setIsMobileView(!isMobileView)}
                    className={cn(
                        "p-2 rounded-full transition-all duration-300 border border-transparent",
                        isMobileView
                            ? "bg-sunset-500/10 text-sunset-600 dark:text-sunset-400 border-sunset-500/20"
                            : "hover:bg-sunset-500/10 text-muted-foreground"
                    )}
                    title="Toggle Shadow Mobile View"
                >
                    <Smartphone className="w-5 h-5" />
                </button>
                <ThemeToggle />

                {/* User Profile Dropdown */}
                <div className="relative" ref={profileMenuRef}>
                    <motion.button
                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 rounded-full bg-gradient-to-tr from-sunset-500 to-coral-500 border border-white/20 shadow-lg flex items-center justify-center text-white font-medium hover:opacity-90 transition-opacity"
                    >
                        <span className="sr-only">User Profile</span>
                        {user.initials}
                    </motion.button>

                    <AnimatePresence>
                        {isProfileMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 mt-4 w-72 bg-white dark:bg-stone-900 backdrop-blur-2xl border border-sunset-500/10 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[100] origin-top-right"
                            >
                                <div className="p-4 border-b border-sunset-500/10 dark:border-white/5 bg-sunset-500/5 dark:bg-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-sunset-500 to-coral-500 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                                            {user.initials}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-foreground truncate">{user.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-2 space-y-1">
                                    <button
                                        onClick={() => {
                                            navigate("/dashboard/settings");
                                            setIsProfileMenuOpen(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-sunset-500/10 transition-colors text-left"
                                    >
                                        <div className="p-1.5 rounded-md bg-sunset-500/10 text-sunset-600 dark:text-sunset-400">
                                            <Settings className="w-4 h-4" />
                                        </div>
                                        Settings
                                    </button>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-coral-600 dark:text-coral-400 hover:bg-coral-500/10 transition-colors text-left"
                                    >
                                        <div className="p-1.5 rounded-md bg-coral-500/10 text-coral-600 dark:text-coral-400">
                                            <LogOut className="w-4 h-4" />
                                        </div>
                                        Sign Out
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}
