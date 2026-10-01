import { useEffect, useState, Component, type ReactNode } from "react";
import type { Catalog } from "../modules/curriculum/public";
import { useStudy, useUi } from "./context";
import { Shell } from "./shell/Shell";
import { IndexScreen } from "./screens/IndexScreen";
import { LessonScreen } from "./screens/LessonScreen";
class ErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <section className="empty-state">
        <h1 lang="ja">ページを表示できません</h1>
        <a href="./" lang="ja">
          教材索引に戻る
        </a>
      </section>
    ) : (
      this.props.children
    );
  }
}
export function App() {
  const { services } = useStudy();
  const t = useUi();
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    services.curriculum
      .catalog()
      .then(setCatalog)
      .catch(() => setError(true));
  }, [services]);
  let content: ReactNode = (
    <p className="empty-state" role="status">
      {t("ui.loading")}
    </p>
  );
  if (error)
    content = (
      <div className="empty-state">
        <p>{t("ui.error")}</p>
        <a href="./">{t("ui.reload")}</a>
      </div>
    );
  if (catalog) {
    try {
      const params = new URLSearchParams(window.location.search);
      const selected = services.curriculum.resolve(
        catalog,
        params.get("unit"),
        params.get("view"),
      );
      content = selected ? (
        <LessonScreen {...selected} />
      ) : (
        <IndexScreen catalog={catalog} />
      );
    } catch {
      content = (
        <div className="empty-state">
          <h1 lang="ja">教材が見つかりません</h1>
          <a href="./" lang="ja">
            教材索引に戻る
          </a>
        </div>
      );
    }
  }
  return (
    <Shell>
      <ErrorBoundary>{content}</ErrorBoundary>
    </Shell>
  );
}
