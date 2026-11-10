import { expect, Locator, Page } from '@playwright/test';
import {
  dayMonthVariants,
  escapeRegExp,
  normalizeText,
} from '../utils/dateUtils';

export interface FollowUpTask {
  subject: string;
  dueDate: string;
  comment: string;
  status: string;
  priority: string;
}

export class AccountRecordPage {
  private readonly page: Page;
  private readonly saveButton: Locator;
  private taskId = '';

  constructor(page: Page) {
    this.page = page;
    this.saveButton = page.getByRole('button', { name: 'Save', exact: true });
  }

  async fillText(label: string, value: string): Promise<void> {
    const field = this.page
      .getByLabel(new RegExp(`^\\*?\\s*${escapeRegExp(label)}$`))
      .first();
    await field.waitFor({ state: 'visible', timeout: 30_000 });
    await field.fill(value);
  }

  async selectPicklist(label: string, value: string): Promise<void> {
    await this.picklist(this.page, label, value);
  }

  async save(): Promise<void> {
    await this.saveButton.first().click();
    await expect(
      this.page.getByText(/was created\.|was saved\./),
    ).toBeVisible({ timeout: 60_000 });
  }

  async expectRecordLoaded(name: string): Promise<void> {
    await expect(
      this.page.getByText(name, { exact: false }).first(),
    ).toBeVisible({ timeout: 60_000 });
  }

  async openDetailsTab(): Promise<void> {
    await this.page
      .getByRole('tab', { name: 'Details' })
      .click({ timeout: 10_000 })
      .catch(() => undefined);
  }

  async expectFieldValue(label: string, expected: string): Promise<void> {
    const details = this.page.getByRole('tabpanel', { name: 'Details' });
    const item = details
      .getByRole('listitem')
      .filter({ hasText: label })
      .first();
    await expect(item).toBeVisible({ timeout: 15_000 });
    await expect
      .poll(async () => normalizeText(await item.innerText()), {
        timeout: 15_000,
      })
      .toContain(normalizeText(expected));
  }

  async logCallAndCreateFollowUp(comment: string): Promise<void> {
    await this.page.getByRole('button', { name: 'Log a Call' }).first().click();
    const comments = this.page.getByLabel(/^\*?\s*Comments$/).first();
    await comments.waitFor({ state: 'visible', timeout: 30_000 });
    await comments.fill(comment);

    const createFollowUp = this.page
      .getByRole('button', { name: 'Create Follow-Up Task' })
      .first();
    const hasCreateFollowUp = await createFollowUp
      .waitFor({ state: 'visible', timeout: 15_000 })
      .then(() => true)
      .catch(() => false);

    if (hasCreateFollowUp) {
      await createFollowUp.click();
    } else {
      await this.saveButton.last().click();
      await this.page.getByRole('button', { name: 'New Task' }).first().click();
    }

    await this.page
      .getByLabel(/^\*?\s*Due Date$/)
      .first()
      .waitFor({ state: 'visible', timeout: 30_000 });
  }

  async saveFollowUpTask(task: FollowUpTask): Promise<void> {
    const dueDate = this.page.getByLabel(/^\*?\s*Due Date$/).first();
    await dueDate.click();
    await dueDate.fill(task.dueDate);
    await dueDate.press('Enter');
    await this.saveButton.last().click();
    await this.page
      .getByRole('dialog')
      .last()
      .waitFor({ state: 'hidden', timeout: 30_000 })
      .catch(() => undefined);
  }

  async expectCallLogged(): Promise<void> {
    const activity = this.page.getByRole('tabpanel', { name: 'Activity' });
    await expect
      .poll(async () => (await activity.innerText()).toLowerCase(), {
        timeout: 30_000,
      })
      .toContain('logged a call with');
  }

  async openFollowUpTask(): Promise<void> {
    const taskLink = await this.resolveFollowUpTaskLink();
    const href = (await taskLink.getAttribute('href')) ?? '';
    const match = href.match(/\/lightning\/r\/(?:Task\/)?([^/]+)/);
    if (!match) {
      throw new Error(`Unable to resolve follow-up task id from href: ${href}`);
    }
    this.taskId = match[1];
    await this.page.goto(`/lightning/r/Task/${this.taskId}/view`, {
      waitUntil: 'domcontentloaded',
    });
  }

  async setFollowUpTaskDetails(task: FollowUpTask): Promise<void> {
    await this.page
      .getByRole('button', { name: 'Edit Status' })
      .first()
      .click();
    await this.setSubject(task.subject);
    await this.picklist(this.page, 'Status', task.status);
    await this.picklist(this.page, 'Priority', task.priority);
    await this.page.getByLabel(/^\*?\s*Comments$/).first().fill(task.comment);
    await this.clickInlineSave();
  }

  async expectTaskDetails(task: FollowUpTask): Promise<void> {
    const dueDateVariants = dayMonthVariants(task.dueDate);
    await expect
      .poll(
        async () => {
          const raw = await this.page.locator('body').innerText();
          const text = normalizeText(raw);
          return [
            text.includes(`status${normalizeText(task.status)}`),
            text.includes(`priority${normalizeText(task.priority)}`),
            text.includes(normalizeText(task.comment)),
            dueDateVariants.some((variant) => raw.includes(variant)),
          ].join(',');
        },
        { timeout: 30_000 },
      )
      .toBe('true,true,true,true');
  }

  private async setSubject(subject: string): Promise<void> {
    const combo = this.page
      .getByRole('combobox', { name: /^\*?\s*Subject/ })
      .first();
    if (await combo.count()) {
      await this.picklist(this.page, 'Subject', subject);
      return;
    }
    await this.fillText('Subject', subject);
  }

  private async clickInlineSave(): Promise<void> {
    const save = this.page
      .locator('button:visible', { hasText: /^Save$/ })
      .first();
    await save.click();
    await save
      .waitFor({ state: 'hidden', timeout: 30_000 })
      .catch(() => undefined);
  }

  private async resolveFollowUpTaskLink(): Promise<Locator> {
    const bySubject = this.page
      .getByRole('link', { name: '[No subject]' })
      .first();
    const subjectVisible = await bySubject
      .waitFor({ state: 'visible', timeout: 15_000 })
      .then(() => true)
      .catch(() => false);
    if (subjectVisible) {
      return bySubject;
    }

    const byEntry = this.page
      .locator('li')
      .filter({ hasText: /upcoming task with/i })
      .locator('a[href*="/lightning/r/"]')
      .first();
    await byEntry.waitFor({ state: 'visible', timeout: 30_000 });
    return byEntry;
  }

  private async picklist(
    scope: Page | Locator,
    label: string,
    value: string,
  ): Promise<void> {
    const combo = scope
      .getByRole('combobox', {
        name: new RegExp(`^\\*?\\s*${escapeRegExp(label)}`),
      })
      .first();
    await combo.waitFor({ state: 'visible', timeout: 30_000 });

    const tagName = await combo.evaluate((element) =>
      element.tagName.toLowerCase(),
    );
    if (tagName === 'select') {
      await combo.selectOption({ label: value });
      return;
    }

    await combo.click();
    await this.page
      .getByRole('option', { name: value, exact: true })
      .first()
      .click();
  }
}
