import { useState } from 'react';

export interface VoiceSettings {
  voiceEnabled: boolean;
  commandsEnabled: boolean;
}

export function useVoiceSettings() {
  const [settings, setSettings] = useState<VoiceSettings>({
    voiceEnabled: false,
    commandsEnabled: true,
  });

  const updateSetting = <K extends keyof VoiceSettings>(key: K, value: VoiceSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const toggleVoice = () => {
    setSettings((prev) => ({ ...prev, voiceEnabled: !prev.voiceEnabled }));
  };

  return { settings, updateSetting, toggleVoice };
}
