/**
 * E2Eテスト独自のアノテーションコメント
 * STEP: テストの手順をまとめる
 * EXPECT: expect() でチェックする箇所をまとめる
 */

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
import loginToGoogle from './util/loginToGoogle'

/**
 * test config
 */
const localhost = 'http://localhost:8080'
const testTimeoutMilliseconds = 10000
const puppetWidth = 1440
const puppetHeight = 900

/**
 * start e2e test
 */
describe('E2Eテスト', () => {
  let page: any

  beforeAll(async () => {
    page = await (global as any).__BROWSER__.newPage()
    await page.setViewport({
      width: puppetWidth,
      height: puppetHeight
    })
    await page.goto(localhost)
    await page.waitForNavigation()
  })

  beforeEach(() => {
    jest.setTimeout(testTimeoutMilliseconds)
  })

  afterAll(async () => {
    await page.close()
  })

  describe('ログインのテスト', () => {
    test('TOPページアクセス時、ログインボタンが表示されること', async () => {
      const buttonLogin = await page.$('#btn-login span:first-child')
      const buttonText = await (
        await buttonLogin.getProperty('textContent')
      ).jsonValue()
      expect(buttonText).toContain(TEXT.BUTTON.LOGIN)
    })

    test('モーダルが閉じていること', async () => {
      const modalVisibility = await page.evaluate(el => {
        const modalLogin = document.querySelector(el).parentElement
        return modalLogin.style.visibility
      }, '#modal-login')

      expect(modalVisibility).toBe('hidden')
    })

    // test.skip('ログインボタンを押すと、モーダルが開くこと', async () => {
    //   NOTE: ログインのテストで担保
    // })

    test('モーダルの閉じるボタンを押すと、モーダルが閉じること', async () => {
      await page.click('#btn-login')
      await page.waitForSelector('#btn-login-with-google')

      const modalVisibility = await page.evaluate(
        ([btnModalClose, modalLogin]) =>
          new Promise(resolve => {
            const modal = document.querySelector(modalLogin).parentElement
            modal.querySelector(btnModalClose).click()

            // NOTE: クリック後、直後にモーダルが閉じないため
            setTimeout(() => {
              resolve(modal.style.visibility)
            }, 800)
          }),
        ['.btn-modal-close', '#modal-login']
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
      const menuButton = await page.$('#menu-board-list')
      expect(menuButton).toBe(null)
    })

    test('ログイン可能かつログイン後のフィードバックが正しいこと', async () => {
      await loginToGoogle(page)

      // web アプリがログイン後の画面へ遷移する
      const snackbar = await page.waitForSelector('.MuiSnackbar-root')
      const snackbarText = await snackbar.evaluate(node => {
        return node.innerText
      })

      const buttonLogout = await page.$('#btn-logout' + ' span:first-child')
      const buttonText = await (
        await buttonLogout.getProperty('textContent')
      ).jsonValue()

      const imageSrc = await page.evaluate(el => {
        const img = document.querySelector(el)
        return img.src
      }, '#img-user-photo')

      expect(buttonText).toContain(TEXT.BUTTON.LOGOUT)
      expect(snackbarText).toBe(OPTION.MESSAGE.LOGIN.SUCCESS)
      expect(imageSrc).toContain('https://')
      expect(page.url()).toContain(OPTION.PATH.BOARD)
    })
  })

  describe('ボード操作のテスト', () => {
    test('ボードの数が０の時、ボードが存在しないフィードバックすること。', async () => {
      // 決まったらテストかく
      await page.waitForSelector('#board')
      const html = await page.evaluate(el => {
        const board = document.querySelector(el)
        return board.textContent
      }, '#board')
      console.log(html)
    })

    describe('ボード作成のテスト', () => {
      test('新しいボードが作成できること', async () => {
        const newBoardTitle = 'new board'

        const buttonHandle = await page.$('#button-menu-open')
        await buttonHandle.click()
        await page.waitForSelector('#menu-board-list', { visible: true })

        await page.click('#btn-create-board')
        await page.waitForSelector('#form-create-board', { visible: true })

        await page.type('#form-create-board input[name="title"]', newBoardTitle)
        await page.click('#form-create-board button[type="submit"]')
        await page.waitForNavigation()

        const boardTitle = await page.evaluate(el => {
          const boardTitle = document.querySelector(
            el + ' button span:first-child'
          )
          return boardTitle!.textContent
        }, '#board-title')

        expect(boardTitle).toBe(newBoardTitle)
        expect(page.url()).toMatch(
          RegExp(localhost + OPTION.PATH.BOARD + '/.*')
        )
      })

      test('ボードがアーカイブできること', async () => {
        /**
         * STEP: アーカイブする確認ダイアログが出たら、OKを押す
         */
        page.on('dialog', dialog => {
          dialog.accept()
        })

        /**
         * STEP: アーカイブ前のボード数を調べる
         */
        await page.click('#button-menu-open')
        await page.waitForSelector('#menu-board-list', { visible: true })
        const beforeBoardLength = (await page.$$('#list-board-menu li')).length
        await page.click('#button-menu-open')

        /**
         * STEP: ボードをアーカイブするボタンを押す
         */
        await page.click('#btn-open-board-menu')
        const buttonArchive = await page.waitForSelector('#btn-archive-board', {
          visible: true
        })
        await buttonArchive.click()
        // await page.waitForNavigation()
        // NOTE: ドロワーはアニメーションして閉じる&APIのレスポンス待ちなので
        await page.waitFor(5000)

        /**
         * EXPECT: アーカイブ後のボード数を調べ、アーカイブ前との差分が1になること
         */
        await page.click('#button-menu-open')
        await page.waitForSelector('#menu-board-list', {
          visible: true
        })
        const afterBoardLength = (await page.$$('#list-board-menu li')).length
        await page.click('#button-menu-open')
        expect(beforeBoardLength - afterBoardLength).toBe(1)

        /**
         * EXPECT:ドロワーが閉じていること
         */
        const drawerVisibility = await page.evaluate(
          el => document.querySelector(el).style.visibility,
          '#drawer .MuiDrawer-paper'
        )
        expect(drawerVisibility).toBe('hidden')

        /**
         * EXPECT: /boards へ遷移し、url から boardId が取り除かれること
         */
        expect(page.url()).toBe(localhost + OPTION.PATH.BOARD)
      })

      test('ボードタイトルが、空白または51字以上の時に、ボードが作成できないこと', async () => {
        const invalidTitle1 = ''
        const invalidTitle2 = 'a'.repeat(51)

        /**
         * STEP: メニューを開いて、新しいボードを作成するボタンを押す
         */
        const buttonHandle = await page.$('#button-menu-open')
        await buttonHandle.click()
        await page.waitForSelector('#menu-board-list', {
          visible: true
        })
        await page.click('#btn-create-board')
        await page.waitForSelector('#form-create-board', {
          visible: true
        })

        /**
         * STEP: 無効なタイトルを入力して、ボタンの disabled を見る
         */
        await page.type('#form-create-board input[name="title"]', invalidTitle1)
        const submitDisabled1 = await page.$eval(
          '#form-create-board button[type="submit"]',
          node => node.disabled
        )
        await page.type('#form-create-board input[name="title"]', invalidTitle2)
        const submitDisabled2 = await page.$eval(
          '#form-create-board button[type="submit"]',
          node => node.disabled
        )

        /**
         * EXPECT: 無効なタイトルの時はボタンが押せないこと
         * FIXME: テストが false になる場合がある?
         */
        expect(submitDisabled1).toBe(true)
        expect(submitDisabled2).toBe(true)
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
