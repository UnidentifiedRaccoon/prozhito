# Task / Result Packet

## Task

**Название:** Уравнять высоту hero экранов «История» и «Решение»

**Владелец:** Codex

**Статус:** done

**Цель:** Сделать hero двух экранов Section одинаковой высоты, равной 85% от прежней высоты hero «Истории», без регенерации изображений.

**Входные источники:**

- явное решение владельца от 29 августа 2026 года;
- `docs/DECISIONS.md`, решения 21–24;
- `docs/DESIGN_SYSTEM.md`, контракт `SectionHeroHeader`;
- текущие `3:2` assets и focal metadata в `src/visuals/sectionVisuals.ts`.

**Write set:**

- этот task packet;
- `src/components/product/SectionHeroHeader/SectionHeroHeader.module.css`;
- `docs/DECISIONS.md`;
- `docs/DESIGN_SYSTEM.md`;
- `harness/PROJECT_STATE.md`.

**Вне scope:**

- регенерация или замена raster assets;
- изменение сюжетов, девяти звеньев, маршрутов, названий экранов или пользовательской модели;
- изменение focal metadata до появления фактической проблемы на crop QA;
- публикация, backend, инфраструктура и Git-операции.

**Риски:**

- увеличение hero «Решения» может сильнее отложить начало `DecisionChain`;
- уменьшение hero «Истории» может обрезать сюжетный субъект или длинный заголовок;
- одинаковая высота не гарантирует одинаково удачный crop для всех 44 assets.

**План проверки:**

- проверить вычисленную одинаковую высоту `story` и `analysis` на mobile и desktop;
- проверить crop, контраст и положение заголовка на реальных маршрутах;
- проверить один `h1`, один hero и ровно девять звеньев на экране «Решение»;
- выполнить `npm run typecheck`, `npm run build`, `npm run build-storybook`, `git diff --check` и `git diff --cached --check`.

## Result

**Итог:** Hero экранов «История» и «Решение» переведены на одну responsive-высоту, равную 85% от прежней высоты story hero. На мобильном режиме используется `clamp(26.35rem, 57.8svh, 33.15rem)`, на desktop — `min(54.4vh, 32.3rem)`. Изображения, focal metadata и содержание Section не менялись.

**Файлы:**

- изменён `src/components/product/SectionHeroHeader/SectionHeroHeader.module.css`;
- изменены `docs/DECISIONS.md`, `docs/DESIGN_SYSTEM.md`;
- изменён `harness/PROJECT_STATE.md`;
- создан и заполнен этот task packet.

**Проверки:**

- `npm run build` — PASS, включая `tsc --noEmit`; сохраняется прежнее неблокирующее предупреждение Vite о chunk больше 500 KB;
- `npm run build-storybook` — PASS; sandbox не позволил сохранить глобальный файл настроек Storybook, сборка завершилась успешно;
- production Browser QA на `391 × 846` — PASS: story и analysis имеют одинаковую высоту `488.984375 px`, разница `0 px`, заголовок внутри hero, overflow отсутствует, на analysis ровно 9 items;
- production Browser QA на `1280 × 800` — PASS: story и analysis имеют одинаковую высоту `435.1953125 px`, разница `0 px`, заголовок внутри hero, overflow отсутствует, на analysis ровно 9 items;
- responsive DOM matrix — `176 / 176` PASS: `22 Section × 2 routes × 4 viewport` (`320 × 720`, `391 × 846`, `768 × 1024`, `1280 × 800`); один `h1`, один hero, заголовок внутри hero, без horizontal overflow, равная высота пары, story сохраняет текст, analysis содержит ровно 9 items;
- Browser console — PASS, ошибок и предупреждений нет;
- `git diff --check` и `git diff --cached --check` — PASS.

**Источники и даты:**

- явное решение владельца и локальная реализация, 29 августа 2026 года.

**Оставшиеся риски:**

- Локальный визуальный QA подтверждает crop пилотной пары и структурную целостность всех 44 маршрутов, но не заменяет owner review всех изображений на физических устройствах;
- увеличение analysis hero позже открывает первое звено на мобильном экране — это ожидаемое следствие выбранного равновесия;
- предупреждение Vite о размере JS chunk существовало до изменения и не связано с hero.

**Следующий шаг:**

- Owner review сбалансированности двух экранов; дальнейшие изменения не запускать автоматически.
