# Task / Result Packet

## Task

**Название:** Объединить кнопку и ссылку в визуальном API Button

**Владелец:** Codex

**Статус:** done

**Цель:** Обновить `Button`, чтобы один типизированный публичный компонент рендерил нативный `<a>` при наличии `href` и Base UI Button в остальных случаях, сохраняя общие размеры и варианты оформления `filled / outline / ghost`.

**Входные источники:**

- `AGENTS.md`, `harness/PROJECT_STATE.md`, `harness/RISK_POLICY.md`;
- `docs/DESIGN_SYSTEM.md`;
- текущие `Button.tsx`, `Button.module.css`, `Button.stories.tsx`;
- утверждённые в обсуждении договорённости о семантике ссылок и визуальном семействе действий.

**Write set:**

- `src/components/ui/Button/`;
- `docs/DESIGN_SYSTEM.md`;
- `harness/WORKBOARD.md`;
- `harness/tasks/2026-08-23-button-link-semantics.md`.

**Вне scope:**

- автоматическая замена ссылок существующих экранов на `Button`;
- изменение `DecisionChain` и выбор его варианта;
- новый `Prose` или визуальный Markdown-компонент;
- изменение канонических историй и Section;
- loading, icon-only, danger tone и disabled-ссылка;
- новые зависимости, backend, API, deployment и публикация Storybook;
- Git staging, commit и push.

**Риски:**

- общий публичный компонент может скрыть различия клавиатурной и disabled-семантики `<button>` и `<a>`;
- неправильное пересечение TypeScript props может разрешить `href + disabled` или передать button-only атрибуты ссылке;
- переименование variants ломает прежний API, хотя production-код его пока не использует.

**План проверки:**

- проверить DOM-теги и отсутствие button-only атрибутов у ссылочной ветки;
- проверить variants, размеры, disabled-кнопку и ссылочные stories;
- выполнить `npm run typecheck`, `npm run build`, `npm run build-storybook`;
- выполнить browser и addon-a11y QA;
- выполнить whitespace- и diff-проверки.

## Result

**Итог:** `Button` получил единый визуальный API с семантически разными ветками. При наличии `href` компонент напрямую рендерит нативный `<a>`; без `href` — Base UI Button. Variants переименованы в `filled / outline / ghost`, размеры сохранены. TypeScript не разрешает `href + disabled`. Существующие экраны автоматически не мигрировали.

**Файлы:**

- `src/components/ui/Button/Button.tsx`;
- `src/components/ui/Button/Button.module.css`;
- `src/components/ui/Button/Button.stories.tsx`;
- `docs/DESIGN_SYSTEM.md`;
- `harness/WORKBOARD.md`, этот task packet.

**Проверки:**

- `npm run typecheck` — PASS;
- `npm run build` — PASS;
- `npm run build-storybook` — PASS;
- browser DOM QA — PASS: story `AsLink` рендерит `<a href>` без `type` и `disabled`; story `Disabled` рендерит `<button type="button" disabled>`;
- addon-a11y для трёх ссылочных variants — `0 violations / 4 passes / 0 inconclusive`;
- `git diff --check`, whitespace-проверка изменённых файлов — PASS;
- DecisionChain открыт пользователю в Storybook Docs; локальный Storybook оставлен запущенным.

**Источники и даты:**

- `docs/DESIGN_SYSTEM.md` и утверждённые договорённости текущего обсуждения, проверено 23 августа 2026 года;
- официальные примеры Material UI, Chakra UI и Base UI для семантики и visual variants, проверены 23 августа 2026 года.

**Оставшиеся риски:**

- variants переименованы без compatibility aliases; production-код прежний `Button` не использовал, но будущие незакоммиченные потребители нужно обновлять вместе с интеграцией;
- Storybook controls могут конструировать runtime-комбинации свободнее, чем TypeScript API; утверждённые stories используют валидные ветки;
- loading, icon-only, danger tone и недоступная навигация остаются вне контракта;
- production-сборки сохраняют прежнее предупреждение Vite о чанках больше 500 kB.

**Следующий шаг:**

- После выбора варианта `DecisionChain` отдельной задачей внедрить утверждённые компоненты в существующие экраны и заменить локальные классы `.primary-action` / `.text-link`.
