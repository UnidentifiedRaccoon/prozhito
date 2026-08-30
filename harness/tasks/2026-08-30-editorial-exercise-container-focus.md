# Task / Result Packet

## Task

**Название:** Убрать случайную рамку фокуса вокруг всего упражнения

**Владелец:** Стефания (`/root`); `build_editorial_exercise` — только Stories экрана; `audit_header_navigation` — read-only review.

**Статус:** done

**Цель:** Пассивный контейнер экрана «Решение» не рисует рамку при фокусе; переход к содержанию и видимый клавиатурный фокус управления сохраняются.

**Источники:** запись и мобильный снимок владельца от 30 августа 2026 года; [AGENTS.md](../../AGENTS.md), [PROJECT_STATE.md](../PROJECT_STATE.md), [UI-контракт](../../docs/EDITORIAL_V2.md#упражнение-l01-s01), [принятие обложки](2026-08-30-editorial-cover-adoption-and-archive.md).

**Причина:** `.content:focus` в `EditorialSolutionScreen.module.css` обводит весь `div[data-editorial-reading][tabindex=-1]`, включая упражнение и нижнюю навигацию. Контейнер служит целью skip-link и может получать фокус при pointer-взаимодействии. Удалить только правило недостаточно из-за глобального `:focus-visible`; требуется локальное `outline:none` на пассивном контейнере.

**Write set:**

- `src/apps/editorial-v2/screens/EditorialSolutionScreen/EditorialSolutionScreen.module.css`;
- `src/apps/editorial-v2/screens/EditorialSolutionScreen/EditorialSolutionScreen.stories.tsx` — отдельный писатель;
- `docs/EDITORIAL_V2.md` — уточнение фокуса контейнера;
- этот packet.

**Вне scope:** первый экран/обложки, архив, JSX/семантика, логика упражнения, содержание и новые упражнения в других Section, theme/global focus, хранение/данные/dependencies, commit/push/publication. Локальное CSS-исправление общего контейнера «Решения» действует также при обычном чтении L01-S02/L01-S03; их сценарий и вёрстка не меняются.

**План:** сохранить `tabIndex=-1`, data-атрибут и skip-link, отключить outline только у `.content:focus`; воспроизвести фокус контейнера и проверить реальные controls на mobile/desktop; добавить регрессионную проверку существующего экрана и проверить сборку, ссылки, diff/baseline.

**Риски:** скрыть focus у всех потомков слишком широким селектором; сломать skip-link удалением tabindex; не учесть fallback глобального focus-visible. `blur()`/preventDefault для кликов не добавляются.

## Result

**Итог:** у `.content:focus` экрана «Решение» теперь `outline:none`. Цель skip-link, `tabIndex=-1`, обработчики и вложенные controls не изменены. Рамка всего экрана исчезла; тонкие разделители рабочей области, выбранный пункт и видимый фокус кнопок/ответов сохранены. Правка реализована в четырёх файлах write set; продуктовый сценарий не меняется.

**Проверки:**

- Просмотрены шесть кадров6.7-секундной записи владельца и мобильный снимок: рамка охватывает вводный текст, упражнение и нижнюю навигацию, совпадая с reading-wrapper. Это не рамка отдельного ответа или nav.
- Рабочий экран390×844 и1280×900: «К содержанию» переносит фокус на `DIV[data-editorial-reading]` с `tabIndex=-1`, прокручивает к его началу, но `outline-style:none`. При ответе/переходе фокус — `legend`, вопрос и общий контейнер без лишней рамки. Переполнения страницы нет. Console error/warn —0.
- Новый browser play `Reading Focus` — PASS на desktop и при реальной ширине iframe390px. Проверены skip-link+Enter, фокус reading target без обводки, Tab к кнопке с видимым outline, клик по пассивному тексту без общей рамки, Tab к radio-строке с видимым outline, Space-выбор и Enter-переход к следующему вопросу.
- В первом запуске тест обнаружил гонку своей подготовки с начальным route-entry focus shell. Тест теперь ждёт фокуса main перед взаимодействием, без задержек и без ослабления проверки целевого контейнера; production-логика не менялась. Повторный запуск — PASS.
- Прежние browser plays экранов `L01S01`, `L01S02`, `L01S03` — PASS: чтение всех девяти звеньев и навигация сохранены.
- Accessibility desktop:0 violations/1 inconclusive. Неопределённость касается только контраста `h1` обложки: axe не определяет фон из-за псевдоэлемента; обложка этой задачей не менялась.
- Production build с TypeScript и Storybook build — PASS; прежнее предупреждение о chunk больше500kB остаётся.
- `git diff --check`, `git diff --cached --check`, whitespace четырёх файлов и15 относительных ссылок — PASS. Baseline234 файлов: изменены только CSS и Stories экрана «Решение»; канонический контент, архив, JSX и компоненты упражнения совпадают с исходным состоянием.

**Артефакты:** `/tmp/prozhito-exercise-container-focus-mobile.jpg`, `/tmp/prozhito-exercise-container-focus-desktop.jpg` — вид при фокусе reading target без обводки; `/tmp/prozhito-exercise-outline-recording.jpg` — кадры исходной записи для локального анализа. Временный проверочный сервер остановлен, пользовательский dev-server не затронут.

**Оставшиеся риски:** локальный UI/regression-check, не полный release-pass; физические устройства и screen reader не проверялись. Контраст обложки требует отдельной ручной оценки. Аналогичный стиль на первом экране не менялся: текущий scope — рамка экрана «Решение».

**Следующий шаг:** визуальная оценка владельцем исправленного второго экрана; дальнейшего переноса, commit/push/publication нет.
