import { useState } from "react";
import type { Question, Answers } from "../../modules/assessment/public";
import type { LessonBundle, View } from "../../modules/curriculum/public";
import { useStudy, useUi, Text } from "../context";
import { Segments, Japanese } from "../components/Japanese";
export function AssessmentScreen({
  lesson,
  view,
}: {
  lesson: LessonBundle;
  view: View;
}) {
  const { services, progress, updateProgress } = useStudy();
  const t = useUi();
  const startQuestions = () => services.assessment.start(
      view === "word-test"
        ? services.assessment.vocabulary(
            lesson.words,
            (id) => lesson.texts[id].zh,
          )
        : lesson.questions,
    );
  const [questions, setQuestions] = useState<Question[]>(startQuestions);
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);
  const [page, setPage] = useState(0);
  const result = services.assessment.grade(questions, answers);
  const pageSize = 10,
    pages = Math.ceil(questions.length / pageSize);
  const visible = questions.slice(page * pageSize, (page + 1) * pageSize);
  function restart(wrongOnly: boolean) {
    setQuestions(
      wrongOnly
        ? services.assessment.retry(questions, answers)
        : startQuestions(),
    );
    setAnswers({});
    setSubmitted(false);
    setPage(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  const controls = (
    <div className="pagination">
      <button
        disabled={!page}
        onClick={() => {
          setPage(page - 1);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        {t("ui.previous")}
      </button>
      <span>
        {page + 1} / {pages}
      </span>
      <button
        disabled={page + 1 >= pages}
        onClick={() => {
          setPage(page + 1);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        {t("ui.next")}
      </button>
    </div>
  );
  if (!questions.length)
    return <p className="empty-state">{t("ui.pending")}</p>;
  return (
    <section className="assessment">
      <div className="assessment-heading">
        <p>
          {view === "word-test"
            ? t("ui.wordTest")
            : lesson.id === "katakana"
              ? t("ui.katakanaTest")
              : lesson.id.startsWith("kanji-")
                ? t("ui.readingTest")
                : t("ui.questionCount", { count: questions.length })}
        </p>
        <span aria-live="polite">
          {t("ui.progress", { done: result.answered, total: result.total })}
        </span>
      </div>
      <progress
        value={result.answered}
        max={result.total}
        aria-label={t("ui.progress", {
          done: result.answered,
          total: result.total,
        })}
      />
      {submitted && (
        <div className="result-panel" role="status">
          <h2 lang="ja" translate="no">
            練習結果
          </h2>
          <strong>
            {t("ui.result", {
              correct: result.correct,
              total: result.total,
              percent: Math.round((result.correct / result.total) * 100),
            })}
          </strong>
          <div className="button-row">
            {!!result.wrongIds.length && (
              <button onClick={() => restart(true)}>
                {t("ui.retryWrong")}
              </button>
            )}
            <button onClick={() => restart(false)}>{t("ui.retry")}</button>
          </div>
        </div>
      )}
      {pages > 1 && controls}
      <div className="questions">
        {visible.map((q, i) => {
          const correct = services.assessment.correct(q, answers[q.id]);
          return (
            <fieldset
              key={q.id}
              className={
                "question" +
                (submitted ? (correct ? " correct" : " incorrect") : "")
              }
              disabled={submitted}
            >
              <legend>
                <span className="question-number">
                  {String(page * pageSize + i + 1).padStart(2, "0")}
                </span>
                <Segments segments={q.prompt} catalog={lesson.texts} />
              </legend>
              {q.instructionId && (
                <p className="muted">
                  <Text id={q.instructionId} catalog={lesson.texts} />
                </p>
              )}
              {q.options ? (
                <div className="options">
                  {q.options.map((o, n) => (
                    <label
                      key={n}
                      className={
                        (answers[q.id] === n ? "selected " : "") +
                        (submitted && q.accepted?.includes(n)
                          ? "answer-key"
                          : "")
                      }
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={n}
                        checked={answers[q.id] === n}
                        onChange={() => setAnswers({ ...answers, [q.id]: n })}
                      />
                      <span className="option-letter">
                        {String.fromCharCode(65 + n)}
                      </span>
                      <span>
                        <Segments segments={o} catalog={lesson.texts} />
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <input
                  className="answer-input"
                  autoComplete="off"
                  spellCheck={false}
                  aria-label={
                    t("ui.inputAnswer") + " " + (page * pageSize + i + 1)
                  }
                  placeholder={t("ui.inputAnswer")}
                  value={answers[q.id] ?? ""}
                  onChange={(e) =>
                    setAnswers({ ...answers, [q.id]: e.target.value })
                  }
                />
              )}
              {submitted && (
                <div className="feedback">
                  <strong>{t(correct ? "ui.correct" : "ui.incorrect")}</strong>
                  <p>
                    {t("ui.answer")}：
                    {q.options ? (
                      q.accepted?.map((n, index) => (
                        <span key={n}>
                          {index ? " ／ " : ""}
                          <Segments
                            segments={q.options![n]}
                            catalog={lesson.texts}
                          />
                        </span>
                      ))
                    ) : (
                      <Japanese text={q.acceptedText?.join(" ／ ") ?? ""} />
                    )}
                  </p>
                  {q.explanationId && (
                    <p>
                      <Text id={q.explanationId} catalog={lesson.texts} />
                    </p>
                  )}
                </div>
              )}
            </fieldset>
          );
        })}
      </div>
      {pages > 1 && controls}
      {!submitted && (
        <div className="submit-area">
          <button
            className="primary-button"
            disabled={!result.complete}
            onClick={() => {
              if (!result.complete) return;
              setSubmitted(true);
              updateProgress(
                services.progress.record(
                  progress,
                  lesson.id + ":" + view,
                  result.correct,
                  result.total,
                ),
              );
              setPage(0);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            {t("ui.submit")}
          </button>
          {!result.complete && <p className="muted">{t("ui.finishAll")}</p>}
        </div>
      )}
    </section>
  );
}
