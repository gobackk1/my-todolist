import React from 'react'
import { useParams, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import * as I from '@/scripts/model/interface'
import {
  LoadingSpinner,
  ListContainer,
  BoardWithBackground,
  FavoriteButton
} from '@/components'
import { useFetchBoard, useFetchList } from '@/scripts/hooks'
import { css } from '@emotion/core'
import { BoardTitle, BoardDrawer } from '@/components'
import { OPTION } from '@/option'
import { theme } from '@/styles'

export const BoardDetail: React.FC = () => {
  const boardState = useSelector((state: I.ReduxState) => state.board)
  const { boardId } = useParams<I.UrlParams>()

  // todo: state に 対象がなかった時のみ取得する
  useFetchBoard()
  useFetchList(boardId)

  const redirect = React.useMemo(
    () => ({
      pathname: OPTION.PATH.BOARD,
      state: 'BOARD_IS_NOT_EXIST'
    }),
    []
  )

  return (
    <div id="board">
      {!boardState.init && <LoadingSpinner />}
      {boardState.init && !boardState.boards[boardId] && (
        /**
         * 存在しない boardId を指定したら、/boards へリダイレクトさせる
         */
        <Redirect to={redirect} />
      )}
      {boardState.init && boardState.boards[boardId] && (
        <div id="board-inner">
          <BoardWithBackground>
            {Object.values(boardState.boards).length ? (
              <>
                <div css={styles['board-header']}>
                  <BoardTitle />
                  <FavoriteButton
                    favorite={boardState.boards[boardId].favorite}
                    boardId={boardId}
                  />
                </div>
                {boardState.error && (
                  <>エラーメッセージ{boardState.error.message}</>
                )}
                <ListContainer boardId={boardId} />
              </>
            ) : (
              'まだボードがありません。「ボード一覧」から新しいボードを作成してください。'
            )}
          </BoardWithBackground>
        </div>
      )}
      <BoardDrawer />
    </div>
  )
}

const styles = {
  'board-header': css`
    margin-bottom: ${theme.spacing(1)}px;
  `
}
