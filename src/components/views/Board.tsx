import React from 'react'
import { useParams, Route } from 'react-router-dom'
import { fetchBoards } from '@/scripts/redux/state/board/actions'
import { useSelector, useDispatch, useStore } from 'react-redux'
import * as I from '@/scripts/model/interface'
import * as T from '@/scripts/model/type'
import { LoadingSpinner, CardList } from '@/components'
import { useSnackbarContext } from '@/scripts/hooks'
import { css } from '@emotion/core'
import { BoardTitle, BoardDrawer } from '@/components'
import { Button } from '@material-ui/core'
import { fetchList, createList } from '@/scripts/redux/state/list/actions'
import { OPTION } from '@/option'
import { Add } from '@material-ui/icons'
import { theme } from '@/styles'

/**
 * ボードの View, 各種操作を管理する
 */
export const Board: React.FC = () => {
  const boardState = useSelector((state: I.ReduxState) => state.board)
  const userState = useSelector((state: I.ReduxState) => state.user)
  const listState = useSelector((state: I.ReduxState) => state.list)
  // const {user, list, board, card }  = useStore().getState()
  const dispatch = useDispatch()
  const { showSnackbar } = useSnackbarContext()
  const { boardId } = useParams<I.UrlParams>()
  const [init, setInit] = React.useState(false)

  /**
   * useEffect でコールする fetchBoard は１度のみ
   */
  React.useEffect(() => {
    if (!userState.user || boardState.error || init) return

    setInit(true)

    const fetch = async () => {
      try {
        await dispatch(fetchBoards())
      } catch ({ message }) {
        console.log('debug: await dispatch(fetchBoards())')
        showSnackbar({ message, type: 'error' })
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
        showSnackbar({ message, type: 'error' })
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

  const onClick = () => {
    if (!userState.user || listState.error) return
    if (boardId) dispatch(createList({ title: 'new card', boardId }))
  }
  return (
    <div css={styles['root']} id="board">
      {boardState.isLoading && <LoadingSpinner />}
      {!boardState.isLoading && (
        <div id="board-inner">
          <Route
            path={OPTION.PATH.BOARD}
            exact
            render={() => <div>BoardTop</div>}
          />
          <Route
            path={OPTION.PATH.BOARD + '/:boardId'}
            render={() => (
              <>
                {boardState.boards.length ? (
                  <>
                    <div css={styles['board-header']}>
                      <BoardTitle />
                    </div>
                    {boardState.error && (
                      <>エラーメッセージ{boardState.error.message}</>
                    )}
                    <ul css={styles['card-list-container']}>
                      {boardId &&
                        listState.boards[boardId] &&
                        listState.boards[boardId].lists.map((list, i) => {
                          return (
                            <li
                              css={styles['card-list-container-item']}
                              key={i}
                            >
                              <CardList list={list} />
                            </li>
                          )
                        })}
                      <li>
                        <Button
                          onClick={onClick}
                          startIcon={<Add />}
                          variant="contained"
                        >
                          リストを追加
                        </Button>
                      </li>
                    </ul>
                  </>
                ) : (
                  'まだボードがありません。「ボード一覧」から新しいボードを作成してください。'
                )}
              </>
            )}
          />
        </div>
      )}
      <BoardDrawer />
    </div>
  )
}

const styles = {
  root: css`
    padding: 10px;
    position: relative;
  `,
  'board-header': css`
    margin-bottom: ${theme.spacing(1)}px;
  `,
  'card-list-container': css`
    display: flex;
    flex-wrap: wrap;
  `,
  'card-list-container-item': css`
    margin-right: ${theme.spacing(2)}px;
    margin-bottom: ${theme.spacing(2)}px;
  `
}
