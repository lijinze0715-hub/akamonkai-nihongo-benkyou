import type { Progress } from "../domain/progress";
export interface ProgressRepository {
  read(): unknown;
  write(progress: Progress): boolean;
}
