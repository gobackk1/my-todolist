import React from 'react'
import { Drawer, makeStyles } from '@material-ui/core'
import { archiveBoard } from '@/scripts/redux/state/board/actions'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory, Link, Route, Switch } from 'react-router-dom'
import { useSnackbarContext } from '@/scripts/hooks'
import { Button } from '@material-ui/core'
import { MoreHoriz } from '@material-ui/icons'
import { css } from '@emotion/core'
import * as I from '@/scripts/model/interface'
import { fetchArchivedList } from '~redux/state/list/actions'

export const BoardDrawer: React.FC = () => {
  const [open, setOpen] = React.useState(false)
  const toggleDrawer = () => setOpen(!open)
  const muiStyle = useStyles()

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={toggleDrawer}
      className={muiStyle['root']}
      variant="persistent"
    >
      <div css={styles['drawer-button']}>
        <Button
          onClick={toggleDrawer}
          variant="contained"
          startIcon={<MoreHoriz />}
        >
          ボードメニューを表示
        </Button>
      </div>
      <Switch>
        <Route
          path="/boards/:boardId/archivedItem"
          render={() => <DrawerArchivedItem open={open} setOpen={setOpen} />}
        />
        <Route
          path="/boards/:boardId/"
          render={() => <DrawerRoot setOpen={setOpen} />}
          exact
        />
      </Switch>
    </Drawer>
  )
}

const DrawerRoot: React.FC<{ setOpen: React.Dispatch<any> }> = ({
  setOpen
}) => {
  const muiStyle = useStyles()
  const history = useHistory()
  const dispatch = useDispatch()
  const { showSnackbar } = useSnackbarContext()
  const { boardId } = useParams<I.UrlParams>()

  const onClickArchive = async () => {
    if (!boardId) return
    if (!window.confirm('ボードをアーカイブしてもよろしいですか？')) return
    try {
      await dispatch(archiveBoard({ id: boardId }))
      setOpen(false)
      history.push('/boards')
    } catch ({ message }) {
      showSnackbar({
        message,
        type: 'error'
      })
    }
  }

  return (
    <div css={styles['drawer-content']}>
      <Button
        onClick={onClickArchive}
        fullWidth
        className={muiStyle['archiveButton']}
      >
        このボードをアーカイブ
      </Button>
      <Button to={`/boards/${boardId}/archivedItem`} component={Link}>
        アーカイブしたアイテム
      </Button>
    </div>
  )
}

const DrawerArchivedItem: React.FC<{
  open: boolean
  setOpen: React.Dispatch<any>
}> = ({ open, setOpen }) => {
  const { boardId } = useParams<I.UrlParams>()
  const dispatch = useDispatch()
  const { showSnackbar } = useSnackbarContext()
  const { user } = useSelector((state: I.ReduxState) => state.user)
  const listState = useSelector((state: I.ReduxState) => state.list)

  React.useEffect(() => {
    if (!(user && user.uid) || !open) return
    ;(async () => {
      try {
        await dispatch(fetchArchivedList({ boardId }))
      } catch ({ message }) {
        showSnackbar({ message, type: 'error' })
      }
    })()
  }, [dispatch, showSnackbar, user, boardId, open])

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
              <div key={i}>{list.title}</div>
            ))}
        </>
      )}
    </div>
  )
}

const useStyles = makeStyles(() => ({
  root: {
    '& .MuiDrawer-paper': {
      width: 300,
      overflow: 'visible',
      top: 64,
      padding: 8,
      boxShadow: '2px 0px 7px 0px #c1c1c1'
    }
  },
  archiveButton: {
    textDecoration: 'underline'
  }
}))

const styles = {
  'drawer-button': css`
    position: absolute;
    left: -76%;
    visibility: visible;
  `,
  'drawer-content': css``
}
