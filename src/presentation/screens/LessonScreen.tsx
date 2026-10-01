import { useEffect, useState } from "react";
import {
  viewTitles,
  type Book,
  type Unit,
  type View,
  type LessonBundle,
} from "../../modules/curriculum/public";
import { useStudy, useUi } from "../context";
import { VocabularyScreen } from "./VocabularyScreen";
import { GrammarScreen } from "./GrammarScreen";
import { AssessmentScreen } from "./AssessmentScreen";
import { lessonHref } from "./IndexScreen";
export function LessonScreen({
  book,
  unit,
  view,
}: {
  book: Book;
  unit: Unit;
  view: View;
}) {
  const { services } = useStudy();
  const t = useUi();
  const [lesson, setLesson] = useState<LessonBundle | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let current = true;
    services.curriculum
      .lesson(unit.id, view)
      .then((data) => {
        if (current) {
          setLesson(data);
          setError(false);
        }
      })
      .catch(() => {
        if (current) setError(true);
      });
    document.title = unit.titleJa + "・" + viewTitles[view] + "｜赤門会日本語";
    return () => {
      current = false;
    };
  }, [services, unit.id, view, attempt]);
  return (
    <>
      <nav
        className="breadcrumbs"
        aria-label="現在の位置"
        lang="ja"
        translate="no"
      >
        <a href="./">教材索引</a>
        <span>/</span>
        <span>{book.titleJa}</span>
        <span>/</span>
        <span>{unit.groupJa}</span>
      </nav>
      <header className="lesson-heading">
        <div className="eyebrow" lang="ja" translate="no">
          {book.titleJa}
        </div>
        <h1 lang="ja" translate="no">
          {unit.titleJa}
        </h1>
        <div className="lesson-subline">
          <span lang="ja" translate="no">
            {viewTitles[view]}
          </span>
          <span>
            {view === "words" || view === "word-test"
              ? t("ui.wordCount", { count: unit.wordCount })
              : view === "grammar-test"
                ? t("ui.questionCount", { count: unit.questionCount })
                : ""}
          </span>
        </div>
      </header>
      <nav className="lesson-tabs" aria-label="学習の種類">
        {unit.views.map((mode) => (
          <a
            key={mode}
            href={lessonHref(unit.id, mode)}
            lang="ja"
            translate="no"
            aria-current={view === mode ? "page" : undefined}
          >
            {viewTitles[mode]}
          </a>
        ))}
      </nav>
      {error ? (
        <div className="empty-state">
          <p>{t("ui.error")}</p>
          <button
            onClick={() => {
              setError(false);
              setAttempt(attempt + 1);
            }}
          >
            {t("ui.reload")}
          </button>
        </div>
      ) : !lesson ? (
        <p className="empty-state" role="status">
          {t("ui.loading")}
        </p>
      ) : view === "words" ? (
        <VocabularyScreen lesson={lesson} />
      ) : view === "grammar" || view === "kanji" ? (
        <GrammarScreen lesson={lesson} />
      ) : (
        <AssessmentScreen lesson={lesson} view={view} />
      )}
      <nav className="lesson-navigation" aria-label="課次">
        {book.units.map((u, i) => {
          const current = book.units.findIndex((x) => x.id === unit.id);
          return (
            (i === current - 1 || i === current + 1) && (
              <a
                key={u.id}
                lang="ja"
                translate="no"
                href={lessonHref(
                  u.id,
                  u.views.includes(view) ? view : u.views[0],
                )}
              >
                {i < current ? "← " : ""}
                {u.titleJa}
                {i > current ? " →" : ""}
              </a>
            )
          );
        })}
      </nav>
    </>
  );
}
