import "./status-message.css";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Mic } from "lucide-react";

type Properties = {
    isRecording: boolean;
};

export default function StatusMessage({ isRecording }: Properties) {
    const { t } = useTranslation();
    if (!isRecording) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass mt-6 rounded-full px-6 py-3"
            >
                <p className="flex items-center gap-2 text-sm font-medium text-teal-700">
                    <Mic className="h-4 w-4" />
                    {t("status.notRecordingMessage")}
                </p>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex items-center gap-3"
        >
            <div className="glass relative flex h-12 items-end justify-around gap-1 overflow-hidden rounded-full px-4">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="w-1 rounded-full bg-gradient-to-t from-teal-600 via-emerald-500 to-cyan-500"
                        animate={{
                            height: ["20%", "100%", "20%"],
                        }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.15,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>
            <p className="glass rounded-full px-4 py-2 text-sm font-medium text-teal-700">
                {t("status.conversationInProgress")}
            </p>
        </motion.div>
    );
}
