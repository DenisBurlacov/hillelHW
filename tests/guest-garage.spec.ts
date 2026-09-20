import { test, expect } from '@playwright/test';
import { MainPage } from '../pages/main.page';
import { GaragePage } from '../pages/garage.page';

test('guest can open Garage', async ({ page }) => {
  await new MainPage(page).openAsGuest();
  await expect(page).toHaveURL(/panel\/garage/);
  await expect(new GaragePage(page).garageHeading).toBeVisible();
});
