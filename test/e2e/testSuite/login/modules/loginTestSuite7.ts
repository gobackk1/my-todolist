// ログイン時メールアドレスが見つからない場合、フィードバックを返すこと
import { Page } from 'puppeteer'
import { OPTION } from '@/option'

export const loginTestSuite7 = async (page: Page): Promise<void> => {
  const buttonLogin = await page.$('.AppLoginFormModal-buttonLogin')
  await buttonLogin.click()
  await page.waitForSelector('.AppLoginView-root')

  const unregisteredEmailAdresses = 'unregister@example.com'
  await page.type('.AppLoginView-root .AppEMailField-root input', unregisteredEmailAdresses, {
    delay: 50
  })
  await page.type('.AppLoginView-root .AppPasswordField-root input', 'testuser', {
    delay: 50
  })
  await page.click('.AppLoginView-buttonLogin')
  const snackbar = await page.waitForSelector('.MuiSnackbar-root')
  const snackbarText = await snackbar.evaluate(node => node.textContent)
  expect(snackbarText).toBe(OPTION.MESSAGE.AUTH.USER_NOT_FOUND)
}
