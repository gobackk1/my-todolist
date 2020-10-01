import React from 'react'
import {
  Menu,
  CreateBoardModal,
  ArchivedBoardModal,
  BoardListSearchForm,
  SearchView,
  BoardListView
} from '@/components'
import { Button, makeStyles, Theme } from '@material-ui/core'
// import * as I from '@/scripts/model/interface'
import { css } from '@emotion/core'
import { Board } from '~redux/state/board/reducer'
import { theme } from '@/styles'

/**
 * ボード一覧ボタンと、押した時にでるメニュー
 */
export const BoardListMenu: React.FC = () => {
  const muiStyles = useStyles()
  const [state, setState] = React.useState<SearchState>({
    isSearching: false,
    value: '',
    result: []
  })

  return (
    <Menu
      render={props => (
        <Button
          {...props}
          variant="outlined"
          color="inherit"
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
          {state.isSearching ? <SearchView state={state} /> : <BoardListView />}
        </div>
        <CreateBoardModal />
        <ArchivedBoardModal />
      </div>
    </Menu>
  )
}

const useStyles = makeStyles({
  'button-open': {
    padding: 0,

    '& .MuiButton-label': {
      padding: 5
    }
  }
})

const styles = {
  'menu-content': css`
    background: #fff;
    color: #000;
    padding: 20px;
    width: 300px;
    border-radius: ${theme.borderRadius(1)}px;
  `,
  'board-list': css`
    margin-bottom: 20px;
  `
}

export type SearchState = {
  isSearching: boolean
  value: string
  result: Board[]
}
