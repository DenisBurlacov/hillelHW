# Готовий навчальний проєкт Playwright

Це заздалегідь підготовлена папка проєкту, а не завдання на побудову фреймворку з нуля. У ній уже є залежності, налаштування Playwright і TypeScript, базовий тест та правила для Codex. `tsconfig.json` підключає Node-типи й перевірку Playwright-файлів у VS Code. `tests/guest-garage.spec.ts` є базовим тестом, `specs/guest-garage.md` — джерелом вимоги, `AGENTS.md` — межами для Codex, а `templates/run-evidence.md` — формою підтвердження.

## Підготовка викладача

1. Встановіть Node.js LTS, VS Code і Codex extension для VS Code.
2. Виконайте `npm ci`, `npx playwright install chromium` і `npm run preflight`.
   Готовий LMS-архів уже містить `.playwright/cli.config.json`.
3. Відкрийте Codex Sidebar у VS Code й увійдіть через ChatGPT; не використовуйте API key для обов'язкової безкоштовної практики.
4. Не змінюйте browser-auth config: його вже використовують Playwright CLI і
   Playwright Test.
5. Запустіть `npm run test:guest`. Якщо середовище повертає auth/network error, збережіть blocker і використайте статичний fallback.

HTTP Basic Authentication — це системне вікно входу перед інтерфейсом QAuto.
Playwright не заповнює його кліками: `playwright.config.ts` читає
`httpCredentials` із локального `.playwright/cli.config.json`. Каталог
`.playwright/` уже додано до `.gitignore`; готовий config постачається лише у
LMS-архіві й не комітиться у Git.

## Маршрут студента

Людина спочатку встановлює Node.js LTS, VS Code і Codex extension, входить у
Codex через ChatGPT та відкриває саме папку готового навчального проєкту. Codex можна доручити
перевірку середовища й наведені нижче команди, але тільки після явного дозволу
на інсталяцію залежностей. Встановити й авторизувати самого себе Codex не може.

Розширення Playwright Test for VS Code є зручним, але необов'язковим. Окреме
розширення TypeScript не потрібне: VS Code уже підтримує TypeScript.

```bash
npm ci
npx playwright install chromium
npm run preflight
```

Не запускайте `npm init playwright@latest`: це створить інший проєкт і може
перезаписати навчальну структуру. Готовий проєкт уже містить config, baseline,
навчальні умови та правила для агента.

Для практики використовуйте `requirements/instructions-search-requirement.md` і
`requirements/instructions-search.png`. Спочатку Codex створює локальний spec і
чекає перевірки людиною. Після `APPROVE SPEC` Codex показує локальну
terminal-команду
`npx playwright cli -s=lecture07 open https://qauto.forstudy.space --config=.playwright/cli.config.json`,
повертає `READY FOR CLI INSPECTION` і чекає `APPROVE CLI INSPECTION`. Це не
дозвіл для Browser connector. Лише після `APPROVE CLI INSPECTION` він досліджує
UI, створює названий test-файл, показує diff і чекає окремого `APPROVE RUN`.

Файл `specs/add-car.md` залишено для окремої домашньої роботи. Готового
промпту до неї немає: студент сам формулює завдання або пише тест вручну.

Codex доступний через ChatGPT Free з обмеженою квотою, яка може змінюватися. Якщо квота або вхід недоступні, код можна відтворити вручну за тим самим контрактом; результат запуску не вигадується.

## Playwright Test, CLI і MCP

- `npx playwright test` — канонічний runner: виконує test suite і створює report/trace.
- Playwright CLI для coding agents — основний агентний інтерфейс для швидкого дослідження сторінки через команди та snapshots. У готовому проєкті він запускається локально як `npx playwright cli`; глобальна інсталяція й окремі Skills для обов'язкової практики не потрібні.
- Playwright MCP — додатковий server для клієнтів, яким потрібна тривала браузерна сесія та багате структуроване спостереження. Для обов'язкової практики він не потрібний.

CLI або MCP допомагає агенту спостерігати UI, але фінальний артефакт лишається звичайним Playwright Test у Git і фактичний output runner-а.

Обов'язкова практика не підключається до вже відкритого браузера і не залежить
від списку `connected browsers`. Локальний `.playwright/cli.config.json`
містить HTTP credentials і не додається в Git. Агент передає шлях через
`--config`, не копіюючи значення доступу у відповідь або test evidence.
Після `APPROVE CLI INSPECTION` Codex:

1. запускає `npx playwright cli -s=lecture07 open ... --config=.playwright/cli.config.json`;
2. виконує `npx playwright cli -s=lecture07 snapshot`;
3. переходить до `Instructions` за refs зі snapshot і виконує
   `npx playwright cli -s=lecture07 generate-locator <ref>` для потрібних елементів;
4. виконує `npx playwright cli -s=lecture07 close` і лише потім створює test.

Якщо `npx --no-install playwright cli --version` недоступна або preflight показує
`Playwright CLI Chromium ready: false` чи `Playwright CLI config ready: false`,
це `CLI SETUP BLOCKER`. Виконайте `npm ci`, установіть Chromium, підготуйте
локальний config і повторіть preflight; не шукайте Browser
connector.

Для лекції 08 у `labs/broken-guest-garage.spec.ts` є окремий детерміновано зламаний приклад. Він лежить поза `testDir`, тому звичайний `npm test` залишається зеленим. Lab запускається окремо:

```bash
npm run lab:broken
```

Очікуваний failure: тест шукає навмисно неправильний heading. Студент має підтвердити root cause через HTML report/trace, виправити лише копію lab-файла й повторити run.
