import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as I from '@/scripts/model/interface'
import { Button, makeStyles, Typography, TextField } from '@material-ui/core'
import firebase from 'firebase'
import { useHistory, Link } from 'react-router-dom'
import { useSnackbarContext } from '@/scripts/hooks'
import { OPTION } from '@/option'
import { setLoggingIn } from '@/scripts/redux/state/user/actions'
import { css } from '@emotion/core'
import { theme } from '@/styles'
import { EMailField, PasswordField, LoginOrSignUpForm } from '@/components'
import { useForm, SubmitHandler } from 'react-hook-form'

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

export const LoginView: React.FC<Props> = ({ setView }) => {
  const userState = useSelector((state: I.ReduxState) => state.user)
  const dispatch = useDispatch()
  const history = useHistory()
  const { showSnackbar } = useSnackbarContext()
  const muiStyles = useStyles()
  const {
    register,
    handleSubmit,
    errors,
    formState: { isDirty, isSubmitting, isValid },
    reset
  } = useForm({ mode: 'onChange' })

  const onClickGoogleLogin = React.useCallback(async () => {
    dispatch(setLoggingIn(true))
    try {
      await firebase
        .auth()
        .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      showSnackbar({
        message: OPTION.MESSAGE.LOGIN.SUCCESS,
        type: 'success'
      })
      dispatch(setLoggingIn(false))
      history.push(OPTION.PATH.BOARD)
    } catch (e) {
      showSnackbar({
        message: OPTION.MESSAGE.LOGIN.ERROR,
        type: 'error'
      })
      dispatch(setLoggingIn(false))
    }
  }, [history, showSnackbar, dispatch])

  const onSubmit: SubmitHandler<FormValue> = async ({ email, password }) => {
    dispatch(setLoggingIn(true))
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password)
      showSnackbar({
        message: OPTION.MESSAGE.LOGIN.SUCCESS,
        type: 'success'
      })
      dispatch(setLoggingIn(false))
      history.push(OPTION.PATH.BOARD)
    } catch (e) {
      console.log(e)
      switch (e.code) {
        case 'auth/user-not-found':
          showSnackbar({
            message: OPTION.MESSAGE.AUTH.USER_NOT_FOUND,
            type: 'error'
          })
          break

        case 'auth/user-disabled':
          showSnackbar({
            message: OPTION.MESSAGE.AUTH.USER_DISABLED,
            type: 'error'
          })
          break

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
      dispatch(setLoggingIn(false))
    }
  }

  return (
    <section id="modal-login">
      <Typography variant="h3" className={muiStyles['title']}>
        ログイン
      </Typography>
      <LoginOrSignUpForm onSubmit={handleSubmit(onSubmit)}>
        <EMailField errors={errors} register={register} />
        <br />
        <PasswordField errors={errors} register={register} />
        <br />
        <Button
          variant="contained"
          disableElevation
          type="submit"
          disabled={!isDirty || isSubmitting || !isValid}
        >
          ログイン
        </Button>
      </LoginOrSignUpForm>
      <button
        onClick={onClickGoogleLogin}
        type="button"
        id="btn-login-with-google"
      >
        Google アカウントでログイン
      </button>
      <button
        onClick={() => {
          setView('signup')
        }}
      >
        signup
      </button>
    </section>
  )
}
