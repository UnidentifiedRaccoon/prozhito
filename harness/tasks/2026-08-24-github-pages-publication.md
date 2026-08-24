# Task / Result Packet

## Task

**Название:** Публикация статической демоверсии в GitHub Pages

**Владелец:** Codex

**Статус:** active

**Цель:** Проверенно отправить текущую статическую демоверсию в `UnidentifiedRaccoon/prozhito` и опубликовать собранный `dist` через GitHub Pages.

**Входные источники:**

- `AGENTS.md`
- `harness/PROJECT_STATE.md`
- `harness/RISK_POLICY.md`
- `package.json`
- `vite.config.ts`
- текущее состояние Git и remote `origin`

**Write set:**

- `.github/workflows/pages.yml`
- `vite.config.ts`
- `harness/tasks/2026-08-24-github-pages-publication.md`
- Git index, коммит и ветка `main` в рамках утверждённой публикации
- настройки GitHub Pages репозитория `UnidentifiedRaccoon/prozhito`

**Вне scope:**

- изменение сюжета, Section, финансовых тезисов или дизайна демо
- backend, API, аналитика, регистрация и пользовательские данные
- изменение истории Git, force-push, удаление веток или репозиториев
- публикация Storybook, debug-логов и локальных review-артефактов

**Риски:**

- внешний push и публичная публикация требуют проверки account, target и visibility
- в рабочем дереве есть большой ранее подготовленный набор незакоммиченных файлов
- GitHub CLI в начале задачи сообщает о недействительном токене
- случайная публикация секретов, локальных логов или служебных review-файлов

**План проверки:**

- проверить GitHub account, target, visibility и самостоятельность истории Git
- явно сформировать staged scope без debug-логов и локальных review-артефактов
- просканировать staged-файлы на секреты и запрещённые файлы
- выполнить `npm run build`, проверки структуры контента и относительных ссылок
- выполнить `git diff --cached --check` и просмотреть staged diff/stat
- после push проверить успешный Pages deployment и опубликованный URL

## Result

**Итог:** В работе.

**Файлы:**

- В работе.

**Проверки:**

- В работе.

**Источники и даты:**

- В работе.

**Оставшиеся риски:**

- В работе.

**Следующий шаг:**

- В работе.
