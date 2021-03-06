import React from 'react'
import { useParams, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import * as I from '@/scripts/model/interface'
import {
  LoadingSpinner,
  ListContainer,
  BoardWithBackground,
  FavoriteButton,
  BoardMembers,
  BoardVisibilitySelection
} from '@/components'
import { useFetchBoard, useFetchList } from '@/scripts/hooks'
import { css } from '@emotion/core'
import { BoardTitle, BoardDrawer } from '@/components'
import { OPTION } from '@/option'
import { theme } from '@/styles'

export const BoardDetail: React.FC = () => {
  const boardState = useSelector(state => state.board)
  const { boardId } = useParams<I.UrlParams>()

  // todo: state に 対象がなかった時のみ取得する
  useFetchBoard(boardId)
  useFetchList(boardId)

  const redirect = React.useMemo(
    () => ({
      pathname: OPTION.PATH.BOARD,
      state: 'BOARD_IS_NOT_EXIST'
    }),
    []
  )

  const currentBoard = React.useMemo(() => boardState.boards[boardId], [
    boardState.boards,
    boardId
  ])

  return (
    <BoardWithBackground>
      {!boardState.init && <LoadingSpinner />}
      {boardState.init && !boardState.boards[boardId] && (
        /**
         * 存在しない boardId を指定したら、/boards へリダイレクトさせる
         */
        <Redirect to={redirect} />
      )}
      {boardState.init && boardState.boards[boardId] && (
        <>
          <div css={styles['board-header']}>
            <BoardTitle />
            <FavoriteButton
              favorite={boardState.boards[boardId].favorite}
              boardId={boardId}
            />
            <BoardMembers data={currentBoard} />
            <BoardVisibilitySelection data={currentBoard} />
          </div>
          {boardState.error && <>エラーメッセージ{boardState.error.message}</>}
          <ListContainer boardId={boardId} />
        </>
      )}
      <BoardDrawer />
    </BoardWithBackground>
  )
}

const styles = {
  'board-header': css`
    margin-bottom: ${theme.spacing(1)}px;
  `
}
