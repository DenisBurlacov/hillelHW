# План тестування: Add car (Garage, модальне вікно "Add a car")

## Application Overview

План побудований на вимогах AC-* з requirements/instructions-add-car-requirements.md. Очікування не вигадані; фіксовані паузи не використовуються (лише web-first assertions). Basic Auth (AC-P1) надає project config (httpCredentials), у плані значення не наводяться.

**Початковий стан.** Якщо в сценарії не сказано інакше: свіжа гостьова сесія (Guest log in), порожній гараж (AC-P3). Кожен сценарій незалежний, починається з рядка Precondition і не залежить від порядку запуску. Автомобілі, створені через UI для підготовки стану, у сценаріях позначені як **Setup** і не є предметом перевірки.

**FACT (перевірено через Playwright CLI на живому UI, 20.09.2026):**
- Кнопки: `getByRole('button', { name: 'Guest log in' })`, `getByRole('button', { name: 'Add car' })`; заголовок модалки `heading 'Add a car'`; поля `getByLabel('Brand')`, `getByLabel('Model')`, `getByLabel('Mileage')` (spinbutton); кнопки Cancel, Close (x), `getByRole('button', { name: 'Add', exact: true })`.
- На щойно відкритій формі (порожній Mileage) кнопка Add вже `disabled`, без жодної взаємодії.
- Помилка валідації Mileage (клас `is-invalid` і текст у `p` всередині `.modal-content`) з'являється після blur (Tab) поля: порожнє значення дає 'Mileage cost required', 1000000 дає 'Mileage has to be from 0 to 999999'.
- Після Add: `.modal-content` зникає, `li.car-item` з'являється, `input.update-mileage-form_input` містить введене значення.
- Тост 'Car added' - це `<p>` в кінці DOM поза `.modal-content`; зникає приблизно за хвилину, тому перевіряти його одразу після кліку Add через `getByText('Car added')`.

**Технічні правила для реалізації:** помилки валідації шукати всередині `.modal-content`, тост - на рівні сторінки, щоб їх не сплутати; значення пробігу перевіряти як рядок (`toHaveValue('12000')`), кількість автомобілів через `toHaveCount`. ASSUMPTION: seed - tests/seed.spec.ts.

**RISK:** локатор Log out не в вимогах і не перевірений у CLI (сценарій 7.1). QUESTION AC-Q1, AC-Q2, AC-Q3 винесені в розділ "Open questions" і не автоматизуються. Файл specs/add-car.md залишено для домашньої роботи і не змінювався.

## Test Scenarios

### 1. Навігація та відкриття модального вікна (AC-P1..P2, AC-N1..N4)

**Seed:** `tests/seed.spec.ts`

#### 1.1. N-01 Guest log in веде до Garage, Add car відкриває і закриває модальне вікно

**File:** `tests/add-car/navigation.spec.ts`

**Precondition:** свіжий контекст із project config; сесії немає.

**Steps:**
  1. Відкрити головну сторінку. Порахувати кнопки 'Guest log in' у хедері.
    - expect: Кнопка 'Guest log in' присутня в єдиному екземплярі (AC-N1).
  2. Натиснути 'Guest log in'.
    - expect: URL дорівнює /panel/garage (AC-N2).
    - expect: Гараж порожній: текст 'You don't have any cars in your garage', жодного li.car-item (AC-P3).
    - expect: Видно банер 'Logged in as guest, any changes will be lost!' (AC-P4).
  3. Натиснути 'Add car'.
    - expect: Відкрито модальне вікно із заголовком 'Add a car' (AC-N3).
    - expect: URL залишився /panel/garage (AC-N4).
  4. Закрити вікно через Cancel.
    - expect: Вікно закрито; URL залишився /panel/garage (AC-N4).

#### 1.2. N-02 Пряме відкриття /panel/garage без сесії переадресовує на /

**File:** `tests/add-car/navigation.spec.ts`

**Precondition:** новий контекст із project config (Basic Auth), без гостьової сесії.

**Steps:**
  1. Напряму відкрити /panel/garage.
    - expect: Відбувається переадресація на / (AC-P2).

#### 1.3. N-03 (негативний) Без Basic-креденшелів сервер відповідає 401

**File:** `tests/add-car/navigation.spec.ts`

**Precondition:** окремий контекст, у якому httpCredentials з project config перевизначено порожніми (ASSUMPTION; не використовувати seed, якщо він застосовує httpCredentials).

**Steps:**
  1. Відкрити стенд.
    - expect: Відповідь 401, сторінка не відкривається (AC-P1). RISK: `page.goto` повертає 401 лише якщо запит автентифікації не відхилено іншим шляхом; статус перевіряти через відповідь навігації.

