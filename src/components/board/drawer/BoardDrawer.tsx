import React from 'react'
import { Drawer, Button, Paper, makeStyles } from '@material-ui/core'
import { DrawerArchivedItem, DrawerRoot, DrawerSelectBg } from '@/components'
import { MoreHoriz } from '@material-ui/icons'
import { css } from '@emotion/core'
import { Route, Switch } from 'react-router-dom'
import { theme } from '@/styles'

export const BoardDrawer: React.FC = () => {
  const [open, setOpen] = React.useState(false)
  const toggleDrawer = () => setOpen(!open)
  const muiStyle = useStyles()

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={toggleDrawer}
      className={muiStyle['root']}
      variant="persistent"
      id="drawer"
    >
      <Paper elevation={5}>
        <div css={styles['drawer-button']}>
          <Button
            onClick={toggleDrawer}
            variant="contained"
            startIcon={<MoreHoriz />}
            id="btn-open-board-menu"
          >
            ボードメニューを表示
          </Button>
        </div>
        <Switch>
          <Route
            path="/boards/:boardId/archivedItem"
            render={() => <DrawerArchivedItem open={open} setOpen={setOpen} />}
          />
          <Route
            path="/boards/:boardId/background"
            render={() => <DrawerSelectBg open={open} setOpen={setOpen} />}
          />
          <Route
            path="/boards/:boardId/"
            render={() => <DrawerRoot setOpen={setOpen} />}
            exact
          />
        </Switch>
      </Paper>
    </Drawer>
  )
}

const styles = {
  'drawer-button': css`
    position: absolute;
    top: 8px;
    left: -76%;
    visibility: visible;
  `,
  'drawer-content': css``
}

const useStyles = makeStyles({
  root: {
    position: 'relative',
    zIndex: theme.zIndex.boardDrawer,
    '& .MuiDrawer-paper': {
      width: 300,
      overflow: 'visible',
      top: 64
    },
    '& .MuiPaper-root': {
      height: '100%'
    }
  }
})
