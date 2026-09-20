import { test, expect } from '@playwright/test';

test('broken lab: guest garage heading', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /guest log in/i }).click();
  await expect(page).toHaveURL(/panel\/garage/);

  // Навмисна помилка для diagnosis lab: такого heading у QAuto немає.
  await expect(page.getByRole('heading', { name: /garage archive/i })).toBeVisible();
});
