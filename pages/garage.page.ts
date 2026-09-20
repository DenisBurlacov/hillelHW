import { expect, type Locator, type Page } from '@playwright/test';

export class GaragePage {
  readonly garageHeading: Locator;
  readonly addCarButton: Locator;
  readonly addCarHeading: Locator;
  readonly brandSelect: Locator;
  readonly modelSelect: Locator;
  readonly mileageInput: Locator;
  readonly submitButton: Locator;
  readonly modal: Locator;
  readonly carAddedMessage: Locator;
  readonly carItems: Locator;
  readonly carNames: Locator;

  constructor(page: Page) {
    this.garageHeading = page.getByRole('heading', { name: /garage/i });
    this.addCarButton = page.getByRole('button', { name: 'Add car' });
    this.addCarHeading = page.getByRole('heading', { name: 'Add a car' });
    this.brandSelect = page.getByLabel('Brand');
    this.modelSelect = page.getByLabel('Model');
    this.mileageInput = page.getByLabel('Mileage');
    this.submitButton = page.getByRole('button', { name: 'Add', exact: true });
    this.modal = page.locator('.modal-content');
    this.carAddedMessage = page.getByText('Car added');
    this.carItems = page.locator('li.car-item');
    this.carNames = this.carItems.locator('p.car_name');
  }

  carName(car: Locator): Locator {
    return car.locator('p.car_name');
  }

  carMileage(car: Locator): Locator {
    return car.locator('input.update-mileage-form_input');
  }

  async openAddCarForm() {
    await this.addCarButton.click();
  }

  async chooseBrand(brand: string) {
    await this.brandSelect.selectOption(brand);
  }

  async chooseModel(model: string) {
    await this.modelSelect.selectOption(model);
  }

  async fillMileage(mileage: string) {
    await this.mileageInput.fill(mileage);
  }

  async submit() {
    await this.submitButton.click();
  }

  async addCar(brand: string, model: string, mileage: string) {
    await this.openAddCarForm();
    await this.chooseBrand(brand);
    await this.chooseModel(model);
    await this.fillMileage(mileage);
    await this.submit();
    await expect(this.modal).toHaveCount(0);
  }
}
