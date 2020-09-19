const chalk = require('chalk')
const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')
const os = require('os')
const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup')
const mkdirp = require('mkdirp')

module.exports = async function() {
  console.log(chalk.green('Setup Puppeteer'))
  const browser = await puppeteer.launch({
    headless: false
  })
  global.__BROWSER__ = browser

  mkdirp.sync(DIR)

  fs.writeFileSync(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint())
}
