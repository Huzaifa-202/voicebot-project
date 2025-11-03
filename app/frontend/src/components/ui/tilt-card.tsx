import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface TiltCardProps {
    children: ReactNode;
    className?: string;
    tiltAmount?: number;
}

export function TiltCard({ children, className = "", tiltAmount = 15 }: TiltCardProps) {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [`${tiltAmount}deg`, `-${tiltAmount}deg`]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [`-${tiltAmount}deg`, `${tiltAmount}deg`]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className={`relative ${className}`}
        >
            <div style={{ transform: "translateZ(50px)" }}>
                {children}
            </div>

            {/* Subtle light reflection effect */}
            <motion.div
                className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300"
                style={{
                    background: `radial-gradient(circle at ${useTransform(mouseXSpring, [-0.5, 0.5], [0, 100])}% ${useTransform(mouseYSpring, [-0.5, 0.5], [0, 100])}%, rgba(255,255,255,0.3), transparent 50%)`,
                }}
                whileHover={{ opacity: 0.1 }}
            />
        </motion.div>
    );
}
