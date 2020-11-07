import React from 'react'
import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
// import * as T from '@/scripts/model/type'
// import * as I from '@/scripts/model/interface'
import { useDispatch } from 'react-redux'
import { useSnackbarContext } from '@/scripts/hooks'
import { OPTION } from '@/option'
import { updateCard, deleteCard } from '~redux/state/card/actions'
import { Card } from '~redux/state/card/reducer'
import { blueGrey } from '@material-ui/core/colors'

type Props = {
  data: Card
}

export const CardItem: React.FC<Props> = ({ data }) => {
  const styles = useStyles()
  const { showSnackbar } = useSnackbarContext()
  const dispatch = useDispatch()

  const onClickUpdate = async id => {
    const title = prompt('更新')
    if (!title) return

    try {
      await dispatch(
        updateCard({
          title,
          listId: data.listId,
          id
        })
      )
    } catch ({ message }) {
      showSnackbar({
        message: OPTION.MESSAGE.SERVER_CONNECTION_ERROR,
        type: 'error'
      })
    }
  }

  const onClickDelete = async id => {
    if (!confirm('削除して良いですか')) return

    try {
      await dispatch(
        deleteCard({
          listId: data.listId,
          id
        })
      )
    } catch ({ message }) {
      showSnackbar({
        message: OPTION.MESSAGE.SERVER_CONNECTION_ERROR,
        type: 'error'
      })
    }
  }
  return (
    <Button
      fullWidth
      variant="contained"
      className={`${styles.root} drag-handle`}
      onClick={() => {
        onClickUpdate(data.id)
      }}
      onContextMenu={() => {
        onClickDelete(data.id)
      }}
    >
      {data.title}
    </Button>
  )
}

const useStyles = makeStyles({
  root: {
    wordBreak: 'break-all',
    backgroundColor: blueGrey[50],
    '& .MuiButton-label': {
      justifyContent: 'left',
      textAlign: 'left'
    }
  }
})
