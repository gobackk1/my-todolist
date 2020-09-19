import { TEXT } from '@/components/common/AppHeader'
import { test, describe, beforeAll, afterAll, expect } from '@jest/globals'

describe('E2Eテスト', () => {
  let page: any

  beforeAll(async () => {
    page = await (global as any).__BROWSER__.newPage()
    await page.setViewport({ width: 1440, height: 900 })
    await page.goto('http://localhost:8080', {
      waitUntil: 'networkidle2'
    })
    await page.waitForSelector('h1')
  })

  test('TOPページアクセス時、ログインボタンが表示されること', async () => {
    const buttonLogin = await page.$('#btn-login span:first-child')
    const buttonText = await (
      await buttonLogin.getProperty('textContent')
    ).jsonValue()
    expect(buttonText).toContain(TEXT.BUTTON.LOGIN)
  })

  afterAll(async () => {
    await page.close()
  })
})
