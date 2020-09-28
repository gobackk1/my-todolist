import React from 'react'
import { archiveBoard } from '@/scripts/redux/state/board/actions'
import { useDispatch, useStore } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import { useSnackbarContext } from '@/scripts/hooks'
import { Button } from '@material-ui/core'
import {
  ArchiveSharp,
  UnarchiveOutlined,
  PhotoSizeSelectActualRounded
} from '@material-ui/icons'
import { css } from '@emotion/core'
import * as I from '@/scripts/model/interface'
import { OPTION } from '@/option'

export const DrawerRoot: React.FC<{
  setOpen: React.Dispatch<any>
  setView: React.Dispatch<any>
}> = ({ setOpen, setView }) => {
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
    <section css={styles['drawer']}>
      <Button
        onClick={onClickArchive}
        fullWidth
        id="btn-archive-board"
        startIcon={<ArchiveSharp />}
      >
        このボードをアーカイブ
      </Button>
      <Button
        onClick={() => setView('archived')}
        startIcon={<UnarchiveOutlined />}
        fullWidth
      >
        アーカイブしたアイテム...
      </Button>
      <Button
        onClick={() => setView('selectBg')}
        startIcon={<PhotoSizeSelectActualRounded />}
        fullWidth
      >
        背景を変更する...
      </Button>
    </section>
  )
}

const styles = {
  drawer: css`
    .MuiButtonBase-root {
      /* text-decoration: underline; */
      .MuiButton-label {
        justify-content: start;
      }
    }
  `
}
