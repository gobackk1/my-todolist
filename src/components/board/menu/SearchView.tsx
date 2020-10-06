import React from 'react'
import { Button, makeStyles, Theme, Typography } from '@material-ui/core'
import { useStore, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { OPTION } from '@/option'
import { Board } from '~redux/state/board/reducer'
import { createBoard } from '@/scripts/redux/state/board/actions'
import { useSnackbarContext } from '@/scripts/hooks'
import { SearchState } from './BoardListMenu'
import { BoardListItem } from '@/components'

export const SearchView: React.FC<{ state: SearchState }> = ({ state }) => {
  const dispatch = useDispatch()
  const { showSnackbar } = useSnackbarContext()
  const history = useHistory()
  const { user, board } = useStore().getState()
  const styles = useStyles()

  const onClickCreate = async ({
    title
  }: Pick<Board, 'title'>): Promise<void> => {
    if (!user || board.error) return

    try {
      const { id }: Board = await dispatch(
        createBoard({
          title,
          backgroundImage: OPTION.BOARD.BG.PHOTO[0].src
        })
      )
      document.body.click()
      history.push(`/boards/${id}`)
    } catch ({ message }) {
      showSnackbar({ message, type: 'error' })
      console.log(message)
    }
  }

  return (
    <div className={`AppSearchListView-root ${styles.root}`}>
      <Typography>結果は{state.result.length}件です</Typography>
      {state.result.length ? (
        <ul className="AppSearchListView-result">
          {state.result.map((board, i) => {
            return (
              <li key={i}>
                <BoardListItem data={board} />
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
        className={styles.createButton}
      >
        「{state.value}」というタイトルのボードを作成
      </Button>
    </div>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    '& .AppSearchListView-result': {
      '& .MuiButton-root': {
        marginBottom: theme.spacing(2)
      }
    },
    '& .MuiTypography-root': {
      marginBottom: theme.spacing(1)
    }
  },
  createButton: {
    textDecoration: 'underline',
    textAlign: 'left'
  }
}))
