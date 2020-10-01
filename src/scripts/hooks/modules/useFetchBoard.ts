import React from 'react'
import { fetchBoard } from '@/scripts/redux/state/board/actions'
import { useSelector, useDispatch } from 'react-redux'
import * as I from '@/scripts/model/interface'
import { useSnackbarContext } from '@/scripts/hooks'

export const useFetchBoard = (boardId: string) => {
  const boardState = useSelector((state: I.ReduxState) => state.board)
  const userState = useSelector((state: I.ReduxState) => state.user)
  const { showSnackbar } = useSnackbarContext()
  const dispatch = useDispatch()

  const dispatchFetchBoard = React.useCallback(async () => {
    try {
      await dispatch(fetchBoard(boardId))
    } catch ({ message }) {
      console.log('debug: dispatchFetchBoard')
      showSnackbar({
        message,
        type: 'error'
      })
    }
    /**
     * NOTE:
     * フィードバック表示・非表示のタイミングで画面を再レンダリングしたく無いので
     * showSnackbar を配列に加えない
     */
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [dispatch, boardId])

  React.useEffect(() => {
    if (!userState.user || boardState.error) return

    dispatchFetchBoard()
  }, [userState.user, dispatchFetchBoard, boardState.error])
}
