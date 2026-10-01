import type { LessonBundle } from "../../modules/curriculum/public";
import type { Article } from "../../modules/grammar/public";
import { Text, useStudy, useUi } from "../context";
import { dialogueLines } from "../../modules/speech/public";
import { VoiceSelect } from "../components/SpeechControls";
import { Japanese } from "../components/Japanese";
import { ListenButton } from "../components/ListenButton";
function ArticleView({
  article,
  catalog,
  nested = false,
  lessonId,
}: {
  article: Article;
  catalog: LessonBundle["texts"];
  nested?: boolean;
  lessonId: string;
}) {
  const Heading = nested ? "h3" : "h2";
  return (
    <article
      className={nested ? "grammar-rule" : "grammar-article"}
      id={article.id}
    >
      <Heading lang="ja" translate="no">
        {article.titleJa}
      </Heading>
      {article.paragraphIds.map((id) => (
        <p key={id}>
          <Text id={id} catalog={catalog} />
        </p>
      ))}
      {article.examples.map((e, i) => (
        <div className="example" key={i}>
          <div className="example-japanese">
            <Japanese text={e.ja} />
            <ListenButton text={e.ja} lines={dialogueLines(e.ja, lessonId)} />
          </div>
          {dialogueLines(e.ja, lessonId).some(line => line.role) && <div className="dialogue-lines">
            {dialogueLines(e.ja, lessonId).map((line, index) => <div className="example-japanese" key={index}>
              <span><strong>{line.role && line.role + "："}</strong><Japanese text={line.text} /></span>
              <ListenButton text={line.text} role={line.role} lessonId={lessonId} />
            </div>)}
          </div>}
          {e.translationId && (
            <p className="translation">
              <Text id={e.translationId} catalog={catalog} />
            </p>
          )}
          {e.analysisId && (
            <p className="analysis">
              <Text id={e.analysisId} catalog={catalog} />
            </p>
          )}
          {e.answerJa && (
            <details>
              <summary lang="ja" translate="no">
                解答
              </summary>
              <Japanese text={e.answerJa} />
            </details>
          )}
        </div>
      ))}
      {article.children.map((child) => (
        <ArticleView key={child.id} article={child} catalog={catalog} lessonId={lessonId} nested />
      ))}
    </article>
  );
}
export function GrammarScreen({ lesson }: { lesson: LessonBundle }) {
  const { services } = useStudy();
  const t = useUi();
  const allLines = (articles: Article[]): ReturnType<typeof dialogueLines> => articles.flatMap(article => [
    ...article.examples.flatMap(example => dialogueLines(example.ja, lesson.id)), ...allLines(article.children),
  ]);
  const lines = allLines(lesson.articles);
  const roles = [...new Set(["我", ...lines.flatMap(line => line.role ? [line.role] : [])])];
  return (
    <div className="grammar-layout">
      <nav className="contents" aria-label="文法の目次">
        <span lang="ja" translate="no">
          この単元の内容
        </span>
        {services.grammar.contents(lesson.articles).map((item, i) => (
          <a key={item.id} href={"#" + item.id} lang="ja" translate="no">
            <small>{String(i + 1).padStart(2, "0")}</small>
            {item.titleJa}
          </a>
        ))}
      </nav>
      <div>
        <section className="speech-controls" aria-label={t("ui.speechRoles")}>
          <div className="button-row">
            {roles.map(role => <VoiceSelect key={role} role={role} lessonId={lesson.id} />)}
            {lines.length > 0 && <ListenButton text={t("ui.speechContinuous")} label={t("ui.speechContinuous")} lines={lines} />}
          </div>
          <small>{t("ui.speechRoleHint")}</small>
        </section>
        {lesson.articles.map((a) => (
          <ArticleView key={a.id} article={a} catalog={lesson.texts} lessonId={lesson.id} />
        ))}
      </div>
    </div>
  );
}
