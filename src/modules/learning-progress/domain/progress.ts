export interface WordMark {
  saved: boolean;
  mastered: boolean;
}
export interface Progress {
  version: 1;
  words: Record<string, WordMark>;
  results: Record<string, { correct: number; total: number; at: string }>;
}
export const emptyProgress = (): Progress => ({
  version: 1,
  words: {},
  results: {},
});
export function validateProgress(value: unknown): value is Progress {
  if (!value || typeof value !== "object") return false;
  const p = value as Progress;
  return (
    p.version === 1 &&
    !!p.words &&
    !!p.results &&
    typeof p.words === "object" &&
    typeof p.results === "object" &&
    !Array.isArray(p.words) &&
    !Array.isArray(p.results) &&
    Object.values(p.words).every(
      (w) =>
        w && typeof w.saved === "boolean" && typeof w.mastered === "boolean",
    ) &&
    Object.values(p.results).every(
      (r) =>
        r &&
        Number.isInteger(r.total) &&
        r.total > 0 &&
        Number.isInteger(r.correct) &&
        r.correct >= 0 &&
        r.correct <= r.total &&
        typeof r.at === "string",
    )
  );
}
