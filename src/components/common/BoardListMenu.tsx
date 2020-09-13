import React from 'react'
import {
  Menu,
  CreateBoardModal,
  ArchivedBoardModal,
  BoardListSearchForm
} from '@/components'
import { Button, makeStyles, Theme, Typography } from '@material-ui/core'
import { useSelector } from 'react-redux'
import * as I from '@/scripts/interfaces'
import { Link } from 'react-router-dom'
import { OPTION } from '@/option'
import { css } from 'emotion/macro'
import { useForm } from 'react-hook-form'
import { Board } from '~redux/state/board/reducer'
import { useEventListener } from '@/scripts/hooks'
import { LoadingSpinner } from './LoadingSpinner'

/**
 * ボード一覧ボタンと、押した時にでるメニュー
 * 検索時に View を出し分ける
 */
export const BoardListMenu: React.FC = () => {
  const boardState = useSelector((state: I.ReduxState) => state.board)
  const muiStyles = useStyles()
  const { register, reset } = useForm()
  const [state, setState] = React.useState<SearchState>({
    isSearching: false,
    value: '',
    result: []
  })
  const inputRef = React.useRef(null)

  useEventListener('onMenuClose', (e: React.MouseEvent<HTMLElement>) => {
    reset()
    /**
     * HACK: <TextField inputRef={register} /> だと、defaultValueを使っていても
     * 最初の１回の onChange イベントが発火しないので、
     * <TextFiled ref={inputRef} />で参照し、無理やり input の value を初期化した
     */
    ;((inputRef.current! as HTMLInputElement).children[0]
      .firstElementChild! as HTMLInputElement).value = ''
    setState({ isSearching: false, value: '', result: [] })
  })

  //TODO: {state.value}というタイトルのボードを作成ロジック

  const SearchView: React.FC = () => {
    return (
      <>
        <div>結果は{state.result.length}件です</div>
        {state.result.length && (
          <>
            {state.result.map((board, i) => {
              return (
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
                  key={i}
                >
                  {board.title}
                </Button>
              )
            })}
          </>
        )}
        <div>
          {state.value}
          というタイトルのボードを作成
        </div>
      </>
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
              <ul>
                {boardState.boards.map((board, i) => {
                  return (
                    <div className={styles['menu-content-item']} key={i}>
                      <Button
                        to={`${OPTION.PATH.BOARD}/${board.id}`}
                        component={Link}
                        fullWidth={true}
                        variant="contained"
                        className={muiStyles['button-board']}
                      >
                        {board.title}
                      </Button>
                    </div>
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
        >
          ボード一覧
        </Button>
      )}
    >
      <div className={styles['menu-content']}>
        <div className={styles['board-list']}>
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
  }
}))

const styles = {
  'menu-content': css`
    background: #fff;
    color: #000;
    padding: 20px;
    width: 300px;
    box-shadow: 2px 2px 13px 0px #6f6f6f;
  `,
  'menu-content-item': css`
    margin-bottom: 15px;
  `,
  'board-list': css`
    margin-bottom: 30px;
  `
}

type SearchState = {
  isSearching: boolean
  value: string
  result: Board[]
}
