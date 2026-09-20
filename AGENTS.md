# Межі роботи AI-агента

Це навчальний Playwright-проєкт. Агент допомагає створити або перевірити один тест, але не є джерелом вимог і не може оголошувати запуск успішним без фактичного output.

## Дозволено

- читати `README.md`, `specs/`, `tests/`, `labs/` і Playwright config;
- змінювати лише файл, прямо названий у завданні;
- використовувати `@playwright/test` і наявні залежності;
- запускати `npm run preflight`, окремий тест і читати локальні report/trace;
- після погодження spec використовувати Playwright CLI для пошуку й перевірки
  локаторів у поточному UI перед написанням тесту;
- для Playwright CLI одразу використовувати `.playwright/cli.config.json`;
  `playwright.config.ts` призначений для Playwright Test і не передається CLI;
  перший запуск робити як
  `npx playwright cli open https://qauto.forstudy.space --config=.playwright/cli.config.json`,
  без пробного запуску з іншим config;
- позначати `FACT`, `ASSUMPTION`, `RISK`, `QUESTION` та `STOP`.

## Потрібне підтвердження людини

- запис або застосування diff;
- `APPROVE SPEC` дозволяє агенту показати точну команду відкриття CLI-сесії;
- `APPROVE CLI INSPECTION` дозволяє агенту запустити погоджену CLI-сесію,
  перевірити локатори й записати названий test file;
- `APPROVE RUN` дозволяє запустити створений Playwright Test;
- додавання залежності чи зміна config;
- будь-яка дія поза цим каталогом.

## Заборонено

- виводити в чат, terminal output або test evidence вміст `.env`,
  `.playwright/cli.config.json`, cookies чи tokens; CLI і Playwright Test можуть
  споживати локальний config без копіювання його вмісту до відповіді агента;
- змінювати baseline, config, package dependencies або product code без прямого завдання;
- використовувати непідтверджені CSS/XPath, fixed waits або вигаданий expected result;
- використовувати Browser connector для обов'язкової практики або просити
  людину вручну запускати Playwright CLI;
- виконувати commit, push, deploy або зовнішні write-дії;
- називати failure дефектом продукту до evidence-based діагностики.

## Definition of done

Є один обмежений diff, перевірені джерела локаторів та очікувань, точна команда, фактичний output або чесний blocker і рішення людини `ACCEPT` чи `STOP`.

Якщо команда `npx --no-install playwright cli --version` недоступна або preflight показує
`Playwright CLI config ready: false`, поверніть `CLI SETUP BLOCKER` і точну
інструкцію підготовки.
