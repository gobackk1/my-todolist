import React from 'react'
import {
  AppHeader,
  Home,
  Board,
  SnackbarProvider,
  Authentication
} from '@/components'
import { Switch, Route, BrowserRouter } from 'react-router-dom'
import { Global } from '@emotion/core'
import { css } from '@emotion/core'
import { reset, global } from '@/styles'
import { OPTION } from '@/option'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from '~redux/store'

/**
 * index.tsx でマウントするコンポーネント
 * 大まかな設定は App.tsx に抽出する
 */
export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ReduxProvider store={store}>
        <Authentication>
          <Global styles={globalStyle} />
          <SnackbarProvider
            autoHideDuration={OPTION.AUTO_HIDE_DURATION}
            position={OPTION.POSITION}
          >
            <AppHeader />
            <Switch>
              <Route path={OPTION.PATH.BOARD} component={Board} />
              <Route path={OPTION.PATH.HOME} component={Home} exact />
            </Switch>
          </SnackbarProvider>
        </Authentication>
      </ReduxProvider>
    </BrowserRouter>
  )
}

export const globalStyle = css`
  ${reset}
  ${global}
`
