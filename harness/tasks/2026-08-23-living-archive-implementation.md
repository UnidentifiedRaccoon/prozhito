# Task / Result Packet

## Task

**Название:** Внедрить дизайн-систему «Живой архив» и production-ассеты L01-S01

**Владелец:** Codex

**Статус:** done

**Цель:** Перевести статическую демоверсию всех 22 Section на утверждённый визуальный язык «Живой архив» и подключить согласованные сюжетные ассеты с персонажем D-F для первого Section, не меняя продуктовый контракт двух экранов.

**Входные источники:**

- `AGENTS.md`, `harness/PROJECT_STATE.md`, `harness/WORKBOARD.md`, `harness/RISK_POLICY.md`;
- `docs/PRODUCT.md`, `docs/DECISIONS.md`, `docs/DESIGN_SYSTEM.md`;
- `docs/CONTENT_MAP.md`, точный фрагмент `L01-S01` в `content/story/book.md`, `content/sections/level-01/section-01-money-by-date.md`;
- утверждённый concept board `/Users/elena/.codex/generated_images/01a02eef-ff28-7900-8a64-656aa8ae0c66/exec-7887a484-c9ea-40e0-83dd-381c693681f0.png`;
- утверждённый character anchor D-F `/Users/elena/.codex/generated_images/01a02eef-ff28-7900-8a64-656aa8ae0c66/exec-b0c07b26-90d0-491c-a6aa-5c1df17bfba0.png`;
- решение владельца от 23 августа 2026 года: использовать D-F и приступить к генерации ассетов и внедрению «Живого архива».

**Write set:**

- этот task packet;
- `docs/DESIGN_SYSTEM.md`, при необходимости точечная запись в `docs/DECISIONS.md`;
- `src/styles/tokens.css`, `src/styles.css`;
- существующие `src/App.tsx`, `src/components/**`, `src/screens/**` и их CSS Modules только в пределах визуального внедрения;
- новые UI-компоненты внутри `src/components/**`, если они нужны для повторяемых архивных мотивов;
- project-bound assets внутри `src/assets/living-archive/**`;
- `harness/PROJECT_STATE.md` и `harness/WORKBOARD.md` только если меняется долговременное состояние или текущий приоритет.

**Вне scope:**

- изменение числа, порядка, границ и текста 22 Section без отдельного явного решения владельца;
- изменение девяти звеньев, финансовых тезисов или результата L01-S01;
- регистрация, прогресс, упражнения, ответы, персонализация, рекомендации и геймификация;
- backend, API, хранение, аналитика, инфраструктура, deployment, зависимости и публикация;
- production-иллюстрации для Section кроме L01-S01.

**Риски:**

- женский visual anchor конфликтует с текущими мужскими формами канонического текста; текстовая редакция требует явного подтверждения и отдельного ограниченного изменения;
- Image Gen может дрейфовать по идентичности D-F или добавлять неканонические предметы, даты, суммы и читаемые документы;
- декоративная стилизация может ухудшить чтение длинного фрагмента либо визуально превратить девять звеньев в прогресс/геймификацию;
- текущий worktree содержит большой объём незакоммиченных пользовательских изменений; разрешено только точечное редактирование объявленного write set без staging и destructive Git-операций.

**План проверки:**

- извлечь exact canon и asset inventory L01-S01 до генерации;
- проверить каждый asset на идентичность D-F, композицию, отсутствие лишнего текста/дат/сумм/props и связь со стилем concept board;
- проверить `6 / 22`, распределение `3 / 4 / 4 / 4 / 4 / 3`, два экрана и ровно девять звеньев;
- выполнить typecheck/build, Storybook build и доступные тесты;
- проверить каталог, историю и разбор на desktop и mobile, включая навигацию и reduced motion;
- сопоставить браузерные screenshots с concept board через `view_image` и составить fidelity ledger минимум по пяти точкам;
- выполнить `git diff --check` и `git diff --cached --check`.

**Implementation inventory:**

- color lock: тёплый canvas `#ebe5da`, paper surface `#f7f3ea`, graphite text `#2f302d`; mist blue, ochre, sage и mauve используются только в иллюстрациях, washes и декоративных Path-маркерах;
- typography: один литературный системный serif stack для заголовков/чтения и один system sans для управляющего текста; story body остаётся `1.0625–1.1875rem / 1.72`, measure около `42rem`;
- container model: на desktop одна непрерывная paper sheet с hairline, мягкой тенью и радиусом; на mobile — edge-to-edge paper без имитации устройства; карточная сетка запрещена;
- app chrome: тихий masthead с кодовым названием `Прожито` и единственной реальной ссылкой к каталогу; нарисованные `menu`, `book`, `Aa`, `list` из concept board не переносятся как неработающие controls;
- catalog: один порядок 6 уровней / 22 Section; Roman numeral обозначает только уровень, двухзначный Arabic number — Section; L01 использует crop сюжетного master, остальные уровни — законченные абстрактные watercolor washes;
- story: кодовые `История` и название Section, один story master перед непрерывным Markdown только для L01-S01, без карточек/вставок внутри текста;
- analysis: кодовый `Разбор решения`, утверждённый прозрачный Path с девятью звеньями и декоративно циклическими акварельными маркерами; still-life L01-S01 после цепочки не образует десятое звено;
- reusable visual mapping: ассеты подключаются по `section.id` отдельно от Markdown/parser;
- allowed above-the-fold copy остаётся существующим: `Прожито`, `Истории и разборы финансовых решений.`, название уровня/Section, `История` или `Разбор решения`; новые claims, badges и поясняющие kicker-тексты не добавляются;
- asset treatment: story `3:2` с мягким растворением краёв в paper, catalog crop из того же master, analysis still-life с пустыми календарными полями; никакого raster-текста, дат, сумм, брендов и статуса платежа.

