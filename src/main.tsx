import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { initializeServices } from "./bootstrap/initialize";
import type { StudyServices } from "./application/study-services";
import { StudyProvider } from "./presentation/context";
import { App } from "./presentation/App";
import "./presentation/styles/index.css";
function Startup() {
  const [services, setServices] = useState<StudyServices | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    initializeServices().then(s => { if (active) setServices(s); }).catch(() => { if (active) setFailed(true); });
    return () => { active = false; };
  }, [attempt]);
  if (services) return <StudyProvider services={services}><App /></StudyProvider>;
  return <main className="empty-state" lang="ja">
    <h1>赤門会日本語</h1>
    <p role={failed ? "alert" : "status"}>{failed ? "教材を読み込めませんでした。" : "読み込み中…"}</p>
    {failed && <button onClick={() => { setFailed(false); setAttempt(n => n + 1); }}>再読み込み / 重试 / Retry</button>}
  </main>;
}
createRoot(document.getElementById("root")!).render(<StrictMode><Startup /></StrictMode>);
