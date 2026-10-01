import { useState } from "react";
import {
  viewTitles,
  type Catalog,
  type View,
} from "../../modules/curriculum/public";
import { useUi, useStudy } from "../context";
export const lessonHref = (id: string, view: View) =>
  "?unit=" + encodeURIComponent(id) + "&view=" + view;
const isExtra = (id: string) => id === "verbs" || id === "katakana";
export function IndexScreen({ catalog }: { catalog: Catalog }) {
  const t = useUi();
  const { progress } = useStudy();
  const [bookId, setBook] = useState("all");
  const [query, setQuery] = useState("");
  const total = catalog.books.reduce((n, b) => n + b.units.length, 0);
  const visibleBooks = catalog.books
    .filter((book) => bookId === "all" || book.id === bookId)
    .map((book) => ({
      ...book,
      units: book.units.filter((unit) =>
        [unit.titleJa, unit.groupJa, book.titleJa].some((text) =>
          text.toLowerCase().includes(query.toLowerCase()),
        ),
      ),
    }));
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
        <div className="eyebrow" lang="ja" translate="no">
          学習ノート / 教材索引
        </div>
        <h1 lang="ja" translate="no">
          今日の<span>日本語学習</span>
        </h1>
        <p>{t("ui.intro")}</p>
        </div>
        <div className="hero-stats" lang="ja" translate="no">
          <div><strong>{catalog.books.length}</strong><span>教材</span></div>
          <div><strong>{total}</strong><span>学習単元</span></div>
        </div>
      </section>
      <section className="index-section">
        <div className="section-heading">
          <h2 lang="ja" translate="no">
            教材をひらく
          </h2>
          <p>{t("ui.indexHelp")}</p>
        </div>
        <div className="catalog-layout">
        <aside className="index-controls">
          <div className="filter-heading" lang="ja" translate="no">教材一覧</div>
          <nav className="book-filters" aria-label={t("ui.all")}>
            <button
              aria-pressed={bookId === "all"}
              onClick={() => setBook("all")}
            >
              <span>{t("ui.all")}</span><small>{catalog.books.length}</small>
            </button>
            {catalog.books.map((b) => (
              <button
                key={b.id}
                lang="ja"
                translate="no"
                aria-pressed={bookId === b.id}
                onClick={() => setBook(b.id)}
              >
                <span>{b.titleJa}</span><small>{b.units.length}</small>
              </button>
            ))}
          </nav>
        </aside>
        <div className="catalog-content">
          <div className="catalog-toolbar">
          <span className="catalog-caption" lang="ja" translate="no">{bookId === "all" ? "すべての教材" : catalog.books.find(b => b.id === bookId)?.titleJa}</span>
          <div className="search-field">
          <span className="search-icon" aria-hidden="true" />
          <input
            type="search"
            aria-label={t("ui.search")}
            placeholder={t("ui.search")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          </div>
        </div>
        <div className="book-list">
          {visibleBooks.map((book) => {
              const units = book.units;
              if (!units.length) return null;
              return (
                <section className="book-section" data-book={book.id} key={book.id}>
                  <div className="book-heading">
                    <span className="book-number">
                      {String(catalog.books.findIndex(b => b.id === book.id) + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p lang="ja" translate="no">
                        {book.subtitleJa}
                      </p>
                      <h3 lang="ja" translate="no">
                        {book.titleJa}
                      </h3>
                    </div>
                    <span className="book-unit-count" lang="ja" translate="no">
                      {units.length} 単元
                    </span>
                  </div>
                  <div className="study-types">
                    {(book.units.every((u) => u.views.includes("kanji"))
                      ? (["words", "word-test", "kanji", "reading-test"] as View[])
                      : ([
                          "words",
                          "word-test",
                          "grammar",
                          "grammar-test",
                        ] as View[])
                    ).map((view) => (
                      <details key={view} open={!!query || undefined}>
                        <summary lang="ja" translate="no">
                          <span className="study-icon" aria-hidden="true">{view === "words" ? "あ" : view === "kanji" ? "漢" : view === "grammar" ? "文" : "✓"}</span>
                          <span>{viewTitles[view]}</span>
                          <small>
                            {
                              units.filter(
                                (u) =>
                                  !isExtra(u.id) &&
                                  u.views.includes(view),
                              ).length
                            }
                          </small>
                          <span className="expand-icon">＋</span>
                        </summary>
                        {!units.some(
                          (u) => !isExtra(u.id) && u.views.includes(view),
                        ) ? (
                          <p className="muted pending">{t("ui.pending")}</p>
                        ) : (
                          <div className="index-links">
                            {units
                              .filter(
                                (u) =>
                                  !isExtra(u.id) &&
                                  u.views.includes(view),
                              )
                              .map((u) => (
                                <a href={lessonHref(u.id, view)} key={u.id}>
                                  <span>
                                    <small lang="ja" translate="no">
                                      {u.groupJa}
                                    </small>
                                    <strong lang="ja" translate="no">
                                      {u.titleJa}
                                    </strong>
                                  </span>
                                  <span className="link-meta">
                                    {progress.results[u.id + ":" + view]
                                      ? t(
                                          "ui.lastResult",
                                          progress.results[u.id + ":" + view],
                                        )
                                      : view === "words"
                                        ? t("ui.wordCount", {
                                            count: u.wordCount,
                                          })
                                        : ""}
                                  </span>
                                </a>
                              ))}
                          </div>
                        )}
                      </details>
                    ))}
                    {units.some((u) => isExtra(u.id)) && (
                      <div className="index-links">
                        {units.filter((u) => isExtra(u.id)).flatMap((u) =>
                          u.views.map((view) => (
                            <a key={u.id + view} href={lessonHref(u.id, view)}>
                              <span>
                                <small lang="ja" translate="no">{viewTitles[view]}</small>
                                <strong lang="ja" translate="no">{u.titleJa}</strong>
                              </span>
                            </a>
                          )),
                        )}
                      </div>
                    )}
                  </div>
                </section>
              );
            })}
        </div>
        {!visibleBooks.some((book) => book.units.length) && <p className="empty-state">{t("ui.empty")}</p>}
        </div>
        </div>
      </section>
    </>
  );
}
