import React from 'react'
import { useParams, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import * as I from '@/scripts/model/interface'
import {
  ListContainer,
  BoardWithBackground,
  FavoriteButton,
  BoardMembers,
  BoardVisibilitySelection
} from '@/components'
import { useFetchBoard, useFetchList } from '@/scripts/hooks'
import { BoardTitle, BoardDrawer } from '@/components'
import { OPTION } from '@/option'
import { theme } from '@/styles'
import { makeStyles } from '@material-ui/styles'
import { fade } from '@material-ui/core/styles/colorManipulator'
import { Divider, Grid } from '@material-ui/core'

export const BoardDetail: React.FC = () => {
  const boardState = useSelector(state => state.board)
  const { boardId } = useParams<I.UrlParams>()
  const styles = useStyles()

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

  const currentBoard = React.useMemo(() => boardState.boards[boardId], [boardState.boards, boardId])

  return (
    <BoardWithBackground>
      <div className={`AppBoardDetail-root ${styles.root}`}>
        {boardState.init && !boardState.boards[boardId] && (
          /**
           * 存在しない boardId を指定したら、/boards へリダイレクトさせる
           */
          <Redirect to={redirect} />
        )}
        {boardState.boards[boardId] && (
          <>
            <div className="AppBoardDetail-header">
              <Grid container alignItems="center">
                <BoardTitle />
                <FavoriteButton favorite={boardState.boards[boardId].favorite} boardId={boardId} />
                <Divider orientation="vertical" flexItem />
                <BoardMembers data={currentBoard} />
                <Divider orientation="vertical" flexItem />
                <BoardVisibilitySelection data={currentBoard} />
              </Grid>
            </div>
            {boardState.error && <>エラーメッセージ{boardState.error.message}</>}
            <ListContainer boardId={boardId} />
          </>
        )}
        <BoardDrawer />
      </div>
    </BoardWithBackground>
  )
}

const useStyles = makeStyles({
  root: {
    position: 'relative',
    zIndex: 1,
    height: '100%',
    '& .AppBoardDetail-header': {
      position: 'relative',
      zIndex: 2,
      marginBottom: theme.spacing(1),
      '& .MuiButtonBase-root': {
        marginRight: theme.spacing(1)
      },
      '& > .MuiGrid-root > .MuiDivider-root': {
        marginRight: theme.spacing(1),
        backgroundColor: fade(theme.palette.white, 0.6)
      },
      '& .MuiAvatarGroup-root': {
        marginRight: theme.spacing(1)
      },
      '& .AppFavoriteButton-root': {
        borderRadius: theme.borderRadius(0.5),
        padding: 6,
        // border: `1px solid ${fade(theme.palette.white, 0.0)}`,
        verticalAlign: 'top'
      }
    },
    '& .AppListContainer-root': {
      position: 'relative',
      zIndex: 1
    }
  }
})
