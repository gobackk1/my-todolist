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
import { selector, localhost } from './util/testOption'
import loginToGoogle from './util/loginToGoogle'

require('dotenv').config()

export const { GOOGLE_PASSWORD, GOOGLE_ADDRESS } = process.env

describe('E2Eテスト', () => {
  let page: any
  beforeAll(async () => {
    page = await (global as any).__BROWSER__.newPage()
    await page.setViewport({
      width: 1440,
      height: 900
    })
    await page.goto(localhost)
    await page.waitForNavigation()
  })

  beforeEach(() => {
    jest.setTimeout(60000)
  })

  afterAll(async () => {
    await page.close()
  })

  describe('ログインのテスト', () => {
    test('TOPページアクセス時、ログインボタンが表示されること', async () => {
      const buttonLogin = await page.$(
        selector.buttonLogin + ' span:first-child'
      )
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

    test('ログイン可能かつログイン後のフィードバックが正しいこと', async () => {
      await loginToGoogle(page)

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

      expect(buttonText).toContain(TEXT.BUTTON.LOGOUT)
      expect(snackbarText).toBe(OPTION.MESSAGE.LOGIN.SUCCESS)
      expect(imageSrc).toContain('https://')
      expect(page.url()).toContain(OPTION.PATH.BOARD)
    })
  })

  describe('ボード操作のテスト', () => {
    test('ボードのテキストのテスト', async () => {
      // await loginToGoogle(page)
      // await page.waitForNavigation({ waitUntil: 'load' })
      await page.waitForSelector(selector.board)
      const html = await page.evaluate(selector => {
        const el = document.querySelector(selector.board)
        return el
      }, selector)
      console.log(html)
    })
  })
})
