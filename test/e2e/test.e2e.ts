import { OPTION } from '@/option'
import { CONFIG } from './util/config'
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
import {
  loginTestSuite1,
  loginTestSuite2,
  loginTestSuite3,
  loginTestSuite4,
  loginTestSuite5
} from './testSuite/login'

describe('E2Eテスト', () => {
  let page: any

  beforeAll(async () => {
    page = await (global as any).__BROWSER__.newPage()
    await page.setViewport({
      width: CONFIG.PUPPET_WIDTH,
      height: CONFIG.PUPPET_HEIGHT
    })
    await page.goto(CONFIG.LOCAL_HOST)
    await page.waitForNavigation()
  })
  beforeEach(async () => {
    jest.setTimeout(CONFIG.TEXT_TIMEOUT_MILLISECONDS)
  })
  afterAll(async () => {
    await page.close()
  })

  describe('ログインのテスト', () => {
    test('TOPページアクセス時、ログインボタンが表示されること', async () => {
      await loginTestSuite1(page)
    })
    test('モーダルの閉じるボタンを押すと、モーダルが閉じること', async () => {
      await loginTestSuite2(page)
    })
    test('未認証状態で要認証ページへ遷移した時、リダイレクトされること', async () => {
      await loginTestSuite3(page)
    })
    test('ログイン前は、「ボード一覧」ボタンが非表示であること', async () => {
      await loginTestSuite4(page)
    })
    test('メールアドレスが見つからない場合、フィードバックを返すこと', () => {})
    test('メールアドレスがある場合もかく', () => {})
    test('', () => {})
    test('ログインができること', async () => {
      await loginTestSuite5(page)
    })
  })

  describe.skip('ボード操作のテスト', () => {
    const app = {
      async openAppMenu() {
        await page.click('#button-menu-open')
        await page.waitForSelector('#menu-board-list', {
          visible: true
        })
      },
      async closeAppMenu() {
        await page.click('#button-menu-open')
        await page.waitForSelector('#menu-board-list', {
          visible: false
        })
      },
      async getBoardCount() {
        await this.openAppMenu()
        await page.waitForSelector('#list-board-menu')
        const count = await page.$eval(
          '#list-board-menu',
          node => node.childElementCount
        )
        await this.closeAppMenu()
        return count
      },
      async openArchivedBoardModal() {
        await this.openAppMenu()
        await page.click('#open-archived-board-modal')
        await page.waitForSelector('#modal-archived-board')
      }
    }
    const newBoardTitle = 'new board'

    test.skip('ボードの数が０の時、ボードが存在しないフィードバックすること。', async () => {
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
        /**
         * STEP ボード作成モーダルを開く
         */
        await page.click('#button-menu-open')
        await page.waitForSelector('#menu-board-list', {
          visible: true
        })
        await page.click('#btn-create-board')
        await page.waitForSelector('#form-create-board', { visible: true })

        /**
         * 有効なタイトルを入力して作成ボタンを押す
         */
        await page.type(
          '#form-create-board input[name="title"]',
          newBoardTitle,
          { delay: 50 }
        )
        await page.click('#form-create-board button[type="submit"]')
        await page.waitForNavigation({ waitUntil: 'domcontentloaded' })

        /**
         * EXPECT 作成したボードのタイトルが表示され、画面が遷移していること
         */
        const boardTitle = await page.$eval(
          '#board-title button span:first-child',
          node => node.textContent
        )
        expect(boardTitle).toBe(newBoardTitle)
        expect(page.url()).toMatch(
          RegExp(CONFIG.LOCAL_HOST + OPTION.PATH.BOARD + '/.*')
        )
      })

      test('ボードがアーカイブできること', async () => {
        /**
         * STEP: アーカイブする確認ダイアログが出たら、OKを押す
         */
        page.on('dialog', dialog => {
          // NOTE: テスト内で何回かダイアログを出すとき、ここにまとめる。
          dialog.accept()
        })

        /**
         * STEP: アーカイブ前のボード数を調べる
         */
        const beforeBoardLength = await app.getBoardCount()

        /**
         * STEP: ボードをアーカイブするボタンを押す
         */
        await page.click('#btn-open-board-menu')
        const buttonArchive = await page.waitForSelector('#btn-archive-board', {
          visible: true
        })
        await buttonArchive.click()
        // NOTE: ドロワーはアニメーションして閉じる&APIのレスポンス待ちなので
        await page.waitFor(2000)

        /**
         * EXPECT: アーカイブ後のボード数を調べ、アーカイブ前との差分が1になること
         */
        const afterBoardLength = await app.getBoardCount()
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
        expect(page.url()).toBe(CONFIG.LOCAL_HOST + OPTION.PATH.BOARD)
      })

      test('ボードタイトルが、空白または51字以上の時に、ボードが作成できないこと', async () => {
        const invalidTitle1 = ''
        const invalidTitle2 = 'a'.repeat(51)

        /**
         * STEP: メニューを開いて、新しいボードを作成するボタンを押す
         */
        await page.click('#button-menu-open')
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
        await page.type(
          '#form-create-board input[name="title"]',
          invalidTitle1,
          { delay: 0 }
        )
        const submitDisabled1 = await page.$eval(
          '#form-create-board button[type="submit"]',
          node => node.disabled
        )
        await page.type(
          '#form-create-board input[name="title"]',
          invalidTitle2,
          { delay: 0 }
        )
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
        await page.reload({ waitUntil: 'networkidle2' })
      })
    })

    describe('ボードアーカイブのテスト', () => {
      test('アーカイブしたボードを戻せること', async () => {
        /**
         * STEP: 現在のURLを調べる
         */
        const beforeUrl = page.url()

        /**
         * STEP: 戻す前のボード数を調べる
         */
        const beforeBoardLength = await app.getBoardCount()

        /**
         * STEP: アーカイブ済みボードモーダルを開く
         */
        await page.click('#button-menu-open')
        await page.waitForSelector('#menu-board-list', {
          visible: true
        })
        await page.click('#open-archived-board-modal')
        await page.waitForSelector('#modal-archived-board-list')

        /**
         * STEP 戻す前のアーカイブボード数を調べる
         */
        const beforeArchivedBoardLength = await page.$eval(
          '#modal-archived-board-list',
          node => node.childElementCount
        )

        /**
         * STEP: 「アーカイブから戻す」を押して、フィードバックのテキストを取得するまで待つ
         */
        await page.click(
          '#modal-archived-board-list li:first-child .btn-restore-board'
        )
        await page.waitForSelector('#board-inner')
        await page.waitForSelector('.MuiSnackbar-root')
        const snackbarText = await page.$eval(
          '.MuiSnackbar-root',
          node => node.innerText
        )
        await page.waitFor(3000)

        /**
         * EXPECT: ボード数が1増え、アーカイブボード数が1減ること
         */
        const afterBoardLength = await app.getBoardCount()
        await page.click('#button-menu-open')
        await page.waitForSelector('#menu-board-list', {
          visible: true
        })
        await page.click('#open-archived-board-modal')
        await page.waitForSelector('#modal-archived-board-list')
        const afterArchivedBoardLength = await page.$eval(
          '#modal-archived-board-list',
          node => node.childElementCount
        )
        expect(beforeBoardLength - afterBoardLength).toBe(-1)
        expect(beforeArchivedBoardLength - afterArchivedBoardLength).toBe(1)

        /**
         * EXPECT: アーカイブから戻したフィードバックが表示されること
         */
        expect(snackbarText).toBe(
          `アーカイブされた「${newBoardTitle}」を戻しました。`
        )

        /**
         * EXPECT: 戻したボードに遷移すること
         */
        expect(page.url() === beforeUrl).toBe(false)
        await page.reload({
          waitUntil: 'networkidle2'
        })
      })
    })

    describe('ボード更新のテスト', () => {
      test('ボードタイトルが更新できること', async () => {
        /**
         * STEP: 変更前の input.value を取得する
         */
        const beforeValue = await page.$eval(
          '#board-title input',
          node => node.value
        )

        /**
         * STEP: ボードタイトルを変更してページをリロードする
         */
        await page.click('#board-title button')
        await page.waitForSelector('#board-title input', { visible: true })
        await page.$eval(
          '#board-title input',
          node => (node.value = node.value + 'update')
        )
        await page.keyboard.down('Enter')

        /**
         * EXPECT: ボードタイトルが変更されていること
         */
        const buttonText = await page.$eval(
          '#board-title button span',
          node => node.textContent
        )
        expect(buttonText).toBe(beforeValue + 'update')
      })
    })

    describe('ボード削除のテスト', () => {
      test('アーカイブしたボードを削除できること', async () => {
        /**
         * STEP: ボードをアーカイブする
         */
        await page.click('#btn-open-board-menu')
        const buttonArchive = await page.waitForSelector('#btn-archive-board', {
          visible: true
        })
        await buttonArchive.click()
        // NOTE: ドロワーはアニメーションして閉じる&APIのレスポンス待ちなので
        await page.waitFor(2000)

        /**
         * STEP: アーカイブ済みボードモーダルを開く
         */
        await page.click('#button-menu-open')
        await page.waitForSelector('#menu-board-list', {
          visible: true
        })
        await page.click('#open-archived-board-modal')
        await page.waitForSelector('#modal-archived-board-list')

        /**
         * STEP 削除前のアーカイブボード数を調べる
         */
        const beforeArchivedBoardLength = await page.$eval(
          '#modal-archived-board-list',
          node => node.childElementCount
        )

        /**
         * STEP: 「削除する」を押して、フィードバックのテキストを取得するまで待つ
         */
        await page.click(
          '#modal-archived-board-list li:first-child .btn-delete-board'
        )
        await page.waitForSelector('#board-inner')

        await page.waitForSelector('.MuiSnackbar-root')
        const snackbarText = await page.$eval(
          '.MuiSnackbar-root',
          node => node.innerText
        )
        await page.waitFor(3000)

        /**
         * EXPECT: 削除後のボード数が1減ること
         */
        await page.click('#button-menu-open')
        await page.waitForSelector('#menu-board-list', {
          visible: true
        })
        await page.click('#open-archived-board-modal')
        await page.waitForSelector('#modal-archived-board-list')
        const afterArchivedBoardLength = await page.$eval(
          '#modal-archived-board-list',
          node => node.childElementCount
        )
        expect(beforeArchivedBoardLength - afterArchivedBoardLength).toBe(1)

        /**
         * フィードバックテキストが正しいこと
         */
        // expect(snackbarText).toBe(ArchivedBoardModal_TEXT.DELETE_BOARD)
      })
    })

    describe('ボード検索のテスト', () => {
      //
    })
  })
})
