import React from 'react'
import { Modal, LoadingSpinner } from '@/components'
import { Button, makeStyles, Theme } from '@material-ui/core'
import {
  fetchArchivedBoards,
  deleteBoard,
  restoreBoard
} from '~redux/state/board/actions'
import { useSnackbarContext } from '@/scripts/hooks'
import { useDispatch, useSelector } from 'react-redux'
import * as I from '@/scripts/model/interface'
import { Reply, DeleteForever } from '@material-ui/icons'
import { css } from '@emotion/core'
import { useHistory } from 'react-router-dom'
import { OPTION } from '@/option'

export const TEXT = {
  DELETE_BOARD: 'ボードを削除しました。',
  DELETE_CONFIRM:
    '本当にボードを削除しても良いですか？ボードを再び開くことが出来なくなります'
}

export const ArchivedBoardModal: React.FC = () => {
  const dispatch = useDispatch()
  const { showSnackbar } = useSnackbarContext()
  const boardState = useSelector((state: I.ReduxState) => state.board)
  const userState = useSelector((state: I.ReduxState) => state.user)
  const muiStyles = useStyles()
  const history = useHistory()

  const renderButton = React.useCallback(
    props => {
      const dispatchFetchArchiveBoards = () => {
        if (!userState.user || boardState.error) return
        try {
          dispatch(fetchArchivedBoards())
        } catch ({ message }) {
          showSnackbar({ message, type: 'error' })
        }
      }
      return (
        <Button
          {...props}
          className={muiStyles.buttonCreate}
          onClick={() => {
            props.onClick()
            dispatchFetchArchiveBoards()
          }}
          id="open-archived-board-modal"
        >
          アーカイブ済みのボードを確認
        </Button>
      )
    },
    [muiStyles.buttonCreate, dispatch, showSnackbar, userState.user, boardState]
  )

  const onClickDelete = async (id: string) => {
    if (!userState.user || boardState.error) return

    if (!window.confirm(TEXT.DELETE_CONFIRM)) return

    try {
      await dispatch(deleteBoard({ id }))
      showSnackbar({ message: TEXT.DELETE_BOARD, type: 'info' })

      dispatchEvent(new CustomEvent('onDispatchCloseModal'))
    } catch ({ message }) {
      showSnackbar({ message, type: 'error' })
    }
  }

  const onClickRestore = async (e: any, id: string, title: string) => {
    if (!userState.user || boardState.error) return

    try {
      await dispatch(restoreBoard({ id }))
      showSnackbar({
        message: `アーカイブされた「${title}」を戻しました。`,
        type: 'info'
      })

      dispatchEvent(new CustomEvent('onDispatchCloseModal'))
      history.push(OPTION.PATH.BOARD + '/' + id)
    } catch ({ message }) {
      showSnackbar({
        message,
        type: 'error'
      })
    }
  }

  return (
    <Modal render={renderButton}>
      <div css={styles['modal-inner']} id="modal-archived-board">
        <div css={styles['modal-title']}>アーカイブ済みボード</div>
        {boardState.isLoading && <LoadingSpinner />}
        {!boardState.isLoading && (
          <ul css={styles['archived-list']} id="modal-archived-board-list">
            {boardState.archivedBoards.length &&
              boardState.archivedBoards.map((board, i) => (
                <li css={styles['archived-board']} key={i}>
                  <div css={styles['archived-board-title']}>{board.title}</div>
                  <Button
                    onClick={e => {
                      onClickRestore(e, board.id, board.title)
                    }}
                    startIcon={<Reply />}
                    variant="contained"
                    className={
                      muiStyles['restore-button'] + ' btn-restore-board'
                    }
                    size="small"
                  >
                    アーカイブから戻す
                  </Button>
                  <Button
                    onClick={() => {
                      onClickDelete(board.id)
                    }}
                    startIcon={<DeleteForever />}
                    variant="contained"
                    className={muiStyles['delete-button'] + ' btn-delete-board'}
                    size="small"
                  >
                    削除する
                  </Button>
                </li>
              ))}
          </ul>
        )}
      </div>
    </Modal>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    '& .MuiTextField-root': {
      marginBottom: theme.spacing(1),
      width: 200
    }
  },
  buttonCreate: {
    '& .MuiButton-label': {
      textDecoration: 'underline'
    }
  },
  'restore-button': {
    backgroundColor: 'green',
    marginLeft: 10
  },
  'delete-button': {
    backgroundColor: 'red',
    marginLeft: 10
  }
}))

const styles = {
  'modal-inner': css`
    width: 600px;
  `,
  'archived-board': css`
    display: flex;
    padding-bottom: 15px;
    margin-bottom: 15px;
    border-bottom: 1px solid #e2e2e2;
  `,
  'archived-board-title': css`
    flex: 1;
    display: flex;
    align-items: center;
  `,
  'modal-title': css`
    font-weight: bold;
    margin-bottom: 30px;
    text-align: center;
  `,
  'archived-list': css`
    max-height: 600px;
    overflow: scroll;
  `
}
