import { expect, Page } from '@playwright/test';

export class AccountsPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async clickNew(): Promise<void> {
    await this.page.getByRole('button', { name: 'New', exact: true }).click();
    await expect(this.page.getByRole('heading', { name: 'New Account' })).toBeVisible({
      timeout: 30_000,
    });
  }

  async selectPersonAccountRecordType(): Promise<void> {
    const next = this.page.getByRole('button', { name: 'Next', exact: true });
    const pickerVisible = await next
      .waitFor({ state: 'visible', timeout: 20_000 })
      .then(() => true)
      .catch(() => false);
    if (!pickerVisible) {
      return;
    }

    const personAccountRadio = this.page
      .getByRole('radio', { name: 'Person Account' })
      .first();
    const personAccountLabel = this.page
      .locator('label', { hasText: 'Person Account' })
      .first();

    if (await personAccountRadio.count()) {
      await personAccountRadio.check({ force: true }).catch(async () => {
        await personAccountLabel.click();
      });
    }

    await next.click();
    await next.waitFor({ state: 'hidden', timeout: 30_000 }).catch(() => undefined);
  }
}
