import React from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import * as I from '@/scripts/model/interface'
import { LoadingSpinner } from '@/components'
import { useFetchBoardAndList, useSnackbarContext } from '@/scripts/hooks'
import { OPTION } from '@/option'

export const BoardTop: React.FC = () => {
  const boardState = useSelector((state: I.ReduxState) => state.board)
  const { boardId } = useParams<I.UrlParams>()
  const { state } = useLocation<string | undefined>()
  const { showSnackbar } = useSnackbarContext()

  /**
   * ボードがない理由でリダイレクトされた来たらフィードバックを返す
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

  useFetchBoardAndList(boardId)

  return (
    <div id="board">
      {!boardState.init || (boardState.isLoading && <LoadingSpinner />)}
      {boardState.init && !boardState.isLoading && (
        <div id="board-inner">BoardTop</div>
      )}
    </div>
  )
}
