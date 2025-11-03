import { motion } from 'framer-motion';
import { Activity, Clock, Zap, MessageCircle } from 'lucide-react';
import { Card } from './card';

interface MetricCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number | React.ReactNode;
    color: string;
    delay?: number;
}

function MetricCard({ icon, label, value, color, delay = 0 }: MetricCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            whileHover={{ scale: 1.05, y: -5 }}
        >
            <Card className="glass p-4 hover:shadow-glow transition-all duration-300 border-white/40">
                <div className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${color} shadow-lg`}>
                        {icon}
                    </div>
                    <div className="flex-1">
                        <p className="text-xs font-medium text-gray-600">{label}</p>
                        <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent font-display">
                            {value}
                        </p>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}

interface MetricsDashboardProps {
    totalInteractions: number;
    lastLatency: number;
    avgLatency: number;
    sessionDuration: string;
}

export function MetricsDashboard({
    totalInteractions,
    lastLatency,
    avgLatency,
    sessionDuration
}: MetricsDashboardProps) {

    const formatLatency = (ms: number) => {
        if (ms === 0) return '0ms';
        return `${Math.round(ms)}ms`;
    };

    const getLatencyColor = (ms: number) => {
        if (ms < 100) return 'text-green-600';
        if (ms < 300) return 'text-blue-600';
        if (ms < 500) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getLatencyLabel = (ms: number) => {
        if (ms === 0) return '';
        if (ms < 100) return '⚡ Excellent';
        if (ms < 300) return '✓ Good';
        if (ms < 500) return '○ Fair';
        return '⚠ Slow';
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full"
        >
            <motion.h3
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-4 text-lg font-bold text-gray-700 font-display"
            >
                Performance Metrics
            </motion.h3>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <MetricCard
                    icon={<MessageCircle className="h-6 w-6 text-white" />}
                    label="Interactions"
                    value={totalInteractions}
                    color="bg-gradient-to-br from-blue-500 to-blue-600"
                    delay={0.1}
                />

                <MetricCard
                    icon={<Zap className="h-6 w-6 text-white" />}
                    label="Last Response"
                    value={
                        <span className="flex flex-col">
                            <span className={getLatencyColor(lastLatency)}>
                                {formatLatency(lastLatency)}
                            </span>
                            <span className="text-xs text-gray-500">
                                {getLatencyLabel(lastLatency)}
                            </span>
                        </span>
                    }
                    color="bg-gradient-to-br from-sky-500 to-sky-600"
                    delay={0.2}
                />

                <MetricCard
                    icon={<Activity className="h-6 w-6 text-white" />}
                    label="Avg Latency"
                    value={
                        <span className={getLatencyColor(avgLatency)}>
                            {formatLatency(avgLatency)}
                        </span>
                    }
                    color="bg-gradient-to-br from-blue-400 to-blue-500"
                    delay={0.3}
                />

                <MetricCard
                    icon={<Clock className="h-6 w-6 text-white" />}
                    label="Session Time"
                    value={sessionDuration}
                    color="bg-gradient-to-br from-blue-600 to-sky-600"
                    delay={0.4}
                />
            </div>
        </motion.div>
    );
}
