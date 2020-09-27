import React from 'react'
import { Typography, makeStyles, Button } from '@material-ui/core'
import { theme } from '@/styles'
import { EMailField, PasswordField } from '@/components'
import { useForm } from 'react-hook-form'

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
  },
  form: {
    '& .MuiTextField-root': {
      marginBottom: theme.spacing(2)
    }
  }
}))

type Props = {
  setView: React.Dispatch<React.SetStateAction<'login' | 'signup'>>
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
  return (
    <>
      <Typography variant="h3" className={muiStyles['title']}>
        サインアップ
      </Typography>
      <form className={muiStyles['form']}>
        <EMailField errors={errors} register={register} />
        <br />
        <PasswordField errors={errors} register={register} />
        <br />
        <Button variant="contained" disableElevation>
          登録
        </Button>
      </form>
      <button
        onClick={() => {
          setView('login')
        }}
      >
        login
      </button>
    </>
  )
}
