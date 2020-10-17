import React from 'react'
import { IconButton } from '@material-ui/core'
import { useDispatch } from 'react-redux'
import { changeFavoriteRelations } from '@/scripts/redux/state/board/actions'
import { useSnackbarContext } from '@/scripts/hooks'
import { FavoriteIcon } from '@/components'

export const FavoriteButton: React.FC<{
  favorite: boolean
  boardId: string
}> = ({ favorite, boardId }) => {
  const { showSnackbar } = useSnackbarContext()
  const dispatch = useDispatch()

  const onClickFavorite = React.useCallback(
    (favorite: boolean): void => {
      try {
        dispatch(changeFavoriteRelations({ favorite, boardId }))
      } catch ({ message }) {
        console.log(message)
        showSnackbar({ message, type: 'error' })
      }
    },
    [boardId, dispatch, showSnackbar]
  )

  return (
    <IconButton
      className="AppFavoriteButton-root"
      onClick={() => onClickFavorite(favorite)}
    >
      <FavoriteIcon favorite={favorite} />
    </IconButton>
  )
}
