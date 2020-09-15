import React from 'react'
import {
  AppHeader,
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
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core'
import { ThemeProvider as EmotionThemeProvider } from 'emotion-theming'

/**
 * Material-UI, emotion に渡す theme オブジェクト
 */
const theme: Theme = createMuiTheme({
  typography: {
    button: {
      textTransform: 'none'
    },
    h2: {
      fontSize: 24
    },
    h3: {
      fontSize: 20
    },
    h4: {
      fontSize: 17
    },
    h5: {
      fontSize: 14
    },
    h6: {
      fontSize: 11
    }
  }
})

/**
 * このプロダクトのグローバルに適用するスタイル
 */
export const globalStyle = css`
  ${reset}
  ${global}
`

/**
 * index.tsx でマウントするコンポーネント
 * 大まかな設定は App.tsx に抽出する
 */
export const App: React.FC = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <EmotionThemeProvider theme={theme}>
        <Global styles={globalStyle} />
        <BrowserRouter>
          <ReduxProvider store={store}>
            <Authentication>
              <SnackbarProvider
                autoHideDuration={OPTION.SNACKBAR.AUTO_HIDE_DURATION}
                position={OPTION.SNACKBAR.POSITION}
              >
                <AppHeader />
                <Switch>
                  <Route
                    path={`${OPTION.PATH.BOARD}/:boardId?`}
                    component={Board}
                  />
                </Switch>
              </SnackbarProvider>
            </Authentication>
          </ReduxProvider>
        </BrowserRouter>
      </EmotionThemeProvider>
    </MuiThemeProvider>
  )
}
