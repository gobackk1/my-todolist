import React from 'react'
import { AppBar, Toolbar, makeStyles, IconButton } from '@material-ui/core'
import {
  LoadingSpinner,
  BoardListMenu,
  LoginFormModal,
  BoardTopLinkButton,
  UserIcon
} from '@/components'
import { useSelector } from 'react-redux'
import { theme } from '@/styles'
import { Link } from 'react-router-dom'
import { useCurrentUser } from '@/scripts/hooks'
import { OPTION } from '@/option'

export const Header: React.FC = () => {
  const { isLoggingIn, user } = useSelector(state => state.currentUser)
  const styles = useStyles()
  const currentUser = useCurrentUser()

  return (
    <AppBar position="static" className={`AppHeader-root ${styles.root}`}>
      <Toolbar>
        {currentUser && user?.emailVerified && (
          <>
            <BoardTopLinkButton />
            <BoardListMenu />
          </>
        )}
        <h1 className="AppHeader-title">CloneApp</h1>
        {isLoggingIn && <LoadingSpinner />}
        {currentUser && user?.emailVerified ? (
          <IconButton
            component={Link}
            to={OPTION.PATH.USER_PROFILE}
            className="AppLoginFormModal-profileLink"
          >
            <UserIcon data={currentUser} />
          </IconButton>
        ) : (
          <LoginFormModal />
        )}
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
