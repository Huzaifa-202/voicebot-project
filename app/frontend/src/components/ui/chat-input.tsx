import { useState, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';
import { Button } from './button';

interface ChatInputProps {
    onSendMessage: (message: string) => void;
    disabled?: boolean;
    isLoading?: boolean;
    placeholder?: string;
}

export function ChatInput({
    onSendMessage,
    disabled = false,
    isLoading = false,
    placeholder = "Type your message..."
}: ChatInputProps) {
    const [message, setMessage] = useState('');

    const handleSubmit = () => {
        if (message.trim() && !disabled && !isLoading) {
            onSendMessage(message.trim());
            setMessage('');
        }
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full"
        >
            <div className="glass rounded-2xl border border-white/40 p-4 shadow-lg">
                <div className="flex items-center gap-3">
                    {/* Input field */}
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={disabled || isLoading}
                        placeholder={placeholder}
                        className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 outline-none text-sm font-medium"
                    />

                    {/* Send button */}
                    <Button
                        onClick={handleSubmit}
                        disabled={!message.trim() || disabled || isLoading}
                        size="sm"
                        className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-sky-500 p-0 text-white shadow-md transition-all hover:from-blue-600 hover:to-sky-600 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <Send className="h-5 w-5" />
                        )}
                    </Button>
                </div>

                {/* Character count or hint */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: message.length > 0 ? 1 : 0 }}
                    className="mt-2 text-xs text-gray-500"
                >
                    {message.length} characters
                </motion.div>
            </div>
        </motion.div>
    );
}
