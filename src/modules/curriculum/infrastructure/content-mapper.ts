import { viewTitles, type Catalog } from "../domain/catalog";
import type { LessonBundle } from "../application/contracts";
function assert(ok: unknown, message: string): asserts ok {
  if (!ok) throw new Error("Invalid curriculum data: " + message);
}
function object(v: unknown): asserts v is Record<string, unknown> {
  assert(v && typeof v === "object" && !Array.isArray(v), "expected object");
}
function text(v: unknown): asserts v is string { assert(typeof v === "string", "expected text"); }
function list(v: unknown): asserts v is unknown[] { assert(Array.isArray(v), "expected list"); }
function identifier(v: unknown): asserts v is string { text(v); assert(/^[a-z0-9-]+$/.test(v), "invalid ID"); }
export function decodeCatalog(value: unknown): Catalog {
  object(value); assert(value.schemaVersion === 1, "unsupported schema"); text(value.siteTitleJa); list(value.books);
  const books = new Set(), units = new Set();
  for (const b of value.books) {
    object(b); identifier(b.id); assert(!books.has(b.id), "duplicate book"); books.add(b.id);
    text(b.titleJa); text(b.subtitleJa); list(b.units);
    for (const u of b.units) {
      object(u); identifier(u.id); assert(!units.has(u.id), "duplicate unit"); units.add(u.id);
      text(u.titleJa); text(u.groupJa); list(u.views);
      assert(u.views.length && new Set(u.views).size === u.views.length && u.views.every(v => typeof v === "string" && Object.hasOwn(viewTitles, v)), "invalid study view");
      for (const key of ["wordCount", "questionCount"]) assert(Number.isInteger(u[key]) && (u[key] as number) >= 0, "invalid count");
    }
  }
  return value as unknown as Catalog;
}
export function decodeLesson(value: unknown, expectedId: string): LessonBundle {
  object(value); assert(value.id === expectedId, "unit identity mismatch"); identifier(value.bookId);
  text(value.titleJa); text(value.groupJa); object(value.texts);
  const translations = value.texts;
  for (const entry of Object.values(translations)) { object(entry); text(entry.zh); text(entry.en); }
  const ref = (id: unknown) => { text(id); assert(Object.hasOwn(translations, id), "missing translation " + id); };
  const optionalRef = (id: unknown) => { if (id !== undefined) ref(id); };
  const segments = (a: unknown) => { list(a); assert(a.length, "empty prompt or option"); for (const s of a) { object(s); assert((typeof s.ja === "string") !== (typeof s.textId === "string"), "invalid segment"); if (s.textId !== undefined) ref(s.textId); } };
  list(value.words);
  for (const w of value.words) { object(w); text(w.id); text(w.wordJa); text(w.readingJa); ref(w.meaningId); optionalRef(w.noteId); }
  const articleIds = new Set();
  const articles = (a: unknown) => {
    list(a);
    for (const item of a) {
      object(item); text(item.id); assert(!articleIds.has(item.id), "duplicate article"); articleIds.add(item.id); text(item.titleJa);
      list(item.paragraphIds); item.paragraphIds.forEach(ref); list(item.examples);
      for (const e of item.examples) { object(e); text(e.ja); optionalRef(e.translationId); optionalRef(e.analysisId); if (e.answerJa !== undefined) text(e.answerJa); }
      articles(item.children);
    }
  };
  articles(value.articles); list(value.questions);
  const questionIds = new Set();
  for (const q of value.questions) {
    object(q); text(q.id); assert(!questionIds.has(q.id), "duplicate question"); questionIds.add(q.id);
    segments(q.prompt); optionalRef(q.instructionId); optionalRef(q.explanationId);
    if (q.options !== undefined) {
      list(q.options); const options = q.options; assert(options.length >= 2, "missing options"); options.forEach(segments);
      list(q.accepted); assert(q.accepted.length && q.accepted.every(i => Number.isInteger(i) && (i as number) >= 0 && (i as number) < options.length), "invalid accepted answer");
    } else { list(q.acceptedText); assert(q.acceptedText.length && q.acceptedText.every(a => typeof a === "string" && a.trim()), "missing answer"); }
  }
  return value as unknown as LessonBundle;
}
