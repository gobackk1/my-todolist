import React from 'react'
import { Button, makeStyles, Typography } from '@material-ui/core'
import { useFirebase } from '@/scripts/hooks'
import { theme } from '@/styles'
import { EMailField, PasswordField, LoginOrSignUpForm, SuccessButton } from '@/components'
import { useForm } from 'react-hook-form'
import iconGoogle from '@/images/icon_google.png'

type Props = {
  setView: React.Dispatch<React.SetStateAction<'login' | 'signup'>>
}

type FormValue = {
  email: string
  password: string
}

export const LoginView: React.FC<Props> = ({ setView }) => {
  const styles = useStyles()
  const {
    register,
    handleSubmit,
    errors,
    formState: { isDirty, isSubmitting, isValid },
    reset
  } = useForm({
    mode: 'onChange'
  })
  const { login, loginWithGoogleProvider } = useFirebase()

  const onSubmit = React.useCallback<(value: FormValue) => void>(
    value => login({ ...value, reset }),
    [login, reset]
  )

  return (
    <section className={`AppLoginView-root ${styles.root}`}>
      <Typography variant="h3" className={styles.title}>
        ログイン
      </Typography>
      <LoginOrSignUpForm onSubmit={handleSubmit(onSubmit)}>
        <EMailField errors={errors} register={register} />
        <br />
        <PasswordField register={register} />
        <br />
        <div className={styles['buttons']}>
          <Button
            onClick={() => {
              setView('signup')
            }}
            variant="contained"
            disableElevation
            color="primary"
            className="AppLoginView-signInButton"
          >
            新規登録へ
          </Button>
          <SuccessButton
            variant="contained"
            disableElevation
            type="submit"
            disabled={!isDirty || isSubmitting || !isValid}
            className={`AppLoginView-buttonLogin ${styles.buttonLogin}`}
          >
            ログイン
          </SuccessButton>
        </div>
      </LoginOrSignUpForm>
      {/* ここから下は切り出して良いかも */}
      <Typography variant="h4" className={styles.subTitle}>
        または
      </Typography>
      <Button
        onClick={loginWithGoogleProvider}
        variant="contained"
        fullWidth
        className={`AppLoginView-buttonGoogleProvider ${styles.buttonGoogle}`}
      >
        <img src={iconGoogle} alt="googleアイコン" />
        Google アカウントでログイン
      </Button>
      <p className={styles.licence}>
        {`Icons made by `}
        <a
          href="https://www.flaticon.com/authors/freepik"
          target="_blank"
          rel="noreferrer"
          title="Freepik"
        >
          Freepik
        </a>
        {` from `}
        <a href="https://www.flaticon.com/" target="_blank" rel="noreferrer" title="Flaticon">
          www.flaticon.com
        </a>
      </p>
    </section>
  )
}

const useStyles = makeStyles(() => ({
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing(3),
    fontWeight: 'bold'
  },
  subTitle: {
    textAlign: 'center',
    margin: `${theme.spacing(2)}px 0`
  },
  buttonGoogle: {
    background: theme.palette.white,
    '&:hover': {
      background: theme.palette.white
    },
    '& img': {
      marginRight: theme.spacing(1)
    }
  },
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
  licence: {
    marginTop: theme.spacing(2),
    fontSize: 12,
    color: '#8a8a8a',
    textAlign: 'center',
    '& a': {
      color: 'inherit'
    }
  },
  buttonLogin: {
    // '&:not(.Mui-disabled)': {
    //   backgroundColor: theme.palette.success.main
    // }
  }
}))
