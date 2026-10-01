
export interface SpeechPort {
  speak(text: string, onEnd: () => void): boolean;
  stop(): void;
}
