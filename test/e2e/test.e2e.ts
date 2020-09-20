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
    jest.setTimeout(10000)
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
    test('ボードの数が０の時、ボードが存在しないフィードバックすること。', async () => {
      // 決まったらテストかく
      await page.waitForSelector(selector.board)
      const html = await page.evaluate(selector => {
        const el = document.querySelector(selector.board)
        return el.textContent
      }, selector)
      console.log(html)
    })

    describe('ボード作成のテスト', () => {
      test('新しいボードが作成できること', async () => {
        const newBoardTitle = 'new board'

        const buttonHandle = await page.$(selector.buttonMenuOpen)
        await buttonHandle.click()
        await page.waitForSelector(selector.menuBoardList, { visible: true })

        page.click(selector.buttonCreateBoard)
        await page.waitForSelector(selector.formCreateBoard, { visible: true })

        await page.type(
          `${selector.formCreateBoard} input[name="title"]`,
          newBoardTitle
        )
        await page.click(`${selector.formCreateBoard} button[type="submit"]`)
        await page.waitForNavigation()

        const boardTitle = await page.evaluate(selector => {
          const boardTitle = document.querySelector(
            selector.boardTitle + ' button span:first-child'
          )
          return boardTitle!.textContent
        }, selector)

        expect(boardTitle).toBe(newBoardTitle)
        expect(page.url()).toMatch(
          RegExp(localhost + OPTION.PATH.BOARD + '/.*')
        )
      })

      test.skip('ボードタイトルが、空白または51字以上の時に、ボードが作成できないこと', async () => {
        const invalidTitle1 = ''
        const invalidTitle2 = 'a'.repeat(51)

        const buttonHandle = await page.$(selector.buttonMenuOpen)
        await buttonHandle.click()
        await page.waitForSelector(selector.menuBoardList, {
          visible: true
        })

        await page.click(selector.buttonCreateBoard)
        await page.waitForSelector(selector.formCreateBoard, {
          visible: true
        })

        await page.type(
          `${selector.formCreateBoard} input[name="title"]`,
          invalidTitle1
        )
        const submitDisabled1 = await page.evaluate(selector => {
          const submit = document.querySelector(
            `${selector.formCreateBoard} button[type="submit"]`
          )
          return (submit as HTMLButtonElement).disabled
        }, selector)

        await page.type(
          `${selector.formCreateBoard} input[name="title"]`,
          invalidTitle2
        )
        const submitDisabled2 = await page.evaluate(selector => {
          const submit = document.querySelector(
            `${selector.formCreateBoard} button[type="submit"]`
          )
          return (submit as HTMLButtonElement).disabled
        }, selector)

        await page.reload()
        await page.waitForNavigation()

        expect(submitDisabled1).toBe(true)
        expect(submitDisabled2).toBe(true)
      })

      test('ボードがアーカイブできること', async () => {
        await page.click(selector.buttonMenuOpen)
        await page.waitForSelector(selector.menuBoardList, { visible: true })

        const beforeBoardLength = (await page.$$('#list-board-menu li')).length
        await page.click(selector.buttonOpenBoardMenu)

        page.on('dialog', dialog => {
          // console.log(dialog, 'dialog')
          dialog.accept()
        })
        const buttonArchive = await page.waitForSelector(
          selector.buttonArchiveBoard,
          {
            visible: true
          }
        )
        await buttonArchive.click()

        // NOTE: ドロワーはアニメーションして閉じる&APIのレスポンス待ちなので
        await page.waitFor(5000)

        const drawerVisibility = await page.evaluate(
          el => document.querySelector(el).style.visibility,
          '#drawer .MuiDrawer-paper'
        )

        await page.click(selector.buttonMenuOpen)
        await page.waitForSelector(selector.menuBoardList, {
          visible: true
        })

        const afterBoardLength = (await page.$$('#list-board-menu li')).length

        expect(drawerVisibility).toBe('hidden')
        expect(page.url()).toBe(localhost + OPTION.PATH.BOARD)
        expect(beforeBoardLength - afterBoardLength).toBe(1)
      })
    })

    describe('ボードアーカイブのテスト', () => {
      test('アーカイブしたボードを戻せること', () => {
        //
        // アーカイブのボードに追加されていること
      })
    })

    describe('ボード更新のテスト', () => {
      test('ボードタイトルが更新できること', () => {
        //
      })
    })

    describe('ボード削除のテスト', () => {
      test('アーカイブしたボードを削除できること', () => {
        //
      })
    })

    describe('ボード検索のテスト', () => {
      //
    })
  })
})