### 2. Форма: структура, значення за замовчуванням, скидання (AC-F1..F3)

**Seed:** `tests/seed.spec.ts`

**Precondition для 2.1-2.3:** свіжа гостьова сесія, порожній гараж.

#### 2.1. F-01 Початковий стан форми Audi / TT / порожній Mileage

**File:** `tests/add-car/form-defaults.spec.ts`

**Steps:**
  1. Guest log in (Setup), натиснути 'Add car'.
    - expect: Форма містить три поля: Brand (#addCarBrand), Model (#addCarModel), Mileage (#addCarMileage) та три керуючі елементи: Add (button.btn-primary), Cancel (button.btn-secondary), x (button.close). Селектори з вимог; ролі й підписи підтверджені в CLI.
    - expect: Brand = Audi, Model = TT (AC-F1), Mileage порожнє.
    - expect: У Brand і Model немає порожнього варіанта (AC-F1, AC-V5).
    - expect: Кнопка Add `disabled` без жодної взаємодії з полями (AC-V1, AC-V6; FACT з CLI).

#### 2.2. F-02 Зміна Brand перебудовує Model і скидає на першу модель

**File:** `tests/add-car/form-defaults.spec.ts`

**Steps:**
  1. Відкрити форму. У Brand обрати BMW.
    - expect: Список Model = 3, 5, X5, X6, Z3; обрано '3' (AC-F2).
  2. Обрати Model X5, потім змінити Brand на Ford.
    - expect: Model скинуто на 'Fiesta' - першу модель Ford (AC-F2).

#### 2.3. F-03 Повторне відкриття форми скидає всі поля (Cancel і x)

**File:** `tests/add-car/form-defaults.spec.ts`

**Steps:**
  1. Відкрити форму, обрати Brand Porsche, Model Cayenne, ввести Mileage 500, закрити через Cancel.
    - expect: Модальне вікно закрито.
  2. Знову натиснути 'Add car'.
    - expect: Brand = Audi, Model = TT, Mileage порожнє (AC-F3).
  3. Повторити кроки 1-2, закриваючи вікно через x.
    - expect: Після повторного відкриття поля знову за замовчуванням (AC-F3).

### 3. Валідація Mileage (AC-V1..V6)

**Seed:** `tests/seed.spec.ts`

**Precondition для 3.1-3.5:** свіжа гостьова сесія, відкрита форма 'Add a car'. Помилки валідації з'являються після blur: перед перевіркою `is-invalid` і тексту завжди натискати Tab (FACT з CLI). Текст помилки шукати всередині `.modal-content`.

#### 3.1. V-01 Порожній Mileage: is-invalid, повідомлення, Add disabled

**File:** `tests/add-car/mileage-validation.spec.ts`

**Steps:**
  1. Відкрити форму, нічого не вводити.
    - expect: Кнопка Add `disabled` без взаємодії (AC-V1, AC-V6; FACT).
  2. Клацнути в Mileage і прибрати фокус клавішею Tab, нічого не вводячи.
    - expect: #addCarMileage має клас is-invalid (AC-V1).
    - expect: Під полем `p` всередині .modal-content з текстом 'Mileage cost required' (AC-V1).
    - expect: Add disabled (AC-V1, AC-V6).
  3. Другий випадок: ввести 5, стерти значення, натиснути Tab.
    - expect: Ті самі три перевірки, що й у кроці 2 (AC-V1).

#### 3.2. V-02 Валідні межі 0 і 999999 (параметризований за значеннями 0 і 999999)

**File:** `tests/add-car/mileage-validation.spec.ts`

**Steps:**
  1. Для кожного значення з набору [0, 999999]: відкрити форму, ввести значення, натиснути Tab.
    - expect: Немає is-invalid; у .modal-content немає тексту помилки; Add enabled (AC-V2, AC-V6).

#### 3.3. V-03 Значення поза діапазоном 1000000 і -1 відхиляються

**File:** `tests/add-car/mileage-validation.spec.ts`

**Steps:**
  1. Ввести 1000000, натиснути Tab.
    - expect: is-invalid; текст 'Mileage has to be from 0 to 999999'; Add disabled (AC-V3, AC-V6).
  2. Замінити значення на -1, натиснути Tab.
    - expect: is-invalid; текст 'Mileage has to be from 0 to 999999'; Add disabled (AC-V3, AC-V6).
  3. Замінити значення на 999999, натиснути Tab.
    - expect: Стан помилки зникає, Add enabled (AC-V2, AC-V6).

#### 3.4. V-04 Нечислове введення не приймається

**File:** `tests/add-car/mileage-validation.spec.ts`

**Steps:**
  1. Клацнути в Mileage і ввести текст 'abc' посимвольно (клавіатурне введення, наприклад `pressSequentially`; RISK: `fill('abc')` на number-полі кидає помилку). Натиснути Tab.
    - expect: Значення поля залишається порожнім: `toHaveValue('')` (AC-V4).
    - expect: Спрацьовує AC-V1: is-invalid, 'Mileage cost required', Add disabled.

#### 3.5. V-05 Add активна тоді й лише тоді, коли форма валідна (зведена перевірка стану)

**File:** `tests/add-car/mileage-validation.spec.ts`

**Steps:**
  1. Пройти послідовність значень: порожнє → 5 → -1 → 0 → порожнє (після кожної зміни Tab).
    - expect: Add enabled лише для 5 і 0, disabled для решти станів (AC-V6). Сценарій зводить стани AC-V6 в одну послідовність; окремі значення детально перевіряються в 3.1-3.3.

### 4. Довідник брендів і моделей (AC-D1, AC-D2)

**Seed:** `tests/seed.spec.ts`

**Precondition для 4.1-4.2:** свіжа гостьова сесія, відкрита форма 'Add a car'.

#### 4.1. D-01 Список брендів фіксований (5 позицій)

**File:** `tests/add-car/reference-data.spec.ts`

**Steps:**
  1. Прочитати опції Brand.
    - expect: Рівно 5 опцій, набір: Audi, BMW, Ford, Porsche, Fiat (AC-D1). Порядок не перевіряється; ASSUMPTION: порядок як у довіднику не є вимогою AC-D1 (з вимог відомий лише Audi як значення за замовчуванням).

#### 4.2. D-02 Моделі кожного бренду відповідають довіднику

**File:** `tests/add-car/reference-data.spec.ts`

**Steps:**
  1. Для кожного з 5 брендів обрати його та прочитати опції Model.
    - expect: Audi: TT, R8, Q7, A6, A8; BMW: 3, 5, X5, X6, Z3; Ford: Fiesta, Focus, Fusion, Mondeo, Sierra; Porsche: 911, Cayenne, Panamera; Fiat: Palio, Ducato, Panda, Punto, Scudo (AC-D2).
    - expect: Кожна модель належить лише одному бренду; моделей іншого бренду в списку немає (AC-D2).

### 5. Успішне збереження та стан списку (AC-S1..S3, AC-L1..L6)

**Seed:** `tests/seed.spec.ts`

**Precondition для 5.1-5.6:** свіжа гостьова сесія, порожній гараж. Тост 'Car added' перевіряється лише в 5.1 (у 5.2-5.6 може бути кілька тостів одночасно, що порушить strict mode).

#### 5.1. S-01 Створення BMW X5 з пробігом 12000

**File:** `tests/add-car/save.spec.ts`

**Steps:**
  1. Guest log in (Setup), натиснути 'Add car'.
    - expect: Форма відкрита.
  2. Обрати Brand BMW, Model X5.
    - expect: Обрано BMW / X5.
  3. Ввести Mileage 12000.
    - expect: Add enabled.
  4. Натиснути Add і одразу перевірити тост.
    - expect: Показано `getByText('Car added')` (AC-S2; FACT: `<p>` поза .modal-content, зникає приблизно за хвилину).
    - expect: Вузол .modal-content зникає з DOM - ознака успіху (AC-S1, AC-S3). URL ознакою успіху не є (AC-S3).
    - expect: У списку 1 елемент li.car-item: `toHaveCount(1)` (AC-L1, AC-L5).
    - expect: p.car_name = 'BMW X5' (один пробіл) (AC-L2).
    - expect: input.update-mileage-form_input у картці: `toHaveValue('12000')` (AC-L3).

#### 5.2. S-02 Новий автомобіль додається на початок списку, лічильник +1

**File:** `tests/add-car/save.spec.ts`

**Steps:**
  1. Setup: створити Audi TT з пробігом 100 через UI.
    - expect: `toHaveCount(1)` для li.car-item (AC-L5).
  2. Створити Ford Focus з пробігом 200.
    - expect: `toHaveCount(2)` (AC-L5).
    - expect: Перший li.car-item - 'Ford Focus' з 200, другий - 'Audi TT' зі 100 (AC-L4, AC-L2, AC-L3).

#### 5.3. S-03a Створення з Mileage 0

**File:** `tests/add-car/save.spec.ts`

**Steps:**
  1. Створити Fiat Panda з Mileage 0.
    - expect: Автомобіль створено, вікно закрито (AC-S1, AC-V2); картка показує `toHaveValue('0')` (AC-L3).

#### 5.4. S-03b Створення з Mileage 999999

**File:** `tests/add-car/save.spec.ts`

**Steps:**
  1. Створити Porsche 911 з Mileage 999999.
    - expect: Автомобіль створено, вікно закрито (AC-S1, AC-V2); картка показує `toHaveValue('999999')` (AC-L3).

#### 5.5. S-04 Дублікати дозволені: два BMW X5

**File:** `tests/add-car/save.spec.ts`

**Steps:**
  1. Двічі створити BMW X5 з пробігом 12000 (обидва створення - предмет перевірки).
    - expect: У списку два окремі li.car-item з 'BMW X5' (AC-L6).
    - expect: Кількість зросла на 1 після кожного створення (AC-L5).
    - RISK: AC-Q2 не підтверджено, очікуваний результат може змінитися після рішення власника продукту; тест фіксує поточну поведінку за AC-L6.

#### 5.6. S-05 Після збереження автомобіль з'являється на початку списку з картки (AC-L4)

**File:** `tests/add-car/save.spec.ts`

**Steps:**
  1. Setup: створити Audi TT (100). Створити BMW X5 (12000).
    - expect: Перший li.car-item - 'BMW X5' (AC-L4).

### 6. Скасування (AC-C1, AC-C2)

**Seed:** `tests/seed.spec.ts`

**Precondition для 6.1-6.3:** свіжа гостьова сесія, порожній гараж.

#### 6.1. C-01 Cancel закриває вікно без створення автомобіля

**File:** `tests/add-car/cancel.spec.ts`

**Steps:**
  1. Відкрити форму, заповнити валідні Brand/Model/Mileage, натиснути Cancel (button.btn-secondary).
    - expect: Модальне вікно закрито (.modal-content відсутній).
    - expect: Кількість li.car-item не змінилась, гараж порожній (AC-C1).

#### 6.2. C-02 x поводиться як Cancel

**File:** `tests/add-car/cancel.spec.ts`

**Steps:**
  1. Відкрити форму, заповнити валідні дані, натиснути x (button.close).
    - expect: Вікно закрито, автомобіль не створено, кількість елементів не змінилась (AC-C2).

#### 6.3. C-03 Cancel при наявному автомобілі не змінює список

**File:** `tests/add-car/cancel.spec.ts`

**Steps:**
  1. Setup: створити BMW X5 через UI.
    - expect: У списку 1 li.car-item.
  2. Відкрити форму, натиснути Cancel.
    - expect: У списку залишається 1 li.car-item 'BMW X5' (AC-C1).

### 7. Ізоляція гостьової сесії (AC-P3, AC-P4)

**Seed:** `tests/seed.spec.ts`

#### 7.1. P-01 Після Log out і повторного Guest log in гараж порожній

**File:** `tests/add-car/guest-isolation.spec.ts`

**Precondition:** новий контекст, сесії немає.

**Steps:**
  1. Guest log in, Setup: створити BMW X5 з пробігом 12000.
    - expect: Автомобіль у списку; видно банер 'Logged in as guest, any changes will be lost!' (AC-P4).
  2. Виконати Log out, потім знову 'Guest log in'.
    - expect: Гараж порожній: 'You don't have any cars in your garage', жодного li.car-item (AC-P3, AC-P4).
    - RISK: локатор Log out відсутній у вимогах і не перевірений у CLI; підтвердити через Playwright CLI перед написанням тесту.

#### 7.2. P-02 Дані однієї гостьової сесії не видно в іншій

**File:** `tests/add-car/guest-isolation.spec.ts`

**Precondition:** два незалежні контексти браузера, A і B, кожен із project config.

**Steps:**
  1. У контексті A виконати Guest log in, Setup: створити BMW X5.
    - expect: У контексті A у списку 1 li.car-item.
  2. У контексті B виконати Guest log in.
    - expect: У B гараж порожній: 'You don't have any cars in your garage', жодного li.car-item (AC-P3).
    - expect: У B є банер про втрату змін (AC-P4).

## Open questions (не автоматизуються, без file/steps)

- **QUESTION AC-Q1.** Mileage приймає дробові значення: 1.5 проходить валідацію й зберігається як 1.5, атрибута step немає. Чи це очікувана поведінка, чи потрібне обмеження "лише цілі числа" - рішення власника продукту. Очікуваного результату немає, статус passed/failed не присвоюється.
- **QUESTION AC-Q2.** Чи навмисно дозволені дублікати BMW X5 (див. RISK у 5.5).
- **QUESTION AC-Q3.** Одиниця 'km' ніде не валідується і не зберігається окремо; очікуваної поведінки немає.
