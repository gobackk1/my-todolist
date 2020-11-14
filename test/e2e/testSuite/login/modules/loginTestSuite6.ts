// ログインができること
import { Page } from 'puppeteer'

export const loginTestSuite6 = async (page: Page): Promise<void> => {
  const buttonLogin = await page.$('.AppLoginFormModal-buttonLogin')
  await buttonLogin.click()
  await page.waitForSelector('.AppLoginView-root')

  const invalidEmailAdresses = ['example']

  await new Promise(resolve => {
    const { length } = invalidEmailAdresses
    invalidEmailAdresses.forEach(async (email, i) => {
      await page.type('.AppLoginView-root .AppEMailField-root input', email, { delay: 50 })
      const feedback = await page.waitForSelector('.AppLoginView-root .MuiFormHelperText-root')
      const helperText = await feedback.evaluate(node => {
        return node.textContent
      })
      expect(helperText).toContain('メールアドレスの例')

      await page.$eval(
        '.AppLoginView-root .AppEMailField-root input',
        element => ((element as HTMLInputElement).value = '')
      )
      if (i === length - 1) {
        resolve()
      }
    })
  })
}
