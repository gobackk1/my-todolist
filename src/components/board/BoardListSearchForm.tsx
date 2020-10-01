import React from 'react'
import { TextField } from '@material-ui/core'
import { useSelector } from 'react-redux'
import * as I from '@/scripts/model/interface'
import { Board } from '~redux/state/board/reducer'
import { useEventListener } from '@/scripts/hooks'
import { useForm } from 'react-hook-form'
import { makeStyles } from '@material-ui/styles'
import { theme } from '@/styles'

export const BoardListSearchForm: React.FC<Props> = ({ state, setState }) => {
  const boardState = useSelector(state => state.board)
  //NOTE: inputRef はアンマウントしないので
  /* eslint @typescript-eslint/no-non-null-assertion: off */
  const inputRef = React.useRef(null)
  const { reset } = useForm()
  const styles = useStyles()

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

    const values = Object.values(boardState.boards)

    const result = values
      .filter(board => RegExp(value).test(board.title))
      /**
       * favorite: true のものを上へ表示する
       */
      .sort((x, y) => (x.favorite === y.favorite ? 0 : x ? -1 : 1))

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
    <form
      css={styles['search']}
      className={`AppBoardListSearchForm-root ${styles.root}`}
    >
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

const useStyles = makeStyles({
  root: {
    marginBottom: theme.spacing(2)
  }
})

type Props = {
  state: SearchState
  setState: React.Dispatch<React.SetStateAction<SearchState>>
}

type SearchState = {
  isSearching: boolean
  value: string
  result: Board[]
}
