import React from 'react'
import {
  Drawer,
  Button,
  Paper,
  makeStyles,
  Typography,
  IconButton
} from '@material-ui/core'
import { DrawerArchivedItem, DrawerRoot, DrawerSelectBg } from '@/components'
import { MoreHoriz } from '@material-ui/icons'
import { css } from '@emotion/core'
import { theme } from '@/styles'
import { KeyboardBackspaceRounded } from '@material-ui/icons/'

export const BoardDrawer: React.FC = () => {
  const [open, setOpen] = React.useState(false)
  const toggleDrawer = () => setOpen(!open)
  const muiStyle = useStyles()
  const [view, setView] = React.useState<'root' | 'archived' | 'selectBg'>(
    'root'
  )

  const renderTitle = () => {
    switch (view) {
      case 'archived':
        return 'アーカイブしたアイテム'
      case 'selectBg':
        return '背景を変更する'
      default:
        return 'ボードメニュー'
    }
  }

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
        <Typography variant="h4">
          <IconButton
            onClick={() => setView('root')}
            // className={muiStyle['button-back']}
            css={
              view === 'root'
                ? styles['button-back-hidden']
                : styles['button-back-visible']
            }
          >
            <KeyboardBackspaceRounded />
          </IconButton>
          {renderTitle()}
        </Typography>
        <div css={styles['drawer-content']}>
          {view === 'root' && (
            <DrawerRoot setOpen={setOpen} setView={setView} />
          )}
          {view === 'archived' && (
            <DrawerArchivedItem open={open} setOpen={setOpen} />
          )}
          {view === 'selectBg' && (
            <DrawerSelectBg open={open} setOpen={setOpen} />
          )}
        </div>
      </Paper>
    </Drawer>
  )
}

const common = {
  'button-back': css`
    transition: 0.5s;
    position: absolute;
    top: 0;
    left: 0;
    padding: 14px;
  `
}

const styles = {
  'drawer-button': css`
    position: absolute;
    top: 7px;
    left: -76%;
    visibility: visible;
  `,
  'drawer-content': css`
    padding: 0 ${theme.spacing(1)}px ${theme.spacing(1)}px;
  `,
  'button-back-visible': css`
    ${common['button-back']}
    opacity: 1;
    transform: translateX(0px);
  `,
  'button-back-hidden': css`
    ${common['button-back']}
    opacity: 0;
    transform: translateX(10px);
  `
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
    },
    '& .MuiTypography-h4': {
      textAlign: 'center',
      padding: theme.spacing(2)
    }
  }
})
