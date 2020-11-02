import React from 'react'
import { css } from '@emotion/core'
import { useSelector } from 'react-redux'
import * as I from '@/scripts/model/interface'
import { useParams } from 'react-router-dom'
import { theme } from '@/styles'

export const BoardWithBackground: React.FC = ({ children }) => {
  const boardState = useSelector(state => state.board)
  const { boardId } = useParams<I.UrlParams>()

  const style = boardState.getBackgroundStyle(boardId) || {}

  return (
    <div css={styles['board']} style={style}>
      {children}
    </div>
  )
}

const styles = {
  board: css`
    position: relative;
    background-position: center;
    background-size: cover;
    height: inherit;
    padding: ${theme.spacing(1)}px;
    overflow-x: scroll;
  `
}
