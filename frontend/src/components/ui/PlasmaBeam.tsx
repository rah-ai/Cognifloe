import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface PlasmaBeamProps {
    className?: string;
    color?: "orange" | "blue" | "purple" | "emerald";
}

export function PlasmaBeam({ className, color = "orange" }: PlasmaBeamProps) {
    const colors = {
        orange: {
            beam: "from-orange-500 via-amber-500 to-transparent",
            glow: "bg-orange-500",
            particles: "bg-amber-300"
        },
        blue: {
            beam: "from-blue-500 via-cyan-500 to-transparent",
            glow: "bg-blue-500",
            particles: "bg-cyan-300"
        },
        purple: {
            beam: "from-purple-500 via-violet-500 to-transparent",
            glow: "bg-purple-500",
            particles: "bg-violet-300"
        },
        emerald: {
            beam: "from-emerald-500 via-green-500 to-transparent",
            glow: "bg-emerald-500",
            particles: "bg-green-300"
        }
    };

    const selectedColor = colors[color];

    return (
        <div className={cn("relative w-24 h-[600px] overflow-hidden pointer-events-none select-none", className)}>
            {/* Core Beam */}
            <motion.div
                className={cn(
                    "absolute left-1/2 -translate-x-1/2 top-0 w-2 h-full bg-gradient-to-b opacity-80 blur-sm",
                    selectedColor.beam
                )}
                animate={{
                    height: ["80%", "100%", "85%"],
                    opacity: [0.6, 0.8, 0.6],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Inner White Hot Core */}
            <motion.div
                className="absolute left-1/2 -translate-x-1/2 top-0 w-0.5 h-full bg-white opacity-90 blur-[1px]"
                animate={{
                    height: ["70%", "95%", "75%"],
                    opacity: [0.8, 1, 0.8],
                }}
                transition={{
                    duration: 0.2, // Fast flicker
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
            />

            {/* Wide Glow */}
            <motion.div
                className={cn(
                    "absolute left-1/2 -translate-x-1/2 top-0 w-16 h-2/3 bg-gradient-to-b from-transparent to-transparent opacity-30 blur-xl",
                    selectedColor.beam.replace("to-transparent", "to-transparent") // Reusing gradient
                )}
                animate={{
                    opacity: [0.2, 0.4, 0.2],
                    scaleX: [1, 1.2, 1]
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Particles */}
            {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                    key={i}
                    className={cn("absolute left-1/2 w-1 h-1 rounded-full", selectedColor.particles)}
                    initial={{
                        y: 0,
                        x: 0,
                        opacity: 1
                    }}
                    animate={{
                        y: [0, 600],
                        x: (Math.random() - 0.5) * 40, // Spread out as they fall/flow
                        opacity: [1, 0]
                    }}
                    transition={{
                        duration: 2 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                        ease: "linear"
                    }}
                />
            ))}

            {/* Top Ignition Point */}
            <div className={cn("absolute top-0 left-1/2 -translate-x-1/2 w-12 h-4 blur-xl rounded-full", selectedColor.glow)} />
        </div>
    );
}
