import React, { useRef, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { fetchBoards, createBoard } from '@/scripts/redux/state/board/actions'
import { useSelector, useDispatch } from 'react-redux'
import * as I from '@/scripts/interfaces'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { useSnackbarContext } from '@/scripts/hooks'

export const Board: React.FC = () => {
  const boardState = useSelector((state: I.ReduxState) => state.board)
  const dispatch = useDispatch()
  const { showSnackbar } = useSnackbarContext()
  const inputRef = useRef(null)

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

  const addBoard = async () => {
    const { value } = inputRef.current!
    try {
      await dispatch(createBoard({ title: value }))
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
              return <div key={i}>{board.title}</div>
            })}
          <button onClick={onClick}>test</button>
          <input ref={inputRef} type="text" />
          <button onClick={addBoard}>addBoard</button>
        </>
      )}
    </div>
  )
}
