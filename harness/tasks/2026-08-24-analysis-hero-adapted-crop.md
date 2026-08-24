# Task / Result Packet

## Task

**Название:** Перенести L01-S01 still-life в адаптированную шапку «Решения»

**Владелец:** Codex

**Статус:** done

**Цель:** Создать отдельный hero-safe raster на основе утверждённого L01-S01 still-life, подключить его в компактную immersive-шапку экрана «Решение» и удалить прежнюю нижнюю иллюстрацию перед footer.

**Входные источники:**

- решение владельца от 24 августа 2026 года;
- `src/assets/living-archive/l01-s01/analysis-still-life-960.jpg` как edit target;
- утверждённая «Акварельная обложка» экрана «История»;
- `docs/PRODUCT.md`, `docs/DECISIONS.md`, `docs/DESIGN_SYSTEM.md`;
- независимый аудит `.impeccable/critique/2026-08-23T20-45-59Z__src-screens-analysisscreen-tsx.md`.

**Write set:**

- этот task packet;
- новый versioned raster в `src/assets/living-archive/l01-s01/`;
- `src/visuals/sectionVisuals.ts`;
- product hero-компоненты и их CSS/Storybook-файлы в `src/components/product/`;
- `src/screens/StoryScreen.tsx`, `src/screens/AnalysisScreen.tsx`, `src/styles.css`;
- `docs/DECISIONS.md`, `docs/DESIGN_SYSTEM.md`;
- `harness/PROJECT_STATE.md`, `harness/WORKBOARD.md`.

**Вне scope:**

- изменение канонического текста, девяти звеньев, маршрутов или числа экранов;
- новые изображения для других Section;
- изменение утверждённого D-F character anchor или сюжетного hero L01-S01;
- добавление текста, дат, сумм, брендов или реквизитов в raster;
- backend, хранение, публикация и Git-операции.

**Риски:**

- буквальный `cover` исходного горизонтального still-life обрезает крайние предметы на mobile;
- высокий второй hero откладывает начало DecisionChain, поэтому шапка «Решения» должна быть компактнее сюжетной;
- overlay не должен перекрывать предметы или терять контраст;
- нельзя оставить дублирующую нижнюю иллюстрацию или неверные aria-labels «Истории»;
- generated raster не должен создавать читаемый текст, календарные даты, логотипы или ложный факт платежа.

**План проверки:**

- визуально проверить generated master до подключения: центральная safe-area, чистая нижняя text-zone, отсутствие текста/дат/логотипов и сюжетных ошибок;
- проверить desktop и mobile crop, контраст label/H1, 44 × 44 back-link, pointer/select/drag protection и forced-colors fallback;
- проверить DOM: один H1, ровно девять звеньев, один hero asset, отсутствие прежнего нижнего figure;
- проверить переходы `#/ → story → analysis → next story` и отсутствие console errors;
- выполнить `npm run typecheck`, `npm run build`, `npm run build-storybook`, Impeccable detector, `git diff --check` и `git diff --cached --check`.

## Result

**Итог:** На основе прежнего L01-S01 still-life создан отдельный hero-safe master 1536 × 1024. Предметы сгруппированы в central mobile-safe поле, нижняя часть оставлена свободной под HTML-заголовок; raster не содержит текста, дат, сумм, логотипов или подтверждения платежа. Экран «Решение» переведён на компактную immersive-шапку общей с «Историей» анатомии, а прежний нижний artwork перед footer удалён.

**Файлы:**

- создан `src/assets/living-archive/l01-s01/analysis-hero-1536-v1.jpg`;
- созданы `src/components/product/SectionHeroHeader/SectionHeroHeader.tsx`, `SectionHeroHeader.module.css`, `SectionHeroHeader.stories.tsx`, `SectionHeroHeader.stories.module.css`;
- удалены заменённые файлы `src/components/product/StoryHeroHeader/*`;
- изменены `src/screens/StoryScreen.tsx`, `src/screens/AnalysisScreen.tsx`, `src/styles.css`, `src/visuals/sectionVisuals.ts`;
- изменены `docs/DECISIONS.md`, `docs/DESIGN_SYSTEM.md`;
- изменены `harness/PROJECT_STATE.md`, `harness/WORKBOARD.md` и этот packet.

**Проверки:**

- asset visual QA — PASS: 1536 × 1024, 220 KB, один телефон, один блокнот, одна связка ключей, три цветные карточки и светлый лист; все поверхности пустые, проверяемого текста и UI нет;
- `npm run typecheck` — PASS;
- `npm run build` — PASS;
- `npm run build-storybook` — PASS, обе hero stories собраны, interaction test новой story завершён успешно;
- Impeccable detector по изменённым React-файлам — PASS, `[]`;
- production Browser QA — PASS: один `h1`, девять `li`/`h2`, один footer, один hero `img`, ноль нижних `figure`, 44 × 44 icon-only ссылка, пустой alt, `draggable=false`, `pointer-events: none`, `user-select: none`;
- responsive Browser QA — PASS: desktop 1354 × 762 и mobile 391 × 846; все предметы видимы, заголовок находится в нижней text-safe зоне, horizontal overflow отсутствует;
- сравнительный QA — PASS: hero «Решения» на 14,1% короче сюжетного на desktop и на 33,3% короче на mobile;
- interaction QA — PASS: `История → Решение → следующая история`, правильные URL и page titles, console errors/warnings отсутствуют;
- `git diff --check` и `git diff --cached --check` — PASS.

**Источники и даты:**

- решение владельца и локальные project assets, 24 августа 2026 года;
- built-in imagegen edit target: `analysis-still-life-960.jpg`; финальный production prompt: сохранить акварельный стиль и точный набор предметов, сдвинуть крайние предметы внутрь центрального mobile-safe поля, оставить нижнюю треть пустой, не добавлять текст, даты, суммы, бренды, UI или символику совершённого платежа.

**Оставшиеся риски:**

- production build сохраняет предупреждение Vite о JS chunk больше 500 KB; оно не создано hero-изменением и не блокирует статическую демоверсию;
- проверка ограничена локальной демоверсией L01-S01 и не является полным release-pass;
- новые assets других Section требуют отдельной генерации и crop/contrast QA.

**Следующий шаг:**

- Owner review открытого экрана «Решение»; новые Section и assets не запускать автоматически.
