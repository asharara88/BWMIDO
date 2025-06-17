class TextToSpeechService {
  private static instance: TextToSpeechService;

  static getInstance(): TextToSpeechService {
    if (!TextToSpeechService.instance) {
      TextToSpeechService.instance = new TextToSpeechService();
    }
    return TextToSpeechService.instance;
  }

  static isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  async speak(text: string, options?: SpeechSynthesisUtterance): Promise<void> {
    if (!TextToSpeechService.isSupported()) {
      throw new Error('Text-to-speech is not supported');
    }

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      if (options) {
        Object.assign(utterance, options);
      }
      utterance.onend = () => resolve();
      utterance.onerror = () => reject(new Error('Speech synthesis error'));
      speechSynthesis.speak(utterance);
    });
  }

  cancel() {
    if (TextToSpeechService.isSupported()) {
      speechSynthesis.cancel();
    }
  }
}

export default TextToSpeechService;
