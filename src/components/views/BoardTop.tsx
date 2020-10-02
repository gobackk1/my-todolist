import React from 'react'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import * as I from '@/scripts/model/interface'
import { LoadingSpinner, PageContainer, BoardListItem } from '@/components'
import { useFetchBoards, useSnackbarContext } from '@/scripts/hooks'
import { OPTION } from '@/option'
import { Typography, makeStyles } from '@material-ui/core'
import { theme } from '@/styles'

export const BoardTop: React.FC = () => {
  const boardState = useSelector((state: I.ReduxState) => state.board)
  const { state } = useLocation<string | undefined>()
  const { showSnackbar } = useSnackbarContext()
  const style = useStyles()

  /**
   * ボードがない理由でリダイレクトされてきたらフィードバックを返す
   */
  React.useEffect(() => {
    if (!state) return
    if (state === 'BOARD_IS_NOT_EXIST') {
      showSnackbar({
        message: OPTION.MESSAGE.UNAUTHORIZED_OPERATION,
        type: 'error'
      })
      history.replaceState(null, '')
    }
  }, [state])

  useFetchBoards()

  const personalBoards = React.useMemo(() => Object.values(boardState.boards), [
    boardState.boards
  ])

  const favoriteBoards = React.useMemo(
    () =>
      Object.values(boardState.boards).filter(board => board.favorite === true),
    [boardState.boards]
  )

  return (
    <PageContainer className={`AppPageContainer-root ${style.root}`}>
      {!boardState.init || (boardState.isLoading && <LoadingSpinner />)}
      {boardState.init && !boardState.isLoading && (
        <section id="board-inner">
          <Typography variant="h2">お気に入りボード</Typography>
          {favoriteBoards.length ? (
            <ul className="AppPageContainer-list">
              {favoriteBoards.map((board, i) => (
                <li key={i}>
                  <BoardListItem data={board} variant="block" />
                </li>
              ))}
            </ul>
          ) : (
            'お気に入りは０'
          )}
          <Typography variant="h2">パーソナルボード</Typography>
          {personalBoards.length ? (
            <ul className="AppPageContainer-list">
              {personalBoards.map((board, i) => (
                <li key={i}>
                  <BoardListItem data={board} variant="block" />
                </li>
              ))}
            </ul>
          ) : (
            'パーソナルボードは０'
          )}
        </section>
      )}
    </PageContainer>
  )
}

const useStyles = makeStyles({
  root: {
    paddingTop: theme.spacing(5),
    '& .MuiTypography-root': {
      marginBottom: theme.spacing(2)
    },
    '& .AppPageContainer-list': {
      display: 'flex',
      flexWrap: 'wrap',
      marginBottom: theme.spacing(4),
      '& > li': {
        width: 184,
        '&:not(:last-child)': {
          marginRight: theme.spacing(2),
          marginBottom: theme.spacing(2)
        }
      }
    }
  }
})
