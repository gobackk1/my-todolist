import { TEXT } from '@/components/common/AppHeader'
import { OPTION } from '@/option'
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
  buttonModalClose: '.btn-modal-close',
  addressInput: 'form section input[type="email"]',
  passwordInput: 'form section input[type="password"]',
  modalLogin: '#modal-login',
  imgUserPhoto: '#img-user-photo',
  menuBoardList: '#menu-board-list',
  snackbarRoot: '.MuiSnackbar-root'
}

const localhost = 'http://localhost:8080'

const { GOOGLE_PASSWORD, GOOGLE_ADDRESS } = process.env

// TODO 今後 board.e2e.ts / list.e2e.ts / auth.e2e.ts 等に分割する
describe('E2Eテスト', () => {
  let page: any
  let buttonLogin

  beforeAll(async () => {
    page = await (global as any).__BROWSER__.newPage()
    await page.setViewport({ width: 1440, height: 900 })
    await page.goto(localhost, {
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

  describe('ログイン前のテスト', () => {
    test('TOPページアクセス時、ログインボタンが表示されること', async () => {
      const buttonText = await (
        await buttonLogin.getProperty('textContent')
      ).jsonValue()
      expect(buttonText).toContain(TEXT.BUTTON.LOGIN)
    })

    test('モーダルが閉じていること', async () => {
      const modalVisibility = await page.evaluate(selector => {
        const modalLogin = document.querySelector(selector.modalLogin)
          .parentElement
        return modalLogin.style.visibility
      }, selector)

      expect(modalVisibility).toBe('hidden')
    })

    // test.skip('ログインボタンを押すと、モーダルが開くこと', async () => {
    //   NOTE: ログインのテストで担保
    // })

    test('モーダルの閉じるボタンを押すと、モーダルが閉じること', async () => {
      await page.click(selector.buttonLogin)
      await page.waitForSelector(selector.buttonLoginWithGoogle)

      const modalVisibility = await page.evaluate(
        selector =>
          new Promise(resolve => {
            const modalLogin = document.querySelector(selector.modalLogin)
              .parentElement
            modalLogin.querySelector(selector.buttonModalClose).click()

            // NOTE: クリック後、直後にモーダルが閉じないため
            setTimeout(() => {
              resolve(modalLogin.style.visibility)
            }, 800)
          }),
        selector
      )

      expect(modalVisibility).toBe('hidden')
    })

    test('ログインが必要なページへ遷移した時、リダイレクトされること', async () => {
      // TODO: 認証必要ページは配列にまとめて、forEachでテストする
      await page.goto(localhost + '/boards')
      await page.waitForNavigation()
      expect(page.url()).not.toContain('/boards')
    })

    test('「ボード一覧」ボタンが非表示であること', async () => {
      const menuButton = await page.$(selector.menuBoardList)
      expect(menuButton).toBe(null)
    })
  })

  describe('ログインのテスト', () => {
    test.only('ログイン可能かつログイン後のフィードバックが正しいこと', async () => {
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
      const snackbar = await page.waitForSelector(selector.snackbarRoot)
      const snackbarText = await snackbar.evaluate(node => {
        return node.innerText
      })

      const buttonLogout = await page.$(
        selector.buttonLogout + ' span:first-child'
      )
      const buttonText = await (
        await buttonLogout.getProperty('textContent')
      ).jsonValue()

      const imageSrc = await page.evaluate(selector => {
        const img = document.querySelector(selector.imgUserPhoto)
        return img.src
      }, selector)

      expect(buttonLoginWithGoogle).not.toBe(null)
      expect(buttonText).toContain(TEXT.BUTTON.LOGOUT)
      expect(snackbarText).toBe(OPTION.MESSAGE.LOGIN.SUCCESS)
      expect(imageSrc).toContain('https://')
      expect(page.url()).toContain(OPTION.PATH.BOARD)
    })
  })

  describe('ログイン状態でボードやリストを操作するテスト', () => {
    //TODO ここは別ファイルへ切り出しかも
  })

  describe('ログアウトのテスト', () => {
    test('ログアウトしたフィードバックが表示されること', async () => {
      //TODO
    })
  })
})
