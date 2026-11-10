import { expect, Locator, Page } from '@playwright/test';

export class HomePage {
  private readonly page: Page;
  private readonly appLauncherButton: Locator;
  private readonly appLauncherSearch: Locator;
  private readonly profileButton: Locator;
  private readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.appLauncherButton = page.getByRole('button', { name: 'App Launcher' });
    this.appLauncherSearch = page.getByPlaceholder('Search apps and items...');
    this.profileButton = page
      .getByRole('button', { name: /View profile/i })
      .or(page.locator('.branding-userProfile-button'));
    this.logoutLink = page
      .getByRole('link', { name: 'Log Out' })
      .or(page.getByRole('menuitem', { name: 'Log Out' }));
  }

  async expectLoaded(): Promise<void> {
    await expect(this.appLauncherButton).toBeVisible({ timeout: 60_000 });
  }

  async openApp(name: string, fallbackPath?: string): Promise<void> {
    await this.page
      .waitForLoadState('networkidle', { timeout: 15_000 })
      .catch(() => undefined);

    try {
      await this.appLauncherButton.click();
      const search = this.appLauncherSearch.first();
      await search.waitFor({ state: 'visible', timeout: 30_000 });

      try {
        await search.fill(name, { timeout: 10_000 });
      } catch {
        await search.click();
        await this.page.keyboard.type(name, { delay: 40 });
      }

      const option = this.page
        .getByRole('option', { name, exact: true })
        .first();
      await option.waitFor({ state: 'visible', timeout: 15_000 });
      await option.click();
      return;
    } catch (error) {
      if (!fallbackPath) {
        throw error;
      }
    }

    await this.page.goto(fallbackPath, { waitUntil: 'domcontentloaded' });
  }

  async logout(): Promise<void> {
    await this.profileButton.first().click();
    await this.logoutLink.first().click();
  }
}
