import { useState } from "react";
import { Mic, Volume2, Play, Moon, User } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { GroundingFiles } from "@/components/ui/grounding-files";
import GroundingFileView from "@/components/ui/grounding-file-view";

import useRealTime from "@/hooks/useRealtime";
import useAudioRecorder from "@/hooks/useAudioRecorder";
import useAudioPlayer from "@/hooks/useAudioPlayer";

import { GroundingFile, ToolResult } from "./types";
import AzureLogo from "@/assets/logo.svg";

function App() {
    const [isRecording, setIsRecording] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [groundingFiles, setGroundingFiles] = useState<GroundingFile[]>([]);
    const [selectedFile, setSelectedFile] = useState<GroundingFile | null>(null);
    const [agentResponse, setAgentResponse] = useState("");
    const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<string>("auto");

    // Latency tracking
    const [requestStartTime, setRequestStartTime] = useState<number | null>(null);
    const [firstResponseTime, setFirstResponseTime] = useState<number | null>(null);
    const [requestCount, setRequestCount] = useState<number>(0);
    const [latencyHistory, setLatencyHistory] = useState<number[]>([]);

    const { startSession, addUserAudio, inputAudioBufferClear, responseCancel } = useRealTime({
        onWebSocketOpen: () => {
            setIsConnected(true);
        },
        onWebSocketClose: () => {
            setIsConnected(false);
        },
        onWebSocketError: event => console.error("WebSocket error:", event),
        onReceivedError: message => console.error("error", message),
        onReceivedResponseAudioDelta: message => {
            const now = Date.now();
            if (!firstResponseTime && requestStartTime) {
                setFirstResponseTime(now);
                const latency = now - requestStartTime;
                setLatencyHistory(prev => [...prev, latency].slice(-10)); // Keep last 10
                setRequestCount(prev => prev + 1);
            }
            isRecording && playAudio(message.delta);
        },
        onReceivedResponseTextDelta: message => {
            const now = Date.now();
            if (!firstResponseTime && requestStartTime) {
                setFirstResponseTime(now);
                const latency = now - requestStartTime;
                setLatencyHistory(prev => [...prev, latency].slice(-10));
                setRequestCount(prev => prev + 1);
            }
            setAgentResponse(prev => prev + message.delta);
        },
        onReceivedResponseAudioTranscriptDelta: message => {
            // Display the audio transcript as text in the agent response area
            setAgentResponse(prev => prev + message.delta);
        },
        onReceivedInputAudioBufferSpeechStarted: () => {
            console.log("User started speaking - cancelling AI response");
            setRequestStartTime(Date.now());
            setFirstResponseTime(null);
            // Cancel the ongoing AI response
            responseCancel();
            // Stop playing any queued audio
            stopAudioPlayer();
            // Clear the agent response for new conversation
            setAgentResponse("");
        },
        onReceivedResponseDone: () => {},
        onReceivedExtensionMiddleTierToolResponse: message => {
            const result: ToolResult = JSON.parse(message.tool_result);
            const files: GroundingFile[] = result.sources.map(x => {
                return { id: x.chunk_id, name: x.title, content: x.chunk };
            });
            setGroundingFiles(prev => [...prev, ...files]);
        }
    });

    const { reset: resetAudioPlayer, play: playAudio, stop: stopAudioPlayer } = useAudioPlayer();
    const { start: startAudioRecording, stop: stopAudioRecording } = useAudioRecorder({ onAudioRecorded: addUserAudio });

    const getLanguageInstruction = (lang: string): string => {
        const instructions: { [key: string]: string } = {
            english: "You must ALWAYS respond in English only, regardless of the user's language.",
            arabic: "You must ALWAYS respond in Arabic (العربية) only, regardless of the user's language.",
            urdu: "You must ALWAYS respond in Urdu (اردو) only, regardless of the user's language.",
            spanish: "You must ALWAYS respond in Spanish (Español) only, regardless of the user's language.",
            hindi: "You must ALWAYS respond in Hindi (हिन्दी) only, regardless of the user's language.",
            french: "You must ALWAYS respond in French (Français) only, regardless of the user's language.",
            auto: "" // No specific instruction, let backend handle auto-detection
        };
        return instructions[lang] || instructions.auto;
    };

    const handleConnectClick = async () => {
        if (!isConnected) {
            const languageInstruction = getLanguageInstruction(selectedLanguage);
            console.log(`Connecting with language: ${selectedLanguage}`);
            console.log(`Language instruction: ${languageInstruction || 'Auto-detect (no instruction)'}`);
            startSession(languageInstruction);
            setSessionStartTime(new Date());
        }
    };

    const handleLanguageSelect = (lang: string) => {
        console.log(`Language changed to: ${lang}`);
        setSelectedLanguage(lang);

        // Clear agent response when changing language to show fresh responses
        setAgentResponse("");

        // If already connected, update session with new language
        if (isConnected) {
            const languageInstruction = getLanguageInstruction(lang);
            console.log(`Updating session with instruction: ${languageInstruction}`);
            startSession(languageInstruction);
        }
    };

    const onToggleRecording = async () => {
        if (!isRecording) {
            await startAudioRecording();
            resetAudioPlayer();
            setIsRecording(true);
        } else {
            await stopAudioRecording();
            stopAudioPlayer();
            inputAudioBufferClear();
            setIsRecording(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#1e1e1e] text-gray-100">
            {/* Header */}
            <header className="border-b border-gray-800 bg-[#252525] px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500">
                            <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">
                                <span className="text-white">AZURE VOICE AGENT</span>{" "}
                                <span className="text-cyan-400">TESTER</span>
                            </h1>
                            <p className="text-xs text-gray-400">Built with Azure AI Services</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={handleConnectClick}
                                disabled={isConnected}
                                className={`rounded-md px-4 py-2 font-medium ${
                                    isConnected
                                        ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                                        : "bg-cyan-500 text-white hover:bg-cyan-600"
                                }`}
                            >
                                {isConnected ? "CONNECTED" : "CONNECT TO AZURE REALTIME"}
                            </Button>
                            <img src={AzureLogo} alt="Azure Logo" className="h-8 w-8" />
                        </div>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                            <Moon className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-full bg-gray-700">
                            <User className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                {/* Left Panel - User Input */}
                <div className="space-y-6">
                    {/* User Input Section */}
                    <motion.div
                        className="rounded-lg border border-gray-800 bg-[#252525] p-6"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h2 className="mb-4 text-sm font-semibold uppercase text-gray-400">
                            USER INPUT
                        </h2>
                        <div className="flex items-center gap-4">
                            <Button
                                onClick={onToggleRecording}
                                disabled={!isConnected}
                                className={`h-20 w-20 rounded-full transition-all ${
                                    isRecording
                                        ? "bg-red-500 hover:bg-red-600 animate-pulse"
                                        : "bg-cyan-500 hover:bg-cyan-600"
                                } ${!isConnected ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                <Mic className="h-8 w-8 text-white" />
                            </Button>
                            <div className="flex-1">
                                {/* Audio Waveform Visualization */}
                                <div className="flex h-16 items-center gap-1">
                                    {[...Array(40)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="flex-1 rounded-full bg-cyan-500"
                                            animate={{
                                                height: isRecording
                                                    ? `${20 + Math.random() * 60}%`
                                                    : "20%",
                                            }}
                                            transition={{
                                                duration: 0.15,
                                                repeat: isRecording ? Infinity : 0,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <Button
                                variant="outline"
                                size="sm"
                                className={`border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 ${
                                    isRecording ? "" : "opacity-50 cursor-not-allowed"
                                }`}
                                disabled={!isRecording}
                            >
                                {isRecording ? "STOP RECORDING" : "START RECORDING"}
                            </Button>
                        </div>
                    </motion.div>

                    {/* Configuration Sections */}
                    <motion.div
                        className="space-y-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        {/* Supported Languages */}
                        <div className="rounded-lg border border-gray-800 bg-[#252525] p-4">
                            <h3 className="mb-3 text-xs font-semibold uppercase text-gray-400">
                                50+ LANGUAGES SUPPORTED
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {/* Highlighted Languages - Clickable */}
                                <button
                                    onClick={() => handleLanguageSelect("english")}
                                    className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                                        selectedLanguage === "english"
                                            ? "bg-cyan-500 text-white border border-cyan-400 shadow-lg shadow-cyan-500/50"
                                            : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30"
                                    }`}
                                >
                                    <span className={`h-2 w-2 rounded-full ${selectedLanguage === "english" ? "bg-white" : "bg-cyan-500"}`}></span>
                                    English
                                </button>
                                <button
                                    onClick={() => handleLanguageSelect("arabic")}
                                    className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                                        selectedLanguage === "arabic"
                                            ? "bg-cyan-500 text-white border border-cyan-400 shadow-lg shadow-cyan-500/50"
                                            : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30"
                                    }`}
                                >
                                    <span className={`h-2 w-2 rounded-full ${selectedLanguage === "arabic" ? "bg-white" : "bg-cyan-500"}`}></span>
                                    Arabic
                                </button>
                                <button
                                    onClick={() => handleLanguageSelect("urdu")}
                                    className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                                        selectedLanguage === "urdu"
                                            ? "bg-cyan-500 text-white border border-cyan-400 shadow-lg shadow-cyan-500/50"
                                            : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30"
                                    }`}
                                >
                                    <span className={`h-2 w-2 rounded-full ${selectedLanguage === "urdu" ? "bg-white" : "bg-cyan-500"}`}></span>
                                    Urdu
                                </button>
                                <button
                                    onClick={() => handleLanguageSelect("spanish")}
                                    className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                                        selectedLanguage === "spanish"
                                            ? "bg-cyan-500 text-white border border-cyan-400 shadow-lg shadow-cyan-500/50"
                                            : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30"
                                    }`}
                                >
                                    <span className={`h-2 w-2 rounded-full ${selectedLanguage === "spanish" ? "bg-white" : "bg-cyan-500"}`}></span>
                                    Spanish
                                </button>
                                <button
                                    onClick={() => handleLanguageSelect("hindi")}
                                    className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                                        selectedLanguage === "hindi"
                                            ? "bg-cyan-500 text-white border border-cyan-400 shadow-lg shadow-cyan-500/50"
                                            : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30"
                                    }`}
                                >
                                    <span className={`h-2 w-2 rounded-full ${selectedLanguage === "hindi" ? "bg-white" : "bg-cyan-500"}`}></span>
                                    Hindi
                                </button>
                                <button
                                    onClick={() => handleLanguageSelect("french")}
                                    className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                                        selectedLanguage === "french"
                                            ? "bg-cyan-500 text-white border border-cyan-400 shadow-lg shadow-cyan-500/50"
                                            : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30"
                                    }`}
                                >
                                    <span className={`h-2 w-2 rounded-full ${selectedLanguage === "french" ? "bg-white" : "bg-cyan-500"}`}></span>
                                    French
                                </button>
                                {/* Additional Languages */}
                                <span className="rounded-full bg-gray-700 px-3 py-1 text-xs text-gray-400">
                                    German
                                </span>
                                <span className="rounded-full bg-gray-700 px-3 py-1 text-xs text-gray-400">
                                    Chinese
                                </span>
                                <span className="rounded-full bg-gray-700 px-3 py-1 text-xs text-gray-400">
                                    Japanese
                                </span>
                                <span className="rounded-full bg-gray-700 px-3 py-1 text-xs text-gray-400">
                                    Korean
                                </span>
                                <span className="rounded-full bg-gray-700 px-3 py-1 text-xs text-gray-400">
                                    Portuguese
                                </span>
                                <span className="rounded-full bg-gray-700 px-3 py-1 text-xs text-gray-400">
                                    Italian
                                </span>
                                <span className="rounded-full bg-gray-700 px-3 py-1 text-xs text-gray-400">
                                    +40 more
                                </span>
                                <button
                                    onClick={() => handleLanguageSelect("auto")}
                                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                                        selectedLanguage === "auto"
                                            ? "bg-green-500 text-white shadow-lg shadow-green-500/50"
                                            : "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30"
                                    }`}
                                >
                                    AUTO-DETECT
                                </button>
                            </div>
                        </div>

                        {/* Service Status */}
                        <div className="rounded-lg border border-gray-800 bg-[#252525] p-4">
                            <h3 className="mb-3 text-xs font-semibold uppercase text-gray-400">
                                SERVICE STATUS & CONFIGURATION
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="mb-2 text-xs text-gray-500">SUPPORTED FOLLOW-UPS</p>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                            <span className="text-sm">CONNECTED</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p className="mb-2 text-xs text-gray-500">AZURE COGNITIVE SERVICES</p>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                            <span className="text-sm">Connected</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Debug Output */}
                        <div className="rounded-lg border border-gray-800 bg-[#252525] p-4">
                            <h3 className="mb-3 text-xs font-semibold uppercase text-gray-400">
                                DEBUG & OUTPUTS
                            </h3>
                            <div className="rounded bg-black/50 p-3 font-mono text-xs text-green-400">
                                <div>{'> Connection status: ' + (isConnected ? 'Connected' : 'Disconnected')}</div>
                                <div>{'> Recording: ' + (isRecording ? 'Active' : 'Inactive')}</div>
                                <div>{'> Session time: ' + (sessionStartTime ? new Date().getTime() - sessionStartTime.getTime() : 0) + 'ms'}</div>
                                <div>{'> Selected language: ' + selectedLanguage.toUpperCase()}</div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Panel - Agent Response */}
                <div className="space-y-6">
                    {/* Agent Response Section */}
                    <motion.div
                        className="rounded-lg border border-gray-800 bg-[#252525] p-6"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-sm font-semibold uppercase text-gray-400">
                                AGENT RESPONSE{" "}
                                <span className="text-cyan-400">(AZURE SPEECH STUDIO)</span>
                            </h2>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-md bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </Button>
                        </div>

                        <div className="mb-4 rounded-lg bg-[#1e1e1e] p-4 max-h-96 overflow-y-auto">
                            <p className="text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">
                                {agentResponse || "Hello! I am your AI voice assistant. How can I help you today?"}
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 rounded-lg bg-[#1e1e1e] px-3 py-2">
                                <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                                </svg>
                                <span className="text-sm text-gray-400">{requestCount} requests</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-md hover:bg-gray-700"
                            >
                                <Play className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-md hover:bg-gray-700"
                            >
                                <Volume2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </motion.div>

                    {/* Grounding Files */}
                    <motion.div
                        className="rounded-lg border border-gray-800 bg-[#252525] p-6"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="mb-4 text-sm font-semibold uppercase text-gray-400">
                            KNOWLEDGE BASE SOURCES
                        </h2>
                        {groundingFiles.length > 0 ? (
                            <GroundingFiles files={groundingFiles} onSelected={setSelectedFile} />
                        ) : (
                            <div className="rounded-lg bg-[#1e1e1e] p-8 text-center">
                                <svg className="mx-auto mb-3 h-12 w-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-sm text-gray-500">No sources retrieved yet</p>
                                <p className="mt-1 text-xs text-gray-600">Ask a question to see knowledge base sources</p>
                            </div>
                        )}
                    </motion.div>

                    {/* Performance Metrics with Insights */}
                    <motion.div
                        className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-[#252525] via-[#1e1e1e] to-[#252525] p-6 shadow-lg shadow-cyan-500/10"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/50">
                                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-sm font-bold uppercase tracking-wide text-cyan-400">
                                    Performance Insights
                                </h2>
                                <p className="text-xs text-gray-500">Real-time analytics & metrics</p>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <motion.div
                                className="rounded-lg border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-4 text-center"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="mb-2 text-xs font-medium uppercase tracking-wider text-purple-400">Total Requests</div>
                                <motion.div
                                    className="font-mono text-3xl font-bold text-white"
                                    key={requestCount}
                                    initial={{ scale: 1.3 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {requestCount}
                                </motion.div>
                                <div className="mt-1 text-xs text-gray-500">interactions</div>
                            </motion.div>

                            <motion.div
                                className="rounded-lg border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 p-4 text-center"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="mb-2 text-xs font-medium uppercase tracking-wider text-yellow-400">KB Sources</div>
                                <motion.div
                                    className="font-mono text-3xl font-bold text-white"
                                    key={groundingFiles.length}
                                    initial={{ scale: 1.3 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {groundingFiles.length}
                                </motion.div>
                                <div className="mt-1 text-xs text-gray-500">retrieved</div>
                            </motion.div>
                        </div>

                        {/* Latency Graph */}
                        {latencyHistory.length > 0 && (
                            <div className="rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 p-6 backdrop-blur-sm">
                                <div className="mb-4 text-xs font-medium uppercase tracking-wider text-cyan-400">Latency Trend</div>
                                <div className="flex items-end justify-between gap-2 h-32">
                                    {latencyHistory.map((latency, index) => {
                                        const maxLatency = Math.max(...latencyHistory);
                                        const height = (latency / maxLatency) * 100;
                                        return (
                                            <motion.div
                                                key={index}
                                                className="flex-1 rounded-t-md"
                                                style={{
                                                    height: `${height}%`,
                                                    background: latency < 500
                                                        ? 'linear-gradient(to top, #22c55e, #10b981)'
                                                        : latency < 1000
                                                        ? 'linear-gradient(to top, #facc15, #f59e0b)'
                                                        : 'linear-gradient(to top, #fb923c, #ef4444)'
                                                }}
                                                initial={{ height: 0 }}
                                                animate={{ height: `${height}%` }}
                                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                                title={`${latency}ms`}
                                            />
                                        );
                                    })}
                                </div>
                                <div className="mt-3 flex justify-between text-xs text-gray-500">
                                    <span>Last {latencyHistory.length} requests</span>
                                    <span>Avg: {Math.round(latencyHistory.reduce((a, b) => a + b, 0) / latencyHistory.length)}ms</span>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            <GroundingFileView groundingFile={selectedFile} onClosed={() => setSelectedFile(null)} />
        </div>
    );
}

export default App;
