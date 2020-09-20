import React from 'react'
import {
  Menu,
  CreateBoardModal,
  ArchivedBoardModal,
  BoardListSearchForm
} from '@/components'
import { Button, makeStyles, Theme, Typography } from '@material-ui/core'
import { useSelector, useDispatch, useStore } from 'react-redux'
import * as I from '@/scripts/model/interface'
import { Link, useHistory } from 'react-router-dom'
import { OPTION } from '@/option'
import { css } from '@emotion/core'
import { Board } from '~redux/state/board/reducer'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { createBoard } from '@/scripts/redux/state/board/actions'
import { useSnackbarContext } from '@/scripts/hooks'

/**
 * ボード一覧ボタンと、押した時にでるメニュー
 * 検索時に View を出し分ける
 */
export const BoardListMenu: React.FC = () => {
  const boardState = useSelector((state: I.ReduxState) => state.board)
  const muiStyles = useStyles()
  const [state, setState] = React.useState<SearchState>({
    isSearching: false,
    value: '',
    result: []
  })
  const dispatch = useDispatch()
  const { showSnackbar } = useSnackbarContext()
  const history = useHistory()
  const { user, board } = useStore().getState()

  const onClickCreate = async ({ title }: Pick<Board, 'title'>) => {
    if (!user || board.error) return

    try {
      const { id }: any = await dispatch(createBoard({ title }))
      document.body.click()
      history.push(`/boards/${id}`)
    } catch ({ message }) {
      showSnackbar({ message, type: 'error' })
    }
  }

  const SearchView: React.FC = () => {
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

  const BoardListView: React.FC = () => {
    return (
      <>
        {boardState.isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {boardState.boards.length ? (
              <ul id="list-board-menu">
                {boardState.boards.map((board, i) => {
                  return (
                    <li css={styles['menu-content-item']} key={i}>
                      <Button
                        to={`${OPTION.PATH.BOARD}/${board.id}`}
                        component={Link}
                        fullWidth={true}
                        variant="contained"
                        className={muiStyles['button-board']}
                        onClick={() => {
                          document.body.click()
                        }}
                      >
                        {board.title}
                      </Button>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <Typography variant="body1">ボードはありません</Typography>
            )}
          </>
        )}
      </>
    )
  }

  return (
    <Menu
      render={props => (
        <Button
          {...props}
          color="inherit"
          variant="contained"
          className={muiStyles['button-open']}
          id="button-menu-open"
        >
          ボード一覧
        </Button>
      )}
    >
      <div css={styles['menu-content']} id="menu-board-list">
        <div css={styles['board-list']}>
          <BoardListSearchForm state={state} setState={setState} />
          {state.isSearching ? <SearchView /> : <BoardListView />}
        </div>
        <CreateBoardModal />
        <ArchivedBoardModal />
      </div>
    </Menu>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  'button-open': {
    padding: 0,
    backgroundColor: '#000',
    '&:hover': {
      backgroundColor: '#000'
    },
    '& .MuiButton-label': {
      padding: 5
    }
  },
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
  'board-list-title': {
    marginBottom: 20
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

const styles = {
  'menu-content': css`
    background: #fff;
    color: #000;
    padding: 20px;
    width: 300px;
  `,
  'menu-content-item': css`
    margin-bottom: 15px;
  `,
  'board-list': css`
    margin-bottom: 20px;
  `
}

type SearchState = {
  isSearching: boolean
  value: string
  result: Board[]
}
