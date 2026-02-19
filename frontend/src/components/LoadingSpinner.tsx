import { motion } from "framer-motion";

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg";
    text?: string;
}

export default function LoadingSpinner({ size = "md", text }: LoadingSpinnerProps) {
    const sizes = {
        sm: { icon: 40, stroke: 2 },
        md: { icon: 64, stroke: 2.5 },
        lg: { icon: 96, stroke: 3 }
    };

    const { icon: iconSize, stroke: strokeWidth } = sizes[size];

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <motion.div
                className="relative"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
                <svg
                    width={iconSize}
                    height={iconSize}
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="drop-shadow-xl"
                >
                    <defs>
                        <linearGradient id="spinnerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#F97316" />
                            <stop offset="50%" stopColor="#DB2777" />
                            <stop offset="100%" stopColor="#7C3AED" />
                        </linearGradient>
                        <filter id="spinnerGlow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Hexagon Frame - animated draw */}
                    <motion.path
                        d="M50 5L90 27.5V72.5L50 95L10 72.5V27.5L50 5Z"
                        stroke="url(#spinnerGradient)"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                        filter="url(#spinnerGlow)"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Inner Neural Pattern */}
                    <motion.path
                        d="M50 25L50 45M50 25L30 35M50 25L70 35"
                        stroke="url(#spinnerGradient)"
                        strokeWidth={strokeWidth * 0.8}
                        strokeLinecap="round"
                        opacity={0.8}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, delay: 0.5, repeat: Infinity }}
                    />

                    {/* Core Triangle */}
                    <motion.path
                        d="M50 45L35 55L65 55L50 45Z"
                        stroke="url(#spinnerGradient)"
                        strokeWidth={strokeWidth * 0.8}
                        strokeLinejoin="round"
                        fill="none"
                        opacity={0.8}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, delay: 0.8, repeat: Infinity }}
                    />

                    {/* Pulsing Core */}
                    <motion.circle
                        cx="50"
                        cy="50"
                        r="0"
                        fill="url(#spinnerGradient)"
                        animate={{ r: [0, 15, 20], opacity: [0.4, 0.1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                    />

                    {/* Data Nodes */}
                    <motion.circle
                        cx="50" cy="25" r="3" fill="#fff"
                        animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                    />
                    <motion.circle
                        cx="50" cy="75" r="3" fill="#fff"
                        animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                    />
                </svg>
            </motion.div>

            {text && (
                <motion.p
                    className="text-sm text-muted-foreground font-medium"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    {text}
                </motion.p>
            )}
        </div>
    );
}

// Full page loading screen
export function LoadingScreen({ text = "Loading..." }: { text?: string }) {
    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-xl flex items-center justify-center z-50">
            <div className="text-center">
                <LoadingSpinner size="lg" />
                <motion.div
                    className="mt-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sunset-500 to-coral-500 mb-2">
                        {text}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Please wait while we prepare your experience
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
