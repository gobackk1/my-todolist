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

/**
 * TODOで検索すると積みタスクがわかる
 */

require('dotenv').config()

const selector = {
  buttonLogin: '#btn-login',
  buttonLoginWithGoogle: '#btn-login-with-google',
  buttonLogout: '#btn-logout',
  addressInput: 'form section input[type="email"]',
  passwordInput: 'form section input[type="password"]',
  modalLogin: '#modal-login',
  imgUserPhoto: '#img-user-photo'
}

const { GOOGLE_PASSWORD, GOOGLE_ADDRESS } = process.env

// TODO 今後 board.e2e.ts / list.e2e.ts / auth.e2e.ts 等に分割する
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

  afterAll(async () => {
    await page.close()
  })
  // test('TOPページアクセス時、ログインボタンが表示されること', async () => {
  //   const buttonText = await (
  //     await buttonLogin.getProperty('textContent')
  //   ).jsonValue()
  //   expect(buttonText).toContain(TEXT.BUTTON.LOGIN)
  // })

  describe('ログイン前のテスト', () => {
    test('ログイン前はログインモーダルが閉じていること', async () => {
      const modalVisibility = await page.evaluate(selector => {
        const modalLogin = document.querySelector(selector.modalLogin)
          .parentElement
        return modalLogin.style.visibility
      }, selector)

      expect(modalVisibility).toBe('hidden')
    })

    test('ログインモーダルの閉じるボタンを押すと、モーダルが閉じること', () => {
      //TODO
    })

    test('ログイン認証前に、ログインが必要なページへ遷移しようとした時、リダイレクトされること', () => {
      //TODO
    })
  })

  describe('ログインのテスト', () => {
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
      const [button1] = await (newPage as any).$x(
        "//button[contains(.,'次へ')]"
      )
      if (button1) await button1.click()
      // パスワード入力
      await (newPage as any).waitForSelector(selector.passwordInput, {
        visible: true
      })
      await (newPage as any).type(selector.passwordInput, GOOGLE_PASSWORD, {
        delay: 0
      })
      const [button2] = await (newPage as any).$x(
        "//button[contains(.,'次へ')]"
      )
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

    test('ログイン後、ユーザーのプロフィール画像がヘッダーに表示されていること', async () => {
      const imageSrc = await page.evaluate(selector => {
        const img = document.querySelector(selector.imgUserPhoto)
        return img.src
      }, selector)

      expect(imageSrc).toContain('https://')
    })

    test('ログイン後、{TODO}へ遷移していること', () => {
      //TODO
    })
    test('ログイン後、ログインしたフィードバックが出ること', () => {
      //TODO
    })
  })

  describe('ログイン状態でボードやリストを操作するテスト', () => {
    //TODO
  })

  describe('ログアウトのテスト', () => {
    //TODO
  })
})
