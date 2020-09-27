import React from 'react'
import firebase from 'firebase'
import { useSnackbarContext } from '@/scripts/hooks'
import { LoadingSpinner } from '@/components'
import * as I from '@/scripts/model/interface'
import { useSelector } from 'react-redux'
import { OPTION } from '@/option'

export const BeforeVerified: React.FC = () => {
  const { showSnackbar } = useSnackbarContext()
  const userState = useSelector((state: I.ReduxState) => state.user)

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
      {userState.isLoggingIn ? (
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
