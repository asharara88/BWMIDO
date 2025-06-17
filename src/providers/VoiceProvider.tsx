import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

interface VoiceContextValue {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string) => void;
}

const VoiceContext = createContext<VoiceContextValue | undefined>(undefined);

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = true;
      recog.interimResults = true;
      recog.onresult = (e: SpeechRecognitionEvent) => {
        const result = e.results[e.results.length - 1];
        if (result.isFinal) {
          setTranscript(prev => prev + result[0].transcript);
        }
      };
      recognitionRef.current = recog;
    }
  }, []);

  const startListening = useCallback(() => {
    const recog = recognitionRef.current;
    if (recog && !isListening) {
      recog.start();
      setIsListening(true);
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    const recog = recognitionRef.current;
    if (recog && isListening) {
      recog.stop();
      setIsListening(false);
    }
  }, [isListening]);

  const speak = useCallback((text: string) => {
    const synth = window.speechSynthesis;
    if (synth) {
      const utter = new SpeechSynthesisUtterance(text);
      synth.speak(utter);
    }
  }, []);

  const contextValue: VoiceContextValue = {
    isListening,
    transcript,
    startListening,
    stopListening,
    speak,
  };

  return (
    <VoiceContext.Provider value={contextValue}>
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};
