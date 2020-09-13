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
import { useSnackbarContext, useEventListener } from '@/scripts/hooks'
import { css } from 'emotion/macro'
import { BoardTitle } from '@/components'

/**
 * ボードの View, 各種操作を管理する
 */
export const Board: React.FC = () => {
  const boardState = useSelector((state: I.ReduxState) => state.board)
  const userState = useSelector((state: I.ReduxState) => state.user)
  const dispatch = useDispatch()
  const { showSnackbar } = useSnackbarContext()

  /**
   * ユーザーがログインしていたら、ボード一覧を取得
   */
  React.useEffect(() => {
    if (userState.user && userState.user.uid) {
      ;(async () => {
        try {
          await dispatch(fetchBoards())
        } catch (e) {
          showSnackbar({
            message: e.message,
            type: 'error'
          })
        }
      })()
    }
  }, [dispatch, fetchBoards, userState])

  return (
    <div className={styles['root']}>
      {boardState.isLoading && <LoadingSpinner />}
      {!boardState.isLoading && (
        <>
          <BoardTitle />
          {boardState.error && <>エラーメッセージ{boardState.error.message}</>}
        </>
      )}
    </div>
  )
}

const styles = {
  root: css`
    padding: 10px;
  `
}
