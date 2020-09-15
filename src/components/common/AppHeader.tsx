import React, { useCallback } from 'react'
import { AppBar, Toolbar, Button } from '@material-ui/core'
import firebase from 'firebase'
import { useHistory } from 'react-router-dom'
import { css } from '@emotion/core'
import { LoadingSpinner, Modal, BoardListMenu } from '@/components'
import { useSnackbarContext } from '@/scripts/hooks'
import { OPTION } from '@/option'
import { setLoggingIn } from '@/scripts/redux/state/user/actions'
import { useSelector, useDispatch } from 'react-redux'
import * as I from '@/scripts/interfaces'

const provider = new firebase.auth.GoogleAuthProvider()

export const AppHeader: React.FC = () => {
  const { showSnackbar } = useSnackbarContext()
  const history = useHistory()
  const userState = useSelector((state: I.ReduxState) => state.user)
  const dispatch = useDispatch()

  const onClick = useCallback(async () => {
    dispatch(setLoggingIn(true))
    try {
      await firebase.auth().signInWithPopup(provider)
      showSnackbar({
        message: OPTION.MESSAGE.LOGIN.SUCCESS,
        type: 'success'
      })
      dispatch(setLoggingIn(false))
      history.push('/boards')
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
    <AppBar position="static">
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
                  <Button color="inherit" {...props}>
                    ログイン
                  </Button>
                )}
              >
                <div css={styles['modal-title']}>ログイン</div>
                <button onClick={onClick} type="button">
                  Google アカウントでログイン
                </button>
              </Modal>
            ) : (
              <>
                <Button color="inherit" onClick={onClickLogout}>
                  Logout
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
