import { test, expect } from '@playwright/test';
import { ToDoPage } from '../pages/to-do';
import { LoginPage } from '../pages/login';;
import { validLoginData } from '../data-test/login-data';
import { validToDoData } from '../data-test/to-do-data'
import { succesMessageToCreateTask } from '../data-test/messages-data';
import { FolderPage } from '../pages/folder';
import { succesMessageToValidFolder } from '../data-test/messages-data'

test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page)
    await login.goto()
    await login.login(validLoginData.username, validLoginData.password)
});

test('Positive - create folder and task with this folder', async ({ page }) => {
    const genericFolderName = `folder-${Math.random().toString(36).substring(2, 16)}`;
    const folder = new FolderPage(page);
    const toDo = new ToDoPage(page);

    await folder.goto();
    await folder.create(genericFolderName);
    const folderDetails = await folder.getFolderDetailsByName(genericFolderName);
    expect(folderDetails.name).toBe(genericFolderName);
    await folder.errorExcpected(false, succesMessageToValidFolder);

    await toDo.goto();
    await toDo.create(validToDoData.title, validToDoData.description, folderDetails.id);
    await toDo.errorExcpected(false, succesMessageToCreateTask);
    await toDo.orderDescElements();
    
    
    const toDoDetails = await toDo.getToDoDetailsByName(validToDoData.title);
    expect(toDoDetails.title).toBe(validToDoData.title);
    expect(toDoDetails.description).toBe(validToDoData.description);
    expect(toDoDetails.folder).toBe(folderDetails.id);

    await page.goto(`https://qa-challenge.ensolvers.com/folder/${folderDetails.id}`);
    await folder.validateView({ id: folderDetails.id, name: folderDetails.name });

});