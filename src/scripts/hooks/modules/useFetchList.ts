import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as I from '@/scripts/model/interface'
import { useSnackbarContext } from '@/scripts/hooks'
import { fetchList } from '@/scripts/redux/state/list/actions'

export const useFetchList = (boardId: string) => {
  const userState = useSelector((state: I.ReduxState) => state.user)
  const listState = useSelector((state: I.ReduxState) => state.list)
  const { showSnackbar } = useSnackbarContext()
  const dispatch = useDispatch()

  React.useEffect(() => {
    if (!userState.user || listState.error || !boardId) return

    const fetch = async () => {
      try {
        await dispatch(fetchList({ boardId }))
      } catch ({ message }) {
        console.log('debug: await dispatch(fetchList({ boardId }))')
        showSnackbar({
          message,
          type: 'error'
        })
      }
    }
    fetch()
    /**
     * NOTE:
     * フィードバック表示・非表示のタイミングで画面を再レンダリングしたく無いので
     * showSnackbar を配列に加えない
     */
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [boardId, dispatch, fetchList, userState.user, listState.error])
}
