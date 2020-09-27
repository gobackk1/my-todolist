import { SnackbarOrigin } from '@material-ui/core'

export const OPTION = {
  PATH: {
    HOME: '/',
    BOARD: '/boards'
  },
  URL_AFTER_EMAIL_CONFIRMATION: `http://${document.domain}:${
    document.domain ? '8080' : ''
  }/boards`,
  SNACKBAR: {
    AUTO_HIDE_DURATION: 5000,
    POSITION: {
      vertical: 'top',
      horizontal: 'center'
    } as SnackbarOrigin
  },
  BOARD: {
    TITLE: {
      MAX_LENGTH: 50
    }
  },
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
      'サーバーと接続できませんでした。サーバーとの接続を確認し、操作をやり直して下さい。',
    BOARD: {
      TITLE: {
        MAX_LENGTH_ERROR: 'タイトルは50字以内で指定してください',
        REQUIRED_ERROR: 'タイトルは必須です'
      }
    },
    AUTH: {
      SEND_EMAIL_VERIFICATION:
        '確認メールを送信しました。受信メールを確認し、アカウントを有効化してから画面を更新してください',
      EMAIL_ALREADY_IN_USE:
        'すでに利用されているメールアドレスです。別のメールアドレスを入力してください',
      USER_NOT_FOUND:
        'メールアドレスが見つかりませんでした。まずはサインインしてユーザーを登録してください',
      USER_DISABLED:
        'ロックされたアカウントです。ロックを解除するにはサポートに問い合わせてください',
      WRONG_PASSWORD: 'パスワードが正しくありません。もう一度やり直してください'
    },
    ABORT:
      'state でエラーが発生しているか、board の fetch 中に呼び出そうとしました。'
  }
} as const
