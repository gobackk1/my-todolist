// ログインができること
import { CONFIG } from '../../../util/config'
import { OPTION } from '@/option'

export const loginTestSuite5 = async page => {
  const buttonLogin = await page.$('.AppLoginFormModal-buttonLogin')
  await buttonLogin.click()
  await page.waitForSelector('.AppLoginView-root')
  await page.type(
    '.AppLoginView-root .AppEMailField-root input',
    CONFIG.TEST_USER_EMAIL,
    {
      delay: 50
    }
  )
  await page.type(
    '.AppLoginView-root .AppPasswordField-root input',
    CONFIG.TEST_USER_PASSWORD,
    {
      delay: 50
    }
  )
  await page.click('.AppLoginView-buttonLogin')

  // web アプリがログイン後の画面へ遷移する
  const snackbar = await page.waitForSelector('.MuiSnackbar-root')
  const snackbarText = await snackbar.evaluate(node => {
    return node.innerText
  })

  // const buttonLogout = await page.$('#btn-logout' + ' span:first-child')
  // const buttonText = await (
  //   await buttonLogout.getProperty('textContent')
  // ).jsonValue()

  // const imageSrc = await page.evaluate(el => {
  //   const img = document.querySelector(el)
  //   return img.src
  // }, '#img-user-photo')

  // TODO: ログイン後のテストは切り出す
  // expect(buttonText).toContain('ログアウト')
  // expect(imageSrc).toContain('https://')
  expect(snackbarText).toBe(OPTION.MESSAGE.LOGIN.SUCCESS)
  expect(page.url()).toContain(OPTION.PATH.BOARD)
}
