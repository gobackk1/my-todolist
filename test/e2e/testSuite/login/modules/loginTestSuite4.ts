// ログイン前は、「ボード一覧」ボタンが非表示であること
export const loginTestSuite4 = async page => {
  const menuButton = await page.$('.AppBoardListMenu-content')
  expect(menuButton).toBe(null)
}
