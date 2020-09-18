import React from 'react'
import { Drawer, makeStyles, Paper } from '@material-ui/core'
import { archiveBoard } from '@/scripts/redux/state/board/actions'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory, Link, Route, Switch } from 'react-router-dom'
import { useSnackbarContext } from '@/scripts/hooks'
import { Button } from '@material-ui/core'
import { MoreHoriz } from '@material-ui/icons'
import { css } from '@emotion/core'
import * as I from '@/scripts/model/interface'
import * as T from '@/scripts/model/type'
import {
  fetchArchivedList,
  restoreList,
  deleteList
} from '~redux/state/list/actions'

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
      <Paper elevation={5}>
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
      </Paper>
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
      <Button to={`/boards/${boardId}/archivedItem`} component={Link} fullWidth>
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

  const onClick = async (id: string): Promise<void> => {
    try {
      await dispatch(restoreList({ boardId, id }))
    } catch ({ message }) {
      showSnackbar({ message, type: 'error' })
    }
  }

  const onClickDelete = async (id: string): Promise<void> => {
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
                    onClick(list.id)
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

const useStyles = makeStyles((theme: T.GlobalTheme) => ({
  root: {
    position: 'relative',
    zIndex: theme.zIndex.boardDrawer,
    '& .MuiDrawer-paper': {
      width: 300,
      overflow: 'visible',
      top: 64
    },
    '& .MuiPaper-root': {
      height: '100%'
    }
  },
  archiveButton: {
    textDecoration: 'underline'
  }
}))

const styles = {
  'drawer-button': css`
    position: absolute;
    top: 8px;
    left: -76%;
    visibility: visible;
  `,
  'drawer-content': css``
}
