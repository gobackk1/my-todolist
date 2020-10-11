import React from 'react'
import { Button } from '@material-ui/core'
import firebase from 'firebase/app'
import { theme } from '@/styles'
import { makeStyles } from '@material-ui/styles'
import { ResetEmailView } from '@/components'
import { useSnackbarContext } from '@/scripts/hooks'
import { OPTION } from '@/option'

export const ProfileSetting: React.FC = () => {
  const [view, setView] = React.useState<'root' | 'resetEmail' | 'resetPW'>(
    'root'
  )
  const { showSnackbar } = useSnackbarContext()
  const [isSubmitting, setSubmitting] = React.useState(false)

  const isEmailAndPasswordProvider = React.useCallback((): boolean => {
    const { currentUser } = firebase.auth()
    if (!currentUser) return false

    return currentUser.providerData.some(data =>
      data ? data.providerId === 'password' : false
    )
  }, [])

  const sendPasswordResetEmail = React.useCallback(async () => {
    const auth = firebase.auth()
    const currentUser = auth.currentUser
    if (!currentUser || !currentUser.email) return

    setSubmitting(true)
    try {
      await auth.sendPasswordResetEmail(currentUser.email)
      showSnackbar({
        message: `${currentUser.email} にパスワード再設定メールを送信しました。`,
        type: 'info'
      })
      setSubmitting(false)
    } catch (error) {
      console.log('debug: sendPasswordResetEmail', error)
      showSnackbar({
        message: OPTION.MESSAGE.SERVER_CONNECTION_ERROR,
        type: 'error'
      })
      setSubmitting(false)
    }
  }, [])

  return (
    <div className={`AppProfileSetting-root`}>
      {view === 'root' && (
        <>
          <Button
            onClick={() => setView('resetEmail')}
            disabled={!isEmailAndPasswordProvider()}
          >
            メールアドレスを変更する
          </Button>
          <br />
          {/*
            TODO:
            1. user_detail_public に、resettingPassword field を設ける
            2. パスワード変更開始と終了とで その field を updateする
            3. resetting password をみてボタンを非活性にする
          */}
          <Button
            onClick={() => sendPasswordResetEmail()}
            // onClick={() => setView('resetPW')}
            disabled={!isEmailAndPasswordProvider() || isSubmitting}
          >
            パスワードの再設定メールを送信する
          </Button>
        </>
      )}

      {view === 'resetEmail' && <ResetEmailView setView={setView} />}
      {/* 独自にPW再設定画面を設ける場合は view を分ける */}
      {/* {view === 'resetPW' && <ResetPasswordView setView={setView} />} */}
    </div>
  )
}

const useStyles = makeStyles({
  root: {
    '& .MuiTypography-root': {
      marginBottom: theme.spacing(2)
    },
    '& .MuiTextField-root': {
      marginBottom: theme.spacing(2),
      width: 250
    }
  }
})
