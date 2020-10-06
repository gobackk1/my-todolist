const fs = require('fs')
const path = require('path')
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

module.exports = ({ config }) => {
  // todo: getResolveAlias のような関数を作って、アプリの webpack と共有する
  config.resolve.alias['@'] = resolveApp('src')
  config.resolve.alias['~redux'] = resolveApp('src/scripts/redux')

  config.module.rules.push({
    test: /\.tsx?$/,
    use: 'ts-loader'
  })

  return config
}
