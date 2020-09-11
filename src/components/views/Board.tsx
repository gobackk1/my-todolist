import React from 'react'
import { Redirect } from 'react-router-dom'
import { fetchBoards } from '@/scripts/redux/state/board/actions'
import { useSelector, useDispatch } from 'react-redux'
import * as I from '@/scripts/interfaces'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { useSnackbarContext } from '@/scripts/hooks'

export const Board: React.FC = () => {
  const boardState = useSelector((state: I.ReduxState) => state.board)
  const dispatch = useDispatch()
  const { showSnackbar } = useSnackbarContext()

  const onClick = async () => {
    try {
      await dispatch(fetchBoards())
    } catch (e) {
      showSnackbar({
        message: e.message,
        type: 'error'
      })
    }
  }

  return (
    <div>
      {boardState.isLoading && <LoadingSpinner />}
      {!boardState.isLoading && (
        <>
          {boardState.error && <>エラーメッセージ{boardState.error.message}</>}
          {boardState.boards &&
            boardState.boards.map((board, i) => {
              return <div key={i}>{board.title}</div>
            })}
          <button onClick={onClick}>test</button>
        </>
      )}
    </div>
  )
}
