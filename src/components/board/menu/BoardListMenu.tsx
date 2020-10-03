import React from 'react'
import {
  Menu,
  ArchivedBoardModal,
  BoardListSearchForm,
  SearchView,
  BoardListView
} from '@/components'
import { Button, makeStyles } from '@material-ui/core'
import { Board } from '~redux/state/board/reducer'
import { theme } from '@/styles'
import { useCreateBoardModalContext } from '@/scripts/hooks'

/**
 * ボード一覧ボタンと、押した時にでるメニュー
 */
export const BoardListMenu: React.FC = () => {
  const styles = useStyles()
  const [state, setState] = React.useState<SearchState>({
    isSearching: false,
    value: '',
    result: []
  })
  const { openCreateBoardModal } = useCreateBoardModalContext()

  return (
    <Menu
      render={props => (
        <Button
          {...props}
          variant="outlined"
          color="inherit"
          className="AppBoardListMenu-button-open"
          id="button-menu-open"
        >
          ボード一覧
        </Button>
      )}
      className={styles.root}
    >
      <div className="AppBoardListMenu-content" id="menu-board-list">
        <div css={styles['board-list']}>
          <BoardListSearchForm state={state} setState={setState} />
          {state.isSearching ? <SearchView state={state} /> : <BoardListView />}
        </div>
        <Button
          onClick={openCreateBoardModal}
          className="AppBoardListMenu-button-create"
        >
          新しいボードを作成
        </Button>
        <ArchivedBoardModal />
      </div>
    </Menu>
  )
}

const useStyles = makeStyles({
  root: {
    position: 'relative',
    '& .AppBoardListMenu-button-open': {
      padding: 0,

      '& .MuiButton-label': {
        padding: 5
      }
    },
    '& .AppBoardListMenu-button-create': {
      '& .MuiButton-label': {
        textDecoration: 'underline'
      }
    },
    '& .AppBoardListMenu-content': {
      background: '#fff',
      color: '#000',
      padding: theme.spacing(2),
      width: 300,
      boarderRadius: theme.borderRadius(1)
    }
  }
})

export type SearchState = {
  isSearching: boolean
  value: string
  result: Board[]
}
