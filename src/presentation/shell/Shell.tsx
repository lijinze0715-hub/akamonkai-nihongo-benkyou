import type { ReactNode } from "react";
import { useStudy, useUi } from "../context";
export function Shell({ children }: { children: ReactNode }) {
  const {
    locale,
    setLocale,
    message,
    progress,
    services,
    updateProgress,
    setMessage,
  } = useStudy();
  const t = useUi();
  function download() {
    const url = URL.createObjectURL(
      new Blob([services.progress.export(progress)], {
        type: "application/json",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "akamonkai-progress.json";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="./" lang="ja" translate="no">
            <span className="seal">赤</span>
            <span>
              <strong>赤門会日本語</strong>
              <small>日本語の学びを、毎日。</small>
            </span>
          </a>
          <div className="header-actions">
            <a href="./" lang="ja" translate="no">
              教材索引
            </a>
            <div className="language-switch" aria-label="Language">
              <span aria-hidden="true">◎</span>
              <button
                lang="zh-CN"
                aria-pressed={locale === "zh"}
                onClick={() => setLocale("zh")}
              >
                中文
              </button>
              <button
                lang="en"
                aria-pressed={locale === "en"}
                onClick={() => setLocale("en")}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </header>
      <main id="main">
        {message && (
          <div role="status" className="notice">
            {t(message)}
            <button aria-label="閉じる" onClick={() => setMessage("")}>
              ×
            </button>
          </div>
        )}
        {children}
      </main>
      <footer className="site-footer">
        <div>
          <strong lang="ja" translate="no">
            赤門会日本語
          </strong>
          <p>{t("ui.sourceNote")}</p>
          <a href="./attribution.txt" lang="ja" translate="no">資料の出典・ライセンス ↗</a>
        </div>
        <details className="progress-tools">
          <summary lang="ja" translate="no">
            学習記録
          </summary>
          <p>{t("ui.localOnly")}</p>
          <div className="button-row">
            <button onClick={download}>{t("ui.export")}</button>
            <label className="file-button">
              {t("ui.import")}
              <input
                type="file"
                accept=".json,application/json"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    if (file.size > 2e6) throw Error("File too large");
                    updateProgress(
                      services.progress.import(await file.text(), progress),
                    );
                    setMessage("ui.imported");
                  } catch {
                    setMessage("ui.invalidFile");
                  }
                  e.target.value = "";
                }}
              />
            </label>
          </div>
        </details>
      </footer>
    </>
  );
}
