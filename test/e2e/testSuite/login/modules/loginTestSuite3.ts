// 未認証状態で要認証ページへ遷移した時、リダイレクトされること
import { CONFIG } from '../../../util/config'

export const loginTestSuite3 = async page => {
  const paths = ['/boards', '/profile']
  for (const path of paths) {
    await page.goto(CONFIG.LOCAL_HOST + path)
    await page.waitForNavigation()
    expect(page.url()).not.toContain(path)
  }
}
