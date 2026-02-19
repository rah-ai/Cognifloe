import { useState, useEffect, useCallback } from 'react';

interface UseVoiceAssistantProps {
    onResult?: (text: string) => void;
}

export function useVoiceAssistant({ onResult }: UseVoiceAssistantProps = {}) {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [recognition, setRecognition] = useState<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

            if (SpeechRecognition) {
                const recognitionInstance = new SpeechRecognition();

                recognitionInstance.continuous = false;
                recognitionInstance.interimResults = true;
                recognitionInstance.lang = 'en-US';

                recognitionInstance.onstart = () => {
                    setIsListening(true);
                    setError(null);
                };

                recognitionInstance.onend = () => {
                    setIsListening(false);
                };

                recognitionInstance.onerror = (event: any) => {
                    setError(event.error);
                    setIsListening(false);
                };

                recognitionInstance.onresult = (event: any) => {
                    let interimTranscript = '';
                    let finalTranscript = '';

                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        if (event.results[i].isFinal) {
                            finalTranscript += event.results[i][0].transcript;
                        } else {
                            interimTranscript += event.results[i][0].transcript;
                        }
                    }

                    const currentText = finalTranscript || interimTranscript;
                    setTranscript(currentText);

                    if (finalTranscript && onResult) {
                        onResult(finalTranscript);
                    }
                };

                setRecognition(recognitionInstance);
            } else {
                setError('Speech recognition not supported in this browser.');
            }
        }
    }, [onResult]);

    const startListening = useCallback(() => {
        if (recognition) {
            try {
                recognition.start();
            } catch (e) {
                console.error("Recognition already started", e);
            }
        }
    }, [recognition]);

    const stopListening = useCallback(() => {
        if (recognition) {
            recognition.stop();
        }
    }, [recognition]);

    const speak = useCallback((text: string) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(utterance);
        }
    }, []);

    const cancelSpeech = useCallback(() => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    }, []);

    return {
        isListening,
        transcript,
        error,
        startListening,
        stopListening,
        speak,
        cancelSpeech
    };
}
