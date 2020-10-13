import React from 'react'
import { Modal, LoadingSpinner } from '@/components'
import { Button, makeStyles, Theme, Typography } from '@material-ui/core'
import {
  fetchArchivedBoards,
  deleteBoard,
  restoreBoard
} from '~redux/state/board/actions'
import { useSnackbarContext } from '@/scripts/hooks'
import { useDispatch, useSelector } from 'react-redux'
import { Reply, DeleteForever } from '@material-ui/icons'
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
  const boardState = useSelector(state => state.board)
  const currentUserState = useSelector(state => state.currentUser)
  const styles = useStyles()
  const history = useHistory()

  const renderButton = React.useCallback(
    props => {
      const dispatchFetchArchiveBoards = () => {
        if (!currentUserState.user || boardState.error) return
        try {
          dispatch(fetchArchivedBoards())
        } catch ({ message }) {
          showSnackbar({ message, type: 'error' })
        }
      }
      return (
        <Button
          {...props}
          className={styles.buttonCreate}
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
    [
      styles.buttonCreate,
      dispatch,
      showSnackbar,
      currentUserState.user,
      boardState
    ]
  )

  const onClickDelete = async (id: string) => {
    if (!currentUserState.user || boardState.error) return

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
    if (!currentUserState.user || boardState.error) return

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
      <div
        className={`AppArchivedBoardModal-root ${styles.root}`}
        id="modal-archived-board"
      >
        <div className="AppArchivedBoardModal-title">アーカイブ済みボード</div>
        {boardState.isLoading && <LoadingSpinner />}
        {!boardState.isLoading && (
          <ul
            className="AppArchivedBoardModal-list"
            id="modal-archived-board-list"
          >
            {Object.values(boardState.archivedBoards).length ? (
              Object.values(boardState.archivedBoards).map((board, i) => (
                <li className="AppArchivedBoardModal-item" key={i}>
                  <div className="AppArchivedBoardModal-itemTitle">
                    {board.title}
                  </div>
                  <Button
                    onClick={e => {
                      onClickRestore(e, board.id, board.title)
                    }}
                    startIcon={<Reply />}
                    variant="contained"
                    className={styles['restore-button'] + ' btn-restore-board'}
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
                    className={styles['delete-button'] + ' btn-delete-board'}
                    size="small"
                  >
                    削除する
                  </Button>
                </li>
              ))
            ) : (
              <Typography variant="body1">
                アーカイブしたボードはありません
              </Typography>
            )}
          </ul>
        )}
      </div>
    </Modal>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: 600,
    padding: `${theme.spacing(5)}px ${theme.spacing(4)}px ${theme.spacing(
      3
    )}px`,
    '& .AppArchivedBoardModal-title': {
      fontWeight: 'bold',
      marginBottom: theme.spacing(4),
      textAlign: 'center'
    },
    '& .AppArchivedBoardModal-list': {
      maxHeight: 600,
      overflow: 'scroll'
    },
    '& .AppArchivedBoardModal-item': {
      display: 'flex',
      paddingLeft: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      marginBottom: theme.spacing(2),
      borderBottom: '1px solid #e2e2e2'
    },
    '& .AppArchivedBoardModal-itemTitle': {
      flex: 1,
      display: 'flex',
      alignItems: 'center'
    }
  },
  buttonCreate: {
    '& .MuiButton-label': {
      textDecoration: 'underline'
    }
  },
  'restore-button': {
    backgroundColor: theme.palette.success.main,
    marginLeft: 10,
    '&:hover': {
      backgroundColor: theme.palette.success.light
    }
  },
  'delete-button': {
    // backgroundColor: theme.palette.error.main,
    marginLeft: 10
    // '&:hover': {
    //   backgroundColor: theme.palette.error.light
    // }
  }
}))
