import { motion, AnimatePresence } from 'framer-motion';
import { User, Bot, Clock } from 'lucide-react';
import { Card } from './card';

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    latency?: number;
    language?: string;
}

interface ConversationHistoryProps {
    messages: Message[];
}

const languageColors: Record<string, string> = {
    english: 'bg-blue-100 text-blue-700 border-blue-300',
    urdu: 'bg-green-100 text-green-700 border-green-300',
    arabic: 'bg-pink-100 text-pink-700 border-pink-300',
    unknown: 'bg-yellow-100 text-yellow-700 border-yellow-300',
};

function LanguageBadge({ language }: { language?: string }) {
    if (!language || language === 'unknown') return null;

    const colorClass = languageColors[language.toLowerCase()] || languageColors.unknown;

    return (
        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${colorClass}`}>
            {language}
        </span>
    );
}

function MessageBubble({ message }: { message: Message }) {
    const isUser = message.role === 'user';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 25 }}
            className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
        >
            {/* Avatar */}
            <motion.div
                className={`flex h-10 w-10 items-center justify-center rounded-full shadow-lg ${
                    isUser
                        ? 'bg-gradient-to-br from-blue-500 to-sky-500'
                        : 'bg-gradient-to-br from-sky-500 to-blue-500'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                {isUser ? (
                    <User className="h-5 w-5 text-white" />
                ) : (
                    <Bot className="h-5 w-5 text-white" />
                )}
            </motion.div>

            {/* Message content */}
            <div className={`flex-1 max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <motion.div
                    className={`glass rounded-2xl px-4 py-3 shadow-md ${
                        isUser
                            ? 'bg-gradient-to-br from-blue-50 to-sky-50 border-blue-200'
                            : 'bg-white/90 border-white/50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                >
                    <p className="text-sm leading-relaxed text-gray-800">
                        {message.content}
                    </p>
                </motion.div>

                {/* Metadata */}
                <div className={`flex items-center gap-2 px-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    {message.language && <LanguageBadge language={message.language} />}

                    {message.latency !== undefined && message.latency > 0 && (
                        <span className="text-xs text-gray-400">
                            {Math.round(message.latency)}ms
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

export function ConversationHistory({ messages }: ConversationHistoryProps) {
    if (messages.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex h-full items-center justify-center p-8 text-center"
            >
                <div className="space-y-3">
                    <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-sky-100"
                    >
                        <Bot className="h-8 w-8 text-blue-600" />
                    </motion.div>
                    <p className="text-sm font-medium text-gray-600">
                        No messages yet
                    </p>
                    <p className="text-xs text-gray-400">
                        Start a conversation to see messages here
                    </p>
                </div>
            </motion.div>
        );
    }

    return (
        <Card className="glass h-full max-h-[500px] overflow-hidden border-white/40">
            <div className="border-b border-white/20 p-4">
                <h3 className="font-bold text-gray-700 font-display">
                    Conversation History
                </h3>
                <p className="text-xs text-gray-500">
                    {messages.length} {messages.length === 1 ? 'message' : 'messages'}
                </p>
            </div>

            <div className="h-full overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-transparent">
                <AnimatePresence mode="popLayout">
                    {messages.map((message) => (
                        <MessageBubble key={message.id} message={message} />
                    ))}
                </AnimatePresence>
            </div>
        </Card>
    );
}
