import React from 'react'
import { IconButton, Button, Typography, Divider } from '@material-ui/core'
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
  const { user } = useSelector(state => state.user)

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

  const currentTargetRole = React.useMemo(
    () => currentBoard.members[data.uid].role,
    [currentBoard.members, data.uid]
  )

  const currentLoginUserRole = React.useMemo(() => {
    if (!user) return null
    return currentBoard.members[user.uid].role
  }, [currentBoard.members, user])

  const isOwner = React.useMemo(() => currentLoginUserRole === 'owner', [
    currentLoginUserRole
  ])

  const isOnlyOneOwner = React.useMemo(
    () =>
      Object.values(currentBoard.members).filter(
        member => member.role === 'owner'
      ).length === 1,
    [currentBoard.members]
  )

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

  const checkForAuthority = React.useCallback(
    /**
     * 以下の場合はボタンを非活性にする
     * - 管理者が1人しかいない時に、管理者を変更しようとしている
     * - 管理者でない
     * - 現在の権限と、設定する権限が同じ
     */
    role => {
      if (currentTargetRole === 'owner' && isOnlyOneOwner) {
        return true
      } else {
        return !isOwner || currentTargetRole === role
      }
    },
    [isOnlyOneOwner, isOwner, currentTargetRole]
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
            <Divider className={styles.upper} />
            <Button
              onClick={() => onClickChangeRoleTo('owner')}
              fullWidth
              disabled={checkForAuthority('owner')}
            >
              管理者へ変更
            </Button>
            <Button
              onClick={() => onClickChangeRoleTo('editor')}
              fullWidth
              disabled={checkForAuthority('editor')}
            >
              編集者へ変更
            </Button>
            <Button
              onClick={() => onClickChangeRoleTo('reader')}
              fullWidth
              disabled={checkForAuthority('reader')}
            >
              購読者へ変更
            </Button>
            <Divider className={styles.bottom} />
            {isOnlyOneOwner && currentTargetRole === 'owner' ? (
              <Typography variant="body1">
                最低でも1人の管理者が必要です。このユーザーを管理者以外に変更できません。
              </Typography>
            ) : (
              <Typography variant="body1">
                権限の変更は管理者のみが行えます。
              </Typography>
            )}
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
    },
    '& .MuiTypography-body1': {
      textAlign: 'left'
    }
  },
  upper: {
    marginBottom: theme.spacing(1)
  },
  bottom: {
    marginTop: theme.spacing(1)
  }
})
