import React from 'react'
import { Board } from '@/scripts/redux/state/board/reducer'
import { Menu } from '@/components'
import { Button, Typography, Divider } from '@material-ui/core'
import { useBoardAuthority, useSnackbarContext } from '@/scripts/hooks'
import { makeStyles } from '@material-ui/styles'
import { theme } from '@/styles'
import { useDispatch } from 'react-redux'
import { updateBoard } from '~redux/state/board/actions'

export const BoardVisibilitySelection: React.FC<{ data: Board }> = ({
  data
}) => {
  const { isOneOfRoles } = useBoardAuthority(data.id)
  const styles = useStyles()
  const { showSnackbar } = useSnackbarContext()
  const dispatch = useDispatch()

  const onClickChangeVisibility = React.useCallback(
    (visible: string) => {
      try {
        const visibility = visible === 'public' ? 'public' : 'members'
        dispatch(updateBoard({ ...data, visibility }))
      } catch ({ message }) {
        console.log('debug: ScopeSelection onClickChangeScope')
        showSnackbar({ message, type: 'error' })
      }
    },
    [showSnackbar, data, dispatch]
  )

  return (
    <Menu
      render={props => (
        <Button
          variant="contained"
          {...props}
          disabled={isOneOfRoles(['reader', 'editor'])}
        >
          {data.visibility === 'public' ? '公開' : 'メンバーのみ'}
        </Button>
      )}
      className={styles.root}
    >
      <section className="AppBoardVisibilitySelection-inner">
        <Typography variant="h4">ボードの公開範囲</Typography>
        <Divider />
        <Button onClick={() => onClickChangeVisibility('public')} fullWidth>
          公開
        </Button>
        <Button onClick={() => onClickChangeVisibility('members')} fullWidth>
          メンバーのみ
        </Button>
      </section>
    </Menu>
  )
}

const useStyles = makeStyles({
  root: {
    display: 'inline-block',
    '& .AppBoardVisibilitySelection-inner': {
      padding: theme.spacing(1),
      width: 280
    },
    '& .MuiTypography-root': {
      textAlign: 'center',
      '& + .MuiDivider-root': {
        marginTop: theme.spacing(1)
      }
    }
  }
})
