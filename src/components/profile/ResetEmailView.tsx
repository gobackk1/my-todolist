import React from 'react'
import { Button, TextField, Typography } from '@material-ui/core'
import { useForm, SubmitHandler } from 'react-hook-form'
import firebase from 'firebase/app'
import { OPTION } from '@/option'
import { useSnackbarContext } from '@/scripts/hooks'
import { theme } from '@/styles'
import { makeStyles } from '@material-ui/styles'

export const ResetEmailView: React.FC<{ setView: any }> = ({ setView }) => {
  const {
    register,
    handleSubmit,
    errors,
    formState: { isValid }
  } = useForm({ mode: 'onChange' })
  const { showSnackbar } = useSnackbarContext()
  const styles = useStyles()
  const [isSubmitting, setSubmitting] = React.useState(false)

  const isEmailAndPasswordProvider = (): boolean => {
    const { currentUser } = firebase.auth()
    if (!currentUser) return false

    return currentUser.providerData.some(data =>
      data ? data.providerId === 'password' : false
    )
  }

  const updateUserEmail = React.useCallback(
    async (newEmail: string, password: string): Promise<void> => {
      const currentUser = firebase.auth().currentUser

      if (!currentUser || !currentUser.email) return

      const credential = firebase.auth.EmailAuthProvider.credential(
        currentUser.email,
        password
      )
      setSubmitting(true)

      try {
        await currentUser.reauthenticateAndRetrieveDataWithCredential(
          credential
        )
        await currentUser.updateEmail(newEmail)
        await currentUser.sendEmailVerification({
          url: OPTION.URL_AFTER_EMAIL_CONFIRMATION
        })
        showSnackbar({
          message: OPTION.MESSAGE.AUTH.SEND_EMAIL_VERIFICATION,
          type: 'info'
        })
        setSubmitting(false)
        setView('root')
      } catch ({ code, message }) {
        console.log('debug: reauthenticateAndRetrieveDataWithCredential')
        setSubmitting(false)
        switch (code) {
          case 'auth/wrong-password':
            showSnackbar({
              message: OPTION.MESSAGE.AUTH.WRONG_PASSWORD,
              type: 'error'
            })
            break

          default:
            showSnackbar({
              message: OPTION.MESSAGE.SERVER_CONNECTION_ERROR,
              type: 'error'
            })
            break
        }
      }
    },
    [showSnackbar, setView]
  )

  const onSubmitResetEmail: SubmitHandler<{
    newEmail: string
    password: string
  }> = React.useCallback(
    async ({ newEmail, password }) => {
      console.log('check')
      await updateUserEmail(newEmail, password)
    },
    [updateUserEmail]
  )

  return (
    <section className={`${styles.root}`}>
      <Button onClick={() => setView('root')}>戻る</Button>
      <Typography variant="h3">メールアドレスの変更</Typography>
      <Typography variant="body1">
        変更後のメールアドレスと、現在のパスワードを入力してください
      </Typography>
      <form onSubmit={handleSubmit(onSubmitResetEmail)}>
        {/* パスワードを間違えたら credential error になること */}
        <TextField
          error={!!errors.newEmail}
          name="newEmail"
          inputRef={register({
            required: 'メールアドレスは必須です',
            maxLength: {
              value: 30,
              message: 'メールアドレスは30'
            },
            pattern: {
              /**
               * https://qiita.com/sakuro/items/1eaa307609ceaaf51123
               */
              value: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, // eslint-disable-line
              message: 'メールアドレスの例/ example@exam.com'
            }
          })}
          type="email"
          label="変更後のメールアドレス"
          helperText={errors.newEmail && errors.newEmail.message}
          variant="filled"
          size="small"
          autoFocus={true}
          required={true}
        />
        <br />
        <TextField
          error={errors ? !!errors.password : false}
          name="password"
          inputRef={register({
            required: 'パスワードは必須です',
            maxLength: {
              value: 20,
              message: 'パスワードは6~20文字の英数小文字で入力してください'
            },
            minLength: {
              value: 6,
              message: 'パスワードは6~20文字の英数小文字で入力してください'
            },
            pattern: {
              value: /^[a-z0-9]+$/,
              message: 'パスワードは6~20文字の英数小文字で入力してください'
            }
          })}
          type="password"
          label="パスワード"
          helperText={
            errors ? errors.password && errors.password.message : false
          }
          variant="filled"
          size="small"
          required={true}
        />
        <br />
        <Button type="submit" disabled={isSubmitting || !isValid}>
          送信
        </Button>
      </form>
    </section>
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
