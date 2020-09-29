import React from 'react'
import { css } from '@emotion/core'
import { useSelector } from 'react-redux'
import * as I from '@/scripts/model/interface'
import { useParams } from 'react-router-dom'

export const BoardWithBackground: React.FC = ({ children }) => {
  const boardState = useSelector((state: I.ReduxState) => state.board)
  const { boardId } = useParams<I.UrlParams>()

  const index = boardState.boards.findIndex(board => board.id === boardId)
  const { init } = boardState
  const bg = init ? boardState.boards[index].backgroundImage : ''
  const style = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(bg)
    ? { backgroundColor: bg }
    : { backgroundImage: `url(${bg})` }

  return (
    <div css={styles['board']} style={style}>
      {children}
    </div>
  )
}

const styles = {
  board: css`
    padding: 10px;
    position: relative;
    min-height: calc(100vh - 64px);
    background-position: center;
    background-size: cover;
  `
}
