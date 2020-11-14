// パスワードを間違えている場合、フィードバックを返すこと
import { Page } from 'puppeteer'
import { OPTION } from '@/option'
import { CONFIG } from '../../../util/config'

export const loginTestSuite8 = async (page: Page): Promise<void> => {
  const buttonLogin = await page.$('.AppLoginFormModal-buttonLogin')
  await buttonLogin.click()
  await page.waitForSelector('.AppLoginView-root')

  await page.type('.AppLoginView-root .AppEMailField-root input', CONFIG.TEST_USER_EMAIL, {
    delay: 50
  })
  await page.type(
    '.AppLoginView-root .AppPasswordField-root input',
    CONFIG.TEST_USER_PASSWORD + 'wrong',
    {
      delay: 50
    }
  )
  await page.click('.AppLoginView-buttonLogin')
  const snackbar = await page.waitForSelector('.MuiSnackbar-root')
  const snackbarText = await snackbar.evaluate(node => node.textContent)
  expect(snackbarText).toBe(OPTION.MESSAGE.AUTH.WRONG_PASSWORD)
}
