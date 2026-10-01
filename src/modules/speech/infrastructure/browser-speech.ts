import type { SpeechPort } from "../application/ports";
export class BrowserSpeech implements SpeechPort {
  speak(text: string, onEnd: () => void) {
    if (!("speechSynthesis" in window)) return false;
    this.stop();
    const u = new SpeechSynthesisUtterance(
      text.replace(/\[([^:\]]+):([^\]]+)\]/g, "$2"),
    );
    u.lang = "ja-JP";
    u.rate = 0.85;
    u.voice =
      speechSynthesis.getVoices().find((v) => v.lang.startsWith("ja")) ?? null;
    u.onend = onEnd;
    u.onerror = onEnd;
    speechSynthesis.speak(u);
    return true;
  }
  stop() {
    if ("speechSynthesis" in window) speechSynthesis.cancel();
  }
}
