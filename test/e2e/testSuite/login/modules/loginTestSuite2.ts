import { Page } from 'puppeteer'

// モーダルの閉じるボタンを押すと、モーダルが閉じること
export const loginTestSuite2 = async (page: Page): Promise<void> => {
  const buttonLogin = await page.$('.AppLoginFormModal-buttonLogin')
  await buttonLogin.click()
  await page.waitForSelector('.AppLoginView-buttonGoogleProvider')

  const modalVisibility = await page.evaluate(
    ([btnModalClose, loginView]) =>
      new Promise(resolve => {
        const loginViewModal = document.querySelector(loginView).closest('.AppModal-root')
        loginViewModal.querySelector(btnModalClose).click()
        // NOTE: クリック後、直後にモーダルが閉じないため
        setTimeout(() => {
          resolve(loginViewModal.style.visibility)
        }, 800)
      }),
    ['button', '.AppLoginView-root']
  )

  expect(modalVisibility).toBe('hidden')
}
