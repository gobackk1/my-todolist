import React from 'react'
import { Modal, LoadingSpinner } from '@/components'
import {
  Button,
  TextField,
  makeStyles,
  Theme,
  Divider
} from '@material-ui/core'
import { useForm, SubmitHandler } from 'react-hook-form'
import {
  fetchArchivedBoards,
  deleteBoard,
  restoreBoard
} from '~redux/state/board/actions'
import { useSnackbarContext } from '@/scripts/hooks'
import { useDispatch, useSelector } from 'react-redux'
import { OPTION } from '@/option'
import { useHistory } from 'react-router-dom'
import * as I from '@/scripts/interfaces'

export const ArchivedBoardModal: React.FC = () => {
  const dispatch = useDispatch()
  const { showSnackbar } = useSnackbarContext()
  const boardState = useSelector((state: I.ReduxState) => state.board)
  const userState = useSelector((state: I.ReduxState) => state.user)

  const styles = useStyles()
  const {
    register,
    handleSubmit,
    errors,
    formState: { isDirty, isSubmitting },
    reset
  } = useForm()
  const history = useHistory()
  console.log('test', userState)

  const dispatchFetchArchiveBoards = () => {
    console.log('test', userState)
    if (!userState.user) return
    try {
      // アーカイブしたアクションの done で、アーカイブへ移動させる
      dispatch(fetchArchivedBoards())
    } catch (e) {
      // showSnackbar()
    }
  }

  const renderButton = React.useCallback(
    props => (
      <Button
        {...props}
        className={styles.buttonCreate}
        onClick={() => {
          props.onClick()
          dispatchFetchArchiveBoards()
        }}
      >
        アーカイブ済みのボードを確認
      </Button>
    ),
    [dispatchFetchArchiveBoards]
  )

  const onClickDelete = async (id: string) => {
    if (
      !window.confirm(
        '本当にボードを削除しても良いですか？ボードを再び開くことが出来なくなります'
      )
    )
      return
    try {
      await dispatch(deleteBoard({ id }))
      showSnackbar({ message: 'ボードを削除しました。', type: 'info' })
    } catch ({ message }) {
      showSnackbar({ message, type: 'error' })
    }
  }

  const onClickRestore = (e: any, id: string, title: string) => {
    try {
      dispatch(restoreBoard({ id }))
      showSnackbar({
        message: `アーカイブされた${title}を戻しました。`,
        type: 'info'
      })
      e.target.parentElement.previousSibling.previousSibling.children[0].click()
    } catch ({ message }) {
      showSnackbar({ message, type: 'error' })
    }
  }

  return (
    <Modal render={renderButton}>
      <div>アーカイブ済みボード</div>
      {boardState.isLoading && <LoadingSpinner />}
      {!boardState.isLoading && (
        <>
          {boardState.archivedBoards &&
            boardState.archivedBoards.map((board, i) => (
              <div key={i}>
                <div>{board.title}</div>
                <button
                  onClick={e => {
                    onClickRestore(e, board.id, board.title)
                  }}
                >
                  アーカイブしたボードを戻す
                </button>
                <button
                  onClick={() => {
                    onClickDelete(board.id)
                  }}
                >
                  削除する
                </button>
              </div>
            ))}
        </>
      )}
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
  }
}))

type FormValue = {
  title: string
}
