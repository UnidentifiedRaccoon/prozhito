# Task / Result Packet

## Task

**Название:** Параллельная редакционная версия — первые три Section

**Владелец:** Стефания

**Статус:** complete

**Цель:** Создать внутри текущей статической демоверсии изолированную ветку `editorial_v2`, которая одновременно с неизменённой `living_archive_v1` показывает каталог первого уровня и два канонических экрана L01-S01, L01-S02 и L01-S03 в выбранном современном редакционном дизайне, а также документирует новые визуальные компоненты отдельными Storybook-stories.

**Входные источники:**

- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `docs/PRODUCT.md`
- `docs/DECISIONS.md`
- `docs/DESIGN_SYSTEM.md`
- `content/sections/level-01/section-01-money-by-date.md`
- `content/sections/level-01/section-02-pause-before-urgent.md`
- `content/sections/level-01/section-03-draft-instead-of-memory.md`
- `src/screens/ModernEditorialLabScreen.tsx`
- `src/screens/ModernEditorialLabScreen.module.css`
- выбранное владельцем направление современной редакционной лаборатории от 2026-08-30

**Write set:**

- `harness/tasks/2026-08-30-editorial-v2-first-level.md`
- `docs/DECISIONS.md`
- `docs/EDITORIAL_V2.md`
- `harness/PROJECT_STATE.md`
- `harness/WORKBOARD.md`
- `src/App.tsx`
- `src/router.ts`
- `src/apps/editorial-v2/**`

**Вне scope:**

- изменение или удаление legacy-экранов, компонентов, styles/tokens и assets `living_archive_v1`;
- изменение существующих legacy-маршрутов и опубликованной GitHub Pages-версии;
- перенос Section L02–L06 или Section после L01-S03;
- изменение канонических Markdown, порядка, причинности и числа девяти звеньев;
- упражнения, ответы, сохранение прогресса, backend, аналитика и персонализация;
- внешняя публикация, Git commit, push и deployment.

**Риски:**

- CSS или Storybook-import новой ветки не должен менять legacy-компоненты;
- новая ветка должна переиспользовать канонический контент без копирования и расхождения;
- в приложении должны одновременно работать старые и новые hash-маршруты;
- три новые сюжетные иллюстрации должны сохранять женский канон Саши, причинность сцен и отсутствие проверяемого текста в raster;
- demo-scope первых трёх Section нельзя выдать за полную миграцию 22 Section;
- существующие несвязанные изменения в dirty worktree должны быть сохранены.

**План проверки:**

- TypeScript и production build;
- Storybook static build и a11y-smoke новых stories;
- `git diff --check` и `git diff --cached --check`;
- старый каталог и одна legacy Section остаются визуально и функционально прежними;
- новый каталог содержит ровно L01-S01, L01-S02 и L01-S03;
- каждая новая Section показывает полный story Markdown и ровно девять analysis items;
- Browser/IAB: каталог → история → решение → следующая Section;
- desktop, 390 px и 320 px без горизонтального overflow;
- console, framework overlay, keyboard focus и изображения;
- fidelity-сверка принятого lab-концепта и финального browser-render через `view_image`.

## Result

**Итог:** Создано изолированное мини-приложение `editorial_v2` внутри текущего SPA. Старая архивная версия остаётся по `#/` со всеми 22 Section; новая версия доступна по `#/editorial-v2/` и содержит каталог первого уровня, полный экран «История» и полную девятизвенную цепочку «Решение» для L01-S01–L01-S03. Новая ветка загружается лениво, использует собственную scoped-тему, компоненты, изображения и Storybook stories, но читает те же канонические Markdown.

**Файлы:**

- `src/apps/editorial-v2/**` — маршруты мини-приложения, model/visual manifest, 9 визуальных компонентов, 3 экрана, scoped-тема, 3 project-bound иллюстрации, 26 Storybook stories и 13 autodocs entries;
- `src/router.ts`, `src/App.tsx` — ограниченная интеграция новых hash-маршрутов и lazy chunk без изменения старых route contracts;
- `docs/EDITORIAL_V2.md`, `docs/DECISIONS.md` — архитектурная граница и решение 26 о параллельной версии;
- `harness/PROJECT_STATE.md`, `harness/WORKBOARD.md` — новое долговременное состояние и следующий сравнительный review;
- этот task packet.

**Проверки:**

- `npm run typecheck` — PASS;
- `npm run build` — PASS; V2 выделена в отдельные `EditorialV2App` JS/CSS chunks, legacy entry остаётся отдельным; общий main chunk сохраняет прежнее предупреждение Vite о размере;
- `npm run build-storybook` — PASS; 26 V2 stories и 13 autodocs entries найдены в static index, addon-a11y остаётся в режиме `error`; sandbox не позволил Storybook записать необязательный global settings-файл в домашнюю директорию, output собран полностью;
- forbidden-import scan — PASS: V2 не импортирует legacy `components`, `screens`, `styles/tokens`, `sectionVisuals`, `living-archive` или lab assets;
- visual-contract scan — PASS: в V2 CSS нет теней, радиусов, градиентов, `:global` или `:has`;
- Browser desktop — PASS: каталог, «История» и «Решение» соответствуют принятой редакционной анатомии; theme занимает полный viewport без видимой legacy paper-frame; console errors/warnings отсутствуют;
- Browser 390 px — PASS: каталог содержит ровно 3 Section, story L01-S01 показывает полный текст и meaningful alt, горизонтального overflow нет;
- Browser 320 px — PASS: самая плотная цепочка L01-S03 содержит ровно 9 items, заканчивается «Результатом», не обрезается и не создаёт горизонтальный overflow;
- flow — PASS: каталог → L01-S01 story → analysis → L01-S02 → L01-S03 → новый каталог; последний CTA не уводит в неперенесённый L02;
- legacy smoke — PASS: `#/` показывает 6 уровней и 22 ссылки Section, L01-S01 использует старый `living-archive` asset, V2-root отсутствует;
- `git diff --check` и `git diff --cached --check` — PASS.

**Источники и даты:**

- локальные канонические файлы первых трёх Section, проверенная коллекция клиента и owner decision от 2026-08-30;
- новые иллюстрации L01-S02/L01-S03 созданы 2026-08-30 по story briefs; L01-S01 скопирована из принятой редакционной лаборатории в отдельный namespace.

**Оставшиеся риски:**

- это только сравнительный срез первой главы, а не миграция 22 Section;
- системные `New York` / `Charter` / `Inter` могут отличаться на устройствах заказчика; перед внешним sign-off нужно принять вариативность или локально поставлять выбранные гарнитуры;
- нужен human review на реальных мобильных устройствах и сравнительная демонстрация двух направлений;
- полный автоматический axe-прогон и кроссбраузерная матрица не выполнялись; семантика, focus-flow и console проверены browser-smoke и Storybook play-проверками;
- внешняя публикация новой ветки не выполнялась.

**Следующий шаг:**

- показать заказчику `living_archive_v1` и `editorial_v2` рядом; только после решения назначить перенос следующих Section или закрытие эксперимента.
