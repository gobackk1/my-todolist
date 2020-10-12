import React from 'react'
import { Button } from '@material-ui/core'
import firebase from 'firebase/app'
import { makeStyles } from '@material-ui/styles'
import { ResetEmailView } from '@/components'
import { useSnackbarContext } from '@/scripts/hooks'
import { OPTION } from '@/option'
import { useDispatch } from 'react-redux'
import { setLoggingIn } from '~redux/state/currentUser/actions'
import { useHistory } from 'react-router'

export const ProfileSetting: React.FC = () => {
  const [view, setView] = React.useState<'root' | 'resetEmail' | 'resetPW'>(
    'root'
  )
  const { showSnackbar } = useSnackbarContext()
  const [isSubmitting, setSubmitting] = React.useState(false)
  const dispatch = useDispatch()
  const history = useHistory()
  const styles = useStyles()

  const isEmailAndPasswordProvider = React.useCallback((): boolean => {
    const { currentUser } = firebase.auth()
    if (!currentUser) return false

    return currentUser.providerData.some(data =>
      data ? data.providerId === 'password' : false
    )
  }, [])

  const sendPasswordResetEmail = React.useCallback(async () => {
    if (!confirm('パスワードを再設定しますか？')) return

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
  }, [showSnackbar])

  const dispatchSignOut = React.useCallback(async () => {
    dispatch(setLoggingIn(true))
    try {
      await firebase.auth().signOut()
      showSnackbar({
        message: OPTION.MESSAGE.LOGOUT.SUCCESS,
        type: 'success'
      })
      dispatch(setLoggingIn(false))
      history.push('/')
    } catch (e) {
      showSnackbar({
        message: OPTION.MESSAGE.LOGOUT.ERROR,
        type: 'error'
      })
      dispatch(setLoggingIn(false))
    }
  }, [history, showSnackbar, dispatch])

  const onClickLogout = React.useCallback(() => {
    if (!confirm('本当にログアウトしますか？')) return
    dispatchSignOut()
  }, [dispatchSignOut])

  return (
    <div className={`AppProfileSetting-root ${styles.root}`}>
      {view === 'root' && (
        <>
          <Button
            onClick={() => setView('resetEmail')}
            disabled={!isEmailAndPasswordProvider()}
          >
            メールアドレスを変更する...
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
          <br />
          <Button onClick={onClickLogout}>ログアウトする</Button>
          <br />
          <Button disabled>退会する(実装予定)</Button>
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
    '& > button .MuiButton-label': {
      textDecoration: 'underline'
    }
  }
})
