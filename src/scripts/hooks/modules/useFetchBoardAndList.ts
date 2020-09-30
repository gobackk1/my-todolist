import React from 'react'
import { fetchBoards } from '@/scripts/redux/state/board/actions'
import { useSelector, useDispatch } from 'react-redux'
import * as I from '@/scripts/model/interface'
import { useSnackbarContext, useMountedRef } from '@/scripts/hooks'
import { fetchList } from '@/scripts/redux/state/list/actions'

export const useFetchBoardAndList = (boardId: string) => {
  const boardState = useSelector((state: I.ReduxState) => state.board)
  const userState = useSelector((state: I.ReduxState) => state.user)
  const listState = useSelector((state: I.ReduxState) => state.list)
  const { showSnackbar } = useSnackbarContext()
  const dispatch = useDispatch()
  const [init, setInit] = React.useState(false)

  /**
   * useEffect でコールする fetchBoard は１度のみ
   */
  React.useEffect(() => {
    if (!userState.user || boardState.error || init) return
    // setInit(true)

    const fetch = async () => {
      try {
        await dispatch(fetchBoards())
      } catch ({ message }) {
        console.log('debug: await dispatch(fetchBoards())')
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
  }, [userState.user, dispatch, boardState.error, init])

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
