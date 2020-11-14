// すでに認証済みのメールアドレスは登録できないこと
import { Page } from 'puppeteer'
import { OPTION } from '@/option'
import { CONFIG } from '../../../util/config'

export const loginTestSuite3 = async (page: Page): Promise<void> => {
  const buttonLogin = await page.$('.AppLoginFormModal-buttonLogin')
  await buttonLogin.click()
  await page.waitForSelector('.AppLoginView-root')

  await page.click('.AppLoginView-signInButton')
  await page.type('.AppEMailField-root input', CONFIG.TEST_USER_EMAIL, { delay: 50 })
  await page.type('.AppDisplayNameField-root input', 'testuser', { delay: 50 })
  await page.type('.AppPasswordField-root input', 'testuser', { delay: 50 })
  await page.click('.AppSignUpView-submitButton')
  const snackbar = await page.waitForSelector('.MuiSnackbar-root')
  const snackbarText = await snackbar.evaluate(node => node.textContent)

  expect(snackbarText).toContain(OPTION.MESSAGE.AUTH.EMAIL_ALREADY_IN_USE)
}
