import { CurriculumService } from "../modules/curriculum/application/curriculum-service";
import { HttpCurriculumRepository } from "../modules/curriculum/infrastructure/http-curriculum-repository";
import { VocabularyService } from "../modules/vocabulary/application/vocabulary-service";
import { GrammarService } from "../modules/grammar/application/grammar-service";
import { AssessmentService } from "../modules/assessment/application/assessment-service";
import { ProgressService } from "../modules/learning-progress/application/progress-service";
import { BrowserProgressRepository } from "../modules/learning-progress/infrastructure/browser-progress-repository";
import { LocalizationService } from "../modules/localization/application/localization-service";
import { BrowserLanguagePreference } from "../modules/localization/infrastructure/browser-language-preference";
import type { TranslationCatalog } from "../shared/kernel/types";
import { SpeechService } from "../modules/speech/application/speech-service";
import { BrowserSpeech } from "../modules/speech/infrastructure/browser-speech";
import type { StudyServices } from "../application/study-services";
import { SystemClock } from "../shared/infrastructure/system-clock";
export function createServices(ui: TranslationCatalog): StudyServices {
  return {
    curriculum: new CurriculumService(new HttpCurriculumRepository()),
    vocabulary: new VocabularyService(),
    grammar: new GrammarService(),
    assessment: new AssessmentService(),
    progress: new ProgressService(new BrowserProgressRepository(), new SystemClock()),
    localization: new LocalizationService(new BrowserLanguagePreference(), ui),
    speech: new SpeechService(new BrowserSpeech()),
  };
}
