import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";

interface Button3DProps extends Omit<HTMLMotionProps<"button">, 'children'> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "organic" | "success";
    size?: "sm" | "md" | "lg" | "icon";
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    children?: React.ReactNode;
}

export function Button3D({
    className,
    children,
    variant = "primary",
    size = "md",
    isLoading = false,
    leftIcon,
    rightIcon,
    ...props
}: Button3DProps) {
    const variants = {
        primary: `
            bg-primary 
            text-primary-foreground 
            shadow-[0_4px_0_0_#b5700a] 
            hover:shadow-[0_2px_0_0_#b5700a] 
            hover:translate-y-[2px]
            active:shadow-none active:translate-y-[4px]
        `,
        secondary: `
            bg-secondary
            text-secondary-foreground 
            shadow-[0_4px_0_0_#94a3b8] 
            hover:shadow-[0_2px_0_0_#94a3b8] 
            hover:translate-y-[2px]
            active:shadow-none active:translate-y-[4px]
        `,
        organic: `
            bg-gradient-to-r from-sunset-500 to-coral-500 
            text-white 
            shadow-[0_6px_0_0_#9a3412] 
            hover:shadow-[0_3px_0_0_#9a3412] 
            hover:translate-y-[3px]
            active:shadow-none active:translate-y-[6px]
        `,
        success: `
            bg-emerald-500
            text-white 
            shadow-[0_4px_0_0_#064e3b] 
            hover:shadow-[0_2px_0_0_#064e3b] 
            hover:translate-y-[2px]
            active:shadow-none active:translate-y-[4px]
        `,
        outline: `
            border-2 border-primary 
            text-primary
            hover:bg-primary/10
            shadow-none
        `,
        ghost: `
            hover:bg-primary/10 
            text-foreground
            shadow-none
        `,
    };

    const sizes = {
        sm: "h-9 px-4 text-sm rounded-lg gap-1.5",
        md: "h-11 px-6 text-base rounded-xl gap-2",
        lg: "h-14 px-8 text-lg rounded-2xl gap-2.5",
        icon: "h-11 w-11 p-2 rounded-xl"
    };

    return (
        <motion.button
            className={cn(
                "relative inline-flex items-center justify-center font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background",
                variants[variant],
                sizes[size],
                className
            )}
            whileTap={{ scale: 0.97 }}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {!isLoading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </motion.button>
    );
}
