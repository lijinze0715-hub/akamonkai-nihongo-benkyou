import { useEffect, useState } from "react";
import { useStudy, useUi } from "../context";
export function ListenButton({ text }: { text: string }) {
  const { services, setMessage } = useStudy();
  const t = useUi();
  const [playing, setPlaying] = useState(false);
  useEffect(() => () => services.speech.stop(), [services]);
  return (
    <button
      className="icon-button"
      aria-label={t(playing ? "ui.stop" : "ui.speak") + " " + text}
      onClick={() => {
        if (playing) {
          services.speech.stop();
          setPlaying(false);
        } else {
          const ok = services.speech.speak(text, () => setPlaying(false));
          setPlaying(ok);
          if (!ok) setMessage("ui.speechUnavailable");
        }
      }}
    >
      {playing ? "■" : "♪"} <span>{t(playing ? "ui.stop" : "ui.speak")}</span>
    </button>
  );
}
