# Task / Result Packet

## Task

**Название:** Расширить статическую демоверсию до 22 Section

**Владелец:** Codex

**Статус:** done

**Цель:** Подключить к существующей статической React-демоверсии все 22 готовые Section, показать их на одном экране по 6 уровням и сохранить линейную hash-навигацию между историей и разбором.

**Входные источники:**

- `AGENTS.md`, `harness/PROJECT_STATE.md`, `harness/RISK_POLICY.md`.
- `docs/PRODUCT.md`, `docs/DECISIONS.md`.
- `content/program/levels-and-sections.md`.
- `content/sections/level-01/`–`content/sections/level-06/`.
- текущие `src/`, `vite.config.ts`, `package.json`, `README.md`.

**Write set:**

- `src/content/program.ts`.
- `src/content/sections.ts`.
- `src/App.tsx`.
- `src/screens/CatalogScreen.tsx`.
- `src/styles.css`.
- `vite.config.ts`.
- `package.json`, `package-lock.json`.
- `README.md`, `AGENTS.md`.
- `docs/PRODUCT.md`, `docs/DECISIONS.md`.
- `harness/PROJECT_STATE.md`, `harness/WORKBOARD.md`.
- `harness/tasks/2026-08-23-expand-demo-to-22-sections.md`.

**Вне scope:**

- изменение текста, границ, цепочек и safety-статусов 22 Section;
- визуальный редизайн и новые ассеты;
- регистрация, прогресс, упражнения, ответы, данные читателя, аналитика и рекомендации;
- backend, API, база данных, хранение, cloud/deployment и публикация;
- изменение hash-маршрутов или выбор стека будущего полного Reader;
- Git staging, commit и push.

**Риски:**

- неправильный программный порядок Section или распределение уровней;
- лишний/пропущенный Markdown-файл в manifest;
- переход после последней Section уровня не ведёт к первой следующего;
- длинный каталог неудобен или ломается на мобильном viewport;
- тихое расхождение документации с новым scope демо;
- пересечение с незавершёнными изменениями владельца.

**План проверки:**

- централизованно зафиксировать 6 уровней, 22 ID и точные source path;
- сохранить общий contract parser для клиента и Vite build;
- выполнить `npm run typecheck` и `npm run build`;
- проверить `6 / 22`, распределение `3 / 4 / 4 / 4 / 4 / 3`, уникальность ID/path и 9 звеньев;
- проверить hash-переходы: каталог → история → разбор → следующая Section, переход между уровнями и финальный возврат к списку;
- провести browser QA на desktop и mobile: DOM, console, screenshot и взаимодействия;
- выполнить `git diff --check`, `git diff --cached --check` и отдельную whitespace-проверку новых файлов.

## Result

**Итог:** Статическая демоверсия расширена до всех 6 уровней и 22 Section. Каталог группирует Section по уровням, каждая Section открывается напрямую, линейные переходы проходят через границы уровней, а после L06-S03 пользователь возвращается к общему списку. Общий manifest используется и клиентом, и Vite-проверкой.

**Файлы:**

- Создан `src/content/program.ts` — manifest 6 уровней, 22 ID и source path с проверкой распределения и уникальности.
- Изменены `src/content/sections.ts`, `src/App.tsx`, `src/screens/CatalogScreen.tsx`, `src/styles.css`.
- Изменён `vite.config.ts` — contract validation и watcher работают для всех 22 Section.
- Обновлены `package.json`, `package-lock.json` — имя пакета `prozhito-demo`.
- Обновлены `README.md`, `AGENTS.md`, `docs/PRODUCT.md`, `docs/DECISIONS.md`.
- Обновлены `harness/PROJECT_STATE.md`, `harness/WORKBOARD.md`.
- Создан `harness/tasks/2026-08-23-expand-demo-to-22-sections.md`.

**Проверки:**

- `npm run typecheck` — PASS.
- `npm run build` — PASS; Vite проверил контракт 22 Section. Есть неблокирующее предупреждение о minified chunk 550,86 kB из-за eager-import длинных Markdown-фрагментов.
- manifest QA — PASS: 6 уровней, 22 уникальных ID/path, распределение `3 / 4 / 4 / 4 / 4 / 3`, первый ID `L01-S01`, последний `L06-S03`.
- относительные ссылки и якоря в `content/`, `docs/`, `harness/` — PASS.
- проверка устаревших формулировок «демо первого уровня» в канонической документации — PASS, совпадений нет.
- Browser QA на `http://127.0.0.1:43572/#/` — PASS: title `Прожито`, 6 level-region, 22 Section-ссылки, нет framework overlay, console errors или warnings.
- interaction: каталог → L02-S01 story → analysis — PASS; в разборе 9 звеньев.
- interaction: L02-S01 analysis → L02-S02 story — PASS.
- boundary: L02-S04 analysis → L03-S01 story — PASS.
- final: L06-S03 analysis → общий список — PASS.
- mobile rendered QA при фактической ширине 332 px — PASS: горизонтального переполнения нет, 22 ссылки и 9 звеньев отображаются, touch-target первой ссылки около 76 px.
- `git diff --check`, `git diff --cached --check` и `git diff --no-index --check` для новых файлов — PASS.
- Проверка локальная и не является полным release-pass; staging и публикация не выполнялись.

**Источники и даты:**

- `docs/PRODUCT.md`, `docs/DECISIONS.md`, `content/program/levels-and-sections.md` — проверены 23 августа 2026 года для порядка, названий уровней и навигации.
- `content/sections/level-01/`–`level-06/` — проверены Vite contract plugin 23 августа 2026 года.
- Внешние финансовые утверждения не добавлялись; текст Section не изменялся.

**Оставшиеся риски:**

- Все Markdown-фрагменты импортируются eagerly, поэтому production chunk превышает стандартный порог Vite на 50,86 kB; gzip-размер — 146,02 kB. Для дальнейшей performance-оптимизации понадобится отдельное решение о lazy-load контента без ослабления build-time contract validation.
- Не проверены другие браузерные движки и viewport ниже поддерживаемого минимума 320 px.
- Human review полного длинного каталога и лонгридов на реальном мобильном устройстве остаётся открытым.

**Следующий шаг:**

- Провести human mobile review; при необходимости отдельной задачей внедрить lazy-load Markdown без изменения пользовательской модели.
