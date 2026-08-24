# Task / Result Packet

## Task

**Название:** Создать три дизайн-варианта девятизвенной цепочки

**Владелец:** Codex

**Статус:** done

**Цель:** Создать в Storybook три адаптивных и доступных варианта продуктового компонента `DecisionChain`, чтобы владелец мог сравнить их до внедрения в экран разбора.

**Входные источники:**

- `AGENTS.md`, `harness/PROJECT_STATE.md`, `harness/RISK_POLICY.md`;
- `docs/PRODUCT.md`, `docs/SECTION_CONTRACT.md`, `docs/METHODOLOGY.md`, `docs/DESIGN_SYSTEM.md`;
- `src/content/sectionContract.ts`, `src/components/MarkdownContent.tsx`, `src/styles.css`;
- приложенный владельцем референс вертикальной структуры с соединительной линией;
- первая готовая Section как репрезентативный пример девяти звеньев.

**Write set:**

- `src/components/product/DecisionChain/`;
- `src/styles/tokens.css`, если вариантам потребуется недостающий semantic token;
- `harness/WORKBOARD.md`;
- `harness/tasks/2026-08-23-decision-chain-design-variants.md`.

**Вне scope:**

- внедрение выбранного варианта в `AnalysisScreen` до решения владельца;
- изменение текста, порядка или числа девяти звеньев;
- изменение парсера Markdown или content schema;
- редизайн истории, каталога и навигации;
- изменение `Button`, добавление polymorphic API и выбор окончательного контракта семейства действий;
- новые зависимости, backend, API, хранение, deployment и публикация Storybook;
- Git staging, commit и push.

**Риски:**

- декоративная линия может ослабить читаемость длинных тезисов;
- вариант может визуально превратить причинную цепочку в прогресс пользователя или временную шкалу;
- desktop-композиция с левой колонкой названий может стать тесной на мобильном экране;
- три экспериментальных варианта могут ошибочно восприниматься как утверждённые постоянные variants.

**План проверки:**

- сохранить семантический `<ol>` и точный порядок девяти звеньев без видимой нумерации;
- проверить все три варианта при desktop и mobile viewport;
- выполнить addon-a11y для сравниваемых stories;
- выполнить `npm run typecheck`, `npm run build`, `npm run build-storybook`;
- выполнить whitespace- и diff-проверки.

## Result

**Итог:** Создан экспериментальный продуктовый компонент `DecisionChain` с тремя визуально различимыми вариантами: `thread`, `axis` и `path`. Во всех вариантах видимая нумерация заменена соединительной линией и маркерами, но сохранён семантический `<ol>`. Компонент проверяет ровно девять звеньев и их канонический порядок. В production-экран компонент не внедрён до выбора владельца.

**Файлы:**

- `src/components/product/DecisionChain/DecisionChain.tsx`;
- `src/components/product/DecisionChain/DecisionChain.module.css`;
- `src/components/product/DecisionChain/DecisionChain.stories.tsx`;
- `src/styles/tokens.css` — добавлен semantic token `--surface-subtle`;
- `harness/WORKBOARD.md`, этот task packet.

**Проверки:**

- `npm run typecheck` — PASS;
- `npm run build` — PASS;
- `npm run build-storybook` — PASS;
- browser QA при ширине `336 px` — PASS: `thread`, `axis`, `path` содержат по девять видимых звеньев, горизонтального переполнения нет;
- addon-a11y — PASS для всех трёх вариантов: `0 violations / 13 passes / 0 inconclusive`;
- `git diff --check`, `git diff --cached --check` — PASS;
- production-компоненты экранов и content-файлы Section не изменялись.

**Источники и даты:**

- приложенный владельцем визуальный референс вертикальной структуры, изучен 23 августа 2026 года;
- `docs/SECTION_CONTRACT.md`, `docs/METHODOLOGY.md`, `src/content/sectionContract.ts`, проверены 23 августа 2026 года;
- Section 01 «Деньги к нужной дате» использована только как репрезентативный контент Storybook без изменения текста.

**Оставшиеся риски:**

- все три variants экспериментальные; после выбора два лишних варианта следует удалить или явно оставить только при реальном продуктовом сценарии;
- `axis` сохраняет узкую левую колонку названий на мобильной ширине и поэтому требует human review с самыми длинными тезисами;
- проверка выполнена в браузерном viewport, а не на физическом устройстве;
- production-сборки сохраняют прежнее предупреждение Vite о чанках больше 500 kB.

**Следующий шаг:**

- Владелец выбирает `thread`, `axis` или `path`. После выбора отдельной задачей оставить утверждённый дизайн, связать парсер с типизированными звеньями и внедрить компонент в `AnalysisScreen`.
