import React from 'react'
import { Typography, makeStyles, Button } from '@material-ui/core'
import { theme } from '@/styles'
import { EMailField, PasswordField, LoginOrSignUpForm } from '@/components'
import { useForm, SubmitHandler } from 'react-hook-form'
import firebase from 'firebase'
import { OPTION } from '@/option'
import { useSnackbarContext } from '@/scripts/hooks'
import { css } from '@emotion/core'

export const TEXT = {
  BUTTON: {
    LOGIN: 'ログイン',
    LOGIN_WITH_GOOGLE_AUTH: 'Google アカウントでログイン',
    LOGOUT: 'ログアウト'
  },
  REQUIRE_EMAIL: 'メールアドレスは必須です'
} as const

const styles = {
  section: css`
    width: 300px;

    .MuiButtonBase-root {
      margin-bottom: ${theme.spacing(2)}px;
    }
  `,
  buttons: css`
    display: flex;
    justify-content: space-between;
  `
}

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
    formState: { isDirty, isSubmitting, isValid }
  } = useForm({ mode: 'onChange' })
  const { showSnackbar } = useSnackbarContext()

  const onSubmit: SubmitHandler<FormValue> = async ({ email, password }) => {
    try {
      /**
       * ユーザーを登録する
       */
      await firebase.auth().createUserWithEmailAndPassword(email, password)

      /**
       * 登録後、確認メールを送信する
       */
      const user = firebase.auth().currentUser
      if (user) {
        await user.sendEmailVerification({
          url: OPTION.URL_AFTER_EMAIL_CONFIRMATION
        })
        showSnackbar({
          message: OPTION.MESSAGE.AUTH.SEND_EMAIL_VERIFICATION,
          type: 'info'
        })
      }
    } catch (e) {
      console.log(e)
      if (e.code === 'auth/email-already-in-use') {
        showSnackbar({
          message: OPTION.MESSAGE.AUTH.EMAIL_ALREADY_IN_USE,
          type: 'info'
        })
      } else {
        showSnackbar({
          message: OPTION.MESSAGE.SERVER_CONNECTION_ERROR,
          type: 'error'
        })
      }
    }
  }

  return (
    <section css={styles['section']}>
      <Typography variant="h3" className={muiStyles['title']}>
        新規登録
      </Typography>
      <LoginOrSignUpForm onSubmit={handleSubmit(onSubmit)}>
        <EMailField errors={errors} register={register} />
        <br />
        <PasswordField errors={errors} register={register} />
        <br />
        <div css={styles['buttons']}>
          <Button
            type="submit"
            variant="contained"
            disableElevation
            disabled={!isDirty || isSubmitting || !isValid}
          >
            登録
          </Button>
          <Button
            onClick={() => {
              setView('login')
            }}
            variant="contained"
            disableElevation
          >
            ログインへ
          </Button>
        </div>
      </LoginOrSignUpForm>
    </section>
  )
}
