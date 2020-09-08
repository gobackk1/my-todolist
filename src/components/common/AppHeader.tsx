import React, { useContext } from 'react'
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import { Link } from 'react-router-dom'
import { AuthenticationContext } from '@/scripts/context'
import firebase from '@/scripts/firebase'
import { useHistory } from 'react-router-dom'

export const AppHeader: React.FC = () => {
  const auth = useContext(AuthenticationContext)
  const history = useHistory()

  const onClickLogout = () => {
    firebase.auth().signOut()
    history.push('/')
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          className={''}
          color="inherit"
          aria-label="menu"
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={''}>
          News
        </Typography>
        {auth.user ? (
          <Button color="inherit" onClick={onClickLogout}>
            Logout
          </Button>
        ) : (
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}
