import type { ProgressUseCases } from "./contracts";
import { emptyProgress, validateProgress, type Progress } from "../domain/progress";
import { LearningProgress } from "../domain/learning-progress";
import type { ProgressRepository } from "./ports";
import type { Clock } from "../../../shared/kernel/clock";
export class ProgressService implements ProgressUseCases {
  constructor(private readonly repository: ProgressRepository, private readonly clock: Clock) {}
  load() { const p = this.repository.read(); return validateProgress(p) ? p : emptyProgress(); }
  mark(progress: Progress, id: string, field: "saved" | "mastered") { return new LearningProgress(progress).mark(id, field); }
  record(progress: Progress, id: string, correct: number, total: number) { return new LearningProgress(progress).record(id, correct, total, this.clock.now()); }
  save(progress: Progress) { new LearningProgress(progress); return this.repository.write(progress); }
  export(progress: Progress) { new LearningProgress(progress); return JSON.stringify(progress, null, 2); }
  import(serialized: string, existing: Progress) {
    const next: unknown = JSON.parse(serialized);
    if (!validateProgress(next)) throw new Error("Invalid progress file");
    return new LearningProgress(existing).merge(next);
  }
}
