# 赤門会日本語

新規実装の日本語復習サイト。旧サイトはデータの参照元であり、このアプリは旧サイトのページ・実行コードに依存しません。

## Development
- `pnpm install --frozen-lockfile`
- `pnpm check`
- `pnpm build`
- `pnpm dev`

`pnpm dev` generates the content in `public/content` before starting the development server. These generated files are ignored by Git, so a fresh checkout does not contain them. After editing source content in `data/content`, restart `pnpm dev` to regenerate it.

## Architecture
`presentation → module public/application → domain`
Infrastructure implements application ports. `src/bootstrap` is the composition root; presentation receives explicit interfaces through `StudyServices`. Curriculum selection and learning-progress transitions live in the domain layer. HTTP adapters validate external JSON before exposing it to use cases.

- `src/modules/curriculum`: catalog, lesson lookup and route validation.
- `src/modules/vocabulary`: word records and vocabulary search.
- `src/modules/grammar`: article models and contents.
- `src/modules/assessment`: grading, alternative answers, shuffling and vocabulary questions.
- `src/modules/learning-progress`: marks, results, validation and import/export.
- `src/modules/localization`: explicit text-ID lookup and locale preference.
- `src/modules/speech`: speech port and browser implementation.
- `src/presentation`: one shell, four reusable screens, shared components and styles.
- `src/application/study-services.ts`: presentation-facing service contract.

Domain code imports no React, browser APIs or content files. Cross-module access goes through public.ts. Network and storage calls are restricted to infrastructure. The check script enforces boundaries and detects runtime cycles.

## Content maintenance
- `data/content/catalog.json`: Japanese textbook titles, ordered units, available views.
- `data/content/units/*.json`: textbook grammar, Japanese examples, questions, word references.
- `data/content/vocabulary.json`: canonical vocabulary records keyed by stable word IDs.
- `data/content/localization/learning.json`: editable Chinese/English textbook text catalog. Teach formation rules in the introducing lesson; later lessons retain their own usage explanations without generic conjugation appendices. Do not reintroduce `curriculum.conjugation.*` or `verb-*` reference sections into textbook units.
- `data/content/reference/verbs.json`: independent, self-contained verb conjugation reference, including all its own articles, examples and Chinese/English texts. It must not be generated from textbook units or resolve translations from the textbook catalog. Edit it separately only when the reference itself needs a change.
- `data/content/localization/ui.json`: the sole editable Chinese/English UI text catalog.

To fix Chinese, edit only the existing ID's zh value. Never regenerate IDs from wording or position. Japanese titles, written forms, readings and original prompt segments are explicit fields; they never pass through translation. Mixed prompts distinguish Japanese source from ID-bound explanatory instructions.

The build compiles each unit and only its referenced translations to public/content. UI translations are also emitted as public/content/ui.json and fetched at startup. Code cannot import source JSON or data directories. Generated public/content and dist are ignored by Git. The client fetches one unit at a time, rather than bundling the full textbook collection. Do not edit generated files. Source data and application code remain in one repository and are published together; this is not a standalone database.

## Progress
Progress and language preferences live in browser storage on this origin. The versioned JSON export/import merges records by ID. This new origin cannot read the old site's browser storage. No user account, cloud progress sync or business database is configured.

## Content scope
102 units, 4,420 vocabulary placements, 1,807 fixed questions. Vocabulary choice questions are generated separately. Kanji reading tests and the 130-question katakana test use the same assessment engine. Missing N2 vocabulary remains explicitly unavailable.

See data/content/provenance.json for the source commit. The September 2026 content correction pass repairs identified English errors, clarifies 61 N2 questions (9 retain multiple natural answers), adds 140 kanji sentences and 16 original supplementary reading questions. Automated checks validate references, grading and boundaries; they do not certify the linguistic accuracy of every source passage.

## Deployment
GitHub Pages deployment is defined in `.github/workflows/deploy-pages.yml`. In the repository's Settings → Pages → Build and deployment, select **GitHub Actions** as the source once. Every push to `main` then installs dependencies, runs `pnpm build` (including content and architecture checks), uploads `dist`, and deploys it. The workflow can also be started manually from the Actions tab. A failed build does not proceed to deployment.

Website: https://lijinze0715-hub.github.io/akamonkai-nihongo-benkyou/

Production builds use `/akamonkai-nihongo-benkyou/` as Vite's base path; content requests and navigation links are relative to the current site directory. Development still runs at `/`. To preview the production build locally, run `pnpm build` and `pnpm preview`, then open `/akamonkai-nihongo-benkyou/` on the preview server. If the repository name changes or a custom domain is added, update the production base path in `vite.config.ts`.

Commit source files, the workflow and the lockfile. Generated `dist` and `public/content` stay ignored; GitHub Actions generates and publishes them.
