import { FileText } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "./button";

import { GroundingFile as GroundingFileType } from "@/types";

type Properties = {
    value: GroundingFileType;
    onClick: () => void;
};

export default function GroundingFile({ value, onClick }: Properties) {
    return (
        <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
            <Button
                variant="outline"
                size="sm"
                className="glass group rounded-full border-blue-200 shadow-sm transition-all hover:border-blue-300 hover:bg-white/90 hover:shadow-md"
                onClick={onClick}
            >
                <FileText className="mr-2 h-4 w-4 text-blue-600 transition-transform group-hover:scale-110" />
                <span className="font-medium text-gray-700">{value.name}</span>
            </Button>
        </motion.div>
    );
}
