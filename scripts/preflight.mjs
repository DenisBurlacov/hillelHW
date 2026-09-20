import { existsSync, readFileSync } from 'node:fs';
import process from 'node:process';
import { spawnSync } from 'node:child_process';

const required = [
  'package.json',
  'tsconfig.json',
  'playwright.config.ts',
  'tests/guest-garage.spec.ts',
  'specs/guest-garage.md',
  'requirements/instructions-search-requirement.md',
  'requirements/instructions-search.png',
  'AGENTS.md'
];

const missing = required.filter((path) => !existsSync(path));
const cliCheck = spawnSync('npx', ['--no-install', 'playwright', 'cli', '--version'], {
  encoding: 'utf8',
  shell: process.platform === 'win32'
});
const cliVersion = cliCheck.status === 0 ? cliCheck.stdout.trim() : null;
const cliBrowserCheck = cliVersion
  ? spawnSync('npx', ['--no-install', 'playwright', 'cli', 'install-browser', 'chromium', '--dry-run'], {
      encoding: 'utf8',
      shell: process.platform === 'win32'
    })
  : null;
const cliBrowserPath = cliBrowserCheck?.status === 0
  ? cliBrowserCheck.stdout.match(/Install location:\s+(.+)/)?.[1]?.trim()
  : null;
const cliBrowserReady = Boolean(cliBrowserPath && existsSync(cliBrowserPath));
let cliConfigReady = false;
let cliCredentialsReady = false;

if (existsSync('.playwright/cli.config.json')) {
  try {
    const config = JSON.parse(readFileSync('.playwright/cli.config.json', 'utf8'));
    const credentials = config?.browser?.contextOptions?.httpCredentials;
    cliCredentialsReady = Boolean(
      credentials?.username &&
      credentials?.password &&
      !String(credentials.username).startsWith('REPLACE_') &&
      !String(credentials.password).startsWith('REPLACE_')
    );
    cliConfigReady = cliCredentialsReady;
  } catch {
    cliConfigReady = false;
  }
}

console.log(`Node: ${process.version}`);
console.log(`Platform: ${process.platform} ${process.arch}`);
console.log(`QAuto base URL: ${process.env.QAUTO_BASE_URL ?? 'default public URL from config'}`);
console.log(`HTTP credentials configured: ${cliCredentialsReady}`);
console.log(`Playwright CLI: ${cliVersion ?? 'MISSING — run npm ci before agent-browser inspection'}`);
console.log(`Playwright CLI Chromium ready: ${cliBrowserReady}`);
console.log(`Playwright CLI config ready: ${cliConfigReady}`);

if (missing.length > 0) {
  console.error(`Missing course project files: ${missing.join(', ')}`);
  process.exitCode = 1;
} else {
  console.log('Course project structure: OK');
}
