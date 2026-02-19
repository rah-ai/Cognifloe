import { useRef, useEffect } from "react"

interface VoiceInputProps {
    onTranscript: (text: string) => void
    isListening: boolean
    setIsListening: (listening: boolean) => void
}

export function useVoiceInput({ onTranscript, isListening, setIsListening }: VoiceInputProps) {
    const recognitionRef = useRef<any>(null)
    const finalTranscriptRef = useRef<string>('')
    const silenceTimerRef = useRef<number | null>(null)

    useEffect(() => {
        // Check if browser supports speech recognition
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

        if (!SpeechRecognition) {
            console.warn('Speech recognition not supported in this browser')
            alert('Voice input is not supported in your browser. Please use Chrome, Edge, or Safari.')
            return
        }

        const recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = 'en-US'
        recognition.maxAlternatives = 1

        recognition.onstart = () => {
            console.log('Voice recognition started')
            finalTranscriptRef.current = ''
        }

        recognition.onresult = (event: any) => {
            let interimTranscript = ''
            let finalTranscript = ''

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript

                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' '
                } else {
                    interimTranscript += transcript
                }
            }

            // Update final transcript
            if (finalTranscript) {
                finalTranscriptRef.current += finalTranscript
                onTranscript(finalTranscriptRef.current.trim())

                // Reset silence timer on new speech
                if (silenceTimerRef.current) {
                    clearTimeout(silenceTimerRef.current)
                }

                // Auto-stop after 3 seconds of silence
                silenceTimerRef.current = setTimeout(() => {
                    if (recognitionRef.current && isListening) {
                        stopListening()
                    }
                }, 3000)
            } else if (interimTranscript) {
                // Show interim results
                onTranscript((finalTranscriptRef.current + interimTranscript).trim())
            }
        }

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error)

            // Handle specific errors
            if (event.error === 'no-speech') {
                console.log('No speech detected, stopping...')
            } else if (event.error === 'aborted') {
                console.log('Recognition aborted')
            } else if (event.error === 'not-allowed') {
                alert('Microphone access denied. Please allow microphone access.')
            }

            setIsListening(false)
            if (silenceTimerRef.current) {
                clearTimeout(silenceTimerRef.current)
            }
        }

        recognition.onend = () => {
            console.log('Voice recognition ended')
            setIsListening(false)
            if (silenceTimerRef.current) {
                clearTimeout(silenceTimerRef.current)
            }
        }

        recognitionRef.current = recognition

        return () => {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop()
                } catch (e) {
                    console.log('Recognition already stopped')
                }
            }
            if (silenceTimerRef.current) {
                clearTimeout(silenceTimerRef.current)
            }
        }
    }, []) // Remove dependencies to avoid recreating recognition

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            try {
                finalTranscriptRef.current = ''
                recognitionRef.current.start()
                setIsListening(true)
                console.log('Starting voice recognition...')
            } catch (error) {
                console.error('Error starting recognition:', error)
                // If already started, stop and restart
                recognitionRef.current.stop()
                setTimeout(() => {
                    recognitionRef.current.start()
                    setIsListening(true)
                }, 100)
            }
        }
    }

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            try {
                recognitionRef.current.stop()
                setIsListening(false)
                console.log('Stopping voice recognition...')
            } catch (error) {
                console.error('Error stopping recognition:', error)
                setIsListening(false)
            }

            if (silenceTimerRef.current) {
                clearTimeout(silenceTimerRef.current)
            }
        }
    }

    return { startListening, stopListening }
}
