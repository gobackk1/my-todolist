import React from 'react'
import { Button, makeStyles, Theme, Typography } from '@material-ui/core'
import { useSelector } from 'react-redux'
import * as I from '@/scripts/model/interface'
import { Link } from 'react-router-dom'
import { OPTION } from '@/option'
import { css } from '@emotion/core'
import { LoadingSpinner, BoardListItem } from '@/components'

export const BoardListView: React.FC = () => {
  const boardState = useSelector((state: I.ReduxState) => state.board)
  const muiStyles = useStyles()

  const personalBoards = Object.values(boardState.boards)
  const favoriteBoards = Object.values(boardState.boards).filter(
    board => board.favorite === true
  )

  return (
    <>
      {boardState.isLoading ? (
        <LoadingSpinner />
      ) : (
        <section>
          <Typography variant="h4">お気に入り</Typography>
          <ul>
            {favoriteBoards.length &&
              favoriteBoards.map((board, i) => {
                return (
                  <li css={styles['menu-content-item']} key={i}>
                    <BoardListItem data={board} />
                  </li>
                )
              })}
          </ul>
          <Typography variant="h4">パーソナルボード</Typography>
          <ul>
            {personalBoards.length &&
              personalBoards.map((board, i) => {
                return (
                  <li css={styles['menu-content-item']} key={i}>
                    <BoardListItem data={board} />
                  </li>
                )
              })}
          </ul>
        </section>
      )}
    </>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  'button-board': {
    fontWeight: 'bold',
    textAlign: 'left',
    '& .MuiButton-label': {
      display: 'block',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }
}))

const styles = {
  'menu-content-item': css`
    margin-bottom: 15px;
  `
}
