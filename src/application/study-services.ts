import type { CurriculumQueries } from "../modules/curriculum/public";
import type { VocabularyUseCases } from "../modules/vocabulary/public";
import type { GrammarUseCases } from "../modules/grammar/public";
import type { AssessmentUseCases } from "../modules/assessment/public";
import type { ProgressUseCases } from "../modules/learning-progress/public";
import type { LocalizationUseCases } from "../modules/localization/public";
import type { SpeechUseCases } from "../modules/speech/public";
/** Stable application boundary. Presentation depends on interfaces, not concrete services. */
export interface StudyServices {
  curriculum: CurriculumQueries;
  vocabulary: VocabularyUseCases;
  grammar: GrammarUseCases;
  assessment: AssessmentUseCases;
  progress: ProgressUseCases;
  localization: LocalizationUseCases;
  speech: SpeechUseCases;
}
