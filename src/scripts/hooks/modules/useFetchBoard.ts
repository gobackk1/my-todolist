import React from 'react'
import { fetchBoard } from '@/scripts/redux/state/board/actions'
import { useSelector, useDispatch } from 'react-redux'
import { useSnackbarContext } from '@/scripts/hooks'

export const useFetchBoard = (boardId: string): void => {
  const boardState = useSelector(state => state.board)
  const currentUserState = useSelector(state => state.currentUser)
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
    if (!currentUserState.user || boardState.error) return

    dispatchFetchBoard()
  }, [currentUserState.user, dispatchFetchBoard, boardState.error])
}
