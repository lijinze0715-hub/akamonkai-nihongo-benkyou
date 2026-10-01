import type { ProgressRepository } from "../application/ports";
import type { Progress } from "../domain/progress";
export class BrowserProgressRepository implements ProgressRepository {
  read(): unknown {
    try {
      return JSON.parse(
        localStorage.getItem("akamonkai.progress.v1") ?? "null",
      );
    } catch {
      return null;
    }
  }
  write(p: Progress) {
    try {
      localStorage.setItem("akamonkai.progress.v1", JSON.stringify(p));
      return true;
    } catch {
      return false;
    }
  }
}
