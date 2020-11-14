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
          className="AppBoardListMenu-openButton"
          id="button-menu-open"
        >
          ボード一覧
        </Button>
      )}
      className={styles.root}
    >
      <div className={`AppBoardListMenu-content ${styles.content}`}>
        <BoardListSearchForm state={state} setState={setState} />
        {state.isSearching ? <SearchView state={state} /> : <BoardListView />}
        <Button onClick={openCreateBoardModal} className="AppBoardListMenu-button-create" fullWidth>
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
    }
  },
  content: {
    background: '#fff',
    color: '#000',
    padding: theme.spacing(2),
    width: 300,
    borderRadius: `${theme.borderRadius(1)}px`,
    '& .MuiButton-label': {
      justifyContent: 'flex-start'
    }
  }
})

export type SearchState = {
  isSearching: boolean
  value: string
  result: Board[]
}
