import type { LessonBundle } from "../../modules/curriculum/public";
import type { Article } from "../../modules/grammar/public";
import { Text, useStudy } from "../context";
import { Japanese } from "../components/Japanese";
import { ListenButton } from "../components/ListenButton";
function ArticleView({
  article,
  catalog,
  nested = false,
}: {
  article: Article;
  catalog: LessonBundle["texts"];
  nested?: boolean;
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
            <ListenButton text={e.ja} />
          </div>
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
        <ArticleView key={child.id} article={child} catalog={catalog} nested />
      ))}
    </article>
  );
}
export function GrammarScreen({ lesson }: { lesson: LessonBundle }) {
  const { services } = useStudy();
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
        {lesson.articles.map((a) => (
          <ArticleView key={a.id} article={a} catalog={lesson.texts} />
        ))}
      </div>
    </div>
  );
}
