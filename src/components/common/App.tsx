import React from 'react'
import {
  AppHeader,
  Board,
  Home,
  SnackbarProvider,
  Authentication,
  EmotionGlobal
} from '@/components'
import { Switch, Route, BrowserRouter } from 'react-router-dom'
import { theme } from '@/styles'
import { OPTION } from '@/option'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from '~redux/store'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { ThemeProvider as EmotionThemeProvider } from 'emotion-theming'
import firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/auth'

firebase.initializeApp({
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID
})

/**
 * index.tsx でマウントするコンポーネント
 * 大まかな設定は App.tsx に抽出する
 */
export const App: React.FC = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <EmotionThemeProvider theme={theme}>
        <EmotionGlobal />
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
                    path={`${OPTION.PATH.BOARD}/:boardId`}
                    component={Board}
                  />
                  <Route path={OPTION.PATH.BOARD} component={Board} />
                  <Route path="/login" exact component={Home} />
                  <Route path="/" exact component={Home} />
                </Switch>
              </SnackbarProvider>
            </Authentication>
          </ReduxProvider>
        </BrowserRouter>
      </EmotionThemeProvider>
    </MuiThemeProvider>
  )
}
