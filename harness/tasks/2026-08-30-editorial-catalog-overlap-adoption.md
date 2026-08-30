# Task / Result Packet

## Task

**Название:** Принятие D «Номер на наплыве» в мобильном каталоге editorial_v2.

**Владелец:** root — документы/интеграция; audit_header_navigation — три production-файла; review_integration_contract — read-only ревью.

**Статус:** done — дизайн принят и перенесён; реальный browser/mobile QA остаётся ограничением.

**Цель:** Применить выбранный владельцем вариант D из лаборатории к мобильному каталогу всех трёх редакционных Section, сохранив desktop, экраны Section и living_archive_v1.

**Источник решения:** сообщение владельца после просмотра C/D: «Да, мне больше нравится номер на наплыве, давай применим этот вариант». Ранее лаборатория была явно мобильной; применяется существующий breakpoint каталога `max-width:48rem`. Исходник выбранной пробы — `src/apps/editorial-catalog-lab/CatalogCard.tsx` и CSS для `overlap-raised`. Книга, финансовые тезисы, шапки и упражнение не пересматриваются.

**Входные источники:** `AGENTS.md`, `harness/PROJECT_STATE.md`, `harness/WORKBOARD.md`, `docs/DECISIONS.md`, `docs/EDITORIAL_V2.md`, предыдущий [lab packet](2026-08-30-editorial-catalog-lab.md), `EditorialChapterIndex`, `EditorialArtwork`, `EditorialCatalogScreen`, текущие program/visuals.

**Write set:**

- `src/apps/editorial-v2/components/EditorialChapterIndex/EditorialChapterIndex.tsx` — audit_header_navigation.
- `src/apps/editorial-v2/components/EditorialChapterIndex/EditorialChapterIndex.module.css` — audit_header_navigation.
- `src/apps/editorial-v2/screens/EditorialCatalogScreen/EditorialCatalogScreen.module.css` — audit_header_navigation.
- `docs/DECISIONS.md`, `docs/EDITORIAL_V2.md`, `harness/PROJECT_STATE.md`, `harness/WORKBOARD.md` — root.
- `src/apps/editorial-catalog-lab/README.md`, `src/apps/editorial-v2/README.md` — root, актуальный статус принятия.
- `src/apps/editorial-catalog-lab/model.ts`, `CatalogLabApp.tsx`, `CatalogLab.stories.tsx` — root, только переименование0 в «Исходный» и сообщение о принятии D; геометрия и маршруты лаборатории сохраняются.
- Этот packet — root; временные baseline/проверки/сборки — `/tmp/prozhito-catalog-adoption-*`.

**Вне scope:** desktop-композиция каталога, канонические Markdown, архив, оба экрана всех Section, упражнения/сверка, лабораторные компоненты и маршруты, изображения и shared focal metadata, зависимости, сервер/аналитика/хранение, Git/push/публикация.

**Принятые детали:** картинка высотой160–180px; светлый текстовый блок заходит на32px на изображение и чуть не доходит до его правой границы; номер на своей непрозрачной светлой подложке выровнен с левым краем текста и поднят над краем блока на50% своей высоты. Полные заголовок/подпись/CTA остаются HTML, вся карточка — одна нативная ссылка. На mobile изображение занимает ширину страницы без двойных внешних отступов; вводная часть каталога сохраняет прежние поля. Каталог использует свой принятый crop, не меняющий обложки Section. Лаборатория сохраняет все5 вариантов.

**Риски:** переносы и crop на реальном устройстве, фокус поверх подложки; не спутать принятие мобильного варианта с разрешением менять desktop или архив. Нового продуктового поведения нет. Browser/mobile QA в этой сессии остаётся недоступным из-за прежнего URL-policy запрета; обходы другим браузером/HTTP/портом запрещены.

**План проверки:** сборка приложения и Storybook, существующие render/route проверки плюс чтение реального каталога в чистом React-render без HTTP; полный текст и настоящие ссылки трёх Section; статическое сопоставление CSS с D и прежними desktop-правилами; независимое ревью; baseline файлов вне scope, ссылки/whitespace и оба git diff --check. Не объявлять частичную проверку release-pass.

## Result

**Итог:** D применён в рабочем каталоге `http://127.0.0.1:5173/prozhito/#/editorial-v2/` для всех трёх Section до48rem включительно. Картинка занимает ширину страницы, текст наплывает на32px, номер на подложке выступает на50% над краем. Полные названия/описания/CTA и прежние href сохранены. Desktop выше48rem, оба экрана Section, архив и shared artwork не изменены. Нового поведения и расширения продуктового контракта нет; принятое визуальное решение зафиксировано строкой32.

**Файлы:** изменены три production-файла, шесть документов/README и три файла lab chrome/Storybook; создан этот packet —13 файлов. Геометрия всех5 лабораторных вариантов сохранена;0 переименован в «Исходный», служебный текст сообщает о принятии D. Production не импортирует лабораторию. Коммит, push, публикация и новые зависимости не выполнялись.

**Проверки:**

- `npm run build` / typecheck — PASS. Прежнее предупреждение о размере общего bundle >500kB осталось.
- `npm run build-storybook -- --output-dir /tmp/prozhito-catalog-adoption-storybook` — PASS; существующие ChapterIndex и лабораторные Stories собраны. Браузерные plays не запускались.
- `/tmp/prozhito-catalog-adoption-check.mjs` — PASS:28 чистых React-render (27 лабораторных и рабочий каталог); все3 ссылки/названия/описания/изображения, локальные crop58/5,50/8,42/10, отсутствие lab controls в рабочем каталоге. Parser сохраняет существующие маршруты, каноническая коллекция22 Section с9 звеньями и распределением3/4/4/4/4/3 валидна. HTTP/listen/browser в проверке не используются.
- Сопоставление со старым исходником — PASS: базовые CSS-правила до первого media query побайтно прежние, новые правила ограничены max-width; DOM/тексты ChapterIndex полностью совпадают после исключения новых inline crop-properties. Desktop-геометрия не изменяется.
- Независимое read-only ревью — PASS: выбранные D-геометрия, crop, подложка номера, полные тексты, один номер/одна ссылка, видимый фокус поверх слоёв и forced colors; локальный crop перекрывает оба диапазона Artwork до42rem и42–48rem. Intro сохраняет прежние поля35/48rem, изображения растягиваются без двойных отступов.
- Baseline `/tmp/prozhito-catalog-adoption-before.json` — только12 объявленных существовавших файлов изменены, остальные304 совпали; новый packet входит в write set. Канонический контент, assets, архив, экраны Section и механика упражнений не затронуты.
- Whitespace всех13 файлов, относительные ссылки, `git diff --check`, `git diff --cached --check` — PASS. Локальный процесс разработки подтверждён на127.0.0.1:5173 проверкой процесса без HTTP.

**Оставшиеся риски:** реальная визуальная/browser/mobile проверка заблокирована прежним URL-policy текущей сессии. Не подтверждены фактические переносы при увеличении шрифта, crop, визуальный фокус, console и клики на устройстве. Никаких обходов или заявлений о полном release-pass нет. Владелец выбрал D при просмотре лаборатории; перенос в рабочий каталог не выдаётся за новый браузерный QA.

**Следующий шаг:** показать принятый дизайн в рабочем каталоге; дальнейшая миграция Section и публикация не входят в задачу.
