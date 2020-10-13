import React from 'react'
import {
  BoardTop,
  BoardDetail,
  Home,
  SnackbarProvider,
  EmotionGlobal,
  PageLayout,
  UserProfile,
  BeforeVerified
} from '@/components'
import { Switch, Route, BrowserRouter } from 'react-router-dom'
import { theme } from '@/styles'
import { OPTION } from '@/option'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from '~redux/store'
import { MuiThemeProvider } from '@material-ui/core/styles'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { CreateBoardModalProvider } from '../board/CreateBoardModalProvider'
import { useErrorReport } from '@/scripts/hooks'

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
  useErrorReport()

  return (
    <MuiThemeProvider theme={theme}>
      <EmotionGlobal />
      <BrowserRouter>
        <ReduxProvider store={store}>
          <SnackbarProvider
            autoHideDuration={OPTION.SNACKBAR.AUTO_HIDE_DURATION}
            position={OPTION.SNACKBAR.POSITION}
          >
            <CreateBoardModalProvider>
              <PageLayout>
                <Switch>
                  <Route
                    path={`${OPTION.PATH.BOARD}/:boardId`}
                    component={BoardDetail}
                  />
                  <Route path={OPTION.PATH.BOARD} component={BoardTop} />
                  <Route
                    path={OPTION.PATH.USER_PROFILE}
                    component={UserProfile}
                  />
                  <Route
                    path={OPTION.PATH.BEFORE_VERIFIED}
                    exact
                    component={BeforeVerified}
                  />
                  <Route path="/login" exact component={Home} />
                  <Route path="/" exact component={Home} />
                </Switch>
              </PageLayout>
            </CreateBoardModalProvider>
          </SnackbarProvider>
        </ReduxProvider>
      </BrowserRouter>
    </MuiThemeProvider>
  )
}