## Result

**Итог:** `living_archive_v1` внедрён во всю статическую демоверсию, а L01-S01 получил единый сюжетный master с D-F, производный catalog crop и отдельный предметный still-life для экрана разбора. Число и содержание пользовательских экранов не менялись. Последующее явное решение владельца закрепило Сашу как женщину; книга и все 22 Section согласованы отдельной задачей `2026-08-23-sasha-female-canon-migration.md`.

**Файлы:**

- дизайн и архитектура: `docs/DECISIONS.md`, `docs/DESIGN_SYSTEM.md`, `src/styles/tokens.css`, `src/styles.css`, `index.html`;
- shell и экраны: `src/components/AppShell.tsx`, `src/screens/CatalogScreen.tsx`, `src/screens/StoryScreen.tsx`, `src/screens/AnalysisScreen.tsx`;
- product UI: `src/components/product/SectionArtwork/**`, обновлённые CSS Modules `SectionHeader`, `SectionFooter`, `DecisionChain`, а также CSS Modules `Button`, `Text`, `Heading`;
- visual mapping: `src/visuals/sectionVisuals.ts`;
- generation masters: `src/assets/living-archive/character/sasha-df-anchor.png`, `src/assets/living-archive/l01-s01/story-arrival.jpg`, `src/assets/living-archive/l01-s01/analysis-still-life.jpg`, `src/assets/living-archive/texture/paper-canvas.jpg`;
- runtime exports: `story-arrival-1200.jpg` — 212 KB, `analysis-still-life-960.jpg` — 68 KB, `paper-canvas-512.jpg` — 12 KB;
- task coordination: `harness/tasks/2026-08-23-sasha-character-casting.md`, этот packet, `harness/PROJECT_STATE.md`, `harness/WORKBOARD.md`.
- финальные QA previews: `/Users/elena/.codex/visualizations/2026/08/23/01a02eef-ff28-7900-8a64-656aa8ae0c66/living-archive/`.

**Проверки:**

- `npm run build` — PASS; typecheck и production build успешны, остаётся неблокирующее предупреждение Vite о JS chunk больше 500 KB;
- `npm run build-storybook` — PASS; stories, включая `SectionArtwork`, собраны, остаются неблокирующие size warnings Storybook;
- структурная проверка — PASS: 22 Section, распределение `3 / 4 / 4 / 4 / 4 / 3`, 198 звеньев = `22 × 9`, 48 внутренних действий;
- относительные Markdown-ссылки — PASS;
- browser QA — PASS для каталога, L01-S01 story/analysis и Section без уникальных assets; desktop `1280 × 800`, mobile `391 × 845`, горизонтального overflow нет, каталог показывает 6 уровней и 22 ссылки, разбор — ровно 9 items;
- raster QA — PASS: в сцене и still-life нет читаемых дат, сумм, сообщений, брендов, статуса совершённого платежа или неканонического результата; потенциально двусмысленная календарная сетка удалена повторной генерацией и заменена чистым листом без разметки;
- `git diff --check` и `git diff --cached --check` — PASS после финальной записи Result.

**Fidelity ledger:**

1. Тёплый внешний canvas и единая paper sheet перенесены; mobile остаётся edge-to-edge, без имитации корпуса телефона.
2. Masthead сохраняет центрированный wordmark: на каталоге это единственный компактный `h1`, на внутренних экранах — реальная ссылка; неработающие `Aa`, книга и меню не перенесены.
3. Roman numeral используется только для Level, Section имеют двухзначные Arabic numbers и простые ruled rows.
4. Story сохраняет единственный `h1`, непрерывную прозу и лёгкий `3:2 / 4:3` сюжетный asset с растворёнными краями.
5. Analysis сохраняет semantic `<ol>` и ровно девять открытых звеньев; rail и акварельные markers декоративны и не кодируют прогресс.
6. L01-S01 использует одно лицо D-F во story/catalog и отдельный object-led still-life после цепочки; остальные 21 Section выглядят законченными благодаря общему типографическому shell и token-based washes.
7. Above-the-fold copy не расширен новыми claims: сохранены `Прожито`, существующий tagline, Level/Section title, `История` и `Разбор решения`.

**Осознанные отклонения от concept board:**

- три панели concept board реализованы как три реальные route-state, а не одновременная трёхколоночная композиция;
- fake controls удалены, потому что продукт не имеет соответствующих функций;
- каталог показывает все 22 Section, а не шесть условных строк;
- точные даты, суммы и сообщения не впечатываются в raster: проверяемые отношения остаются в каноническом HTML/Markdown.

**Источники и даты:**

- утверждённые visual concept и D-F character anchor, 23 августа 2026 года;
- канонические файлы проекта, точечная проверка 23 августа 2026 года.

**Оставшиеся риски:**

- Ручной visual-regression baseline не автоматизирован; browser screenshots сохранены только как артефакты текущего QA.

**Следующий шаг:**

- Не начинать новые production-ассеты автоматически; следующий visual scope требует отдельного решения владельца.
