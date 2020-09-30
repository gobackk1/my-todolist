import React from 'react'
import { css } from '@emotion/core'
import { useSelector } from 'react-redux'
import * as I from '@/scripts/model/interface'
import { useParams } from 'react-router-dom'

export const BoardWithBackground: React.FC = ({ children }) => {
  const boardState = useSelector((state: I.ReduxState) => state.board)
  const { boardId } = useParams<I.UrlParams>()

  return (
    <div css={styles['board']} style={boardState.getBackgroundStyle(boardId)}>
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
