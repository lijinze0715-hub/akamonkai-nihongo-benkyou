import type { Progress } from "../domain/progress";
export interface ProgressUseCases {
 load(): Progress;
 mark(progress: Progress, id: string, field: "saved" | "mastered"): Progress;
 record(progress: Progress, id: string, correct: number, total: number): Progress;
 save(progress: Progress): boolean;
 export(progress: Progress): string;
 import(serialized: string, existing: Progress): Progress;
}
