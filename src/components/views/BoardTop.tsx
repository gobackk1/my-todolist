import React from 'react'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import * as I from '@/scripts/model/interface'
import { LoadingSpinner } from '@/components'
import { useFetchBoards, useSnackbarContext } from '@/scripts/hooks'
import { OPTION } from '@/option'

export const BoardTop: React.FC = () => {
  const boardState = useSelector((state: I.ReduxState) => state.board)
  const { state } = useLocation<string | undefined>()
  const { showSnackbar } = useSnackbarContext()

  /**
   * ボードがない理由でリダイレクトされてきたらフィードバックを返す
   */
  React.useEffect(() => {
    if (!state) return
    if (state === 'BOARD_IS_NOT_EXIST') {
      showSnackbar({
        message: OPTION.MESSAGE.UNAUTHORIZED_OPERATION,
        type: 'error'
      })
      history.replaceState(null, '')
    }
  }, [state])

  useFetchBoards()

  return (
    <div id="board">
      {!boardState.init || (boardState.isLoading && <LoadingSpinner />)}
      {boardState.init && !boardState.isLoading && (
        <div id="board-inner">
          BoardTop
          {Object.values(boardState.boards).length
            ? Object.values(boardState.boards).map((board, i) => {
                return <div key={i}>{board.title}</div>
              })
            : 'まだボードがありません。「ボード一覧」から新しいボードを作成してください。'}
        </div>
      )}
    </div>
  )
}
