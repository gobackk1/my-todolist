import React from 'react'
import { useSnackbarContext } from '@/scripts/hooks'
import { useParams } from 'react-router-dom'
import { updateBoard } from '@/scripts/redux/state/board/actions'
import { useSelector, useDispatch, useStore } from 'react-redux'
import * as I from '@/scripts/model/interface'
import { OPTION } from '@/option'
import { VariableInput } from '@/components'
import { makeStyles } from '@material-ui/core'
import { theme } from '@/styles'
import { fade } from '@material-ui/core/styles/colorManipulator'

export const BoardTitle: React.FC = () => {
  const boardState = useSelector(state => state.board)
  const { boardId } = useParams<I.UrlParams>()
  const { currentUser, board } = useStore().getState()
  const { showSnackbar } = useSnackbarContext()
  const dispatch = useDispatch()
  const styles = useStyles()

  const updateTitle = React.useCallback(
    async (
      e: React.FocusEvent<any> | React.KeyboardEvent<any>,
      close: () => void
    ) => {
      if (!currentUser || board.error || !boardState.boards[boardId]) return

      const title = e.currentTarget.value

      close()

      if (title === boardState.boards[boardId].title) return

      if (title.length > 50) {
        showSnackbar({
          message: OPTION.MESSAGE.BOARD.TITLE.MAX_LENGTH_ERROR,
          type: 'error'
        })
        return
      } else if (!title.length) {
        showSnackbar({
          message: OPTION.MESSAGE.BOARD.TITLE.REQUIRED_ERROR,
          type: 'error'
        })
        return
      }

      try {
        await dispatch(updateBoard({ title, id: boardId }))
      } catch (e) {
        console.log(e)
        showSnackbar({
          message: OPTION.MESSAGE.SERVER_CONNECTION_ERROR,
          type: 'error'
        })
      }
    },
    [
      board.error,
      boardId,
      boardState.boards,
      dispatch,
      showSnackbar,
      currentUser
    ]
  )

  return (
    <div className={`js-title-area ${styles.root}`} id="board-title">
      {boardState.boards[boardId] ? (
        <VariableInput
          label={boardState.boards[boardId].title}
          onUpdate={updateTitle}
          component="input"
        />
      ) : null}
    </div>
  )
}

const useStyles = makeStyles({
  root: {
    display: 'inline-block',
    '& .MuiButtonBase-root': {
      backgroundColor: fade(theme.palette.white, 0.6),
      '&:hover': {
        backgroundColor: fade(theme.palette.white, 0.5)
      }
    }
  }
})
