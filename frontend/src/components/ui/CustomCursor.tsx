import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const dot = dotRef.current;
        const ring = ringRef.current;

        if (!dot || !ring) return;

        // Init positions
        gsap.set(dot, { xPercent: -50, yPercent: -50 });
        gsap.set(ring, { xPercent: -50, yPercent: -50 });

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        document.addEventListener('mousemove', handleMouseMove);

        // Animation Loop for smoothness
        const ticker = gsap.ticker.add(() => {
            gsap.to(dot, {
                x: mouseX,
                y: mouseY,
                duration: 0.1,
                ease: "power2.out"
            });
            gsap.to(ring, {
                x: mouseX,
                y: mouseY,
                duration: 0.5,
                ease: "power2.out"
            });
        });

        // Event Delegation for Hoverables
        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('.hoverable')) {
                const hoverEl = target.closest('.hoverable') as HTMLElement;
                document.body.classList.add('magnetic-active');

                if (hoverEl.getAttribute('data-magnetic') === 'true') {
                    gsap.to(ring, { scale: 1.5, borderColor: 'transparent' });

                    // Add magnetic movement listener to this specific element
                    hoverEl.addEventListener('mousemove', handleMagneticMove);
                }
            }
        };

        const handleMouseOut = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('.hoverable')) {
                const hoverEl = target.closest('.hoverable') as HTMLElement;
                document.body.classList.remove('magnetic-active');

                // Reset ring
                gsap.to(ring, {
                    scale: 1,
                    borderColor: 'var(--cursor-ring)'
                });

                if (hoverEl.getAttribute('data-magnetic') === 'true') {
                    gsap.to(hoverEl, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
                    hoverEl.removeEventListener('mousemove', handleMagneticMove);
                }
            }
        };

        const handleMagneticMove = (e: MouseEvent) => {
            const hoverEl = e.currentTarget as HTMLElement;
            const rect = hoverEl.getBoundingClientRect();
            const x = e.clientX - (rect.left + rect.width / 2);
            const y = e.clientY - (rect.top + rect.height / 2);

            gsap.to(hoverEl, {
                x: x * 0.2,
                y: y * 0.2,
                duration: 0.3,
                ease: "power2.out"
            });
        }

        document.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mouseout', handleMouseOut);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mouseout', handleMouseOut);
            gsap.ticker.remove(ticker);
        };
    }, []);

    return (
        <>
            <div
                ref={dotRef}
                id="cursor-dot"
                className="fixed top-0 left-0 w-1.5 h-1.5 bg-primary rounded-full pointer-events-none z-[9999]"
            />
            <div
                ref={ringRef}
                id="cursor-ring"
                className="fixed top-0 left-0 w-[30px] h-[30px] border border-[var(--cursor-ring)] rounded-full pointer-events-none z-[9999] transition-all duration-200"
            />
        </>
    );
}
