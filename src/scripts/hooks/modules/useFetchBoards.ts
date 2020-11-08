import React from 'react'
import { fetchBoards } from '@/scripts/redux/state/board/actions'
import { useSelector, useDispatch } from 'react-redux'
import { useSnackbarContext } from '@/scripts/hooks'

export const useFetchBoards = (): void => {
  const { init } = useSelector(state => state.board)
  const { user } = useSelector(state => state.currentUser)
  const { showSnackbar } = useSnackbarContext()
  const dispatch = useDispatch()

  const dispatchFetchBoards = React.useCallback(async () => {
    try {
      await dispatch(fetchBoards())
    } catch ({ message }) {
      console.log('debug: dispatchFetchBoards')
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
  }, [dispatch])

  React.useEffect(() => {
    /**
     * TODO: 他のユーザーの更新に追従する
     */
    if (!user || init) return

    dispatchFetchBoards()
  }, [user, dispatchFetchBoards, init])
}
