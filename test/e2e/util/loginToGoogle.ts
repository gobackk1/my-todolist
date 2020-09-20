import { selector } from './testOption'
require('dotenv').config()

export const { GOOGLE_PASSWORD, GOOGLE_ADDRESS } = process.env

/**
 * ログインボタンがある画面で実行すること
 * @param page ログインしたい puppeteer の page
 */
export default async function(page: any) {
  const button = await page.$(selector.buttonLogin)
  if (!button) return
  await page.click(selector.buttonLogin)
  const buttonLoginWithGoogle = await page.waitForSelector(
    selector.buttonLoginWithGoogle
  )

  // signInWithPopup によってログイン用ページが開く
  const [newPage] = await Promise.all([
    (global as any).__BROWSER__
      .waitForTarget(t => t.opener() === page.target())
      .then(t => t.page()),
    await buttonLoginWithGoogle.click()
  ])

  // アドレス入力
  await (newPage as any).waitForSelector(selector.addressInput)
  await (newPage as any).type(selector.addressInput, GOOGLE_ADDRESS, {
    delay: 0
  })
  const [button1] = await (newPage as any).$x("//button[contains(.,'次へ')]")
  if (button1) await button1.click()

  // パスワード入力
  await (newPage as any).waitForSelector(selector.passwordInput, {
    visible: true
  })
  await (newPage as any).type(selector.passwordInput, GOOGLE_PASSWORD, {
    delay: 0
  })
  const [button2] = await (newPage as any).$x("//button[contains(.,'次へ')]")
  if (button2) await button2.click()

  await page.waitForNavigation()
}
