import React from 'react'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { LoadingSpinner, PageContainer, BoardListItem, FavoriteIcon } from '@/components'
import {
  useFetchBoards,
  useSnackbarContext,
  useCreateBoardModalContext,
  useCurrentUser
} from '@/scripts/hooks'
import { OPTION } from '@/option'
import { Typography, makeStyles, Button } from '@material-ui/core'
import { theme } from '@/styles'
import PersonOutlineRoundedIcon from '@material-ui/icons/PersonOutlineRounded'
import AddRoundedIcon from '@material-ui/icons/AddRounded'
import PeopleAltOutlinedIcon from '@material-ui/icons/PeopleAltOutlined'

export const BoardTop: React.FC = () => {
  const boardState = useSelector(state => state.board)

  const user = useCurrentUser()
  const { state } = useLocation<string | undefined>()
  const { showSnackbar } = useSnackbarContext()
  const { openCreateBoardModal } = useCreateBoardModalContext()
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
  }, [state, showSnackbar])

  useFetchBoards()

  const personalBoards = React.useMemo(() => {
    if (!user) return []
    return Object.values(boardState.boards).filter(board => board.author === user.uid)
  }, [boardState.boards, user])

  const joiningBoards = React.useMemo(() => {
    if (!user) return []
    return Object.values(boardState.boards).filter(board => board.author !== user.uid)
  }, [boardState.boards, user])

  const favoriteBoards = React.useMemo(
    () => Object.values(boardState.boards).filter(board => board.favorite === true),
    [boardState.boards]
  )

  return (
    <PageContainer className={`AppPageContainer-root ${style.root}`}>
      {!boardState.init || (boardState.isLoading && <LoadingSpinner />)}
      {boardState.init && !boardState.isLoading && (
        <section id="board-inner">
          <Typography variant="h2">
            <PeopleAltOutlinedIcon />
            参加しているボード
          </Typography>
          <ul className="AppPageContainer-list">
            {joiningBoards.length ? (
              joiningBoards.map((board, i) => (
                <li key={i}>
                  <BoardListItem data={board} variant="block" />
                </li>
              ))
            ) : (
              <li className="AppPageContainer-listNotFound">
                <Typography variant="body2">参加しているボードはありません</Typography>
              </li>
            )}
          </ul>
          <Typography variant="h2">
            <FavoriteIcon favorite={false} />
            お気に入りボード
          </Typography>
          <ul className="AppPageContainer-list">
            {favoriteBoards.length ? (
              favoriteBoards.map((board, i) => (
                <li key={i}>
                  <BoardListItem data={board} variant="block" />
                </li>
              ))
            ) : (
              <li className="AppPageContainer-listNotFound">
                <Typography variant="body2">お気に入りのボードはありません</Typography>
              </li>
            )}
          </ul>
          <Typography variant="h2">
            <PersonOutlineRoundedIcon />
            パーソナルボード
          </Typography>
          <ul className="AppPageContainer-list">
            {personalBoards &&
              personalBoards.map((board, i) => (
                <li key={i}>
                  <BoardListItem data={board} variant="block" />
                </li>
              ))}
            <li>
              <Button
                variant="contained"
                onClick={openCreateBoardModal}
                startIcon={<AddRoundedIcon />}
                className="AppPageContainer-create"
              >
                新しいボード
              </Button>
            </li>
          </ul>
        </section>
      )}
    </PageContainer>
  )
}

const useStyles = makeStyles({
  root: {
    paddingTop: theme.spacing(5),
    '& .MuiTypography-root': {
      marginBottom: theme.spacing(2),
      '& > .MuiSvgIcon-root': {
        fontSize: '2rem',
        verticalAlign: 'bottom',
        marginRight: theme.spacing(1),
        color: 'inherit'
      }
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
      },
      '& .AppPageContainer-listNotFound': {
        width: '100%'
      }
    },
    '& .AppPageContainer-create': {
      height: 100,
      width: '100%'
    }
  }
})
