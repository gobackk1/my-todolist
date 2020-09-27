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
import { useForm } from 'react-hook-form'
import { EMailField, PasswordField } from '@/components'

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

  const onClick = React.useCallback(async () => {
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

  return (
    <section id="modal-login">
      <Typography variant="h3" className={muiStyles['title']}>
        ログイン
      </Typography>
      <form className={muiStyles['form']}>
        <EMailField errors={errors} register={register} />
        <br />
        <PasswordField errors={errors} register={register} />
        <br />
        <Button variant="contained" disableElevation>
          ログイン
        </Button>
      </form>
      <button onClick={onClick} type="button" id="btn-login-with-google">
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
