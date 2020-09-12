import React, { useRef, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import {
  fetchBoards,
  createBoard,
  updateBoard,
  deleteBoard
} from '@/scripts/redux/state/board/actions'
import { useSelector, useDispatch } from 'react-redux'
import * as I from '@/scripts/interfaces'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { useSnackbarContext } from '@/scripts/hooks'

export const Board: React.FC = () => {
  const boardState = useSelector((state: I.ReduxState) => state.board)
  const userState = useSelector((state: I.ReduxState) => state.user)
  const dispatch = useDispatch()
  const { showSnackbar } = useSnackbarContext()
  const inputRef = useRef<HTMLInputElement | null>(null)

  const dispatchFetchBoard = async () => {
    try {
      await dispatch(fetchBoards())
    } catch (e) {
      showSnackbar({
        message: e.message,
        type: 'error'
      })
    }
  }

  React.useEffect(() => {
    if (userState.user && userState.user.uid) {
      dispatchFetchBoard()
    }
  }, [dispatch, fetchBoards, userState])

  const create = async (title: string) => {
    try {
      await dispatch(createBoard({ title }))
    } catch (e) {}
  }

  const deleteboard = async (id: string) => {
    try {
      await dispatch(deleteBoard({ id }))
    } catch (e) {}
  }

  return (
    <div>
      {boardState.isLoading && <LoadingSpinner />}
      {!boardState.isLoading && (
        <>
          {boardState.error && <>エラーメッセージ{boardState.error.message}</>}
          <button
            onClick={() => {
              create('newboard')
            }}
          >
            createBoard
          </button>
        </>
      )}
    </div>
  )
}
