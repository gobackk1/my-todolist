import React from 'react'
import { css } from '@emotion/core'
import bg1 from '@/images/bg/bg_photo_1.jpg'
import bg2 from '@/images/bg/bg_photo_2.jpg'
import { useSelector } from 'react-redux'
import * as I from '@/scripts/model/interface'
import { useParams } from 'react-router-dom'

export const BoardWithBackground: React.FC = ({ children }) => {
  const boardState = useSelector((state: I.ReduxState) => state.board)
  const { boardId } = useParams<I.UrlParams>()

  const index = boardState.boards.findIndex(board => board.id === boardId)

  const bgUrl = () => {
    if (!boardState.init) return ''
    switch (boardState.boards[index].backgroundImage) {
      case 'bg_photo_1':
        return bg1
      case 'bg_photo_2':
        return bg2
      default:
        return bg1
    }
  }

  return (
    <div
      css={styles['board']}
      style={{
        backgroundImage: `url(${bgUrl()})`
      }}
    >
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
