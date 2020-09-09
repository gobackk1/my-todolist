import React, { useCallback } from 'react'
import { AppBar, Toolbar, IconButton, Button } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import firebase from '@/scripts/firebase'
import { useHistory } from 'react-router-dom'
import { css } from 'emotion/macro'
import { LoadingSpinner, Modal } from '@/components'
import { useAuthContext, useSnackbarContext } from '@/scripts/hooks'
import { OPTION } from '@/option'

const provider = new firebase.auth.GoogleAuthProvider()

export const AppHeader: React.FC = () => {
  const { auth, setAuth } = useAuthContext()
  const { showSnackbar } = useSnackbarContext()
  const history = useHistory()

  const onClick = useCallback(async () => {
    setAuth(state => ({ ...state, isLoggingIn: true }))
    try {
      await firebase.auth().signInWithPopup(provider)
      setAuth(state => ({ ...state, isLoggingIn: false }))
      showSnackbar({
        message: OPTION.MESSAGE.LOGIN.SUCCESS,
        type: 'success'
      })
      history.push('/board')
    } catch (e) {
      setAuth(state => ({ ...state, isLoggingIn: false }))
      showSnackbar({
        message: OPTION.MESSAGE.LOGIN.ERROR,
        type: 'error'
      })
    }
  }, [history, setAuth, showSnackbar])

  const onClickLogout = useCallback(async () => {
    setAuth(state => ({ ...state, isLoggingIn: true }))
    try {
      await firebase.auth().signOut()
      setAuth(state => ({ ...state, isLoggingIn: false }))
      showSnackbar({
        message: OPTION.MESSAGE.LOGOUT.SUCCESS,
        type: 'success'
      })
      history.push('/')
    } catch (e) {
      setAuth(state => ({ ...state, isLoggingIn: false }))
      showSnackbar({
        message: OPTION.MESSAGE.LOGOUT.ERROR,
        type: 'error'
      })
    }
  }, [history, setAuth, showSnackbar])

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <h1 className={styles['h1']}>Pacrello</h1>
        {auth.isLoggingIn && <LoadingSpinner />}
        {!auth.isLoggingIn && auth.user ? (
          <>
            <Button color="inherit" onClick={onClickLogout}>
              Logout
            </Button>
            <img
              src={auth.user.photoURL}
              alt={auth.user.displayName}
              width="40"
            />
          </>
        ) : (
          <Modal>
            <button onClick={onClick} type="button">
              Google アカウントでログイン
            </button>
          </Modal>
        )}
      </Toolbar>
    </AppBar>
  )
}

const styles = {
  h1: css`
    flex-grow: 1;
  `
}
