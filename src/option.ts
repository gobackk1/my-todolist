import { SnackbarOrigin } from '@material-ui/core'
import bg1 from '@/images/bg/bg_photo_1.jpg'
import bg2 from '@/images/bg/bg_photo_2.jpg'
import bg3 from '@/images/bg/bg_photo_3.jpg'
import bg4 from '@/images/bg/bg_photo_4.jpg'
import bg5 from '@/images/bg/bg_photo_5.jpg'
import bg6 from '@/images/bg/bg_photo_6.jpg'

export const OPTION = {
  PATH: {
    HOME: '/',
    BOARD: '/boards',
    USER_PROFILE: '/profile',
    BEFORE_VERIFIED: '/before_verified'
  },
  COLLECTION_PATH: {
    BOARDS_LIVE: 'boards_live',
    BOARDS_ARCHIVED: 'boards_archived',
    RELATIONSHIPS_FAVORITE: 'relationships_favorite',
    USERS: 'users',
    USER_DETAIL_PUBLIC: 'user_detail_public',
    RUNTIME_ERROR_REPORTS: 'runtime_error_reports'
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
    },
    BG: {
      COLORS: [
        '#cccccc',
        '#00bcd4',
        '#6bff9f',
        '#ff9800',
        '#e91e63',
        '#4caf50'
      ],
      PHOTO: [
        {
          alt: '背景1を選択するボタン',
          src: bg1
        },
        {
          alt: '背景2を選択するボタン',
          src: bg2
        },
        {
          alt: '背景3を選択するボタン',
          src: bg3
        },
        {
          alt: '背景4を選択するボタン',
          src: bg4
        },
        {
          alt: '背景5を選択するボタン',
          src: bg5
        },
        {
          alt: '背景6を選択するボタン',
          src: bg6
        }
      ]
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
  },
  ROLE: {
    owner: '管理者',
    editor: '編集者',
    reader: '購読者'
  }
} as const
