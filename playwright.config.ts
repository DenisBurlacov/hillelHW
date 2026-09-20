import { existsSync, readFileSync } from 'node:fs';
import { defineConfig, devices } from '@playwright/test';

type HttpCredentials = { username: string; password: string };

function readCliHttpCredentials(): HttpCredentials | undefined {
  const path = '.playwright/cli.config.json';
  if (!existsSync(path)) return undefined;

  try {
    const config = JSON.parse(readFileSync(path, 'utf8'));
    const credentials = config?.browser?.contextOptions?.httpCredentials;
    return credentials?.username && credentials?.password
      ? { username: credentials.username, password: credentials.password }
      : undefined;
  } catch {
    return undefined;
  }
}

const cliHttpCredentials = readCliHttpCredentials();

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: 1,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: process.env.QAUTO_BASE_URL ?? 'https://qauto.forstudy.space',
    httpCredentials: cliHttpCredentials,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]
});
