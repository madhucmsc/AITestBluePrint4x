import 'dotenv/config';
import fs from 'fs';
import { defineConfig, devices } from '@playwright/test';
import { authStateFile } from './src/config/paths';

const chromeLaunchOptions = { args: ['--start-maximized'] };
const savedAuthState = fs.existsSync(authStateFile) ? authStateFile : undefined;

export default defineConfig({
  testDir: './tests',
  timeout: 600_000,
  expect: { timeout: 20_000 },
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.SF_BASE_URL,
    headless: (process.env.HEADLESS ?? 'true').toLowerCase() !== 'false',
    actionTimeout: 30_000,
    navigationTimeout: 60_000,
    ignoreHTTPSErrors: true,
    storageState: savedAuthState,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        launchOptions: chromeLaunchOptions,
      },
    },
    {
      name: 'Google Chrome',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        viewport: { width: 1920, height: 1080 },
        launchOptions: chromeLaunchOptions,
      },
    },
  ],
});
