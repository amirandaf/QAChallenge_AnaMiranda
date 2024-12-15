import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login';
import { validLoginData, invalidLoginData } from '../data-test/login-data';
import { errorMessageToIvalidLogin, succesMessageToValidLogin} from '../data-test/messages-data';
// @ts-check

test('Positive login case', async ({ page }) => {
  const login = new LoginPage(page)
  await login.goto()
  await login.login(validLoginData.username, validLoginData.password)
  await login.assertMessage(succesMessageToValidLogin)
});

test('Negative login case', async ({ page }) => {
  const login = new LoginPage(page)
  await login.goto()
  await login.login(invalidLoginData.username, invalidLoginData.password)
  await login.assertMessage(errorMessageToIvalidLogin)
});
