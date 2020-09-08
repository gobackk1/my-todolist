import React from 'react'
import ReactDOM from 'react-dom'
import { App } from '@/components'
import * as serviceWorker from './serviceWorker'
import { Global } from '@emotion/core'
import { css } from '@emotion/core'
import { reset, global } from '@/styles'

export const CSS = {
  global: css`
    ${reset}
    ${global}
  `
}

ReactDOM.render(
  <React.StrictMode>
    <Global styles={CSS['global']} />
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
