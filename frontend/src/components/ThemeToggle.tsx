import { Moon, Sun, Laptop } from "lucide-react"
import { useTheme } from "../context/ThemeContext"
import { cn } from "../lib/utils"
import { motion } from "framer-motion"

export function ThemeToggle({ className }: { className?: string }) {
    const { theme, setTheme } = useTheme()

    return (
        <div className={cn(
            "flex items-center gap-1 p-1 rounded-full bg-cream-100/80 dark:bg-stone-800/80 backdrop-blur-sm border border-sunset-200/30 dark:border-sunset-500/10 shadow-sm",
            className
        )}>
            <motion.button
                onClick={() => setTheme("light")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                    "p-2 rounded-full transition-all duration-300",
                    theme === "light"
                        ? "bg-white dark:bg-stone-900 shadow-md text-sunset-500"
                        : "text-muted-foreground hover:text-sunset-500"
                )}
                title="Light Mode"
            >
                <Sun className="h-4 w-4" />
            </motion.button>
            <motion.button
                onClick={() => setTheme("system")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                    "p-2 rounded-full transition-all duration-300",
                    theme === "system"
                        ? "bg-white dark:bg-stone-900 shadow-md text-forest-500"
                        : "text-muted-foreground hover:text-forest-500"
                )}
                title="System Mode"
            >
                <Laptop className="h-4 w-4" />
            </motion.button>
            <motion.button
                onClick={() => setTheme("dark")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                    "p-2 rounded-full transition-all duration-300",
                    theme === "dark"
                        ? "bg-white dark:bg-stone-900 shadow-md text-coral-500"
                        : "text-muted-foreground hover:text-coral-500"
                )}
                title="Dark Mode"
            >
                <Moon className="h-4 w-4" />
            </motion.button>
        </div>
    )
}
