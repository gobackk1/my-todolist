// 未認証のメールアドレスは登録できること
import { Page } from 'puppeteer'
import { OPTION } from '@/option'

export const loginTestSuite10 = async (page: Page): Promise<void> => {
  const buttonLogin = await page.$('.AppLoginFormModal-buttonLogin')
  await buttonLogin.click()
  await page.waitForSelector('.AppLoginView-root')

  await page.click('.AppLoginView-signInButton')
  await page.type('.AppEMailField-root input', 'example@example.com', { delay: 50 })
  await page.type('.AppDisplayNameField-root input', 'testuser', { delay: 50 })
  await page.type('.AppPasswordField-root input', 'testuser', { delay: 50 })
  await page.click('.AppSignUpView-submitButton')
  const snackbar = await page.waitForSelector('.MuiSnackbar-root')
  const snackbarText = await snackbar.evaluate(node => node.textContent)

  expect(snackbarText).toContain(OPTION.MESSAGE.AUTH.SEND_EMAIL_VERIFICATION)
}
