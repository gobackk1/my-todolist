import React from 'react'
import { css } from 'emotion'
import { TextField } from '@material-ui/core'
import { useSelector } from 'react-redux'
import * as I from '@/scripts/interfaces'
import { Board } from '~redux/state/board/reducer'

type Props = {
  state: SearchState
  setState: React.Dispatch<React.SetStateAction<SearchState>>
}

export const BoardListSearchForm: React.FC<Props> = ({ state, setState }) => {
  const boardState = useSelector((state: I.ReduxState) => state.board)
  const inputRef = React.useRef(null)

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <form className={styles['search']}>
      <TextField
        ref={inputRef}
        // FIXME:
        // inputRef={register({
        //   required: OPTION.MESSAGE.BOARD.TITLE.REQUIRED_ERROR,
        // })}
        name="keyword"
        placeholder="タイトルでボードを検索"
        fullWidth
        onChange={onChangeInput}
        autoComplete="off"
        defaultValue=""
        variant="outlined"
        size="small"
      />
    </form>
  )
}

const styles = {
  search: css`
    margin-bottom: 30px;
  `
}

type SearchState = {
  isSearching: boolean
  value: string
  result: Board[]
}
