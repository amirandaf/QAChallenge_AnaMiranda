import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameField = page.locator('[data-cy="username"]');
    this.passwordField = page.locator('[data-cy="password"]');
    this.loginButton = page.locator('[data-cy="submit"]');
    this.errorMessage = page.locator('.alert').first();
  }

  async goto() {
    await this.page.goto('https://qa-challenge.ensolvers.com/login');
  }

  async login(username: string, password: string) {
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    await this.loginButton.click();

    try {
      await this.page.waitForNavigation({ timeout: 1000 });
    } catch (error) {}
  }

  async assertMessage(expectedMessage: string) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedMessage);
  }
}
