// spec: specs/add-car-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { MainPage } from '../pages/main.page';
import { GaragePage } from '../pages/garage.page';

test.describe('Успішне збереження та стан списку', () => {
  let garage: GaragePage;

  test.beforeEach(async ({ page }) => {
    garage = new GaragePage(page);
    await new MainPage(page).openAsGuest();
    await expect(page).toHaveURL(/\/panel\/garage/);
    await expect(garage.carItems).toHaveCount(0);
  });

  test('S-01 Створення BMW X5 з пробігом 12000', async () => {
    // 1. Натиснути 'Add car'
    await garage.openAddCarForm();
    await expect(garage.addCarHeading).toBeVisible();

    // 2. Обрати Brand BMW, Model X5
    await garage.chooseBrand('BMW');
    await garage.chooseModel('X5');

    // 3. Ввести Mileage 12000
    await garage.fillMileage('12000');
    await expect(garage.submitButton).toBeEnabled();

    // 4. Натиснути Add і одразу перевірити тост (AC-S1, AC-S2, AC-S3, AC-L1..L3, AC-L5)
    await garage.submit();
    await expect(garage.carAddedMessage).toBeVisible();
    await expect(garage.modal).toHaveCount(0);

    await expect(garage.carItems).toHaveCount(1);
    // єдиний елемент у списку, first() лише вибирає його картку
    const car = garage.carItems.first();
    await expect(garage.carName(car)).toHaveText('BMW X5');
    await expect(garage.carMileage(car)).toHaveValue('12000');
  });

  test('S-02 Новий автомобіль додається на початок списку, лічильник +1', async () => {
    // 1. Setup: створити Audi TT з пробігом 100
    await garage.addCar('Audi', 'TT', '100');
    await expect(garage.carItems).toHaveCount(1);

    // 2. Створити Ford Focus з пробігом 200
    await garage.addCar('Ford', 'Focus', '200');
    await expect(garage.carItems).toHaveCount(2);
    // позиція в списку і є предметом перевірки (AC-L4): nth(0) - новий, nth(1) - попередній
    const newest = garage.carItems.nth(0);
    const previous = garage.carItems.nth(1);
    await expect(garage.carName(newest)).toHaveText('Ford Focus');
    await expect(garage.carMileage(newest)).toHaveValue('200');
    await expect(garage.carName(previous)).toHaveText('Audi TT');
    await expect(garage.carMileage(previous)).toHaveValue('100');
  });

  test('S-03a Створення з Mileage 0', async () => {
    // 1. Створити Fiat Panda з Mileage 0
    await garage.addCar('Fiat', 'Panda', '0');
    await expect(garage.carItems).toHaveCount(1);
    // єдиний елемент у списку, first() лише вибирає його картку
    const car = garage.carItems.first();
    await expect(garage.carName(car)).toHaveText('Fiat Panda');
    await expect(garage.carMileage(car)).toHaveValue('0');
  });

  test('S-03b Створення з Mileage 999999', async () => {
    // 1. Створити Porsche 911 з Mileage 999999
    await garage.addCar('Porsche', '911', '999999');
    await expect(garage.carItems).toHaveCount(1);
    // єдиний елемент у списку, first() лише вибирає його картку
    const car = garage.carItems.first();
    await expect(garage.carName(car)).toHaveText('Porsche 911');
    await expect(garage.carMileage(car)).toHaveValue('999999');
  });

  test('S-04 Дублікати дозволені: два BMW X5', async () => {
    // 1. Двічі створити BMW X5 з пробігом 12000 (RISK: AC-Q2 не підтверджено)
    await garage.addCar('BMW', 'X5', '12000');
    await expect(garage.carItems).toHaveCount(1);
    await garage.addCar('BMW', 'X5', '12000');
    await expect(garage.carItems).toHaveCount(2);
    await expect(garage.carNames).toHaveText(['BMW X5', 'BMW X5']);
  });
});
