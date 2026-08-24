# Task / Result Packet

## Task

**Название:** Упростить навигацию акварельной шапки до круглой иконки

**Владелец:** Codex

**Статус:** done

**Цель:** Заменить видимую подпись `Все истории` в выбранной production-шапке на аккуратную круглую icon-only ссылку назад в каталог и удалить из кода две отклонённые композиции StoryHeroHeader.

**Входные источники:**

- уточнение владельца от 23 августа 2026 года;
- `docs/PRODUCT.md`, `docs/DECISIONS.md`, `docs/DESIGN_SYSTEM.md`;
- production-компонент `StoryHeroHeader`, его Storybook stories и экран L01-S01;
- утверждённый визуальный язык `living_archive_v1`.

**Write set:**

- этот task packet;
- `src/components/product/StoryHeroHeader/*`;
- удаление `src/components/experiments/StoryHeroHeader/*` после переноса единственной story;
- `src/screens/StoryScreen.tsx`;
- `docs/DECISIONS.md`, `docs/DESIGN_SYSTEM.md`;
- `harness/PROJECT_STATE.md`, `harness/WORKBOARD.md`.

**Вне scope:**

- изменение изображения, crop, градиента, заголовка, сюжета или экрана «Решение»;
- создание настоящего burger-menu, новых маршрутов или дополнительной навигации;
- изменение Section без сюжетного asset;
- backend, хранение, публикация и Git-операции.

**Риски:**

- burger-icon без открываемого меню создаёт ложное ожидание, поэтому используется стрелка назад;
- icon-only control должен сохранить доступное имя, focus и touch target 44 × 44 px;
- удаление variant API и stories не должно оставить мёртвые CSS-селекторы или сломать текущий Storybook URL `cover-overlay`.

**План проверки:**

- проверить единственную круглую ссылку без видимого текста и с accessibility-name `Все истории`;
- проверить переход `#/section/l01-s01/story → #/`;
- проверить отсутствие `archiveLabel`, `imageThenTitle`, `variant` и экспериментального компонента;
- выполнить `npm run typecheck`, `npm run build`, `npm run build-storybook`, Impeccable detector, `git diff --check` и `git diff --cached --check`;
- визуально проверить production и Storybook, включая focus и отсутствие horizontal overflow.

## Result

**Итог:** Выбранная «Акварельная обложка» сведена к одной production-композиции. В левом верхнем углу находится круглая icon-only ссылка со стрелкой назад: видимой подписи нет, доступное имя `Все истории` сохранено, переход ведёт в общий каталог `#/`. Burger-icon не добавлен, потому что отдельного меню в продукте нет. Отклонённые варианты и их публичный variant API удалены; прежний Storybook URL `cover-overlay` сохранён.

**Файлы:**

- `src/components/product/StoryHeroHeader/StoryHeroHeader.tsx`;
- `src/components/product/StoryHeroHeader/StoryHeroHeader.module.css`;
- `src/components/product/StoryHeroHeader/StoryHeroHeader.stories.tsx`;
- `src/components/product/StoryHeroHeader/StoryHeroHeader.stories.module.css`;
- `src/screens/StoryScreen.tsx`;
- удалённые Storybook-файлы из `src/components/experiments/StoryHeroHeader/`;
- `docs/DECISIONS.md`, `docs/DESIGN_SYSTEM.md`;
- `harness/PROJECT_STATE.md`, `harness/WORKBOARD.md`;
- этот task packet.

**Проверки:**

- `npm run typecheck` — PASS;
- `npm run build` — PASS;
- `npm run build-storybook` — PASS;
- Impeccable detector по изменённым UI-файлам — PASS, замечаний нет;
- `git diff --check` и `git diff --cached --check` — PASS;
- production Browser QA — PASS: один `h1`, одна ссылка `Все истории`, видимого текста `Все истории` нет, control 44 × 44 px с `border-radius: 50%`, horizontal overflow отсутствует;
- keyboard focus — PASS: нативная ссылка получает общий контрастный `:focus-visible` outline из design system;
- переход `#/section/l01-s01/story → #/` — PASS, после проверки экран истории возвращён и оставлен открытым;
- Storybook Browser QA — PASS: прежний story-id открывается, один `h1`, одна icon-only ссылка, чистая загрузка без console errors;
- изображение — PASS: `draggable=false`, `pointer-events: none`, `user-select: none`.

**Источники и даты:**

- решение владельца и локальная реализация, 23 августа 2026 года.

**Оставшиеся риски:**

- production-сборка сохраняет предупреждение Vite о размере основного JS chunk; оно существовало вне узкого scope шапки и не блокирует статическую демоверсию;
- новый сюжетный asset в будущей Section всё ещё потребует отдельной проверки crop и контраста.

**Следующий шаг:**

- Owner review открытых production-экрана и Storybook story; новые варианты или assets не запускать автоматически.
