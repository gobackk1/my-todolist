import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createList } from '@/scripts/redux/state/list/actions'
import { Button } from '@material-ui/core'
import { Add } from '@material-ui/icons'
import { theme } from '@/styles'
import { css } from '@emotion/core'
import { CardList } from '@/components'
import { useBoardAuthority } from '@/scripts/hooks'

export const ListContainer: React.FC<{ boardId: string }> = ({ boardId }) => {
  const { user } = useSelector(state => state.user)
  const listState = useSelector(state => state.list)
  const dispatch = useDispatch()
  const { isOneOfRoles } = useBoardAuthority(boardId)

  const onClick = React.useCallback(() => {
    if (!user || listState.error) return
    if (boardId) dispatch(createList({ title: 'new card', boardId }))
  }, [user, listState.error, boardId, dispatch])

  return (
    <ul css={styles['card-list-container']}>
      {boardId &&
        listState.boards[boardId] &&
        listState.boards[boardId].lists.map((list, i) => {
          return (
            <li css={styles['card-list-container-item']} key={i}>
              <CardList list={list} />
            </li>
          )
        })}
      <li>
        <Button
          onClick={onClick}
          startIcon={<Add />}
          variant="contained"
          disabled={isOneOfRoles(['reader'])}
        >
          リストを追加
        </Button>
      </li>
    </ul>
  )
}

const styles = {
  'card-list-container': css`
    display: flex;
    flex-wrap: wrap;
  `,
  'card-list-container-item': css`
    margin-right: ${theme.spacing(2)}px;
    margin-bottom: ${theme.spacing(2)}px;
  `
}
