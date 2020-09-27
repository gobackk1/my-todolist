const Dotenv = require('dotenv-webpack')
const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production' ? true : false
  return {
    entry: './src/index.tsx',
    output: {
      filename: 'bundle.min.js',
      path: isProduction ? resolveApp('build') : undefined,
      publicPath: '/'
    },
    module: {
      rules: [
        {
          test: [/\.tsx?$/],
          loader: 'babel-loader',
          exclude: /node_modules/,
          options: {
            presets: [
              ['@babel/preset-env', { useBuiltIns: 'usage', corejs: 3 }],
              '@babel/preset-typescript',
              '@babel/preset-react',
              '@emotion/babel-preset-css-prop'
            ],
            plugins: ['@babel/plugin-proposal-class-properties']
          }
        },
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.tsx?$/,
          loader: 'eslint-loader',
          exclude: /node_modules/,
          include: resolveApp(`src`),
          options: {
            eslintPath: 'eslint'
          }
        },
        {
          test: /\.(jpg|png|gif)$/,
          loader: 'file-loader',
          options: {
            name: 'images/[name].[ext]'
          }
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: resolveApp('public/index.html'),
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true
        }
      }),
      new Dotenv()
    ],
    resolve: {
      alias: {
        '@': resolveApp('src'),
        '~redux': resolveApp('src/scripts/redux')
      },
      extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    ...(isProduction
      ? {
          optimization: {
            minimize: true,
            minimizer: [
              new TerserPlugin({
                terserOptions: {
                  compress: {
                    drop_console: true
                  }
                }
              })
            ]
          }
        }
      : {
          devtool: 'inline-source-map',
          devServer: {
            contentBase: resolveApp('public'),
            historyApiFallback: true
          }
        })
  }
}
