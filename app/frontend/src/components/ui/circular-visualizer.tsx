import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface CircularVisualizerProps {
    isActive: boolean;
    size?: number;
}

export function CircularVisualizer({ isActive, size = 300 }: CircularVisualizerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number>();

    useEffect(() => {
        if (!isActive) {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const bars = 64;
        const dataArray = new Array(bars).fill(0);
        let angle = 0;

        // Generate simulated audio data (in a real implementation, this would come from Web Audio API)
        const generateData = () => {
            for (let i = 0; i < bars; i++) {
                // Create wave-like pattern with some randomness
                const wave1 = Math.sin(angle + i * 0.1) * 0.3;
                const wave2 = Math.cos(angle * 0.5 + i * 0.15) * 0.2;
                const randomness = Math.random() * 0.2;
                dataArray[i] = 0.3 + wave1 + wave2 + randomness;
            }
            angle += 0.05;
        };

        const draw = () => {
            if (!isActive) return;

            generateData();

            const width = canvas.width;
            const height = canvas.height;
            const centerX = width / 2;
            const centerY = height / 2;
            const radius = Math.min(width, height) / 3;

            ctx.clearRect(0, 0, width, height);

            const angleStep = (Math.PI * 2) / bars;

            // Draw outer ring (subtle)
            ctx.strokeStyle = 'rgba(139, 92, 246, 0.1)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius * 1.8, 0, Math.PI * 2);
            ctx.stroke();

            // Draw frequency bars
            for (let i = 0; i < bars; i++) {
                const value = dataArray[i];
                const currentAngle = i * angleStep - Math.PI / 2;

                const barHeight = value * radius * 0.6;
                const innerRadius = radius;
                const outerRadius = radius + barHeight;

                // Calculate color based on position and height
                const hue = (i / bars) * 360;
                const lightness = 60 + value * 20;

                // Create gradient for each bar
                const startX = centerX + Math.cos(currentAngle) * innerRadius;
                const startY = centerY + Math.sin(currentAngle) * innerRadius;
                const endX = centerX + Math.cos(currentAngle) * outerRadius;
                const endY = centerY + Math.sin(currentAngle) * outerRadius;

                const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
                gradient.addColorStop(0, `hsla(${hue}, 80%, ${lightness}%, 0.6)`);
                gradient.addColorStop(1, `hsla(${(hue + 60) % 360}, 85%, ${lightness + 10}%, 0.9)`);

                ctx.strokeStyle = gradient;
                ctx.lineWidth = Math.max(2, (2 * Math.PI * innerRadius) / bars * 0.7);
                ctx.lineCap = 'round';

                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                ctx.stroke();
            }

            // Draw inner glow
            const glowGradient = ctx.createRadialGradient(
                centerX, centerY, 0,
                centerX, centerY, radius * 0.8
            );
            glowGradient.addColorStop(0, 'rgba(139, 92, 246, 0.25)');
            glowGradient.addColorStop(0.5, 'rgba(236, 72, 153, 0.15)');
            glowGradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

            ctx.fillStyle = glowGradient;
            ctx.fillRect(0, 0, width, height);

            // Inner circle highlight
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius * 0.4, 0, Math.PI * 2);
            ctx.stroke();

            animationFrameRef.current = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isActive, size]);

    if (!isActive) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center"
            style={{ pointerEvents: 'none' }}
        >
            <canvas
                ref={canvasRef}
                width={size * 2}
                height={size * 2}
                style={{ width: size, height: size }}
                className="drop-shadow-2xl"
            />
        </motion.div>
    );
}
