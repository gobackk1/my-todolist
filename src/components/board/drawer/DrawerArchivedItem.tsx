import React from 'react'
import {
  fetchArchivedList,
  restoreList,
  deleteList
} from '~redux/state/list/actions'
import { List } from '~redux/state/list/reducer'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useStore } from 'react-redux'
import { useSnackbarContext } from '@/scripts/hooks'
import * as I from '@/scripts/model/interface'

export const DrawerArchivedItem: React.FC<{
  open: boolean
  setOpen: React.Dispatch<any>
}> = ({ open, setOpen }) => {
  console.log(setOpen)
  const { boardId } = useParams<I.UrlParams>()
  const { user, list: listState } = useStore().getState()
  const dispatch = useDispatch()
  const { showSnackbar } = useSnackbarContext()

  React.useEffect(() => {
    if (!(user && user.uid) || !open || listState.error) return
    ;(async () => {
      try {
        await dispatch(fetchArchivedList({ boardId }))
      } catch ({ message }) {
        showSnackbar({ message, type: 'error' })
      }
    })()
  }, [dispatch, showSnackbar, user, boardId, open, listState.error])

  const onClick = async ({ id, title }: List): Promise<void> => {
    if (!user || listState.error) return

    try {
      await dispatch(restoreList({ boardId, id }))
      showSnackbar({
        message: `アーカイブされた「${title}」を戻しました。`,
        type: 'info'
      })
    } catch ({ message }) {
      showSnackbar({ message, type: 'error' })
    }
  }

  const onClickDelete = async (id: string): Promise<void> => {
    if (!user || listState.error) return

    try {
      await dispatch(deleteList({ boardId, id }))
    } catch ({ message }) {
      showSnackbar({ message, type: 'error' })
    }
  }

  return (
    <div>
      archived item
      <Link to={`/boards/${boardId}`}>back</Link>
      {listState.isLoading ? (
        'loading'
      ) : (
        <>
          {listState.boards[boardId].archivedLists &&
            listState.boards[boardId].archivedLists.map((list, i) => (
              <div key={i}>
                {list.title}
                <button
                  onClick={() => {
                    onClick(list)
                  }}
                >
                  復元
                </button>
                <button onClick={() => onClickDelete(list.id)}>削除</button>
              </div>
            ))}
        </>
      )}
    </div>
  )
}
