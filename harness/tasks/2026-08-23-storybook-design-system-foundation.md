# Task / Result Packet

## Task

**Название:** Заложить основу дизайн-системы и Storybook

**Владелец:** Codex

**Статус:** done

**Цель:** Зафиксировать дизайн-договорённости статической демоверсии, подключить локальный Storybook и реализовать документированные компоненты `Button` и `Text` на CSS Modules и семантических токенах.

**Входные источники:**

- `AGENTS.md`, `harness/PROJECT_STATE.md`, `harness/RISK_POLICY.md`.
- `docs/PRODUCT.md`, `docs/DECISIONS.md`.
- текущие `src/styles.css`, `src/components/`, `package.json`, `vite.config.ts`.
- официальная документация Storybook для React/Vite и Base UI, проверенная 23 августа 2026 года.
- утверждённые в обсуждении договорённости: shadcn/ui — только справочник; CSS Modules; типизированные class maps через `cn()`; токены через CSS custom properties; без Tailwind и без `data-*` как собственного API стилизации.

**Write set:**

- `.storybook/`.
- `src/components/ui/Button/`, `src/components/ui/Text/`.
- `src/lib/cn.ts`.
- `src/styles/tokens.css`, `src/styles.css`.
- `docs/DESIGN_SYSTEM.md`, `docs/DECISIONS.md`.
- `package.json`, `package-lock.json`, `.gitignore`, `README.md`.
- `harness/PROJECT_STATE.md`, `harness/WORKBOARD.md`.
- `harness/tasks/2026-08-23-storybook-design-system-foundation.md`.

**Вне scope:**

- визуальный редизайн существующих экранов и автоматическая замена текущих ссылок на новые компоненты;
- новые продуктовые сущности, экраны, состояния прогресса или интерактивность;
- изменение текста, границ или контракта 22 Section;
- Tailwind, runtime shadcn/ui, собственный registry компонентов;
- dark mode, icon-only/loading Button, Heading, Link и сложные overlay/form-компоненты;
- архитектура полного Reader, backend, API, хранение, cloud/deployment и публикация Storybook;
- Git staging, commit и push.

**Риски:**

- Storybook или addons могут не поддержать текущую комбинацию React 19, Vite 8 и TypeScript 7;
- токены могут преждевременно разрастись или разойтись с существующим визуальным языком;
- `Button` может быть ошибочно использован для навигации вместо ссылки;
- глобальные стили Storybook могут отличаться от приложения;
- установка зависимостей может затронуть существующий lockfile шире необходимого;
- пересечение с незавершёнными изменениями владельца в рабочем дереве.

**План проверки:**

- проверить типизированную полноту maps вариантов и размеров;
- выполнить `npm run typecheck` и `npm run build`;
- выполнить production-сборку Storybook;
- проверить stories для вариантов, размеров и disabled-состояния Button, а также ролей и тонов Text;
- проверить относительные ссылки и отсутствие запрещённого технического расширения;
- выполнить `git diff --check`, `git diff --cached --check` и whitespace-проверку новых файлов.

## Result

**Итог:** Дизайн-договорённости статической демоверсии зафиксированы. Подключены Base UI, `clsx` и локальный Storybook 10 с autodocs и addon-a11y. Созданы семантические токены, `cn()`, а также первые компоненты `Button` и `Text` с типизированными class maps, CSS Modules и stories. Tailwind и runtime shadcn/ui не добавлялись; Storybook не публикуется.

**Файлы:**

- конфигурация и зависимости: `.storybook/main.ts`, `.storybook/preview.ts`, `package.json`, `package-lock.json`, `.gitignore`;
- основа стилей: `src/styles/tokens.css`, `src/styles.css`, `src/lib/cn.ts`;
- компоненты: `src/components/ui/Button/`, `src/components/ui/Text/`;
- договорённости и вход в проект: `docs/DESIGN_SYSTEM.md`, `docs/DECISIONS.md`, `README.md`;
- координация: `harness/PROJECT_STATE.md`, `harness/WORKBOARD.md`, этот task packet.

**Проверки:**

- `npm run typecheck` — PASS;
- `npm run build` — PASS; сборка демо сохранила встроенную проверку manifest 22 Section, двух экранов и девяти звеньев;
- `npm run build-storybook` — PASS, telemetry отключена;
- интерактивная проверка Storybook — PASS: переключение `Button` на `secondary` обновляет CSS-класс и визуальный вариант; размеры дают высоты `40 / 48 / 56 px`;
- мобильная проверка при фактической ширине iframe `336 px` — PASS, горизонтального переполнения Button и Text нет;
- addon-a11y — `Button: 0 violations / 6 passes`, `Text: 0 violations / 3 passes`;
- `git diff --check`, `git diff --cached --check`, проверка trailing whitespace/final newline новых файлов — PASS;
- относительные ссылки в изменённых Markdown-файлах — PASS;
- контент Section, число `6 / 22`, распределение `3 / 4 / 4 / 4 / 4 / 3` и 48 внутренних действий в рамках задачи не изменялись.

**Источники и даты:**

- Storybook React/Vite и accessibility testing, официальная документация, проверено 23 августа 2026 года: `https://storybook.js.org/docs/get-started/frameworks/react-vite`, `https://storybook.js.org/docs/writing-tests/accessibility-testing`;
- Base UI Button, официальная документация, проверено 23 августа 2026 года: `https://base-ui.com/react/components/button`;
- проектные решения: `docs/PRODUCT.md`, `docs/DECISIONS.md`, утверждённые договорённости текущего обсуждения.

**Оставшиеся риски:**

- production-сборки приложения и Storybook предупреждают о чанках больше 500 kB; для локальной мастерской это не блокирует работу, но оптимизацию приложения следует решать отдельно по фактической загрузке;
- Storybook 10 выводит внутреннее предупреждение о будущем обязательном `ariaLabel` у собственного `PopoverProvider` в Storybook 11; оно приходит из manager runtime, не из компонентов приложения;
- проверка выполнена в браузерном viewport, а не на физическом мобильном устройстве;
- новые компоненты намеренно не заменяют существующие элементы экранов автоматически.

**Следующий шаг:**

- Не добавлять следующий компонент автоматически. Выбрать один фактический повторяемый сценарий существующего экрана и отдельной задачей либо внедрить `Button`/`Text`, либо сформировать контракт следующего компонента.
