import { TEXT } from '@/components/common/AppHeader'
import {
  test,
  describe,
  beforeAll,
  afterAll,
  expect,
  beforeEach,
  jest
} from '@jest/globals'

require('dotenv').config()

const selector = {
  buttonLogin: '#btn-login',
  buttonLoginWithGoogle: '#btn-login-with-google',
  buttonLogout: '#btn-logout',
  addressInput: 'form section input[type="email"]',
  passwordInput: 'form section input[type="password"]'
}

const { GOOGLE_PASSWORD, GOOGLE_ADDRESS } = process.env

describe('E2Eテスト', () => {
  let page: any
  let buttonLogin

  beforeAll(async () => {
    page = await (global as any).__BROWSER__.newPage()
    await page.setViewport({ width: 1440, height: 900 })
    await page.goto('http://localhost:8080', {
      waitUntil: 'networkidle2'
    })
    await page.waitForSelector('h1')
    buttonLogin = await page.$(selector.buttonLogin + ' span:first-child')
  })

  beforeEach(() => {
    jest.setTimeout(30000)
  })

  test('TOPページアクセス時、ログインボタンが表示されること', async () => {
    const buttonText = await (
      await buttonLogin.getProperty('textContent')
    ).jsonValue()
    expect(buttonText).toContain(TEXT.BUTTON.LOGIN)
  })

  test('ログイン成功時、ログイン後画面のログアウトボタンが表示されること', async () => {
    await page.click(selector.buttonLogin)
    await page.waitForSelector(selector.buttonLoginWithGoogle)

    // signInWithPopup によってログイン用ページが開く
    const [newPage] = await Promise.all([
      (global as any).__BROWSER__
        .waitForTarget(t => t.opener() === page.target())
        .then(t => t.page()),
      await page.click(selector.buttonLoginWithGoogle)
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

    // web アプリがログイン後の画面へ遷移する
    await page.waitForSelector(selector.buttonLogout)
    const buttonLogout = await page.$(
      selector.buttonLogout + ' span:first-child'
    )
    const buttonText = await (
      await buttonLogout.getProperty('textContent')
    ).jsonValue()

    expect(buttonText).toContain(TEXT.BUTTON.LOGOUT)
  })

  afterAll(async () => {
    await page.close()
  })
})
