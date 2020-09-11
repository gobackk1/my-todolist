import React, { useRef, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import {
  fetchBoards,
  createBoard,
  updateBoard
} from '@/scripts/redux/state/board/actions'
import { useSelector, useDispatch } from 'react-redux'
import * as I from '@/scripts/interfaces'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { useSnackbarContext } from '@/scripts/hooks'

export const Board: React.FC = () => {
  const boardState = useSelector((state: I.ReduxState) => state.board)
  const dispatch = useDispatch()
  const { showSnackbar } = useSnackbarContext()
  const inputRef = useRef<HTMLInputElement | null>(null)

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

  const update = async (id: string) => {
    if (!inputRef.current) return
    const { value } = inputRef.current
    try {
      await dispatch(updateBoard({ id, title: value }))
    } catch (e) {}
  }

  return (
    <div>
      {boardState.isLoading && <LoadingSpinner />}
      {!boardState.isLoading && (
        <>
          {boardState.error && <>エラーメッセージ{boardState.error.message}</>}
          {boardState.boards &&
            boardState.boards.map((board, i) => {
              return (
                <div key={i}>
                  <div>{board.id}</div>
                  <div>{board.title}</div>
                  <button
                    onClick={() => {
                      update(board.id)
                    }}
                  >
                    updateBoard
                  </button>
                </div>
              )
            })}
          <button onClick={onClick}>test</button>
          <input ref={inputRef} type="text" />
        </>
      )}
    </div>
  )
}
