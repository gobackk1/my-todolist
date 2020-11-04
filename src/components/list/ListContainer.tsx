import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createList, changeListSortOrder } from '@/scripts/redux/state/list/actions'
import { fade, makeStyles } from '@material-ui/core'
import { Add } from '@material-ui/icons'
import { theme } from '@/styles'
import { CardList, BoardButton } from '@/components'
import { useBoardAuthority, useSnackbarContext } from '@/scripts/hooks'
import { Container, Draggable, DropResult } from 'react-smooth-dnd'
import { List } from '~redux/state/list/reducer'

export const ListContainer: React.FC<{ boardId: string }> = ({ boardId }) => {
  const { user } = useSelector(state => state.currentUser)
  const listState = useSelector(state => state.list)
  const dispatch = useDispatch()
  const { isOneOfRoles } = useBoardAuthority(boardId)
  const styles = useStyles()
  const { showSnackbar } = useSnackbarContext()

  const onClick = React.useCallback(() => {
    if (!user || listState.error) return
    if (boardId) dispatch(createList({ title: 'new card', boardId }))
  }, [user, listState.error, boardId, dispatch])

  const onDrop = React.useCallback(
    async ({ removedIndex, addedIndex }: DropResult): Promise<void> => {
      if (removedIndex === addedIndex || removedIndex === null || addedIndex === null) return
      try {
        await dispatch(changeListSortOrder({ removedIndex, addedIndex, boardId }))
      } catch ({ message }) {
        // TODO: トランザクション失敗のフィードバック
        showSnackbar({ message, type: 'info' })
      }
    },
    [boardId, dispatch, showSnackbar]
  )

  const sortedList: List[] | null = React.useMemo(() => {
    if (!listState.boards[boardId] || !listState.boards[boardId].lists) return null
    return listState.boards[boardId].lists.sort((x, y) => x.sortOrder - y.sortOrder)
  }, [boardId, listState.boards])

  return (
    <div className={`AppListContainer-root ${styles.root}`}>
      <Container
        dragHandleSelector=".drag-handle"
        nonDragAreaSelector=".non-drag-handle"
        onDrop={onDrop}
        orientation="horizontal"
        dropPlaceholder={{
          className: 'drop-placeholder',
          showOnTop: true
        }}
      >
        {sortedList &&
          sortedList.map((list, i) => {
            return (
              <Draggable key={i}>
                <CardList list={list} />
              </Draggable>
            )
          })}
      </Container>
      <BoardButton
        onClick={onClick}
        startIcon={<Add />}
        variant="contained"
        disabled={isOneOfRoles(['reader'])}
        className={`non-drag-handle ${styles.buttonAddList}`}
      >
        リストを追加
      </BoardButton>
    </div>
  )
}

const useStyles = makeStyles({
  root: {
    display: 'flex',
    height: '100%',
    overflowX: 'scroll',
    '& .smooth-dnd-container': {
      height: '100%',
      minWidth: 0
    },
    '& .drop-placeholder': {
      transform: `translateX(${-theme.spacing(1)}px)`,
      background: fade('#000', 0.3),
      boxSizing: 'border-box'
    }
  },
  buttonAddList: {
    width: 150,
    minWidth: 150,
    alignSelf: 'flex-start'
  }
})
