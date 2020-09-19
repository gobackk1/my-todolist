import React from 'react'
import { useSnackbarContext } from '@/scripts/hooks'
import { Board as IBoard } from '~redux/state/board/reducer'
import { useParams } from 'react-router-dom'
import { updateBoard } from '@/scripts/redux/state/board/actions'
import { useSelector, useDispatch, useStore } from 'react-redux'
import * as I from '@/scripts/model/interface'
import { OPTION } from '@/option'
import { ChangeableTitle } from '@/components'

export const BoardTitle: React.FC = () => {
  const [currentBoard, setCurrentBoard] = React.useState<IBoard | null>(
    {} as IBoard
  )
  const boardState = useSelector((state: I.ReduxState) => state.board)
  const { boardId } = useParams<I.UrlParams>()
  const { user, board } = useStore().getState()
  const { showSnackbar } = useSnackbarContext()
  const dispatch = useDispatch()

  const updateTitle = async (
    e: React.FocusEvent<any> | React.KeyboardEvent<any>,
    close: () => void
  ) => {
    if (!user || board.error || !currentBoard) return

    const title = e.currentTarget.value

    close()

    if (title === currentBoard.title) return

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
      showSnackbar({
        message: OPTION.MESSAGE.SERVER_CONNECTION_ERROR,
        type: 'error'
      })
    }
  }

  /**
   * 選択中のボードの情報を state で管理する
   */
  React.useEffect(() => {
    const current = boardState.boards.find(board => board.id === boardId)
    if (current) {
      setCurrentBoard(current)
    } else {
      setCurrentBoard(null)
    }
  }, [boardId, boardState, setCurrentBoard])

  return (
    <div className="js-title-area">
      {currentBoard ? (
        <ChangeableTitle
          title={currentBoard.title}
          updateTitle={updateTitle}
          component="input"
        />
      ) : null}
    </div>
  )
}
