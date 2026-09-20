import type { Locator, Page } from '@playwright/test';

export class InstructionsPage {
  readonly navLink: Locator;
  readonly brandToggle: Locator;
  readonly modelToggle: Locator;
  readonly brandItems: Locator;
  readonly modelItems: Locator;
  readonly searchButton: Locator;
  readonly cards: Locator;

  constructor(page: Page) {
    this.navLink = page.getByRole('link', { name: 'Instructions', exact: true });
    this.brandToggle = page.locator('#brandSelectDropdown');
    this.modelToggle = page.locator('#modelSelectDropdown');
    this.brandItems = page.locator('.brand-select-dropdown_item');
    this.modelItems = page.locator('.model-select-dropdown_item');
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.cards = page
      .getByRole('listitem')
      .filter({ has: page.getByRole('link', { name: 'Download' }) });
  }

  async open() {
    await this.navLink.click();
  }

  async search(brand: string, model: string) {
    await this.brandToggle.click();
    await this.brandItems.getByText(brand, { exact: true }).click();
    await this.modelToggle.click();
    await this.modelItems.getByText(model, { exact: true }).click();
    await this.searchButton.click();
  }

  results(carName: string): Locator {
    return this.cards.filter({ hasText: carName });
  }
}
