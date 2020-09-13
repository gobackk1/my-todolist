import React from 'react'
import { Menu, CreateBoardModal, ArchivedBoardModal } from '@/components'
import {
  Button,
  makeStyles,
  Theme,
  Typography,
  TextField
} from '@material-ui/core'
import { useSelector } from 'react-redux'
import * as I from '@/scripts/interfaces'
import { Link } from 'react-router-dom'
import { OPTION } from '@/option'
import { css } from 'emotion/macro'
import { useForm } from 'react-hook-form'
import { Board } from '~redux/state/board/reducer'
import { useEventListener } from '@/scripts/hooks'

type SearchState = {
  isSearching: boolean
  value: string
  result: Board[]
}

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

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.currentTarget.value)
    const { value } = e.currentTarget
    value === ''
      ? setState(state => ({ ...state, isSearching: false }))
      : setState(state => ({ ...state, isSearching: true }))

    const result = boardState.boards.filter(board =>
      RegExp(value).test(board.title)
    )
    setState(state => ({ ...state, result, value }))
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
      <div className={styles['menu-content']} data-not-closed="true">
        <div className={styles['board-list']} data-not-closed="true">
          <form>
            <TextField
              ref={inputRef}
              // FIXME:
              // inputRef={register({
              //   required: OPTION.MESSAGE.BOARD.TITLE.REQUIRED_ERROR,
              //   maxLength: {
              //     value: OPTION.BOARD.TITLE.MAX_LENGTH,
              //     message: OPTION.MESSAGE.BOARD.TITLE.MAX_LENGTH_ERROR
              //   }
              // })}
              name="keyword"
              placeholder="タイトルでボードを検索"
              fullWidth
              onChange={onChangeInput}
              autoComplete="off"
              defaultValue=""
            />
          </form>
          {state.isSearching ? (
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
