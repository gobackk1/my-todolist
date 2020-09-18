import React from 'react'
import { css } from '@emotion/core'
import { TextField } from '@material-ui/core'
import { useSelector } from 'react-redux'
import * as I from '@/scripts/model/interface'
import { Board } from '~redux/state/board/reducer'
import { useEventListener } from '@/scripts/hooks'
import { useForm } from 'react-hook-form'

type Props = {
  state: SearchState
  setState: React.Dispatch<React.SetStateAction<SearchState>>
}

export const BoardListSearchForm: React.FC<Props> = ({ state, setState }) => {
  console.log(state)
  const boardState = useSelector((state: I.ReduxState) => state.board)
  //NOTE: inputRef はアンマウントしないので
  /* eslint @typescript-eslint/no-non-null-assertion: off */
  const inputRef = React.useRef(null)
  const { reset } = useForm()

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget
    value === ''
      ? setState(state => ({
          ...state,
          isSearching: false
        }))
      : setState(state => ({
          ...state,
          isSearching: true
        }))

    const result = boardState.boards.filter(board =>
      RegExp(value).test(board.title)
    )
    setState(state => ({
      ...state,
      result,
      value
    }))
  }

  useEventListener('onMenuClose', () => {
    reset()
    /**
     * HACK: <TextField inputRef={register} /> だと、defaultValueを使っていても
     * 最初の１回の onChange イベントが発火しないので、
     * <TextFiled ref={inputRef} />で参照し、無理やり input の value を初期化した
     */
    ;((inputRef.current! as HTMLInputElement).children[0]
      .firstElementChild! as HTMLInputElement).value = ''
    setState({
      isSearching: false,
      value: '',
      result: []
    })
  })

  return (
    <form css={styles['search']}>
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
