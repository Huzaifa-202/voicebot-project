import { motion } from 'framer-motion';
import { Mic, Sparkles, MessageCircle } from 'lucide-react';

interface EmptyStateProps {
    onSuggestionClick?: (question: string) => void;
}

export function EmptyState({ onSuggestionClick }: EmptyStateProps) {
    const suggestions = [
        "What benefits are available?",
        "How do I file a claim?",
        "What's my coverage?",
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center py-12 px-4"
        >
            {/* Animated Icon Container */}
            <div className="relative mb-8">
                {/* Glow effect */}
                <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-sky-400 to-blue-500 blur-2xl opacity-40"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Main icon circle */}
                <motion.div
                    className="relative flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-sky-500 to-blue-600 shadow-2xl"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    {/* Rotating ring */}
                    <motion.div
                        className="absolute inset-0 rounded-full border-4 border-dashed border-white/30"
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />

                    <Mic className="h-20 w-20 text-white drop-shadow-lg" />

                    {/* Floating sparkles */}
                    <motion.div
                        className="absolute -right-3 -top-3"
                        animate={{
                            y: [-5, 5, -5],
                            rotate: [0, 180, 360],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <Sparkles className="h-10 w-10 text-yellow-400 drop-shadow-lg" />
                    </motion.div>

                    <motion.div
                        className="absolute -left-2 -bottom-2"
                        animate={{
                            y: [5, -5, 5],
                            rotate: [0, -180, -360],
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.5,
                        }}
                    >
                        <MessageCircle className="h-8 w-8 text-sky-300 drop-shadow-lg" />
                    </motion.div>
                </motion.div>
            </div>

            {/* Text Content */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-6 text-center"
            >
                <h3 className="mb-3 bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 bg-clip-text text-3xl font-bold text-transparent font-display">
                    Start Your Conversation
                </h3>
                <p className="mx-auto max-w-md text-gray-600 leading-relaxed">
                    Click the microphone to ask questions about your data. I'll provide intelligent answers with relevant sources.
                </p>
            </motion.div>

            {/* Suggested Questions */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex flex-col gap-2 w-full max-w-md"
            >
                <p className="text-center text-sm font-medium text-blue-600 mb-2">
                    Try asking:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                    {suggestions.map((question, i) => (
                        <motion.button
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onSuggestionClick?.(question)}
                            className="glass group rounded-full px-5 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-white/90 hover:shadow-md hover:border-blue-300"
                        >
                            <span className="flex items-center gap-2">
                                <MessageCircle className="h-4 w-4 text-blue-600 transition-transform group-hover:scale-110" />
                                {question}
                            </span>
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            {/* Bottom hint */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="mt-8 text-xs text-gray-400"
            >
                Powered by AI • Real-time voice interaction
            </motion.p>
        </motion.div>
    );
}
