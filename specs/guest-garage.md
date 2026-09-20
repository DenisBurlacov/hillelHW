# Guest opens Garage

## Перевірена навчальна умова

Після натискання кнопки `Guest log in` користувач переходить на URL, що містить `/panel/garage`, і бачить видимий заголовок `Garage`.

## Межі

- Один UI-тест у Chromium.
- Старт через `baseURL` із `playwright.config.ts`.
- Одна дія: натискання `Guest log in`.
- Дві перевірки: URL і видимий heading.
- Не додавати registration, API-виклики, credentials або інші сценарії.

## Джерела контракту

- URL і heading: ця навчальна умова.
- Роль і доступна назва кнопки: checked-in baseline; перед прийняттям звірити з поточним UI або accessibility snapshot.
- Результат запуску: лише фактичний terminal output Playwright Test.
