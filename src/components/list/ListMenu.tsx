import React from 'react'
import { IconButton, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { MoreHoriz } from '@material-ui/icons'
import { Menu } from '@/components'
import { useDispatch, useSelector } from 'react-redux'
import { archiveList } from '~redux/state/list/actions'
import { useSnackbarContext } from '@/scripts/hooks'
import { theme } from '@/styles'
import { List } from '~redux/state/list/reducer'

type Props = {
  data: List
}

export const ListMenu: React.FC<Props> = ({ data }) => {
  const dispatch = useDispatch()
  const { showSnackbar } = useSnackbarContext()
  const user = useSelector(state => state.currentUser)
  const listState = useSelector(state => state.list)
  const styles = useStyles()

  const onClickArchive = async () => {
    if (!user || listState.error) return

    try {
      await dispatch(archiveList(data))
      dispatchEvent(new CustomEvent('close_menu'))
    } catch ({ message }) {
      showSnackbar({
        message,
        type: 'error'
      })
    }
  }
  return (
    <Menu
      render={props => (
        <IconButton className={styles.buttonOpenMenu} {...props}>
          <MoreHoriz />
        </IconButton>
      )}
    >
      <div className={styles.listMenu}>
        <Button onClick={onClickArchive} fullWidth>
          リストをアーカイブする
        </Button>
      </div>
    </Menu>
  )
}

const useStyles = makeStyles({
  buttonOpenMenu: {
    padding: 5,
    borderRadius: 0
  },
  listMenu: {
    background: theme.palette.white,
    padding: theme.spacing(1),
    width: 200,
    borderRadius: `${theme.borderRadius(1)}px`
  }
})
