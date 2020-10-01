import React from 'react'
import { Button, makeStyles, Theme, Typography } from '@material-ui/core'
import { useDispatch, useStore } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { OPTION } from '@/option'
import { Board } from '~redux/state/board/reducer'
import { createBoard } from '@/scripts/redux/state/board/actions'
import { useSnackbarContext } from '@/scripts/hooks'
import { SearchState } from './BoardListMenu'

export const SearchView: React.FC<{ state: SearchState }> = ({ state }) => {
  const dispatch = useDispatch()
  const { showSnackbar } = useSnackbarContext()
  const history = useHistory()
  const { user, board } = useStore().getState()
  const muiStyles = useStyles()

  const onClickCreate = async ({ title }: Pick<Board, 'title'>) => {
    if (!user || board.error) return

    try {
      const { id }: any = await dispatch(
        createBoard({
          title,
          backgroundImage: OPTION.BOARD.BG.PHOTO[0].src
        })
      )
      document.body.click()
      history.push(`/boards/${id}`)
    } catch ({ message }) {
      showSnackbar({ message, type: 'error' })
    }
  }

  return (
    <div className={muiStyles['search-root']}>
      <Typography>結果は{state.result.length}件です</Typography>
      {state.result.length ? (
        <ul>
          {state.result.map((board, i) => {
            return (
              <li key={i}>
                <Button
                  to={`${OPTION.PATH.BOARD}/${board.id}`}
                  component={Link}
                  fullWidth={true}
                  variant="contained"
                  className={muiStyles['button-board']}
                  onClick={() => {
                    document.body.click()
                  }}
                  defaultValue=""
                >
                  {board.title}
                </Button>
              </li>
            )
          })}
        </ul>
      ) : null}
      {/* NOTE: サーバーからも検索するのであればここに表示 */}
      <Button
        onClick={() => {
          onClickCreate({ title: state.value })
        }}
        className={muiStyles['create-board-button']}
      >
        「{state.value}」というタイトルのボードを作成
      </Button>
    </div>
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
  },
  'search-root': {
    '& .MuiButton-root': {
      marginBottom: theme.spacing(2)
    },
    '& .MuiTypography-root': {
      marginBottom: theme.spacing(1)
    }
  },
  'create-board-button': {
    textDecoration: 'underline',
    textAlign: 'left'
  }
}))
