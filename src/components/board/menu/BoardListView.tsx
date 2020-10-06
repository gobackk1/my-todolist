import React from 'react'
import { makeStyles, Theme, Typography } from '@material-ui/core'
import { useSelector } from 'react-redux'
import { LoadingSpinner, BoardListItem, ToggleList } from '@/components'

export const BoardListView: React.FC = () => {
  const boardState = useSelector(state => state.board)
  const styles = useStyles()

  const personalBoards = Object.values(boardState.boards)
  const favoriteBoards = Object.values(boardState.boards).filter(
    board => board.favorite === true
  )

  return (
    <div className={`AppBoardListView ${styles.root}`}>
      {boardState.isLoading ? (
        <LoadingSpinner />
      ) : (
        <section>
          {favoriteBoards.length ? (
            <ToggleList
              component={
                <Typography variant="h4" className={styles.title}>
                  お気に入り
                </Typography>
              }
            >
              <ul>
                {favoriteBoards.map((board, i) => {
                  return (
                    <li key={i}>
                      <BoardListItem data={board} />
                    </li>
                  )
                })}
              </ul>
            </ToggleList>
          ) : null}
          <ToggleList
            component={
              <Typography variant="h4" className={styles.title}>
                パーソナルボード
              </Typography>
            }
          >
            <ul>
              {personalBoards.length ? (
                personalBoards.map((board, i) => {
                  return (
                    <li key={i}>
                      <BoardListItem data={board} />
                    </li>
                  )
                })
              ) : (
                <Typography variant="body2">
                  作成したボードがありません。
                </Typography>
              )}
            </ul>
          </ToggleList>
        </section>
      )}
    </div>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    '& .AppToggleList-root': {
      marginBottom: theme.spacing(2)
    },
    '& .AppBoardListItem-root': {
      marginBottom: theme.spacing(1)
    }
  },
  title: {
    display: 'flex',
    alignItems: 'center'
  }
}))
