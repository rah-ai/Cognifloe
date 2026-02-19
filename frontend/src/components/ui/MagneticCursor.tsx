import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { cn } from "../../lib/utils";

export default function MagneticCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);

    // Mouse position
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring physics for the main cursor
    const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    // Trail effect (slightly delayed)
    const trailConfig = { damping: 30, stiffness: 200, mass: 0.8 };
    const trailX = useSpring(mouseX, trailConfig);
    const trailY = useSpring(mouseY, trailConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);

        const handleMouseEnter = (e: MouseEvent) => {
            if ((e.target as HTMLElement).closest('.hoverable')) {
                setIsHovering(true);
            }
        };

        const handleMouseLeave = (e: MouseEvent) => {
            if ((e.target as HTMLElement).closest('.hoverable')) {
                setIsHovering(false);
            }
        };

        // Add event listeners
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);

        // Use event delegation for hover detection
        document.body.addEventListener("mouseover", handleMouseEnter);
        document.body.addEventListener("mouseout", handleMouseLeave);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
            document.body.removeEventListener("mouseover", handleMouseEnter);
            document.body.removeEventListener("mouseout", handleMouseLeave);
        };
    }, [mouseX, mouseY]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] custom-cursor hidden md:block">
            {/* Main Cursor (The "Head") */}
            <motion.div
                ref={cursorRef}
                className={cn(
                    "absolute top-0 left-0 w-4 h-4 rounded-full border border-primary/80 bg-primary/20 backdrop-blur-sm transition-all duration-200",
                    isHovering && "w-12 h-12 border-primary/40 bg-transparent",
                    isClicking && "scale-75 bg-primary/50"
                )}
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: "-50%",
                    translateY: "-50%"
                }}
            >
                {/* Center dot */}
                <div className={cn(
                    "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-primary rounded-full transition-all duration-200",
                    isHovering && "w-0 h-0 opacity-0"
                )} />
            </motion.div>

            {/* Trail (The "Tail") */}
            <motion.div
                className="absolute top-0 left-0 w-2 h-2 rounded-full bg-secondary/50 blur-[2px]"
                style={{
                    x: trailX,
                    y: trailY,
                    translateX: "-50%",
                    translateY: "-50%"
                }}
            />
        </div>
    );
}
