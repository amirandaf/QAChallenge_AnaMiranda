import { test, expect } from '@playwright/test';
import { ToDoPage } from '../pages/to-do';
import { LoginPage } from '../pages/login';
import { validLoginData } from '../data-test/login-data';
import { validToDoData, invalidToDoData } from '../data-test/to-do-data'
import { succesMessageToCreateTask, succesMessageToDeleteTask, succesMessageToEditTask } from '../data-test/messages-data';
// @ts-check

test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page)
    await login.goto()
    await login.login(validLoginData.username, validLoginData.password)
});

test('Positive create new to do element', async ({ page }) => {
    const toDo = new ToDoPage(page);
    await toDo.goto();
    await toDo.create(validToDoData.title, validToDoData.description, validToDoData.folder);
    await toDo.errorExcpected(false, succesMessageToCreateTask)
    await toDo.orderDescElements();
    const toDoDetails = await toDo.getToDoDetailsByName(validToDoData.title);
    
    expect(toDoDetails.title).toBe(validToDoData.title);
    expect(toDoDetails.description).toBe(validToDoData.description);
    expect(toDoDetails.folder).toBe(validToDoData.folder);
});

test('Negative - create new to do element with description empty', async ({ page }) => {
    const toDo = new ToDoPage(page);
    await toDo.goto();
    await toDo.create(invalidToDoData.title, invalidToDoData.description, invalidToDoData.folder);
   
    await toDo.errorExcpected(true, '', succesMessageToCreateTask)
});

test('Delete a folder ', async ({ page }) => {
    const toDo = new ToDoPage(page);
    await toDo.goto();
    await toDo.create(validToDoData.title, validToDoData.description, validToDoData.folder);
    await toDo.errorExcpected(false, succesMessageToCreateTask);
    await toDo.orderDescElements();

    await toDo.deleteTaskByName(validToDoData.title);
    await toDo.errorExcpected(false, succesMessageToDeleteTask);
    await toDo.orderDescElements();
    await toDo.validateRemove(validToDoData.title);
});

test('Positive - edit the title for a to do element', async ({ page }) => {
    const toDo = new ToDoPage(page);
    const newTitle = validToDoData.title + ' edited'
    await toDo.goto();
    await toDo.create(validToDoData.title, validToDoData.description, validToDoData.folder);
    await toDo.errorExcpected(false, succesMessageToCreateTask);
    await toDo.orderDescElements();

    await toDo.editTaskByName(validToDoData.title, newTitle);
    await toDo.errorExcpected(false, succesMessageToEditTask);
    await toDo.orderDescElements();
    const toDoDetails = await toDo.getToDoDetailsByName(newTitle)
    expect(toDoDetails.title).toBe(newTitle);

});

test('Positive - edit the description for a to do element', async ({ page }) => {
    const toDo = new ToDoPage(page);
    const newDescription = validToDoData.description + ' edited'
    await toDo.goto();
    await toDo.create(validToDoData.title, validToDoData.description, validToDoData.folder);
    await toDo.errorExcpected(false, succesMessageToCreateTask);
    await toDo.orderDescElements();

    await toDo.editTaskByName(validToDoData.title, '-', newDescription);
    await toDo.errorExcpected(false, succesMessageToEditTask);
    await toDo.orderDescElements();
    const toDoDetails = await toDo.getToDoDetailsByName(validToDoData.title)
    expect(toDoDetails.description).toBe(newDescription);
});

test('Negative - leave the description field empty', async ({ page }) => {
    const toDo = new ToDoPage(page);
    const newDescription = ''
    await toDo.goto();
    await toDo.create(validToDoData.title, validToDoData.description, validToDoData.folder);
    await toDo.errorExcpected(false, succesMessageToCreateTask);
    await toDo.orderDescElements();

    await toDo.editTaskByName(validToDoData.title, '-', newDescription);
    await toDo.errorExcpected(true, '', succesMessageToEditTask);
});
