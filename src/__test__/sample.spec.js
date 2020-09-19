describe('puppeteer test', () => {
  let page
  beforeAll(async () => {
    page = await global.__BROWSER__.newPage()
    await page.goto('http://localhost:8080', {
      waitUntil: 'networkidle2'
    })
  }, 5000)

  afterAll(async () => {
    await page.close()
  })

  it('google text', async () => {
    const text = await page.evaluate(() => document.body.textContent)
    expect(text).toContain('google')
  })
})
