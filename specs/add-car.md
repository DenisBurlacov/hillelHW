# Guest adds a car to Garage

## Перевірена навчальна умова

Після входу через `Guest log in` користувач відкриває форму `Add car`, обирає
`Audi` → `TT`, вводить `Mileage = 12000`, зберігає форму й бачить автомобіль
`Audi TT` у Garage.

## Межі

- Один UI-тест у Chromium.
- Старт через `baseURL` із `playwright.config.ts`.
- Вхід у гостьовий профіль є підготовкою, а не головною перевіркою.
- Головний результат: автомобіль `Audi TT` з'явився у Garage після збереження.
- Перевірити URL Garage та видимий запис `Audi TT`.
- Не додавати registration, API-виклики, credentials, Fuel Expenses або інші сценарії.

## Тестові дані

- Brand: `Audi`.
- Model: `TT`.
- Mileage: `12000`.

## Джерела контракту

- Правила Brand, Model, Mileage та появи авто у Garage:
  `cases/qauto/requirements/add-car.md`.
- Конкретні навчальні дані `Audi`, `TT`, `12000`: цей файл.
- Ознаки UI-елементів: поточний accessibility snapshot або перевірений locator
  picker. Якщо UI не підтверджує їх, агент повертає `ASSUMPTION` + `STOP`.
- Результат запуску: лише фактичний terminal output Playwright Test.
