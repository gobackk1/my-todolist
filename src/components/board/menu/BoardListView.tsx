import React from 'react'
import { makeStyles, Theme, Typography } from '@material-ui/core'
import { useSelector } from 'react-redux'
import { LoadingSpinner, BoardListItem, ToggleList } from '@/components'
import { useFetchBoards } from '@/scripts/hooks'

export const BoardListView: React.FC = () => {
  const boardState = useSelector(state => state.board)
  const styles = useStyles()
  const { user } = useSelector(state => state.currentUser)

  const personalBoards = React.useMemo(() => {
    if (!user) return []
    return boardState.getBoardsByUid(user.uid)
  }, [user, boardState])

  const joiningBoards = React.useMemo(() => {
    if (!user) return []
    return boardState.getBoardsByUid(null)
  }, [user, boardState])

  const favoriteBoards = React.useMemo(() => {
    return Object.values(boardState.boards).filter(board => board.favorite === true)
  }, [boardState])

  useFetchBoards()

  return (
    <div className={`AppBoardListView ${styles.root}`}>
      {boardState.isLoading ? (
        <LoadingSpinner />
      ) : (
        <section className={styles.section}>
          <ToggleList
            component={
              <Typography variant="h4" className={styles.title}>
                参加しているボード
              </Typography>
            }
          >
            <ul>
              {joiningBoards.length ? (
                joiningBoards.map((board, i) => {
                  return (
                    <li key={i}>
                      <BoardListItem data={board} />
                    </li>
                  )
                })
              ) : (
                <Typography variant="body2">参加しているボードがありません。</Typography>
              )}
            </ul>
          </ToggleList>
          {favoriteBoards.length && (
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
          )}
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
                <Typography variant="body2">作成したボードがありません。</Typography>
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
  },
  section: {
    maxHeight: 600,
    overflowY: 'scroll',
    marginBottom: theme.spacing(1)
  }
}))
