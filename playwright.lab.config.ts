import baseConfig from './playwright.config';
import { defineConfig } from '@playwright/test';

export default defineConfig({
  ...baseConfig,
  testDir: './labs',
  retries: 0,
  reporter: [['html', { open: 'never', outputFolder: 'playwright-report-lab' }], ['list']],
  use: {
    ...baseConfig.use,
    trace: 'on',
    screenshot: 'only-on-failure'
  }
});
