import type { SpeechUseCases } from "./contracts";
import type { SpeechPort } from "./ports";

export class SpeechService implements SpeechUseCases {
  constructor(private port: SpeechPort) {}
  speak(text: string, onEnd: () => void) {
    return this.port.speak(text, onEnd);
  }
  stop() {
    this.port.stop();
  }
}
