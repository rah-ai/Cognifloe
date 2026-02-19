import { cn } from "../../lib/utils";
import { forwardRef, type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    loading?: boolean;
    children?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            children,
            variant = "primary",
            size = "md",
            leftIcon,
            rightIcon,
            loading,
            disabled,
            ...props
        },
        ref
    ) => {
        const variants = {
            primary:
                "bg-gradient-to-r from-sunset-500 to-coral-500 text-white hover:opacity-90 shadow-lg shadow-sunset-500/25",
            secondary:
                "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg shadow-secondary/25",
            outline:
                "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
            ghost: "text-foreground hover:bg-muted",
        };

        const sizes = {
            sm: "px-4 py-2 text-sm",
            md: "px-6 py-3 text-base",
            lg: "px-8 py-4 text-lg",
        };

        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: disabled ? 1 : 1.02 }}
                whileTap={{ scale: disabled ? 1 : 0.98 }}
                className={cn(
                    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    variants[variant],
                    sizes[size],
                    className
                )}
                disabled={disabled || loading}
                {...props}
            >
                {loading ? (
                    <svg
                        className="animate-spin h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                ) : (
                    leftIcon
                )}
                {children}
                {rightIcon}
            </motion.button>
        );
    }
);

Button.displayName = "Button";
