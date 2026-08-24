# Task / Result Packet

## Task

**Название:** Переименовать экран 2 в «Решение» и собрать три варианта шапки истории

**Владелец:** Codex

**Статус:** done

**Цель:** Синхронно закрепить пользовательское название второго экрана «Решение» и создать в Storybook три самостоятельные мобильные концепции шапки первого экрана, где сюжетная иллюстрация открывает страницу и композиционно связана с заголовком, не меняя production-шапку до выбора владельца.

**Входные источники:**

- решение владельца и три приложенных structural references от 23 августа 2026 года;
- `docs/PRODUCT.md`, `docs/DECISIONS.md`, `docs/DESIGN_SYSTEM.md`;
- `docs/METHODOLOGY.md`, `docs/SECTION_CONTRACT.md`;
- существующие `SectionHeader`, `SectionArtwork`, экраны Story/Analysis и Storybook;
- `living_archive_v1` и сюжетный asset L01-S01.

**Write set:**

- этот task packet;
- пользовательские заголовки экрана 2 в 22 `content/sections/level-*/section-[0-9][0-9]-*.md` и связанный parser/UI;
- `content/sections/level-01/section-template.md`, `content/program/levels-and-sections.md`, `README.md` для согласованного экранного именования;
- компоненты и stories, отвечающие за `SectionHeader`, `SectionFooter` и новые Storybook-концепции story header;
- `docs/PRODUCT.md`, `docs/DECISIONS.md`, `docs/DESIGN_SYSTEM.md`, `docs/METHODOLOGY.md`, `docs/SECTION_CONTRACT.md` только для согласования названия экрана;
- `harness/PROJECT_STATE.md`, `harness/WORKBOARD.md`.

**Вне scope:**

- изменение сюжета, девяти звеньев, финансовых тезисов, источников или границ Section;
- изменение числа экранов, маршрута `/analysis` как внутренней технической детали или имени типа `AnalysisItem`;
- внедрение одного из трёх вариантов шапки в production до отдельного выбора владельца;
- генерация новых сюжетных ассетов, backend, хранение, аналитика, публикация или Git-операции.

**Риски:**

- частичное переименование может оставить в пользовательском UI старое «Разбор решения» или сломать Markdown-parser;
- методический термин «разбор» нельзя механически удалить там, где он описывает девятизвенную аналитическую цепочку, а не имя экрана;
- title-on-image может потерять контраст, закрыть лицо D-F или выглядеть как travel/news template вместо «Живого архива»;
- Storybook-концепты не должны создавать фиктивные controls или незаметно менять production-компонент.

**План проверки:**

- инвентаризировать пользовательские и методические употребления «Разбор решения»;
- проверить 22 Section, два экрана и `22 × 9` после смены заголовка Markdown;
- проверить TypeScript API, stories/autodocs, focus, alt и контраст трёх вариантов;
- выполнить `npm run build`, `npm run build-storybook`, `git diff --check`, `git diff --cached --check` и проверку относительных ссылок;
- визуально проверить три Storybook stories на mobile и desktop, затем открыть Storybook владельцу для выбора.

## Result

**Итог:** Пользовательское имя второго экрана синхронно изменено на «Решение» в 22 Section, шаблоне, parser, runtime, accessibility-copy и Storybook. Создан отдельный экспериментальный `StoryHeroHeader` с тремя Storybook-концепциями; production-шапка истории намеренно не изменена до выбора владельца.

**Файлы:**

- 22 `content/sections/level-*/section-[0-9][0-9]-*.md` и `content/sections/level-01/section-template.md`;
- `src/content/sectionContract.ts`, `src/screens/StoryScreen.tsx`, `src/screens/AnalysisScreen.tsx`;
- `src/components/product/SectionHeader/SectionHeader.tsx` и stories;
- `src/components/product/DecisionChain/DecisionChain.tsx`;
- stories `SectionFooter`, `Button`, `Text`;
- `src/components/experiments/StoryHeroHeader/StoryHeroHeader.tsx`;
- `src/components/experiments/StoryHeroHeader/StoryHeroHeader.module.css`;
- `src/components/experiments/StoryHeroHeader/StoryHeroHeader.stories.tsx`;
- `src/components/experiments/StoryHeroHeader/StoryHeroHeader.stories.module.css`;
- `README.md`, `content/program/levels-and-sections.md`;
- `docs/PRODUCT.md`, `docs/DECISIONS.md`, `docs/DESIGN_SYSTEM.md`, `docs/METHODOLOGY.md`, `docs/SECTION_CONTRACT.md`;
- `harness/PROJECT_STATE.md`, `harness/WORKBOARD.md`, этот task packet.

**Проверки:**

- migration audit: 23/23 заголовка `Экран 2. Решение`, 0 старых точных заголовков; 23/23 паспортных перехода используют экран «Решение» — PASS;
- baseline-normalization audit всех 23 content-файлов: кроме двух утверждённых строк экранного именования изменений нет — PASS;
- 22/22 сюжетных фрагмента дословно совпадают с `content/story/book.md` — PASS;
- структура: 6 уровней, 22 ready Section, распределение `3 / 4 / 4 / 4 / 4 / 3`, два экрана в каждой Section, 198 звеньев (`22 × 9`), 48 внутренних действий — PASS;
- относительные Markdown-ссылки — PASS;
- `npm run typecheck` — PASS;
- `npm run build` — PASS с прежним неблокирующим предупреждением Vite о размере основного chunk;
- `npm run build-storybook` — PASS с неблокирующими предупреждениями о размере Storybook chunks;
- Storybook browser QA: три отдельные stories загружают реальный L01-S01 asset и полный канонический текст, имеют один видимый `h1`, подпись «История», смысловой alt, реальную ссылку в каталог, 44 px navigation target и нулевой horizontal overflow — PASS;
- responsive QA: три варианта проверены при `391 × 845` и `1024 × 899`; лицо D-F не обрезано и не перекрыто заголовком, title-on-image имеет локальную graphite-вуаль, paper-overlap сохраняет контраст paper/ink, image-then-title намеренно переносит часть заголовка за первый мобильный viewport — PASS;
- production browser flow `L01-S01 История → Решение`: CTA переименован, title/aria обновлены, старое экранное имя отсутствует, цепочка содержит 9 items, console error/warn отсутствуют — PASS;
- визуальный reference comparison через `view_image`: сохранены image-first структура, HTML-заголовок, реальная навигация, mobile-first crop и связь с длинным чтением; насыщенные travel/news colors, fake metrics, badges и глянцевые карточки намеренно не перенесены — PASS;
- `git diff --check` и `git diff --cached --check` — PASS.

**Источники и даты:**

- решение владельца и приложенные structural references, 23 августа 2026 года;
- локальные канонические и интерфейсные файлы проекта, проверка начата 23 августа 2026 года.

**Оставшиеся риски:**

- три концепции проверены на утверждённом L01-S01 asset; перед production-переносом нужно повторно проверить crop и контраст на будущих сюжетных изображениях;
- `coverOverlay` сильнее других зависит от локальной светлоты изображения;
- `imageThenTitle` намеренно помещает полный заголовок ниже первого мобильного viewport;
- выбранный вариант пока не определён, поэтому production-композиция первого экрана остаётся прежней.

**Следующий шаг:**

- владелец сравнивает три Storybook stories и выбирает направление; не переносить вариант в production автоматически.
