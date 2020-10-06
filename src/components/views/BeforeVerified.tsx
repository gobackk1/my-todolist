import React from 'react'
import firebase from 'firebase'
import { useSnackbarContext } from '@/scripts/hooks'
import { LoadingSpinner } from '@/components'
import { useSelector } from 'react-redux'
import { OPTION } from '@/option'

export const BeforeVerified: React.FC = () => {
  const { showSnackbar } = useSnackbarContext()
  const currentUserState = useSelector(state => state.currentUser)

  const onClick = () => {
    const user = firebase.auth().currentUser
    if (user) {
      user.sendEmailVerification({
        url: OPTION.URL_AFTER_EMAIL_CONFIRMATION
      })
      showSnackbar({
        message: OPTION.MESSAGE.AUTH.SEND_EMAIL_VERIFICATION,
        type: 'info'
      })
    }
  }

  return (
    <div>
      {currentUserState.isLoggingIn ? (
        <LoadingSpinner />
      ) : (
        <>
          メールアドレスの確認が終わっていません。受信メールを確認し、アカウントを有効化してから画面を更新してください
          <button onClick={onClick}>確認用メールを再送信する</button>
        </>
      )}
    </div>
  )
}
