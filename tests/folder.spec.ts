import { test, expect } from '@playwright/test';
import { FolderPage } from '../pages/folder';
import { LoginPage } from '../pages/login';
import { validLoginData } from '../data-test/login-data';
import { folder256Name } from '../data-test/folder-data';
import { succesMessageToValidFolder, succesMessageToEditFolder, succcesMessageToDeleteFolder } from '../data-test/messages-data'
// @ts-check

test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page)
    await login.goto()
    await login.login(validLoginData.username, validLoginData.password)
});

// Crate new folder cases
test('Positive - create new folder', async ({ page }) => {
    const folderName = `folder-${Math.random().toString(36).substring(2, 16)}`;
    const folder = new FolderPage(page);
    await folder.goto();
    await folder.create(folderName);
    const folderDetails = await folder.getFolderDetailsByName(folderName);

    expect(folderDetails.name).toBe(folderName);
    await folder.errorExcpected(false, succesMessageToValidFolder)
});

test('Negative - try to create a new folder with an empty name and that the error is not generic', async ({ page }) => {
    const folder = new FolderPage(page);
    await folder.goto();
    await folder.create('');
    await folder.errorExcpected(true, '', succesMessageToValidFolder)
});

test('Negative - validate name with more than 256 characters and that the error is not generic', async ({ page }) => {
    const folder = new FolderPage(page);
    await folder.goto();
    await folder.create(folder256Name);
    await folder.errorExcpected(true, '', succesMessageToValidFolder)
});
// View folder case
test('Positive - view folder', async ({ page }) => {
    const folderName = `folder-${Math.random().toString(36).substring(2, 16)}`;
    const folder = new FolderPage(page);
    await folder.goto();
    await folder.create(folderName);
    await folder.errorExcpected(false, succesMessageToValidFolder)

    const folderDetails = await folder.getFolderDetailsByName(folderName);
    await folder.viewFolder(folderName);
    await folder.validateView(folderDetails)
});

// Delete folder case
test('Positive - delete a folder ', async ({ page }) => {
    const folderName = `folder-${Math.random().toString(36).substring(2, 16)}`;
    const folder = new FolderPage(page);
    await folder.goto();
    await folder.create(folderName);
    await folder.errorExcpected(false, succesMessageToValidFolder)
    
    await folder.deleteFolderByName(folderName);
    await folder.errorExcpected(false, succcesMessageToDeleteFolder)
    await folder.validateRemove(folderName)
});

// Edit folder cases
test('Positive - edit a folder ', async ({ page }) => {
    const folderName = `folder-${Math.random().toString(36).substring(2, 16)}`;
    const folder = new FolderPage(page);
    await folder.goto();
    await folder.create(folderName);
    await folder.errorExcpected(false, succesMessageToValidFolder)

    const newFolderName = folderName + ' edited'
    await folder.editFolderByName(folderName, newFolderName);
    await folder.errorExcpected(false, succesMessageToEditFolder);
    const folderDetails = await folder.getFolderDetailsByName(newFolderName);
    expect(folderDetails.name).toBe(newFolderName);
});

test('Negative - edit a folder and leave its name empty ', async ({ page }) => {
    const folderName = `folder-${Math.random().toString(36).substring(2, 16)}`;
    const folder = new FolderPage(page);
    await folder.goto();
    await folder.create(folderName);
    await folder.errorExcpected(false, succesMessageToValidFolder);

    const newFolderName = ''
    await folder.editFolderByName(folderName, newFolderName);
    await folder.errorExcpected(true, '', succesMessageToEditFolder);
});