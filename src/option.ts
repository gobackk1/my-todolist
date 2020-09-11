import { SnackbarOrigin } from '@material-ui/core'

export const OPTION = {
  PATH: {
    HOME: '/',
    BOARD: '/boards'
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
    },
    UNAUTHORIZED_OPERATION:
      '不正な画面遷移でアクセスされた可能性があります。画面を更新し、操作をやり直して下さい。',
    SERVER_CONNECTION_ERROR:
      'サーバーと接続できませんでした。サーバーとの接続を確認し、操作をやり直して下さい。'
  }
} as const
