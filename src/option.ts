import { SnackbarOrigin } from '@material-ui/core'

export const OPTION = {
  PATH: {
    HOME: '/',
    BOARD: '/board'
  },
  AUTO_HIDE_DURATION: 5000,
  POSITION: {
    vertical: 'top',
    horizontal: 'center'
  } as SnackbarOrigin,
  MESSAGE: {
    LOGIN: {
      SUCCESS: 'ログインしました',
      ERROR: 'ログインに失敗しました。サーバーとの接続を確認して下さい。'
    },
    LOGOUT: {
      SUCCESS: 'ログアウトしました',
      ERROR: 'ログアウトに失敗しました。サーバーとの接続を確認して下さい。'
    }
  }
} as const
