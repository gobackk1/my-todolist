import React from 'react'
import { Button, makeStyles, Typography } from '@material-ui/core'
import { useFirebase } from '@/scripts/hooks'
import { theme } from '@/styles'
import {
  EMailField,
  PasswordField,
  LoginOrSignUpForm,
  SuccessButton
} from '@/components'
import { useForm } from 'react-hook-form'
import iconGoogle from '@/images/icon_google.png'

type Props = {
  setView: React.Dispatch<React.SetStateAction<'login' | 'signup'>>
}

export const LoginView: React.FC<Props> = ({ setView }) => {
  const styles = useStyles()
  const {
    register,
    handleSubmit,
    errors,
    formState: { isDirty, isSubmitting, isValid }
  } = useForm({
    mode: 'onChange'
  })
  const { login, loginWithGoogleProvider } = useFirebase()

  return (
    <section className={`AppLoginView-root ${styles.root}`}>
      <Typography variant="h3" className={styles.title}>
        ログイン
      </Typography>
      <LoginOrSignUpForm onSubmit={handleSubmit(login)}>
        <EMailField errors={errors} register={register} />
        <br />
        <PasswordField register={register} />
        <br />
        <div className={styles['buttons']}>
          <SuccessButton
            variant="contained"
            disableElevation
            type="submit"
            disabled={!isDirty || isSubmitting || !isValid}
            className={`AppLoginView-buttonLogin ${styles.buttonLogin}`}
          >
            ログイン
          </SuccessButton>
          <Button
            onClick={() => {
              setView('signup')
            }}
            variant="contained"
            disableElevation
            color="primary"
          >
            新規登録へ
          </Button>
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
        className={(styles.buttonGoogle, 'AppLoginView-buttonGoogleProvider')}
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
        <a
          href="https://www.flaticon.com/"
          target="_blank"
          rel="noreferrer"
          title="Flaticon"
        >
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
    '& img': {
      marginRight: theme.spacing(1)
    }
  },
  root: {
    width: 300,
    '& .MuiButtonBase-root': {
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
