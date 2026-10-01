import { useMemo, useState } from "react";
import type { LessonBundle } from "../../modules/curriculum/public";
import { useStudy, useUi, Text } from "../context";
import { Japanese } from "../components/Japanese";
import { ListenButton } from "../components/ListenButton";
export function VocabularyScreen({ lesson }: { lesson: LessonBundle }) {
  const { services, locale, progress, updateProgress } = useStudy();
  const t = useUi();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "saved" | "mastered">("all");
  const words = useMemo(
    () =>
      services.vocabulary
        .search(lesson.words, query, (id) =>
          services.localization.text(lesson.texts, id, locale),
        )
        .filter((w) => filter === "all" || progress.words[w.id]?.[filter]),
    [services, lesson, query, locale, filter, progress],
  );
  return (
    <section>
      <div className="vocabulary-toolbar">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("ui.wordSearch")}
          aria-label={t("ui.wordSearch")}
        />
        <div className="filter-buttons">
          {(["all", "saved", "mastered"] as const).map((f) => (
            <button
              key={f}
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {t("ui." + f)}
            </button>
          ))}
        </div>
      </div>
      <div className="list-caption">
        {t("ui.wordCount", { count: words.length })}
      </div>
      <ul className="vocabulary-list">
        {words.map((w, i) => {
          const mark = progress.words[w.id];
          return (
            <li className="word-row" key={w.id} data-word-id={w.id}>
              <span className="row-number">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="word-content">
                <p className="word-reading">
                  <Japanese text={w.readingJa} />
                </p>
                <p className="word-headword">
                  <Japanese text={w.wordJa} />
                </p>
                <p className="word-meaning">
                  <Text id={w.meaningId} catalog={lesson.texts} />
                </p>
                {w.noteId && (
                  <details className="word-note">
                    <summary lang="ja" translate="no">
                      用法
                    </summary>
                    <p>
                      <Text id={w.noteId} catalog={lesson.texts} />
                    </p>
                  </details>
                )}
              </div>
              <div className="word-actions">
                <ListenButton text={w.readingJa} />
                <button
                  className="icon-button"
                  aria-pressed={!!mark?.saved}
                  aria-label={
                    t(mark?.saved ? "ui.unsave" : "ui.save") + " " + w.wordJa
                  }
                  onClick={() =>
                    updateProgress(
                      services.progress.mark(progress, w.id, "saved"),
                    )
                  }
                >
                  {mark?.saved ? "♥" : "♡"}
                </button>
                <button
                  className="icon-button"
                  aria-pressed={!!mark?.mastered}
                  aria-label={
                    t(mark?.mastered ? "ui.unmaster" : "ui.master") +
                    " " +
                    w.wordJa
                  }
                  onClick={() =>
                    updateProgress(
                      services.progress.mark(progress, w.id, "mastered"),
                    )
                  }
                >
                  ✓
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      {!words.length && <p className="empty-state">{t("ui.empty")}</p>}
    </section>
  );
}
