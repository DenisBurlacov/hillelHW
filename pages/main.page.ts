import type { Locator, Page } from '@playwright/test';

export class MainPage {
  readonly guestLogInButton: Locator;

  constructor(private readonly page: Page) {
    this.guestLogInButton = page.getByRole('button', { name: 'Guest log in' });
  }

  async openAsGuest() {
    await this.page.goto('/');
    await this.guestLogInButton.click();
  }
}
