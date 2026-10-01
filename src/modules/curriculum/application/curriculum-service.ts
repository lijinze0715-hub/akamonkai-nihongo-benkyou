import type { Catalog, View } from "../domain/catalog";
import { Curriculum } from "../domain/curriculum";
import type { CurriculumRepository, CurriculumQueries } from "./contracts";
export class CurriculumService implements CurriculumQueries {
  constructor(private readonly repository: CurriculumRepository) {}
  catalog() { return this.repository.catalog(); }
  async lesson(id: string, view: View) {
    const curriculum = new Curriculum(await this.catalog());
    curriculum.select(id, view);
    return this.repository.lesson(id);
  }
  resolve(catalog: Catalog, unitId: string | null, view: string | null) {
    return unitId ? new Curriculum(catalog).select(unitId, view) : null;
  }
}
