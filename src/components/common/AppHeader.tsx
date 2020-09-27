import React from 'react'
import { AppBar, Toolbar, makeStyles } from '@material-ui/core'
import { css } from '@emotion/core'
import { LoadingSpinner, BoardListMenu, LoginFormModal } from '@/components'
import { useSelector } from 'react-redux'
import * as I from '@/scripts/model/interface'
import { theme } from '@/styles'

const useStyles = makeStyles({
  root: {
    position: 'relative',
    zIndex: theme.zIndex.appHeader
  }
})

const styles = {
  h1: css`
    flex-grow: 1;
    text-align: center;
  `
}

export const AppHeader: React.FC = () => {
  const userState = useSelector((state: I.ReduxState) => state.user)
  const muiStyles = useStyles()

  return (
    <AppBar position="static" className={muiStyles['root']}>
      <Toolbar>
        {userState.user && <BoardListMenu />}
        <h1 css={styles['h1']}>Pacrello</h1>
        {userState.isLoggingIn && <LoadingSpinner />}
        {!userState.isLoggingIn && <LoginFormModal />}
      </Toolbar>
    </AppBar>
  )
}
