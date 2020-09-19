import React, { useCallback } from 'react'
import { AppBar, Toolbar, Button, makeStyles } from '@material-ui/core'
import firebase from 'firebase'
import { useHistory } from 'react-router-dom'
import { css } from '@emotion/core'
import { LoadingSpinner, Modal, BoardListMenu } from '@/components'
import { useSnackbarContext } from '@/scripts/hooks'
import { OPTION } from '@/option'
import { setLoggingIn } from '@/scripts/redux/state/user/actions'
import { useSelector, useDispatch } from 'react-redux'
import * as I from '@/scripts/model/interface'
import * as T from '@/scripts/model/type'

export const TEXT = {
  BUTTON: {
    LOGIN: 'ログイン',
    LOGIN_WITH_GOOGLE_AUTH: 'Google アカウントでログイン',
    LOGOUT: 'ログアウト'
  }
} as const

const useStyles = makeStyles((theme: T.GlobalTheme) => ({
  root: {
    position: 'relative',
    zIndex: theme.zIndex.appHeader
  }
}))

const styles = {
  h1: css`
    flex-grow: 1;
    text-align: center;
  `,
  'modal-title': css`
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
  `
}

export const AppHeader: React.FC = () => {
  const { showSnackbar } = useSnackbarContext()
  const history = useHistory()
  const userState = useSelector((state: I.ReduxState) => state.user)
  const dispatch = useDispatch()
  const muiStyles = useStyles()

  const onClick = useCallback(async () => {
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

  const onClickLogout = useCallback(async () => {
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
    <AppBar position="static" className={muiStyles['root']}>
      <Toolbar>
        <BoardListMenu />
        {/* <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton> */}
        <h1 css={styles['h1']}>Pacrello</h1>
        {userState.isLoggingIn && <LoadingSpinner />}
        {!userState.isLoggingIn && (
          <>
            {userState.user === null ? (
              <Modal
                render={props => (
                  <Button color="inherit" {...props} id="btn-login">
                    {TEXT.BUTTON.LOGIN}
                  </Button>
                )}
              >
                <div css={styles['modal-title']}>{TEXT.BUTTON.LOGIN}</div>
                <button
                  onClick={onClick}
                  type="button"
                  id="btn-login-with-google"
                >
                  {TEXT.BUTTON.LOGIN_WITH_GOOGLE_AUTH}
                </button>
              </Modal>
            ) : (
              <>
                <Button color="inherit" onClick={onClickLogout} id="btn-logout">
                  {TEXT.BUTTON.LOGOUT}
                </Button>
                <img
                  src={userState.user.photoURL as string}
                  alt={userState.user.displayName as string}
                  width="40"
                />
              </>
            )}
          </>
        )}
      </Toolbar>
    </AppBar>
  )
}
