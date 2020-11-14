// 「ボード一覧」が表示されること
import { Page } from 'puppeteer'

export const loginTestSuite11 = async (page: Page): Promise<void> => {
  await page.screenshot({ path: './screenshot/check.jpg' })
  const openButton = await page.$eval('.AppBoardListMenu-openButton', el => el.textContent)
  expect(openButton).toContain('ボード一覧')
}
