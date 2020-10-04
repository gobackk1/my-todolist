import React from 'react'
import { IconButton, Button, Typography } from '@material-ui/core'
import { UserIcon, Menu } from '@/components'
import { User } from '@/scripts/redux/state/users/reducer'
import { makeStyles } from '@material-ui/styles'
import { theme } from '@/styles'
import {
  deleteBoardMember,
  updateBoard
} from '@/scripts/redux/state/board/actions'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import * as I from '@/scripts/model/interface'
import { useSnackbarContext, useCustomEvent } from '@/scripts/hooks'
import { KeyboardBackspaceRounded } from '@material-ui/icons/'
import { OPTION } from '@/option'

export const MemberButton: React.FC<{ data: User }> = ({ data }) => {
  const styles = useStyles()
  const dispatch = useDispatch()
  const { boardId } = useParams<I.UrlParams>()
  const { showSnackbar } = useSnackbarContext()
  const dispatchCustomEvent = useCustomEvent()
  const [view, setView] = React.useState<'root' | 'changeRole'>('root')
  const boardState = useSelector(state => state.board)

  const onClickDeleteMember = React.useCallback(
    ({ uid, displayName }) => {
      if (
        !confirm(
          `このボードから以下のメンバーを削除しても良いですか？\n\n${displayName}`
        )
      )
        return
      try {
        dispatch(
          deleteBoardMember({
            boardId,
            uid
          })
        )
        showSnackbar({
          message: 'ボードからメンバーを削除しました',
          type: 'info'
        })
        dispatchCustomEvent('close_menu')
      } catch ({ message }) {
        console.log('debug: MemberButton onClickDeleteMember', message)
        showSnackbar({
          message,
          type: 'error'
        })
      }
    },
    [dispatch, showSnackbar, dispatchCustomEvent, boardId]
  )

  const currentBoard = React.useMemo(() => boardState.boards[boardId], [
    boardState.boards,
    boardId
  ])

  const currentRole = React.useMemo(() => currentBoard.members[data.uid].role, [
    currentBoard.members,
    data.uid
  ])

  /**
   * 同期処理にすると、.closest([data-click-area="menu"]) が null になる
   */
  const asyncSetView = React.useCallback(
    view => window.setTimeout(() => setView(view)),
    [setView]
  )

  const onClickChangeRoleTo = React.useCallback(
    role => {
      const newBoard = {
        ...currentBoard,
        members: { ...currentBoard.members, [data.uid]: { role } }
      }

      try {
        dispatch(updateBoard(newBoard))
        showSnackbar({
          message: 'メンバーを権限を変更しました',
          type: 'info'
        })
        dispatchCustomEvent('close_menu')
      } catch ({ message }) {
        console.log('debug: MemberButton onClickChangeRoleTo', message)
        showSnackbar({
          message,
          type: 'error'
        })
      }
    },
    [dispatch, currentBoard, data, showSnackbar, dispatchCustomEvent]
  )

  return (
    <Menu
      render={props => (
        <IconButton {...props}>
          <UserIcon data={data} />
        </IconButton>
      )}
      className={`AppMemberButton-root ${styles.root}`}
    >
      <div className="AppMemberButton-inner">
        <div className="AppMemberButton-innerHeader">
          <UserIcon data={data} />
          <span>{data.displayName}</span>
        </div>

        {view === 'root' && (
          <>
            <Button fullWidth onClick={() => asyncSetView('changeRole')}>
              {`メンバーの権限を変更する\n（現在は${
                OPTION.ROLE[currentBoard.members[data.uid].role]
              }）`}
            </Button>
            <Button fullWidth onClick={() => onClickDeleteMember(data)}>
              メンバーの削除
            </Button>
          </>
        )}

        {view === 'changeRole' && (
          <div className={styles.changeRole}>
            <Typography variant="h5">
              <IconButton onClick={() => asyncSetView('root')}>
                <KeyboardBackspaceRounded />
              </IconButton>
              権限変更
            </Typography>
            <Button
              onClick={() => onClickChangeRoleTo('owner')}
              fullWidth
              disabled={currentRole === 'owner'}
            >
              管理者へ変更
            </Button>
            <Button
              onClick={() => onClickChangeRoleTo('editor')}
              fullWidth
              disabled={currentRole === 'editor'}
            >
              編集者へ変更
            </Button>
            <Button
              onClick={() => onClickChangeRoleTo('reader')}
              fullWidth
              disabled={currentRole === 'reader'}
            >
              購読者へ変更
            </Button>
          </div>
        )}
      </div>
    </Menu>
  )
}

const useStyles = makeStyles({
  root: {
    '& .AppMemberButton-inner': {
      padding: theme.spacing(1),
      width: 200,
      '& .MuiButton-label': {
        justifyContent: 'flex-start',
        textAlign: 'left'
      }
    },
    '& .AppMemberButton-innerHeader': {
      display: 'flex',
      alignItems: 'center',
      marginBottom: theme.spacing(1),
      '& img': {
        marginRight: theme.spacing(1)
      },
      '& span': {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    },
    '& .MuiButtonBase-root': {
      padding: 0
    }
  },
  changeRole: {
    '& .MuiTypography-root': {
      position: 'relative',
      textAlign: 'center',
      padding: '4px 0',
      '& .MuiIconButton-root': {
        position: 'absolute',
        top: 0,
        left: 0
      }
    }
  }
})
