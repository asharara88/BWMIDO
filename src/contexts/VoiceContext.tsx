import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVoiceSettings } from '../hooks/useVoiceSettings';
import { useVoiceCommands } from '../hooks/useVoiceCommands';
import TextToSpeechService from '../services/TextToSpeechService';
import { ErrorCode, createErrorObject } from '../utils/errorHandling';
import { useError } from './ErrorContext';

interface VoiceContextType {
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  interimTranscript: string;
  lastCommand: string | null;
  isVoiceSupported: boolean;
  settings: ReturnType<typeof useVoiceSettings>['settings'];
  updateSetting: <K extends keyof ReturnType<typeof useVoiceSettings>['settings']>(key: K, value: ReturnType<typeof useVoiceSettings>['settings'][K]) => void;
  toggleVoice: () => void;
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string, options?: any) => Promise<void>;
  stopSpeaking: () => void;
  processCommand: (text: string) => boolean;
  executeVoiceQuery: (query: string) => void;
  showCommandHelp: () => void;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export function VoiceProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { addError } = useError();

  const { settings, updateSetting: updateSettingOriginal, toggleVoice } = useVoiceSettings();
  const { initCommands, handleVoiceInput, showVoiceHelp } = useVoiceCommands();

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [lastCommand, setLastCommand] = useState<string | null>(null);

  const isVoiceSupported = useMemo(
    () => typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window),
    [],
  );

  const ttsService = useMemo(() => TextToSpeechService.getInstance(), []);
  const ttsSupported = TextToSpeechService.isSupported();

  useEffect(() => {
    if (settings.commandsEnabled) {
      initCommands();
    }
  }, [initCommands, settings.commandsEnabled]);

  const updateSetting = <K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) => {
    updateSettingOriginal(key, value);
  };

  const startListening = () => {
    if (!isVoiceSupported) {
      addError(
        createErrorObject(
          'Speech recognition is not supported in this browser',
          'warning',
          ErrorCode.DEVICE_NOT_SUPPORTED,
          'voice',
        ),
      );
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => {
        setIsListening(true);
      })
      .catch(() => {
        addError(
          createErrorObject(
            'Microphone access is required for voice input',
            'warning',
            ErrorCode.DEVICE_PERMISSION_DENIED,
            'voice',
          ),
        );
      });
  };

  const stopListening = () => {
    setIsListening(false);
  };

  const speak = async (text: string, options?: any) => {
    if (!ttsSupported) {
      addError(createErrorObject('Text-to-speech is not supported', 'warning', ErrorCode.DEVICE_NOT_SUPPORTED, 'voice'));
      return;
    }

    try {
      setIsSpeaking(true);
      await ttsService.speak(text, options);
    } catch (err) {
      addError(createErrorObject('Failed to speak text', 'error', ErrorCode.VOICE_ERROR, 'voice'));
    } finally {
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    ttsService.cancel();
    setIsSpeaking(false);
  };

  const processCommand = (text: string): boolean => {
    const handled = handleVoiceInput(text);
    if (handled) {
      setLastCommand(text);
    }
    return handled;
  };

  const executeVoiceQuery = (query: string) => {
    navigate(`/search?query=${encodeURIComponent(query)}`);
  };

  const showCommandHelp = () => {
    showVoiceHelp();
  };

  const value: VoiceContextType = {
    isListening,
    isSpeaking,
    transcript,
    interimTranscript,
    lastCommand,
    isVoiceSupported,
    settings,
    updateSetting,
    toggleVoice,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    processCommand,
    executeVoiceQuery,
    showCommandHelp,
  };

  return <VoiceContext.Provider value={value}>{children}</VoiceContext.Provider>;
}

export function useVoice() {
  const context = useContext(VoiceContext);
  if (context === undefined) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
}

export { VoiceContext };
