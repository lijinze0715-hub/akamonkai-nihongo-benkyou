export interface SpeechUseCases { speak(text: string, onEnd: () => void): boolean; stop(): void; }
