import type { Catalog, View, Book, Unit } from "../domain/catalog";
import type { Word } from "../../vocabulary/public";
import type { Article } from "../../grammar/public";
import type { Question } from "../../assessment/public";
import type { TranslationCatalog } from "../../../shared/kernel/types";
export interface LessonBundle {
  id: string;
  bookId: string;
  titleJa: string;
  groupJa: string;
  words: Word[];
  articles: Article[];
  questions: Question[];
  texts: TranslationCatalog;
}
export interface CurriculumRepository {
  catalog(): Promise<Catalog>;
  lesson(id: string): Promise<LessonBundle>;
}
export interface LessonSelection { book: Book; unit: Unit; view: View; }
export interface CurriculumQueries {
  catalog(): Promise<Catalog>;
  lesson(id: string, view: View): Promise<LessonBundle>;
  resolve(catalog: Catalog, unitId: string | null, view: string | null): LessonSelection | null;
}
