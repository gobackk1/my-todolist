import React from 'react'
import { Drawer, Button, Paper, makeStyles } from '@material-ui/core'
import * as T from '@/scripts/model/type'
import { DrawerArchivedItem, DrawerRoot } from '@/components'
import { MoreHoriz } from '@material-ui/icons'
import { css } from '@emotion/core'
import { Route, Switch } from 'react-router-dom'

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
    >
      <Paper elevation={5}>
        <div css={styles['drawer-button']}>
          <Button
            onClick={toggleDrawer}
            variant="contained"
            startIcon={<MoreHoriz />}
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

const useStyles = makeStyles((theme: T.GlobalTheme) => ({
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
}))
