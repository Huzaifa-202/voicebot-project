import { AnimatePresence, motion, Variants } from "framer-motion";
import { FileText } from "lucide-react";

import { GroundingFile as GroundingFileType } from "@/types";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import GroundingFile from "./grounding-file";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

type Properties = {
    files: GroundingFileType[];
    onSelected: (file: GroundingFileType) => void;
};

const variants: Variants = {
    hidden: { opacity: 0, scale: 0.8, y: 20, rotateX: -15 },
    visible: (i: number) => ({
        opacity: 1,
        scale: 1,
        y: 0,
        rotateX: 0,
        transition: {
            delay: i * 0.08,
            duration: 0.4,
            type: "spring",
            stiffness: 260,
            damping: 20
        }
    })
};

export function GroundingFiles({ files, onSelected }: Properties) {
    const { t } = useTranslation();
    const isAnimating = useRef(false);

    if (files.length === 0) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <Card className="m-4 max-w-full md:max-w-md lg:min-w-96 lg:max-w-2xl">
                <CardHeader className="border-b border-white/20 pb-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-sky-500">
                            <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <CardTitle className="bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-xl text-transparent">
                                {t("groundingFiles.title")}
                            </CardTitle>
                            <CardDescription className="text-xs text-gray-600">
                                {t("groundingFiles.description")}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <AnimatePresence>
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className={`h-full ${isAnimating ? "overflow-hidden" : "overflow-y-auto"}`}
                            onLayoutAnimationStart={() => (isAnimating.current = true)}
                            onLayoutAnimationComplete={() => (isAnimating.current = false)}
                        >
                            <div className="flex flex-wrap gap-2">
                                {files.map((file, index) => (
                                    <motion.div key={index} variants={variants} initial="hidden" animate="visible" custom={index}>
                                        <GroundingFile key={index} value={file} onClick={() => onSelected(file)} />
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </CardContent>
            </Card>
        </motion.div>
    );
}
