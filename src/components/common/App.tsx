import React from 'react'
import {
  AppHeader,
  Home,
  Board,
  Authentication,
  SnackbarProvider
} from '@/components'
import { Switch, Route, BrowserRouter } from 'react-router-dom'
import { Global } from '@emotion/core'
import { css } from '@emotion/core'
import { reset, global } from '@/styles'
import { OPTION } from '@/option'
/**
 * index.tsx でマウントするコンポーネント
 * 大まかな設定は App.tsx に抽出する
 */
export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Global styles={globalStyle} />
      <Authentication>
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
    </BrowserRouter>
  )
}

export const globalStyle = css`
  ${reset}
  ${global}
`
