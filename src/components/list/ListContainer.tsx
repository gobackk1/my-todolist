import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createList } from '@/scripts/redux/state/list/actions'
import { makeStyles } from '@material-ui/core'
import { Add } from '@material-ui/icons'
import { theme } from '@/styles'
import { CardList, BoardButton } from '@/components'
import { useBoardAuthority } from '@/scripts/hooks'

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

  return (
    <ul className={`AppListContainer-root ${styles.root}`}>
      {boardId &&
        listState.boards[boardId] &&
        listState.boards[boardId].lists.map((list, i) => {
          return (
            <li className={`${styles.item}`} key={i}>
              <CardList list={list} />
            </li>
          )
        })}
      <li>
        <BoardButton
          onClick={onClick}
          startIcon={<Add />}
          variant="contained"
          disabled={isOneOfRoles(['reader'])}
        >
          リストを追加
        </BoardButton>
      </li>
    </ul>
  )
}

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  item: {
    marginRight: theme.spacing(1)
  }
})
