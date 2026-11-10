import { expect, Locator, Page } from '@playwright/test';

export class LoginPage {
  private readonly page: Page;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly verifyHeading: Locator;
  private readonly verificationCodeInput: Locator;
  private readonly verifyButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#Login');
    this.errorMessage = page.locator('#error');
    this.verifyHeading = page.getByRole('heading', {
      name: 'Verify Your Identity',
    });
    this.verificationCodeInput = page
      .getByRole('textbox', { name: 'Verification Code' })
      .or(page.locator('#emc, input[name="emc"]'));
    this.verifyButton = page.getByRole('button', { name: 'Verify' });
  }

  async goto(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  async login(username: string, password: string): Promise<void> {
    const alreadyAuthenticated = await this.usernameInput
      .waitFor({ state: 'visible', timeout: 15_000 })
      .then(() => false)
      .catch(() => true);
    if (alreadyAuthenticated) {
      return;
    }

    await this.usernameInput.fill(username);

    if (!(await this.passwordInput.isVisible().catch(() => false))) {
      await this.loginButton.click();
    }

    await expect(this.passwordInput).toBeVisible({ timeout: 30_000 });
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async completeIdentityVerification(
    code: string,
    manualTimeoutMs: number,
  ): Promise<void> {
    const prompted = await this.verifyHeading
      .waitFor({ state: 'visible', timeout: 15_000 })
      .then(() => true)
      .catch(() => false);
    if (!prompted) {
      return;
    }

    if (code) {
      await this.verificationCodeInput.first().fill(code);
      await this.verifyButton.first().click();
    } else {
      await this.verifyHeading.waitFor({
        state: 'hidden',
        timeout: manualTimeoutMs,
      });
    }
  }

  async expectLoginError(): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
  }
}
