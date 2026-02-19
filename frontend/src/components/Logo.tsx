import { motion } from "framer-motion";

interface LogoProps {
    size?: "sm" | "md" | "lg" | "xl";
    animated?: boolean;
    showText?: boolean;
    showTagline?: boolean;
    className?: string;
}

/**
 * CogniFloe Logo - Unique Handcrafted Design
 * 
 * CONCEPT: The "Flowing Mind" - A continuous neural pathway that represents:
 * - The letter "C" (Cognition) flowing into "F" (Flow)
 * - Connected nodes representing workflow steps
 * - Smooth curves showing automation/continuous processing
 * - The infinity-like flow showing endless automation capability
 */
export default function Logo({
    size = "md",
    animated = true,
    showText = true,
    showTagline = true,
    className = ""
}: LogoProps) {
    const sizes = {
        sm: { icon: 42, text: "text-lg", tagline: "text-[8px]", gap: "gap-2.5" },
        md: { icon: 50, text: "text-xl", tagline: "text-[9px]", gap: "gap-3" },
        lg: { icon: 64, text: "text-2xl", tagline: "text-[10px]", gap: "gap-4" },
        xl: { icon: 84, text: "text-3xl", tagline: "text-xs", gap: "gap-5" },
    };

    const { icon: iconSize, text: textSize, tagline: taglineSize, gap } = sizes[size];

    // Handcrafted drawing animation - feels organic
    const draw: any = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: (i: number) => ({
            pathLength: 1,
            opacity: 1,
            transition: {
                pathLength: { delay: i * 0.25, duration: 1.8, ease: "easeInOut" },
                opacity: { delay: i * 0.25, duration: 0.3 }
            }
        })
    };

    const nodeReveal: any = {
        hidden: { scale: 0, opacity: 0 },
        visible: (i: number) => ({
            scale: 1,
            opacity: 1,
            transition: { delay: i * 0.25, duration: 0.4, type: "spring", stiffness: 200 }
        })
    };

    return (
        <div className={`flex items-center ${gap} ${className}`}>
            <motion.div
                className="relative flex-shrink-0"
                initial="hidden"
                animate="visible"
            >
                <svg
                    width={iconSize}
                    height={iconSize}
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="drop-shadow-lg"
                >
                    <defs>
                        {/* Warm flowing gradient - represents energy & intelligence */}
                        <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#F97316" />
                            <stop offset="50%" stopColor="#E11D48" />
                            <stop offset="100%" stopColor="#7C3AED" />
                        </linearGradient>

                        {/* Subtle accent gradient */}
                        <linearGradient id="accentGradient" x1="100%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#FB923C" />
                            <stop offset="100%" stopColor="#A855F7" />
                        </linearGradient>

                        {/* Premium glow */}
                        <filter id="flowGlow" x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur stdDeviation="1.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* 
                        THE FLOW MARK - A unique continuous path representing:
                        - Input → Processing → Output workflow
                        - Neural pathway connecting three workflow nodes
                        - Forms abstract "CF" when viewed artistically
                    */}

                    {/* Main Flow Path - The continuous automation journey */}
                    <motion.path
                        d="M20 50 
                           C20 32 35 20 50 20 
                           C65 20 80 32 80 50 
                           C80 68 65 80 50 80 
                           C35 80 25 72 22 60"
                        stroke="url(#flowGradient)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        fill="none"
                        filter="url(#flowGlow)"
                        variants={draw}
                        custom={0}
                    />

                    {/* Inner Processing Path - Shows the intelligence/decision making */}
                    <motion.path
                        d="M35 50 
                           C35 40 42 35 50 35 
                           C58 35 65 42 65 50 
                           C65 58 58 65 50 65"
                        stroke="url(#accentGradient)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        fill="none"
                        opacity={0.8}
                        variants={draw}
                        custom={1}
                    />

                    {/* Connector Lines - Links between workflow nodes */}
                    <motion.path
                        d="M50 20 L50 35"
                        stroke="url(#flowGradient)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        variants={draw}
                        custom={1.5}
                    />
                    <motion.path
                        d="M65 50 L80 50"
                        stroke="url(#flowGradient)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        variants={draw}
                        custom={1.8}
                    />
                    <motion.path
                        d="M50 65 L50 80"
                        stroke="url(#flowGradient)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        variants={draw}
                        custom={2}
                    />

                    {/* Workflow Nodes - The steps in automation */}
                    {/* Input Node (Top) */}
                    <motion.circle
                        cx="50"
                        cy="20"
                        r="5"
                        fill="url(#flowGradient)"
                        variants={nodeReveal}
                        custom={2.5}
                    />
                    {/* Process Node (Center) */}
                    <motion.circle
                        cx="50"
                        cy="50"
                        r="6"
                        fill="#fff"
                        stroke="url(#flowGradient)"
                        strokeWidth="2"
                        variants={nodeReveal}
                        custom={3}
                    />
                    {/* Output Node (Right) */}
                    <motion.circle
                        cx="80"
                        cy="50"
                        r="5"
                        fill="url(#flowGradient)"
                        variants={nodeReveal}
                        custom={3.5}
                    />
                    {/* Result Node (Bottom) */}
                    <motion.circle
                        cx="50"
                        cy="80"
                        r="5"
                        fill="url(#flowGradient)"
                        variants={nodeReveal}
                        custom={4}
                    />
                    {/* Entry Point (Left) */}
                    <motion.circle
                        cx="20"
                        cy="50"
                        r="4"
                        fill="url(#accentGradient)"
                        variants={nodeReveal}
                        custom={4.5}
                    />

                    {/* Pulsing Core - AI Processing */}
                    {animated && (
                        <motion.circle
                            cx="50"
                            cy="50"
                            r="0"
                            stroke="url(#flowGradient)"
                            strokeWidth="1"
                            fill="none"
                            animate={{
                                r: [6, 18, 22],
                                opacity: [0.5, 0.2, 0]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeOut",
                                delay: 4
                            }}
                        />
                    )}

                    {/* Flow Arrow Head - Indicates direction/automation */}
                    <motion.path
                        d="M16 56 L22 60 L18 65"
                        stroke="url(#flowGradient)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                        variants={draw}
                        custom={5}
                    />
                </svg>
            </motion.div>

            {/* Typography - Clean, Bold, Readable */}
            {showText && (
                <motion.div
                    className="flex flex-col justify-center"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.5, duration: 0.6 }}
                >
                    <span className={`${textSize} font-extrabold tracking-tight leading-none`}>
                        <span className="text-orange-500">Cogni</span>
                        <span className="text-stone-800 dark:text-white">Floe</span>
                    </span>
                    {showTagline && (
                        <span className={`${taglineSize} font-medium text-stone-500 dark:text-stone-400 tracking-wider uppercase mt-1`}>
                            AI Workflow Automation Recommendation Engine
                        </span>
                    )}
                </motion.div>
            )}
        </div>
    );
}

// Static icon version for favicons, etc.
export function LogoIcon({ size = 36, className = "" }: { size?: number; className?: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`drop-shadow-md ${className}`}
        >
            <defs>
                <linearGradient id="iconFlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F97316" />
                    <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
            </defs>
            {/* Main Flow */}
            <path
                d="M20 50 C20 30 35 18 50 18 C68 18 82 32 82 50 C82 68 68 82 50 82 C35 82 24 72 21 58"
                stroke="url(#iconFlowGrad)"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
            />
            {/* Inner Ring */}
            <circle cx="50" cy="50" r="15" stroke="url(#iconFlowGrad)" strokeWidth="3" fill="none" />
            {/* Nodes */}
            <circle cx="50" cy="18" r="6" fill="url(#iconFlowGrad)" />
            <circle cx="82" cy="50" r="6" fill="url(#iconFlowGrad)" />
            <circle cx="50" cy="82" r="6" fill="url(#iconFlowGrad)" />
            <circle cx="50" cy="50" r="5" fill="#fff" stroke="url(#iconFlowGrad)" strokeWidth="2" />
            {/* Arrow */}
            <path d="M15 54 L21 58 L17 64" stroke="url(#iconFlowGrad)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
    );
}
