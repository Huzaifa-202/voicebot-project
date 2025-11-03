import { motion } from 'framer-motion';

export function LiquidBackground() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    {/* Goo filter for liquid effect */}
                    <filter id="goo">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
                        <feColorMatrix
                            in="blur"
                            mode="matrix"
                            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                            result="goo"
                        />
                        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                    </filter>

                    {/* Gradient definitions */}
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                        <stop offset="50%" stopColor="#93c5fd" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.5" />
                    </linearGradient>

                    <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.5" />
                        <stop offset="50%" stopColor="#dbeafe" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.4" />
                    </linearGradient>

                    <linearGradient id="grad3" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.4" />
                        <stop offset="50%" stopColor="#93c5fd" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0.4" />
                    </linearGradient>

                    <linearGradient id="grad4" x1="50%" y1="0%" x2="50%" y2="100%">
                        <stop offset="0%" stopColor="#1e40af" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
                    </linearGradient>
                </defs>

                <g filter="url(#goo)">
                    {/* Blob 1 - Top Left */}
                    <motion.circle
                        cx="15%"
                        cy="15%"
                        r="220"
                        fill="url(#grad1)"
                        animate={{
                            cx: ["15%", "18%", "12%", "15%"],
                            cy: ["15%", "12%", "18%", "15%"],
                            r: [220, 270, 240, 220],
                        }}
                        transition={{
                            duration: 12,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />

                    {/* Blob 2 - Bottom Right */}
                    <motion.circle
                        cx="85%"
                        cy="85%"
                        r="200"
                        fill="url(#grad2)"
                        animate={{
                            cx: ["85%", "82%", "88%", "85%"],
                            cy: ["85%", "88%", "82%", "85%"],
                            r: [200, 250, 220, 200],
                        }}
                        transition={{
                            duration: 14,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1,
                        }}
                    />

                    {/* Blob 3 - Center */}
                    <motion.circle
                        cx="50%"
                        cy="50%"
                        r="180"
                        fill="url(#grad3)"
                        animate={{
                            cx: ["50%", "55%", "45%", "50%"],
                            cy: ["50%", "45%", "55%", "50%"],
                            r: [180, 230, 200, 180],
                        }}
                        transition={{
                            duration: 16,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 2,
                        }}
                    />

                    {/* Blob 4 - Top Right (smaller accent) */}
                    <motion.circle
                        cx="80%"
                        cy="20%"
                        r="140"
                        fill="url(#grad4)"
                        animate={{
                            cx: ["80%", "78%", "82%", "80%"],
                            cy: ["20%", "18%", "22%", "20%"],
                            r: [140, 180, 160, 140],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 3,
                        }}
                    />

                    {/* Blob 5 - Bottom Left (smaller accent) */}
                    <motion.circle
                        cx="20%"
                        cy="80%"
                        r="130"
                        fill="url(#grad1)"
                        animate={{
                            cx: ["20%", "22%", "18%", "20%"],
                            cy: ["80%", "82%", "78%", "80%"],
                            r: [130, 170, 150, 130],
                        }}
                        transition={{
                            duration: 11,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 4,
                        }}
                    />
                </g>
            </svg>
        </div>
    );
}
