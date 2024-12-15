import { Page, Locator, expect } from '@playwright/test';
import { genericsErrorMessagge } from '../data-test/messages-data';

export class ToDoPage {
  readonly page: Page;
  readonly entityCreateButton: Locator;
  readonly refreshList: Locator;
  
  readonly titleNewEntity: Locator;
  readonly descriptionNewEntity: Locator;
  readonly folderSelectable: Locator;
  readonly saveNewEntity: Locator;
  readonly alertMessage: Locator;
  readonly deleteRow: Locator;
  readonly confirmDelete: Locator;
  readonly editRow: Locator;


  constructor(page: Page) {
    this.page = page;
    this.entityCreateButton = page.locator('[data-cy="entityCreateButton"]');
    this.refreshList = page.locator('#to-do-item-heading > div > button');
    
    this.titleNewEntity = page.locator('[data-cy="title"]');
    this.descriptionNewEntity = page.locator('[data-cy="description"]');
    this.folderSelectable = page.locator('[data-cy="folder"]');
    this.saveNewEntity = page.locator('[data-cy="entityCreateSaveButton"]');
    this.alertMessage = page.locator('[role="alert"]');
    this.deleteRow = page.locator('[data-cy="entityDeleteButton"]');
    this.confirmDelete = page.locator('[data-cy="entityConfirmDeleteButton"]');
    this.editRow = page.locator('[data-cy="entityEditButton"]');
  }

  async goto() {
    await this.page.goto('https://qa-challenge.ensolvers.com/to-do-item');
    await this.page.waitForNavigation({ timeout: 1000 });
  }

  async orderDescElements() {
    await this.page.goto('https://qa-challenge.ensolvers.com/to-do-item?page=1&sort=id,desc'); 
  }

  async create(title: string, description: string, folder: string = '') {
    await this.entityCreateButton.click()
    await this.folderSelectable.selectOption({label: folder})
    await Promise.all([
        this.folderSelectable.selectOption({ label: folder }),
        this.page.waitForLoadState('networkidle') 
    ]); 
    await this.titleNewEntity.fill(title)
    await this.descriptionNewEntity.fill(description)
    await this.saveNewEntity.click()
    await this.page.waitForNavigation({ timeout: 3000 });
  }

  async getToDoDetailsByName(taskName: string) {
    const row = this.page.locator(`table tr:has(td:text("${taskName}"))`).first();
    const id = await row.locator('td:nth-child(1) a').innerText();
    const title = await row.locator('td:nth-child(2)').innerText();
    const description = await row.locator('td:nth-child(3)').innerText();
    const folder = await row.locator('td:nth-child(4)').innerText();
    return { id, title, description, folder };
  }

  async deleteTaskByName(taskName: string) {
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            attempt++;
            await this.tryDeleteRow(taskName);
            return; 
        } catch (error) {
            if (attempt >= maxRetries) {
                throw new Error(`Failed to delete the task after ${maxRetries} attempts.`);
            }
        }
    }
  }

  private async tryDeleteRow(taskName: string) {
      await expect(this.refreshList).toBeEnabled();
      await this.refreshList.click();
      const row = this.page.locator(`table tr:has(td:text("${taskName}"))`).first();
      await row.locator(this.deleteRow).click();
      await this.confirmDelete.click();
      await expect(this.page.locator(`table tr:has(td:text("${taskName}"))`)).toHaveCount(0, {timeout: 3000});
  }

  
  async validateRemove(taskName: string) {
    const row = this.page.locator(`table tr:has(td:text("${taskName}"))`)
    await expect(row).toHaveCount(0);
  }

  async editTaskByName(taskName: string, newTaskName: string = '-', newDescription: string = '-', newFolder: string = '-') {
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            attempt++;
            await this.tryEditRow(taskName, newTaskName, newDescription, newFolder);
            return;
        } catch (error) {
            if (attempt >= maxRetries) {
                throw new Error(`Failed to edit the task after ${maxRetries} attempts.`);
            }
        }
    }
  }

  private async tryEditRow(taskName: string, newTaskName: string, newDescription: string, newFolder: string) {
      await expect(this.refreshList).toBeEnabled();
      await this.refreshList.click();
      await expect(this.refreshList).toBeEnabled();

      const row = this.page.locator(`table tr:has(td:text("${taskName}"))`).first();
      await row.locator(this.editRow).click();
      await this.page.waitForLoadState('networkidle') 
      await expect(this.titleNewEntity).toBeVisible();

      await this.updateField(this.titleNewEntity, newTaskName);
      await this.updateField(this.descriptionNewEntity, newDescription);
      await this.updateDropdown(this.folderSelectable, newFolder);

      await this.saveNewEntity.click();
  }

  private async updateField(field: Locator, newValue: string) {
      if (newValue !== '-') {
          await field.clear();
          await field.fill(newValue);
          await expect(field).toHaveValue(newValue);
      }
  }

  private async updateDropdown(dropdown: Locator, visibleText: string) {
      if (visibleText !== '-') {
          await dropdown.selectOption({ label: visibleText });
          await expect(dropdown).toHaveValue(visibleText);
      }
  }

  async errorExcpected(errorIsExpected: boolean, expectedMessage: string = '', notExpectedMessage: string = '') {
    if (errorIsExpected) {
        await expect(this.alertMessage).not.toContainText(notExpectedMessage);
        const actualErrorMessage = await this.alertMessage.textContent();
        expect(genericsErrorMessagge).not.toContain(actualErrorMessage);
        expect(actualErrorMessage?.trim().length).toBeGreaterThan(0);
        await this.alertMessage.click()
    } else {
        await expect(this.alertMessage).toContainText(expectedMessage);
        await this.alertMessage.click()
    }
  }
}
