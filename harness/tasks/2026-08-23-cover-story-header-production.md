# Task / Result Packet

## Task

**Название:** Внедрить выбранную акварельную шапку истории

**Владелец:** Codex

**Статус:** done

**Цель:** Перенести выбранный владельцем вариант `coverOverlay` из Storybook на production-экран «История», сделать возврат к каталогу однозначным, повысить контраст заголовка и исключить браузерные взаимодействия с сюжетным изображением.

**Входные источники:**

- выбор владельца «1 — Акварельная обложка» и уточнения от 23 августа 2026 года;
- `docs/PRODUCT.md`, `docs/DECISIONS.md`, `docs/DESIGN_SYSTEM.md`;
- существующие `StoryHeroHeader`, `AppShell`, `StoryScreen` и сюжетный asset L01-S01;
- `living_archive_v1` и проверенные Storybook mobile/desktop-композиции.

**Write set:**

- этот task packet и статус предыдущего packet выбора;
- `src/components/experiments/StoryHeroHeader/*` и production-место выбранного компонента;
- `src/components/AppShell.tsx`, `src/screens/StoryScreen.tsx`, `src/styles.css`;
- `docs/DECISIONS.md`, `docs/DESIGN_SYSTEM.md`;
- `harness/PROJECT_STATE.md`, `harness/WORKBOARD.md`.

**Вне scope:**

- изменение сюжета, девяти звеньев, финансовых тезисов, числа экранов или маршрутов;
- новые raster-ассеты или изменение D-F character anchor;
- перенос hero-композиции на экран «Решение» или на Section без сюжетного asset;
- backend, хранение, аналитика, публикация и Git-операции.

**Риски:**

- два разных элемента, ведущих в каталог, выглядят как неизвестные функции;
- title-on-image может потерять контраст на широком crop;
- скрытие общего masthead не должно убрать единственный понятный путь к каталогу;
- `pointer-events: none` не должно удалять смысловой alt из accessibility tree.

**План проверки:**

- сохранить один видимый control `Все истории`, ведущий на `#/`, и один `h1`;
- проверить отсутствие `Прожито`, icon-only «бургера» и декоративного flourish в hero;
- проверить `draggable=false`, `pointer-events: none`, `user-select: none` и отсутствие горизонтального overflow;
- выполнить `npm run typecheck`, `npm run build`, `npm run build-storybook`, Impeccable detector, `git diff --check` и `git diff --cached --check`;
- визуально проверить Storybook и production при mobile и desktop viewport, console health и переход `Все истории → каталог`.

## Result

**Итог:** Выбранная «Акварельная обложка» подключена к production-экрану L01-S01. В hero осталась одна подписанная ссылка `Все истории`; `Прожито`, icon-only индекс и декоративный flourish удалены. Подпись и `h1` опущены в усиленную нижнюю graphite-вуаль, а raster не принимает pointer events, не выделяется и не перетаскивается.

**Файлы:**

- `src/components/product/StoryHeroHeader/StoryHeroHeader.tsx`;
- `src/components/product/StoryHeroHeader/StoryHeroHeader.module.css`;
- `src/components/experiments/StoryHeroHeader/StoryHeroHeader.stories.tsx`;
- удалены экспериментальные дубликаты component/CSS из `src/components/experiments/StoryHeroHeader`;
- `src/components/AppShell.tsx`, `src/screens/StoryScreen.tsx`, `src/styles.css`;
- `docs/DECISIONS.md`, `docs/DESIGN_SYSTEM.md`;
- `harness/PROJECT_STATE.md`, `harness/WORKBOARD.md`;
- этот task packet и статус предыдущего packet выбора.

**Проверки:**

- `npm run typecheck` — PASS;
- `npm run build` — PASS; сохранено прежнее неблокирующее предупреждение Vite о размере основного chunk;
- `npm run build-storybook` — PASS с неблокирующими предупреждениями о размере Storybook chunks;
- Impeccable detector по изменённым UI-файлам — PASS, `[]`;
- Storybook Browser QA: `414 × 896` и `1280 × 1024`, один `h1`, одна ссылка `Все истории`, 44 px target, нулевой horizontal overflow, `draggable=false`, `pointer-events:none`, `user-select:none` — PASS;
- production Browser QA L01-S01: общий masthead отсутствует, hero и reading column не создают horizontal overflow, смысловой alt сохранён — PASS;
- interaction `Все истории → #/ → Деньги к нужной дате` — PASS;
- interaction `История → Решение`, точная подпись «Решение» и 9 items — PASS;
- Storybook console — PASS; production UI не имеет runtime-ошибок, но IAB фиксирует локальный dev-only Vite HMR WebSocket warning, не присутствующий в production build;
- прямое сравнение утверждённого concept screenshot и свежего production screenshot через `view_image` — PASS: image-first структура, crop, типографика и Living Archive сохранены; требуемые навигация, нижнее положение текста, gradient и отсутствие flourish отличаются намеренно;
- `git diff --check` и `git diff --cached --check` — PASS.

**Источники и даты:**

- решение и визуальный feedback владельца, 23 августа 2026 года;
- локальные runtime/Storybook renders и исходники проекта, проверены 23 августа 2026 года.

**Оставшиеся риски:**

- Каждый будущий сюжетный asset требует отдельной проверки focal crop и нижнего контраста в выбранном hero.
- В локальном IAB live reload может потребовать ручного обновления из-за dev-only HMR WebSocket warning; статическая production-сборка проходит.

**Следующий шаг:**

- Владелец проверяет открытую production-историю; новые сюжетные assets или следующая дизайн-итерация не запускаются автоматически.
