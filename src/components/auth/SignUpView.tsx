import React from 'react'
import { Typography, makeStyles, Button } from '@material-ui/core'
import { theme } from '@/styles'
import { EMailField, PasswordField, LoginOrSignUpForm } from '@/components'
import { useForm } from 'react-hook-form'
import { useFirebase } from '@/scripts/hooks'
import { SuccessButton } from '../button'

export const SignUpView: React.FC<Props> = ({ setView }) => {
  const styles = useStyles()
  const {
    register,
    handleSubmit,
    errors,
    formState: { isDirty, isSubmitting, isValid }
  } = useForm({ mode: 'onChange' })
  const { signUp } = useFirebase()

  return (
    <section className={`${styles.root} AppSignUpView-root`}>
      <Typography variant="h3" className={styles.title}>
        新規登録
      </Typography>
      <Typography className={styles.description}>
        登録するメールアドレスとパスワードを入力してください
      </Typography>
      <LoginOrSignUpForm onSubmit={handleSubmit(signUp)}>
        <EMailField errors={errors} register={register} />
        <br />
        <PasswordField errors={errors} register={register} />
        <br />
        <div className={styles.buttons}>
          <Button
            onClick={() => setView('login')}
            variant="contained"
            disableElevation
            color="primary"
          >
            ログインへ
          </Button>
          <SuccessButton
            type="submit"
            variant="contained"
            disableElevation
            disabled={!isDirty || isSubmitting || !isValid}
          >
            登録
          </SuccessButton>
        </div>
      </LoginOrSignUpForm>
    </section>
  )
}

const useStyles = makeStyles(() => ({
  root: {
    width: 300,
    '& > .MuiButtonBase-root': {
      marginBottom: theme.spacing(2)
    }
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing(3),
    fontWeight: 'bold'
  },
  description: {
    marginBottom: theme.spacing(2)
  }
}))

type Props = {
  setView: React.Dispatch<React.SetStateAction<'login' | 'signup'>>
}
