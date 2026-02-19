import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Loader2, Square, Volume2 } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SpeechRecognitionType = any;

interface VoiceInputProps {
    onTranscript: (text: string) => void;
    onRecording?: (isRecording: boolean) => void;
    className?: string;
}

export function VoiceInput({ onTranscript, onRecording, className = '' }: VoiceInputProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [audioLevel, setAudioLevel] = useState(0);

    const recognitionRef = useRef<SpeechRecognitionType>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationRef = useRef<number | null>(null);

    // Check for browser support
    const isSupported = typeof window !== 'undefined' &&
        ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

    useEffect(() => {
        return () => {
            // Cleanup on unmount
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    const startRecording = async () => {
        if (!isSupported) {
            setError('Voice input is not supported in this browser');
            return;
        }

        setError(null);
        setTranscript('');

        // Setup audio context for visualization
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioContextRef.current = new AudioContext();
            const source = audioContextRef.current.createMediaStreamSource(stream);
            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 256;
            source.connect(analyserRef.current);

            // Animate audio level
            const updateAudioLevel = () => {
                if (analyserRef.current) {
                    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
                    analyserRef.current.getByteFrequencyData(dataArray);
                    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
                    setAudioLevel(average / 255);
                }
                animationRef.current = requestAnimationFrame(updateAudioLevel);
            };
            updateAudioLevel();
        } catch {
            console.log('Audio visualization not available');
        }

        // Setup speech recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognitionRef.current.onresult = (event: any) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    finalTranscript += result[0].transcript;
                } else {
                    interimTranscript += result[0].transcript;
                }
            }

            setTranscript(finalTranscript || interimTranscript);
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognitionRef.current.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            if (event.error === 'not-allowed') {
                setError('Microphone access denied. Please allow microphone access.');
            } else {
                setError(`Error: ${event.error}`);
            }
            stopRecording();
        };

        recognitionRef.current.onend = () => {
            if (isRecording) {
                // Restart if still recording (auto-stop prevention)
                recognitionRef.current?.start();
            }
        };

        try {
            recognitionRef.current.start();
            setIsRecording(true);
            onRecording?.(true);
        } catch (err) {
            setError('Failed to start voice input');
        }
    };

    const stopRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }

        setIsRecording(false);
        setAudioLevel(0);
        onRecording?.(false);

        // Send final transcript
        if (transcript.trim()) {
            setIsProcessing(true);
            setTimeout(() => {
                onTranscript(transcript.trim());
                setIsProcessing(false);
                setTranscript('');
            }, 500);
        }
    };

    const toggleRecording = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    if (!isSupported) {
        return (
            <div className={`text-sm text-muted-foreground italic ${className}`}>
                Voice input not supported in this browser
            </div>
        );
    }

    return (
        <div className={`flex flex-col items-center ${className}`}>
            {/* Voice Button */}
            <div className="relative">
                {/* Pulse rings when recording */}
                <AnimatePresence>
                    {isRecording && (
                        <>
                            <motion.div
                                initial={{ scale: 1, opacity: 0.5 }}
                                animate={{ scale: 1.5 + audioLevel * 0.5, opacity: 0 }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="absolute inset-0 rounded-full bg-coral-500"
                            />
                            <motion.div
                                initial={{ scale: 1, opacity: 0.3 }}
                                animate={{ scale: 1.3 + audioLevel * 0.3, opacity: 0 }}
                                transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                                className="absolute inset-0 rounded-full bg-coral-500"
                            />
                        </>
                    )}
                </AnimatePresence>

                <motion.button
                    onClick={toggleRecording}
                    disabled={isProcessing}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                        relative z-10 p-4 rounded-full transition-all duration-300
                        ${isRecording
                            ? 'bg-coral-500 text-white shadow-lg shadow-coral-500/30'
                            : 'bg-gradient-to-br from-sunset-500 to-coral-500 text-white shadow-lg hover:shadow-xl'
                        }
                        ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                >
                    <AnimatePresence mode="wait">
                        {isProcessing ? (
                            <motion.div
                                key="processing"
                                initial={{ opacity: 0, rotate: 0 }}
                                animate={{ opacity: 1, rotate: 360 }}
                                exit={{ opacity: 0 }}
                                transition={{ rotate: { duration: 1, repeat: Infinity, ease: 'linear' } }}
                            >
                                <Loader2 className="w-6 h-6" />
                            </motion.div>
                        ) : isRecording ? (
                            <motion.div
                                key="recording"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                            >
                                <Square className="w-6 h-6" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="mic"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                            >
                                <Mic className="w-6 h-6" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>

            {/* Status Text */}
            <AnimatePresence mode="wait">
                {isRecording ? (
                    <motion.div
                        key="recording-status"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-3 flex items-center gap-2 text-coral-500"
                    >
                        <Volume2 className="w-4 h-4 animate-pulse" />
                        <span className="text-sm font-medium">Listening...</span>
                    </motion.div>
                ) : isProcessing ? (
                    <motion.div
                        key="processing-status"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-3 text-sm text-muted-foreground"
                    >
                        Processing...
                    </motion.div>
                ) : (
                    <motion.div
                        key="ready-status"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-3 text-sm text-muted-foreground"
                    >
                        Click to speak your workflow
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Live Transcript */}
            <AnimatePresence>
                {transcript && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 w-full max-w-md"
                    >
                        <div className="p-4 rounded-xl bg-muted/50 border border-border">
                            <p className="text-sm text-foreground italic">"{transcript}"</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-3 flex items-center gap-2 text-coral-500"
                    >
                        <MicOff className="w-4 h-4" />
                        <span className="text-sm">{error}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

