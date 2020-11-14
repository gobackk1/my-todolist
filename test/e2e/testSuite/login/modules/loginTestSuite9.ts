// 新規登録フォームとログインフォームとで切り替えができること
import { Page } from 'puppeteer'

export const loginTestSuite9 = async (page: Page): Promise<void> => {
  const buttonLogin = await page.$('.AppLoginFormModal-buttonLogin')
  await buttonLogin.click()
  await page.waitForSelector('.AppLoginView-root')

  await page.click('.AppLoginView-signInButton')
  const signUpViewHandle = await page.waitForSelector('.AppSignUpView-root')
  const signUpViewTitleText = await signUpViewHandle.$eval('h3', el => el.textContent)
  await page.click('.AppSignUpView-loginButton')
  const loginViewHandle = await page.waitForSelector('.AppLoginView-root')
  const loginViewTitleText = await loginViewHandle.$eval('h3', el => el.textContent)

  expect(signUpViewTitleText).toContain('新規登録')
  expect(loginViewTitleText).toContain('ログイン')
}
