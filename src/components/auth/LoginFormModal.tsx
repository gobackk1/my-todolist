import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as I from '@/scripts/model/interface'
import { LoadingSpinner, Modal, LoginView, SignUpView } from '@/components'
import { Button, makeStyles, Typography } from '@material-ui/core'
import firebase from 'firebase'
import { useHistory, Link } from 'react-router-dom'
import { useSnackbarContext } from '@/scripts/hooks'
import { OPTION } from '@/option'
import { setLoggingIn } from '@/scripts/redux/state/user/actions'
import { css } from '@emotion/core'
import { theme } from '@/styles'

const useStyles = makeStyles(() => ({
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing(3),
    fontWeight: 'bold'
  }
}))

export const LoginFormModal: React.FC = () => {
  const userState = useSelector((state: I.ReduxState) => state.user)
  const dispatch = useDispatch()
  const history = useHistory()
  const { showSnackbar } = useSnackbarContext()
  const [view, setView] = React.useState<'login' | 'signup'>('login')
  const muiStyles = useStyles()

  const onClickLogout = React.useCallback(async () => {
    dispatch(setLoggingIn(true))
    try {
      await firebase.auth().signOut()
      showSnackbar({
        message: OPTION.MESSAGE.LOGOUT.SUCCESS,
        type: 'success'
      })
      dispatch(setLoggingIn(false))
      history.push('/')
    } catch (e) {
      showSnackbar({
        message: OPTION.MESSAGE.LOGOUT.ERROR,
        type: 'error'
      })
      dispatch(setLoggingIn(false))
    }
  }, [history, showSnackbar, dispatch])
  return (
    <>
      {userState.user === null ? (
        <Modal
          render={props => (
            <Button color="inherit" {...props} id="btn-login">
              ログイン
            </Button>
          )}
        >
          {view === 'login' ? (
            <LoginView setView={setView} />
          ) : (
            <SignUpView setView={setView} />
          )}
        </Modal>
      ) : (
        <>
          <Button color="inherit" onClick={onClickLogout} id="btn-logout">
            ログアウト
          </Button>
          <img
            src={userState.user.photoURL as string}
            alt={userState.user.displayName as string}
            width="40"
            id="img-user-photo"
          />
        </>
      )}
    </>
  )
}
