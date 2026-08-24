# Task / Result Packet

## Task

**Название:** Внедрить Heading, SectionHeader и SectionFooter в демоверсию

**Владелец:** Codex

**Статус:** done

**Цель:** Добавить утверждённые базовые и продуктовые компоненты, затем перевести реальные экраны на `Heading`, `Text`, `Button`, `SectionHeader` и `SectionFooter` без изменения пользовательского контента и маршрутов.

**Входные источники:**

- `AGENTS.md`, `harness/PROJECT_STATE.md`, `harness/RISK_POLICY.md`;
- `docs/DESIGN_SYSTEM.md`;
- `src/screens/*.tsx`, `src/styles.css`, `src/styles/tokens.css`;
- существующие `Button`, `Text`, `DecisionChain` и явное решение владельца использовать `SectionHeader` и `SectionFooter`.

**Write set:**

- `src/components/ui/Heading/`;
- `src/components/product/SectionHeader/`, `src/components/product/SectionFooter/`;
- `src/screens/CatalogScreen.tsx`, `src/screens/StoryScreen.tsx`, `src/screens/AnalysisScreen.tsx`;
- `src/screens/ContentErrorScreen.tsx`, `src/screens/NotFoundScreen.tsx`;
- `src/styles.css`, при необходимости `src/styles/tokens.css`;
- `docs/DESIGN_SYSTEM.md`;
- `harness/PROJECT_STATE.md`, `harness/WORKBOARD.md`;
- этот task packet.

**Вне scope:**

- изменение текстов, маршрутов, числа или порядка Section и девяти звеньев;
- создание `Prose`, универсальных `Card`, `Stack`, `Container`, `EmptyState` или компонента элемента каталога;
- изменение дизайна `DecisionChain`;
- dark mode, новые зависимости, backend, API, хранение и deployment;
- Git staging, commit и push.

**Риски:**

- замена глобальных классов может изменить размеры, переносы или иерархию заголовков;
- ссылка, оформленная как `Button`, должна сохранить нативную anchor-семантику;
- `SectionFooter` не должен скрыть различие между переходом к следующей истории и возвратом в каталог или дублировать один маршрут двумя ссылками;
- новые компоненты могут остаться только в Storybook и не заменить production-разметку.

**План проверки:**

- проверить HTML-семантику заголовков, footer/nav и ссылок;
- убедиться, что старые `.content-header`, `.screen-actions`, `.primary-action`, `.text-link` больше не используются;
- выполнить `npm run typecheck`, `npm run build`, `npm run build-storybook`;
- проверить каталог, историю, разбор, последний Section и not-found на desktop/mobile;
- проверить console, keyboard focus, основные переходы и Storybook a11y;
- выполнить `git diff --check`, `git diff --cached --check` и поиск устаревших классов.

## Result

**Итог:** Созданы базовый `Heading` и продуктовые `SectionHeader`/`SectionFooter`. Каталог, история, разбор и системные экраны переведены на реальные `Heading`, `Text` и link-ветку `Button`. Повторяющиеся глобальные классы шапки и навигации удалены. Последняя Section больше не показывает две ссылки в один каталог.

**Файлы:**

- `src/components/ui/Heading/Heading.tsx`, `Heading.module.css`, `Heading.stories.tsx`;
- `src/components/product/SectionHeader/SectionHeader.tsx`, `SectionHeader.module.css`, `SectionHeader.stories.tsx`;
- `src/components/product/SectionFooter/SectionFooter.tsx`, `SectionFooter.module.css`, `SectionFooter.stories.tsx`;
- `src/screens/CatalogScreen.tsx`, `StoryScreen.tsx`, `AnalysisScreen.tsx`;
- `src/screens/ContentErrorScreen.tsx`, `NotFoundScreen.tsx`, `src/styles.css`;
- `docs/DESIGN_SYSTEM.md`, `harness/PROJECT_STATE.md`, `harness/WORKBOARD.md`, этот task packet.

**Проверки:**

- `npm run typecheck` — PASS;
- `npm run build` — PASS; eager manifest продолжает проверять все 22 Section;
- `npm run build-storybook` — PASS;
- поиск `.content-header`, `.screen-label`, `.screen-actions`, `.primary-action`, `.text-link`, `.content-screen` — совпадений в `src` нет;
- browser flow `catalog → L01-S01 story → analysis → L01-S02 story` — PASS;
- browser QA при фактических `336 px` — `innerWidth = scrollWidth = 336`, один `h1`, один `footer`, горизонтального переполнения нет;
- footer story/analysis — действия рендерятся как нативные `<a>`, видимый keyboard focus подтверждён;
- последний разбор `L06-S03` — один primary-link `Вернуться к списку`, дублирующей ссылки нет;
- not-found — один `h1`, текст и link-ветка `Button` отображаются корректно;
- console приложения на проверенных маршрутах — без warning/error;
- addon-a11y: `SectionFooter` — `0 violations / 12 passes / 0 inconclusive`, `SectionHeader` — `0 / 8 / 0`, `Heading` — `0 / 5 / 0`;
- `git diff --check`, `git diff --cached --check`, whitespace-проверка 17 файлов — PASS;
- контент, маршруты, порядок Section и девять звеньев не изменялись в рамках задачи.

**Источники и даты:** Явное решение владельца использовать `SectionHeader` и `SectionFooter`, текущие экранные сценарии и `docs/DESIGN_SYSTEM.md`; проверено 23 августа 2026 года.

**Оставшиеся риски:**

- human review выполнен во встроенном Chromium-браузере, а не на физическом мобильном устройстве;
- production-сборка сохраняет предупреждение Vite о чанке больше 500 kB;
- Storybook 10 выводит собственное предупреждение о будущем обязательном `ariaLabel` у внутреннего `PopoverProvider` в Storybook 11; stories приложения нарушений не имеют.

**Следующий шаг:** Не создавать новый компонент автоматически. Каталожный item или отдельный content block выделять только при появлении второго фактического сценария или новой семантики.
