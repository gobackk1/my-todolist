import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createList } from '@/scripts/redux/state/list/actions'
import { fade, makeStyles } from '@material-ui/core'
import { Add } from '@material-ui/icons'
import { theme } from '@/styles'
import { CardList, BoardButton } from '@/components'
import { useBoardAuthority } from '@/scripts/hooks'
import { Container, Draggable } from 'react-smooth-dnd'
import arrayMove from 'array-move'

export const ListContainer: React.FC<{ boardId: string }> = ({ boardId }) => {
  const { user } = useSelector(state => state.currentUser)
  const listState = useSelector(state => state.list)
  const dispatch = useDispatch()
  const { isOneOfRoles } = useBoardAuthority(boardId)
  const styles = useStyles()

  const onClick = React.useCallback(() => {
    if (!user || listState.error) return
    if (boardId) dispatch(createList({ title: 'new card', boardId }))
  }, [user, listState.error, boardId, dispatch])

  const onDrop = param => console.log('onDrop', param)

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
        {boardId &&
          listState.boards[boardId] &&
          listState.boards[boardId].lists.map((list, i) => {
            return (
              <Draggable key={i}>
                <CardList list={list} />
              </Draggable>
            )
          })}
        <Draggable>
          <BoardButton
            onClick={onClick}
            startIcon={<Add />}
            variant="contained"
            disabled={isOneOfRoles(['reader'])}
            className={`non-drag-handle ${styles.buttonAddList}`}
          >
            リストを追加
          </BoardButton>
        </Draggable>
      </Container>
    </div>
  )
}

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    height: '100%',
    overflowX: 'scroll',
    '& .smooth-dnd-container': {
      height: '100%'
    },
    '& .drop-placeholder': {
      transform: `translateX(${-theme.spacing(1)}px)`,
      background: fade('#000', 0.3),
      boxSizing: 'border-box'
    }
  },
  buttonAddList: {
    width: 150
  }
})
