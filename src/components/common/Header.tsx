import React from 'react'
import { AppBar, Toolbar, makeStyles } from '@material-ui/core'
import {
  LoadingSpinner,
  BoardListMenu,
  LoginFormModal,
  BoardTopLinkButton
} from '@/components'
import { useSelector } from 'react-redux'
import { theme } from '@/styles'

export const Header: React.FC = () => {
  const userState = useSelector(state => state.user)
  const styles = useStyles()

  return (
    <AppBar position="static" className={`AppHeader-root ${styles.root}`}>
      <Toolbar>
        {userState.user && (
          <>
            <BoardTopLinkButton />
            <BoardListMenu />
          </>
        )}
        <h1 className="AppHeader-title">Pacrello</h1>
        {userState.isLoggingIn && <LoadingSpinner />}
        {!userState.isLoggingIn && <LoginFormModal />}
      </Toolbar>
    </AppBar>
  )
}

const useStyles = makeStyles({
  root: {
    position: 'relative',
    zIndex: theme.zIndex.appHeader,
    '& .AppHeader-title': {
      flexGrow: 1,
      textAlign: 'center'
    }
  }
})
