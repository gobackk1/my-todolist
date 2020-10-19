// TOPページアクセス時、ログインボタンが表示されること
export const loginTestSuite1 = async page => {
  const buttonLogin = await page.$('.AppLoginFormModal-buttonLogin')
  const buttonText = await (
    await buttonLogin.getProperty('textContent')
  ).jsonValue()
  expect(buttonText).toContain('ログイン')
}
