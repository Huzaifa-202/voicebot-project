import { motion } from 'framer-motion';
import { Mic, Brain, Volume2, Circle } from 'lucide-react';

export type BotStatus = 'ready' | 'listening' | 'thinking' | 'speaking';

interface EnhancedStatusIndicatorProps {
    status: BotStatus;
}

const statusConfig = {
    ready: {
        icon: Circle,
        label: 'Ready',
        color: 'text-gray-500',
        bgColor: 'bg-gray-100',
        glowColor: 'rgba(107, 114, 128, 0.3)',
        borderColor: 'border-gray-300'
    },
    listening: {
        icon: Mic,
        label: 'Listening',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        glowColor: 'rgba(34, 197, 94, 0.4)',
        borderColor: 'border-green-300'
    },
    thinking: {
        icon: Brain,
        label: 'Thinking',
        color: 'text-sky-600',
        bgColor: 'bg-sky-50',
        glowColor: 'rgba(14, 165, 233, 0.4)',
        borderColor: 'border-sky-300'
    },
    speaking: {
        icon: Volume2,
        label: 'Speaking',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        glowColor: 'rgba(59, 130, 246, 0.4)',
        borderColor: 'border-blue-300'
    }
};

export function EnhancedStatusIndicator({ status }: EnhancedStatusIndicatorProps) {
    const config = statusConfig[status];
    const Icon = config.icon;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative inline-flex items-center gap-3 rounded-full border-2 px-6 py-3 shadow-lg glass"
            style={{
                borderColor: `${config.glowColor}`,
            }}
        >
            {/* Pulsing background glow */}
            {status !== 'ready' && (
                <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                        background: config.glowColor,
                        filter: 'blur(20px)',
                    }}
                    animate={{
                        opacity: [0.3, 0.6, 0.3],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            )}

            {/* Icon with animation */}
            <motion.div
                className={`relative z-10 ${config.color}`}
                animate={
                    status === 'listening'
                        ? { scale: [1, 1.2, 1] }
                        : status === 'thinking'
                        ? { rotate: [0, 360] }
                        : status === 'speaking'
                        ? { scale: [1, 1.1, 1] }
                        : {}
                }
                transition={{
                    duration: status === 'thinking' ? 2 : 1,
                    repeat: status !== 'ready' ? Infinity : 0,
                    ease: status === 'thinking' ? 'linear' : 'easeInOut',
                }}
            >
                <Icon className="h-6 w-6" />
            </motion.div>

            {/* Status text */}
            <div className="relative z-10">
                <p className={`font-semibold ${config.color}`}>
                    {config.label}
                </p>
                {status !== 'ready' && (
                    <motion.div
                        className="flex gap-1 mt-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className={`h-1 w-1 rounded-full ${config.bgColor} ${config.color}`}
                                animate={{
                                    opacity: [0.3, 1, 0.3],
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                }}
                            />
                        ))}
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
