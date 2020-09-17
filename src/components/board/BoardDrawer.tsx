import React from 'react'
import { Drawer, makeStyles } from '@material-ui/core'
import { archiveBoard } from '@/scripts/redux/state/board/actions'
import { useDispatch } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import { useSnackbarContext } from '@/scripts/hooks'
import { Button } from '@material-ui/core'
import { MoreHoriz } from '@material-ui/icons'
import { css } from '@emotion/core'

export const BoardDrawer: React.FC = () => {
  const [open, setOpen] = React.useState(false)
  const toggleDrawer = () => {
    setOpen(!open)
  }
  const muiStyle = useStyles()
  const history = useHistory()
  const dispatch = useDispatch()
  const { boardId } = useParams<I.UrlParams>()
  const { showSnackbar } = useSnackbarContext()

  const onClickArchive = async () => {
    if (!boardId) return
    if (!window.confirm('ボードをアーカイブしてもよろしいですか？')) return
    try {
      await dispatch(archiveBoard({ id: boardId }))
      setOpen(false)
      history.push('/boards')
    } catch ({ message }) {
      showSnackbar({
        message,
        type: 'error'
      })
    }
  }
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={toggleDrawer}
      className={muiStyle['root']}
      variant="persistent"
    >
      <div css={styles['drawer-button']}>
        <Button
          onClick={toggleDrawer}
          variant="contained"
          startIcon={<MoreHoriz />}
        >
          ボードメニューを表示
        </Button>
      </div>
      <div css={styles['drawer-content']}>
        <Button
          onClick={onClickArchive}
          fullWidth
          className={muiStyle['archiveButton']}
        >
          このボードをアーカイブ
        </Button>
      </div>
    </Drawer>
  )
}

const useStyles = makeStyles(() => ({
  root: {
    '& .MuiDrawer-paper': {
      width: 300,
      overflow: 'visible',
      top: 64,
      padding: 8,
      boxShadow: '2px 0px 7px 0px #c1c1c1'
    }
  },
  archiveButton: {
    textDecoration: 'underline'
  }
}))

const styles = {
  'drawer-button': css`
    position: absolute;
    left: -76%;
    visibility: visible;
  `,
  'drawer-content': css``
}
