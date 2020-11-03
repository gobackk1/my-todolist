import React from 'react'
import { List } from '~redux/state/list/reducer'
import { Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { VariableInput, ListMenu, CardItem, CardCreator } from '@/components'
// import * as T from '@/scripts/model/type'
import * as I from '@/scripts/model/interface'
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbarContext } from '@/scripts/hooks'
import { OPTION } from '@/option'
import { updateList } from '~redux/state/list/actions'
import { theme } from '@/styles'
import { fade } from '@material-ui/core/styles/colorManipulator'

export const CardList: React.FC<Props> = ({ list }) => {
  const styles = useStyles()
  const dispatch = useDispatch()
  const { showSnackbar } = useSnackbarContext()
  const user = useSelector(state => state.currentUser)
  const listState = useSelector(state => state.list)
  const card = useSelector(state => state.card)

  const updateTitle = React.useCallback(
    async (
      e: React.FocusEvent<any> | React.KeyboardEvent<any>,
      setEditing: React.Dispatch<boolean>
    ) => {
      if (!user || listState.error) return

      const title = e.currentTarget.value
      setEditing(false)

      if (title === list.title) return

      if (title.length > 50) {
        // TODO: リストタイトルのバリデーション
        // showSnackbar({
        //   message: OPTION.MESSAGE.BOARD.TITLE.MAX_LENGTH_ERROR,
        //   type: 'error'
        // })
        // return
      } else if (!title.length) {
        showSnackbar({
          message: OPTION.MESSAGE.BOARD.TITLE.REQUIRED_ERROR,
          type: 'error'
        })
        return
      }

      try {
        await dispatch(updateList({ ...list, title }))
      } catch (e) {
        showSnackbar({
          message: OPTION.MESSAGE.SERVER_CONNECTION_ERROR,
          type: 'error'
        })
      }
    },
    [dispatch, listState.error, showSnackbar, user, list]
  )

  return (
    <Paper elevation={1} className={`${styles.root} drag-handle`}>
      <div className={styles.cardList}>
        <div className={styles.header}>
          <div className={styles.title}>
            <VariableInput
              label={list.title}
              onUpdate={updateTitle}
              component="textarea"
              width={200}
            />
          </div>
          <ListMenu data={list} />
        </div>
        <ul>
          {card.lists[list.id] &&
            card.lists[list.id].cards &&
            card.lists[list.id].cards.map((card, i) => {
              return (
                <li className={styles.item} key={i}>
                  <CardItem data={card} />
                </li>
              )
            })}
        </ul>
        <CardCreator data={list} />
      </div>
    </Paper>
  )
}

type Props = {
  list: List
}

const useStyles = makeStyles({
  root: {
    background: 'none',
    marginRight: `${theme.spacing(1)}px`,
    '& .AppVariableInput-root button': {
      boxShadow: 'none'
    },
    '& .AppVariableInput-root textarea::selection': {
      backgroundColor: theme.palette.primary.light
    }
  },
  cardList: {
    width: 250,
    backgroundColor: fade(theme.palette.white, 0.6),
    padding: theme.spacing(1),
    borderRadius: theme.borderRadius(0.5)
  },
  header: {
    display: 'flex',
    marginBottom: theme.spacing(2)
  },
  title: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    fontSize: 18,
    width: 200
  },
  item: {
    marginBottom: theme.spacing(1)
  }
})
