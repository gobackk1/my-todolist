describe('puppeteer test', () => {
  let page
  beforeAll(async () => {
    page = await global.__BROWSER__.newPage()
    await page.setViewport({ width: 1440, height: 900 })
    await page.goto('http://localhost:8080', {
      waitUntil: 'domcontentloaded'
    })
  }, 5000)

  afterAll(async () => {
    await page.close()
  })

  it('google text', async () => {
    const buttonLogin = await page.$('#btn-login')
    expect(buttonLogin.textContent).toContain('google')
  })
})
