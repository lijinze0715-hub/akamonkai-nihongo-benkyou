export type View =
  | "words"
  | "word-test"
  | "grammar"
  | "grammar-test"
  | "kanji"
  | "reading-test"
  | "katakana";
export const viewTitles: Record<View, string> = {
  words: "単語帳",
  "word-test": "単語テスト",
  grammar: "文法・例文",
  "grammar-test": "文法テスト",
  kanji: "漢字・例文",
  "reading-test": "漢字の読み方",
  katakana: "カタカナテスト",
};
export interface Unit {
  id: string;
  titleJa: string;
  groupJa: string;
  wordCount: number;
  questionCount: number;
  views: View[];
}
export interface Book {
  id: string;
  titleJa: string;
  subtitleJa: string;
  units: Unit[];
}
export interface Catalog {
  schemaVersion: 1;
  siteTitleJa: string;
  books: Book[];
}
