import React from 'react'
import { useParams } from 'react-router-dom'
import { fetchBoards } from '@/scripts/redux/state/board/actions'
import { useSelector, useDispatch } from 'react-redux'
import * as I from '@/scripts/model/interface'
import { LoadingSpinner, CardList } from '@/components'
import { useSnackbarContext } from '@/scripts/hooks'
import { css } from '@emotion/core'
import { BoardTitle, BoardDrawer } from '@/components'
import { Button } from '@material-ui/core'
import { Theme } from '@material-ui/core'
import { fetchList, createList } from '@/scripts/redux/state/list/actions'

/**
 * ボードの View, 各種操作を管理する
 */
export const Board: React.FC = () => {
  const boardState = useSelector((state: I.ReduxState) => state.board)
  const userState = useSelector((state: I.ReduxState) => state.user)
  const listState = useSelector((state: I.ReduxState) => state.list)
  const dispatch = useDispatch()
  const { showSnackbar } = useSnackbarContext()
  const { boardId } = useParams<I.UrlParams>()

  React.useEffect(() => {
    if (userState.user && userState.user.uid && !listState.error) {
      ;(async () => {
        try {
          await dispatch(fetchList({ boardId }))
        } catch ({ message }) {
          showSnackbar({ message, type: 'error' })
        }
      })()
    }
    /**
     * NOTE:
     * フィードバック表示・非表示のタイミングで画面を再レンダリングしたく無いので
     * showSnackbar を配列に加えない
     */
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [userState, dispatch, boardId, listState.error])

  /**
   * ユーザーがログインしていたら、ボード一覧を取得
   */
  React.useEffect(() => {
    if (userState.user && userState.user.uid && !boardState.error) {
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
    /**
     * NOTE:
     * フィードバック表示・非表示のタイミングで画面を再レンダリングしたく無いので
     * showSnackbar を配列に加えない
     */
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [dispatch, userState, boardState.error])

  const onClick = () => {
    if (!userState.user || listState.error) return
    if (boardId) dispatch(createList({ title: 'new card', boardId }))
  }

  return (
    <div css={styles['root']}>
      {boardState.isLoading && <LoadingSpinner />}
      {!boardState.isLoading && (
        <>
          {boardState.boards.length ? (
            <>
              <div css={styles['board-header']}>
                <BoardTitle />
              </div>
              {boardState.error && (
                <>エラーメッセージ{boardState.error.message}</>
              )}
              <Button onClick={onClick}>create list</Button>
              <ul css={styles['card-list-container']}>
                {boardId &&
                  listState.boards[boardId] &&
                  listState.boards[boardId].lists.map((list, i) => {
                    return (
                      <li key={i}>
                        <CardList list={list} />
                      </li>
                    )
                  })}
              </ul>
            </>
          ) : (
            'まだボードがありません。「ボード一覧」から新しいボードを作成してください。'
          )}
        </>
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
  'board-header': (theme: Theme) => css`
    margin-bottom: ${theme.spacing(1)}px;
  `,
  'card-list-container': css`
    display: flex;
    flex-wrap: wrap;
  `
}
