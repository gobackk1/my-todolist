import React from 'react'
import { Typography, makeStyles, Button } from '@material-ui/core'
import { theme } from '@/styles'
import { EMailField, PasswordField, LoginOrSignUpForm } from '@/components'
import { useForm, SubmitHandler } from 'react-hook-form'
import firebase from 'firebase'
import { OPTION } from '@/option'
import { useSnackbarContext } from '@/scripts/hooks'
import * as I from '@/scripts/model/interface'
import { useSelector } from 'react-redux'

export const TEXT = {
  BUTTON: {
    LOGIN: 'ログイン',
    LOGIN_WITH_GOOGLE_AUTH: 'Google アカウントでログイン',
    LOGOUT: 'ログアウト'
  },
  REQUIRE_EMAIL: 'メールアドレスは必須です'
} as const

const useStyles = makeStyles(() => ({
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing(3),
    fontWeight: 'bold'
  }
}))

type Props = {
  setView: React.Dispatch<React.SetStateAction<'login' | 'signup'>>
}

type FormValue = {
  email: string
  password: string
}

export const SignUpView: React.FC<Props> = ({ setView }) => {
  const muiStyles = useStyles()
  const {
    register,
    handleSubmit,
    errors,
    formState: { isDirty, isSubmitting, isValid },
    reset
  } = useForm({ mode: 'onChange' })
  const { showSnackbar } = useSnackbarContext()
  const userState = useSelector((state: I.ReduxState) => state.user)

  const onSubmit: SubmitHandler<FormValue> = async ({ email, password }) => {
    try {
      /**
       * ユーザーを登録する
       */
      await firebase.auth().createUserWithEmailAndPassword(email, password)

      // すでにユーザーが登録済みだったらフィードバックを返す

      const user = firebase.auth().currentUser

      /**
       * 登録後、確認メールを送信する
       */
      if (user) {
        user.sendEmailVerification({
          url: OPTION.URL_AFTER_EMAIL_CONFIRMATION
        })
        showSnackbar({
          message: OPTION.MESSAGE.SEND_EMAIL_VERIFICATION,
          type: 'info'
        })
      }
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <section>
      <Typography variant="h3" className={muiStyles['title']}>
        サインアップ
      </Typography>
      <LoginOrSignUpForm onSubmit={handleSubmit(onSubmit)}>
        <EMailField errors={errors} register={register} />
        <br />
        <PasswordField errors={errors} register={register} />
        <br />
        <Button
          type="submit"
          variant="contained"
          disableElevation
          disabled={!isDirty || isSubmitting || !isValid}
        >
          登録
        </Button>
      </LoginOrSignUpForm>
      <button
        onClick={() => {
          setView('login')
        }}
      >
        login
      </button>
    </section>
  )
}
