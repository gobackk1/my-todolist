import React from 'react'
import { Button, TextField } from '@material-ui/core'
import { useForm, SubmitHandler } from 'react-hook-form'
import firebase from 'firebase/app'
import { OPTION } from '@/option'
import { useSnackbarContext } from '@/scripts/hooks'

export const ProfileSetting: React.FC = () => {
  const [view, setView] = React.useState<'root' | 'resetEmail' | 'resetPW'>(
    'root'
  )
  const {
    register,
    handleSubmit,
    errors,
    formState: { isDirty, isSubmitting, isValid }
  } = useForm({ mode: 'onChange' })
  const { showSnackbar } = useSnackbarContext()

  //hook化
  const onSubmitResetEmail: SubmitHandler<{
    newEmail: string
    password: string
  }> = ({ newEmail, password }) => {
    updateUserEmail(newEmail, password)
  }

  console.log(firebase.auth().currentUser!.providerData)

  const isEmailAndPasswordProvider = (): boolean => {
    const { currentUser } = firebase.auth()
    if (!currentUser) return false

    return currentUser.providerData.some(data =>
      data ? data.providerId === 'password' : false
    )
  }

  const updateUserEmail = async (
    newEmail: string,
    password: string
  ): Promise<void> => {
    const currentUser = firebase.auth().currentUser

    if (!currentUser || !currentUser.email) return

    const credential = firebase.auth.EmailAuthProvider.credential(
      currentUser.email,
      password
    )
    //k_k11111_0327@yahoo.co.jp
    try {
      await currentUser.reauthenticateAndRetrieveDataWithCredential(credential)
      await currentUser.updateEmail(newEmail)
      await currentUser.sendEmailVerification({
        url: OPTION.URL_AFTER_EMAIL_CONFIRMATION
      })
      showSnackbar({
        message: OPTION.MESSAGE.AUTH.SEND_EMAIL_VERIFICATION,
        type: 'info'
      })
      setView('root')
    } catch (error) {
      console.log('debug: reauthenticateAndRetrieveDataWithCredential', error)
      // credential error handle
      // auth/wrong-password
      showSnackbar({
        message: error.message,
        type: 'info'
      })
      // showSnackbar({
      //   message: OPTION.MESSAGE.SERVER_CONNECTION_ERROR,
      //   type: 'info'
      // })
    }
  }

  return (
    <>
      {view === 'root' && (
        <>
          {/* 外部認証かどうか調べ、ボタンを非活性したり、フィードバックを出す必要がある */}
          {/* ボタンの活性状態をチェックする */}
          <Button
            onClick={() => setView('resetEmail')}
            disabled={!isEmailAndPasswordProvider()}
          >
            メールアドレスを変更する
          </Button>
          <br />
          <Button disabled={true}>パスワードを変更する(実装予定)</Button>
        </>
      )}

      {view === 'resetEmail' && (
        <form onSubmit={handleSubmit(onSubmitResetEmail)}>
          <div>変更後のメールとパスワードを入力させる</div>
          {/* パスワードを間違えたら credential error になること */}
          <TextField name="newEmail" label="email" inputRef={register} />
          <TextField name="password" label="password" inputRef={register} />
          <Button type="submit">送信</Button>
        </form>
      )}
    </>
  )
}
