import { AnimatePresence, motion } from "framer-motion";
import { X, FileText, Copy, Check } from "lucide-react";
import { useState } from "react";

import { Button } from "./button";
import { GroundingFile } from "@/types";

type Properties = {
    groundingFile: GroundingFile | null;
    onClosed: () => void;
};

export default function GroundingFileView({ groundingFile, onClosed }: Properties) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (groundingFile?.content) {
            await navigator.clipboard.writeText(groundingFile.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <AnimatePresence>
            {groundingFile && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
                    onClick={() => onClosed()}
                >
                    <motion.div
                        initial={{ scale: 0.95, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.95, y: 20, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="glass-dark flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl border border-white/20 p-6 shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="mb-4 flex items-center justify-between border-b border-white/20 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-sky-500">
                                    <FileText className="h-5 w-5 text-white" />
                                </div>
                                <h2 className="bg-gradient-to-r from-blue-400 to-sky-400 bg-clip-text text-xl font-bold text-transparent">
                                    {groundingFile.name}
                                </h2>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    aria-label="Copy content"
                                    variant="ghost"
                                    size="sm"
                                    className="text-white/80 hover:bg-white/10 hover:text-white"
                                    onClick={handleCopy}
                                >
                                    {copied ? (
                                        <>
                                            <Check className="mr-2 h-4 w-4" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="mr-2 h-4 w-4" />
                                            Copy
                                        </>
                                    )}
                                </Button>
                                <Button
                                    aria-label="Close grounding file view"
                                    variant="ghost"
                                    size="sm"
                                    className="text-white/80 hover:bg-white/10 hover:text-white"
                                    onClick={() => onClosed()}
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-grow overflow-hidden">
                            <motion.pre
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="h-[60vh] overflow-auto rounded-xl bg-white/10 p-5 text-sm text-white backdrop-blur-sm scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20"
                            >
                                <code className="leading-relaxed">{groundingFile.content}</code>
                            </motion.pre>
                        </div>

                        {/* Footer hint */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="mt-4 text-center text-xs text-white/60"
                        >
                            Press ESC or click outside to close
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
