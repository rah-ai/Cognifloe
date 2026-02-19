import { cn } from "../../lib/utils";
import { forwardRef } from "react";
import type { ReactNode } from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    variant?: "default" | "heavy" | "solid";
    hover?: boolean;
    glow?: boolean;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
    ({ className, children, variant = "default", hover = false, glow = false, ...props }, ref) => {
        const variants = {
            default: "glass",
            heavy: "glass-heavy",
            solid: "bg-card border border-border",
        };

        return (
            <div
                ref={ref}
                className={cn(
                    "rounded-xl p-6 transition-all duration-300",
                    variants[variant],
                    hover && "hover:scale-[1.02] hover:shadow-xl cursor-pointer",
                    glow && "glow-primary",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

GlassCard.displayName = "GlassCard";
