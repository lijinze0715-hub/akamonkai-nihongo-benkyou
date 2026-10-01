import { validateProgress, type Progress, type WordMark } from "./progress";
export class LearningProgress {
  constructor(private readonly state: Progress) {
    if (!validateProgress(state)) throw new Error("Invalid progress");
  }
  mark(id: string, field: keyof WordMark): Progress {
    if (!id.trim()) throw new Error("Invalid word ID");
    const before = this.state.words[id] ?? { saved: false, mastered: false };
    return { ...this.state, words: { ...this.state.words, [id]: { ...before, [field]: !before[field] } } };
  }
  record(id: string, correct: number, total: number, at: string): Progress {
    if (!id.trim() || !Number.isInteger(total) || total <= 0 || !Number.isInteger(correct) || correct < 0 || correct > total || !Number.isFinite(Date.parse(at)))
      throw new Error("Invalid assessment result");
    return { ...this.state, results: { ...this.state.results, [id]: { correct, total, at } } };
  }
  merge(next: Progress): Progress {
    if (!validateProgress(next)) throw new Error("Invalid progress file");
    return { ...this.state, words: { ...this.state.words, ...next.words }, results: { ...this.state.results, ...next.results } };
  }
}
