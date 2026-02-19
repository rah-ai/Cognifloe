import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";

interface ArtisanButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
}

export function ArtisanButton({
    children,
    className,
    variant = "primary",
    size = "md",
    isLoading = false,
    leftIcon,
    rightIcon,
    ...props
}: ArtisanButtonProps) {

    const variants = {
        primary: "bg-primary text-primary-foreground hover:text-white border border-transparent hover:border-primary/50",
        secondary: "bg-secondary text-secondary-foreground hover:text-white border border-transparent hover:border-secondary/50",
        outline: "bg-transparent border border-input text-foreground hover:text-primary hover:border-primary",
        ghost: "bg-transparent hover:bg-muted text-foreground hover:text-foreground",
    };

    const sizes = {
        sm: "h-9 px-3 text-xs",
        md: "h-11 px-6 text-sm",
        lg: "h-14 px-8 text-base",
    };

    return (
        <button
            className={cn(
                "group relative inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 overflow-hidden hoverable active:scale-95 disabled:pointer-events-none disabled:opacity-50",
                variants[variant],
                sizes[size],
                className
            )}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {/* Liquid Fill Animation Background */}
            {(variant === "primary" || variant === "secondary") && (
                <div className="absolute inset-0 translate-y-[100%] bg-black/20 transition-transform duration-300 group-hover:translate-y-0" />
            )}
            {variant === "outline" && (
                <div className="absolute inset-0 translate-y-[100%] bg-primary/10 transition-transform duration-300 group-hover:translate-y-0" />
            )}

            {/* Content Content */}
            <div className="relative z-10 flex items-center gap-2">
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {!isLoading && leftIcon}
                <span className="tracking-wide">{children}</span>
                {!isLoading && rightIcon}
            </div>
        </button>
    );
}
