# Task / Result Packet

## Task

**Название:** Подготовить оставшиеся 19 Section программы

**Владелец:** Codex

**Статус:** done

**Цель:** Создать по каноническому контракту Section все content-файлы `L02-S01`–`L06-S03`, не меняя книгу, карту программы и демоверсию.

**Входные источники:**

- `AGENTS.md`, `harness/PROJECT_STATE.md`, `harness/RISK_POLICY.md`.
- `docs/PRODUCT.md`, `docs/DECISIONS.md`, `docs/CONTENT_MAP.md`.
- устойчивые якоря `content/story/book.md#level-02-section-01`–`#level-06-section-03`.
- связанные строки `content/program/competency-action-map.md`.
- `docs/METHODOLOGY.md`, `docs/SECTION_CONTRACT.md`, `docs/SAFETY.md`.
- `content/sections/level-01/section-template.md` и три соседних готовых Section первого уровня.

**Write set:**

- `content/sections/level-02/`.
- `content/sections/level-03/`.
- `content/sections/level-04/`.
- `content/sections/level-05/`.
- `content/sections/level-06/`.
- `harness/tasks/2026-08-23-remaining-19-sections.md`.
- `harness/PROJECT_STATE.md` — только итоговое изменение долгосрочного состояния после QA.

**Вне scope:**

- три существующие Section уровня 1 и их шаблон;
- каноническая книга, карты, методология, продуктовые решения;
- код и навигация статической демоверсии;
- архитектура, backend, хранение, инфраструктура и публикация;
- Git staging, commit и push.

**Риски:**

- потеря абзаца или захват первого beat соседней Section;
- усиление результата или смена владельца решения;
- обобщение условия вымышленного кейса до реального закона, договора или рыночной практики;
- меняющиеся темы: кредитные продукты, инвестиции, карты, ДМС, налоги, реестры, цифровая безопасность;
- существующие незавершённые изменения владельца в рабочем дереве.

**План проверки:**

- для каждой Section сверить границу, полный фрагмент, девять звеньев, действия, квалификации и мосты;
- провести method/continuity QA и financial safety-review;
- проверить все относительные ссылки и программные инварианты `6 / 22`, `3 / 4 / 4 / 4 / 4 / 3`, 48 действий, 22 Section и девять звеньев;
- проверить отсутствие запрещённых сущностей и технического расширения;
- выполнить `git diff --check` и `git diff --cached --check`, явно различая проверку незастейдженных и staged-файлов.

## Result

**Итог:** Созданы все 19 Section уровней 2–6. Каждый файл содержит полный канонический фрагмент, ровно девять звеньев, методический паспорт, связанные действия и компетенции, источники/safety-ограничения и заполненный QA-чек-лист. Все Section имеют статус `ready`, safety-вердикт `PASS`.

**Файлы:**

- `content/sections/level-02/section-01-whole-room-cost.md`.
- `content/sections/level-02/section-02-plan-after-breakdown.md`.
- `content/sections/level-02/section-03-not-decided-status.md`.
- `content/sections/level-02/section-04-control-with-minimum-data.md`.
- `content/sections/level-03/section-01-criteria-before-option.md`.
- `content/sections/level-03/section-02-deadline-before-promise.md`.
- `content/sections/level-03/section-03-check-answer-and-channel.md`.
- `content/sections/level-03/section-04-extend-without-forever.md`.
- `content/sections/level-04/section-01-count-what-is-known.md`.
- `content/sections/level-04/section-02-contact-before-deadline.md`.
- `content/sections/level-04/section-03-specific-dms-terms.md`.
- `content/sections/level-04/section-04-own-share-separate-question.md`.
- `content/sections/level-05/section-01-role-boundaries-first.md`.
- `content/sections/level-05/section-02-check-without-extra-conclusion.md`.
- `content/sections/level-05/section-03-platform-refusal-not-project-end.md`.
- `content/sections/level-05/section-04-small-test-launch-boundaries.md`.
- `content/sections/level-06/section-01-one-question-several-stages.md`.
- `content/sections/level-06/section-02-help-without-access.md`.
- `content/sections/level-06/section-03-own-choice-shared-method.md`.
- `harness/PROJECT_STATE.md`.
- `harness/tasks/2026-08-23-remaining-19-sections.md`.

**Проверки:**

- машинная сверка экрана 1 с фрагментами `book.md` — PASS, 19 из 19 совпали без расхождений;
- счётчик цепочек — PASS, 171 звено в новых Section, по 9 в каждом файле и в обязательном порядке;
- структура программы — PASS, 22 Section и распределение `3 / 4 / 4 / 4 / 4 / 3`;
- внутренняя карта — PASS, 48 действий; состав действий каждого паспорта совпадает с картой;
- относительные файлы и якоря в `content/`, `docs/`, `harness/` — PASS;
- статусы — PASS, 19 из 19 новых Section имеют `ready` и `PASS`;
- запрет технического расширения — PASS, в новых каталогах нет `.env`, workflow, TypeScript/JavaScript, backend или сетевых API;
- `git diff --no-index --check /dev/null <новый файл>` для 19 Section и packet — PASS; это отдельно проверяет ещё не отслеживаемые файлы;
- `git diff --check` — PASS;
- `git diff --cached --check` — PASS для текущего staged diff; новые файлы намеренно не staged;
- проверка проведена локально и не названа release-pass; визуальный mobile review не выполнялся.

**Источники и даты:**

- `content/story/book.md`, `docs/CONTENT_MAP.md`, `content/program/competency-action-map.md` — проверены 23 августа 2026 года для всех 19 Section.
- Банк России, «Проверить участника финансового рынка» — сведения на 20 августа 2026 года, проверено 23 августа 2026 года для L03-S02.
- Банк России, витрина данных ПИФ и предел прошлой доходности — проверено 23 августа 2026 года для L03-S02.
- Банк России, «Осторожно: мошенники!» — обновлено 11 августа 2026 года, проверено 23 августа 2026 года для L03-S03.
- Банк России, FAQ по информационной безопасности — проверено 23 августа 2026 года для L03-S03.
- ФНС России, перечень сервисов открытых сведений — обновлено 7 августа 2025 года, проверено 23 августа 2026 года для L05-S02.
- ФНС России, социальный налоговый вычет по расходам на обучение — проверено 23 августа 2026 года для L06-S01.
- Условия продавцов, аренды, карт, работодателя, ДМС и площадки в остальных тезисах явно ограничены вымышленным кейсом книги и не обобщены.

**Оставшиеся риски:**

- Human review длины лонгридов на реальных мобильных устройствах не выполнялся.
- Быстро меняющиеся официальные источники нужно повторно проверить перед внешней публикацией.
- Новые Section не подключены к статической демоверсии: это намеренно вне scope текущей content-задачи.

**Следующий шаг:**

- Провести human editorial/mobile review всех 19 Section; интеграцию в клиент начинать только отдельной задачей.
