import React from 'react'
import {
  AppHeader,
  Board,
  SnackbarProvider,
  Authentication
} from '@/components'
import { Switch, Route, BrowserRouter } from 'react-router-dom'
import { Global, css } from '@emotion/core'
import { reset, global } from '@/styles'
import { OPTION } from '@/option'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from '~redux/store'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID
}

firebase.initializeApp(firebaseConfig)

/**
 * Material-UI のグローバルに適用するスタイル
 */
const theme = createMuiTheme({
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
    </MuiThemeProvider>
  )
}
