import React, { useCallback, useContext } from 'react'
import { AppBar, Toolbar, IconButton, Button } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import firebase from '@/scripts/firebase'
import { useHistory } from 'react-router-dom'
import { css } from 'emotion/macro'
import { LoadingSpinner, Modal } from '@/components'
import { AuthContext } from '@/scripts/context'

const provider = new firebase.auth.GoogleAuthProvider()

export const AppHeader: React.FC = () => {
  const [{ isLoggingIn, user }, setAuth] = useContext(AuthContext)
  const history = useHistory()

  const onClick = useCallback(async () => {
    try {
      setAuth(state => ({ ...state, isLoggingIn: true }))
      await firebase.auth().signInWithPopup(provider)
      setAuth(state => ({ ...state, isLoggingIn: false }))
      history.push('/board')
    } catch (e) {
      // TODO: ポップアップ
    }
  }, [history, setAuth])

  const onClickLogout = useCallback(async () => {
    try {
      setAuth(state => ({ ...state, isLoggingIn: true }))
      await firebase.auth().signOut()
      setAuth(state => ({ ...state, isLoggingIn: false }))
      history.push('/')
    } catch (e) {
      // TODO: ポップアップ
    }
  }, [history, setAuth])

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <h1 className={styles['h1']}>Pacrello</h1>
        {isLoggingIn && <LoadingSpinner />}
        {!isLoggingIn && user ? (
          <>
            <Button color="inherit" onClick={onClickLogout}>
              Logout
            </Button>
            <img src={user.photoURL} alt={user.displayName} width="40" />
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
