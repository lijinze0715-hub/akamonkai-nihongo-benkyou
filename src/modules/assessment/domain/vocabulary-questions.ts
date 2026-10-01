import type { Segment } from "../../../shared/kernel/types";
import type { Question } from "./assessment";
export interface VocabularyQuestionSource {
  id: string;
  wordJa: string;
  readingJa: string;
  meaningId: string;
}
export function buildVocabularyQuestions(
    words: readonly VocabularyQuestionSource[],
    meaning: (id: string) => string,
  ): Question[] {
    return words.flatMap((word, index) => {
      const correct = meaning(word.meaningId);
      const seen = new Set([correct]);
      const distractors = words.filter((w) => {
        const text = meaning(w.meaningId);
        if (
          w.wordJa === word.wordJa ||
          w.readingJa === word.readingJa ||
          seen.has(text)
        )
          return false;
        seen.add(text);
        return true;
      });
      const chosen = distractors
        .slice(index % distractors.length)
        .concat(distractors.slice(0, index % distractors.length))
        .slice(0, 3);
      if (chosen.length < 1) return [];
      const options: Segment[][] = [word, ...chosen].map((w) => [
        { textId: w.meaningId },
      ]);
      return [
        {
          id: "vocabulary-test." + word.id,
          prompt: [{ ja: word.wordJa + "（" + word.readingJa + "）" }],
          options,
          accepted: [0],
          explanationId: word.meaningId,
        },
      ];
    });
  }
