import React from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { fetchBoards, archiveBoard } from '@/scripts/redux/state/board/actions'
import { fetchList } from '@/scripts/redux/state/list/actions'
import { useSelector, useDispatch } from 'react-redux'
import * as I from '@/scripts/interfaces'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { useSnackbarContext } from '@/scripts/hooks'
import { css } from 'emotion/macro'
import { BoardTitle } from '@/components'
import { Button } from '@material-ui/core'
import { Drawer, makeStyles } from '@material-ui/core'
import { MoreHoriz } from '@material-ui/icons'
import { createList } from '~redux/state/list/actions'
import { OPTION } from '@/option'

/**
 * ボードの View, 各種操作を管理する
 */
export const Board: React.FC = () => {
  const boardState = useSelector((state: I.ReduxState) => state.board)
  const userState = useSelector((state: I.ReduxState) => state.user)
  const listState = useSelector((state: I.ReduxState) => state.list)
  const dispatch = useDispatch()
  const { showSnackbar } = useSnackbarContext()
  const [open, setOpen] = React.useState(false)

  const muiStyle = useStyles()
  const history = useHistory()
  const { boardId } = useParams<any>()

  React.useEffect(() => {
    ;(async () => {
      if (!userState.user) return

      try {
        await dispatch(fetchList({ boardId }))
      } catch ({ message }) {
        showSnackbar({ message, type: 'error' })
      }
    })()
  }, [userState, dispatch, fetchList, showSnackbar, boardId])

  /**
   * ユーザーがログインしていたら、ボード一覧を取得
   */
  React.useEffect(() => {
    if (userState.user && userState.user.uid) {
      ;(async () => {
        try {
          await dispatch(fetchBoards())
        } catch (e) {
          showSnackbar({
            message: e.message,
            type: 'error'
          })
        }
      })()
    }
  }, [dispatch, userState, showSnackbar])

  const toggleDrawer = () => {
    setOpen(!open)
  }

  const onClickArchive = async () => {
    if (!boardId) return
    if (!window.confirm('ボードをアーカイブしてもよろしいですか？')) return
    try {
      await dispatch(
        archiveBoard({
          id: boardId
        })
      )
      setOpen(false)
      history.push('/boards')
    } catch ({ message }) {
      showSnackbar({
        message,
        type: 'error'
      })
    }
  }

  const onClick = () => {
    if (boardId)
      dispatch(
        createList({
          title: 'new card',
          boardId
        })
      )
  }

  return (
    <div className={styles['root']}>
      {boardState.isLoading && <LoadingSpinner />}
      {!boardState.isLoading && (
        <>
          {boardState.boards.length ? (
            <>
              <BoardTitle />
              {boardState.error && (
                <>
                  エラーメッセージ
                  {boardState.error.message}
                </>
              )}
              <div>ここにリストを並べる</div>
              <button onClick={onClick}>create list</button>
              {boardId &&
                listState.boards[boardId] &&
                listState.boards[boardId].lists.map((list, i) => {
                  return <div key={i}>{list.title}</div>
                })}
            </>
          ) : (
            'まだボードがありません。「ボード一覧」から新しいボードを作成してください。'
          )}
        </>
      )}
      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer}
        className={muiStyle['root']}
        variant="persistent"
      >
        <div className={styles['drawer-button']}>
          <Button
            onClick={toggleDrawer}
            variant="contained"
            startIcon={<MoreHoriz />}
          >
            ボードメニューを表示
          </Button>
        </div>
        <div className={styles['drawer-content']}>
          <Button
            onClick={onClickArchive}
            fullWidth
            className={muiStyle['archiveButton']}
          >
            このボードをアーカイブ
          </Button>
        </div>
      </Drawer>
    </div>
  )
}

const useStyles = makeStyles((theme: any) => ({
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
  root: css`
    padding: 10px;
    position: relative;
  `,
  'drawer-button': css`
    position: absolute;
    left: -76%;
    visibility: visible;
  `,
  'drawer-content': css``
}
