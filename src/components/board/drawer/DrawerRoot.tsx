import React from 'react'
import { archiveBoard } from '@/scripts/redux/state/board/actions'
import { useDispatch, useStore } from 'react-redux'
import { useParams, useHistory, Link } from 'react-router-dom'
import { useSnackbarContext } from '@/scripts/hooks'
import { Button, makeStyles } from '@material-ui/core'
import { css } from '@emotion/core'
import * as I from '@/scripts/model/interface'
import { OPTION } from '@/option'

export const DrawerRoot: React.FC<{ setOpen: React.Dispatch<any> }> = ({
  setOpen
}) => {
  const muiStyle = useStyles()
  const history = useHistory()
  const dispatch = useDispatch()
  const { showSnackbar } = useSnackbarContext()
  const { boardId } = useParams<I.UrlParams>()
  const { user, board } = useStore().getState()

  const onClickArchive = async () => {
    if (!boardId || !user || board.error) return

    if (!window.confirm('ボードをアーカイブしてもよろしいですか？')) return
    try {
      await dispatch(archiveBoard({ id: boardId }))
      setOpen(false)
      history.push(OPTION.PATH.BOARD)
    } catch ({ message }) {
      showSnackbar({
        message,
        type: 'error'
      })
    }
  }

  return (
    <div css={styles['drawer-content']}>
      <Button
        onClick={onClickArchive}
        fullWidth
        className={muiStyle['archiveButton']}
        id="btn-archive-board"
      >
        このボードをアーカイブ
      </Button>
      <Button to={`/boards/${boardId}/archivedItem`} component={Link} fullWidth>
        アーカイブしたアイテム
      </Button>
    </div>
  )
}

const styles = {
  'drawer-content': css``
}

const useStyles = makeStyles(() => ({
  archiveButton: {
    textDecoration: 'underline'
  }
}))
