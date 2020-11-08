import React from 'react'
import { IconButton, Button, Typography, Divider } from '@material-ui/core'
import { UserIcon, Menu } from '@/components'
import { User } from '@/scripts/model/interface'
import { makeStyles } from '@material-ui/styles'
import { theme } from '@/styles'
import { deleteBoardMember, updateBoard } from '@/scripts/redux/state/board/actions'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import * as I from '@/scripts/model/interface'
import { useSnackbarContext, useCustomEvent, useBoardAuthority } from '@/scripts/hooks'
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
  const { getRole, isAuthor, isOneOfRoles } = useBoardAuthority(boardId)

  const onClickDeleteMember = React.useCallback(
    ({ uid, displayName }) => {
      if (!confirm(`このボードから以下のメンバーを削除しても良いですか？\n\n${displayName}`)) return
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

  const currentBoard = React.useMemo(() => boardState.boards[boardId], [boardState.boards, boardId])

  /**
   * 同期処理にすると、.closest([data-click-area="menu"]) が null になる
   */
  const asyncSetView = React.useCallback(view => window.setTimeout(() => setView(view)), [setView])

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
    role => {
      if (isAuthor(data.uid)) {
        /**
         * 対象がボード作成者の場合、ボタンを非活性にする
         */
        return true
      } else {
        /**
         * 以下の場合、ボタンを非活性にする
         * - 管理者でない
         * - 現在の権限と、設定する権限が同じ
         */
        return !isOneOfRoles(['owner']) || getRole(data.uid) === role
      }
    },
    [getRole, isAuthor, data.uid, isOneOfRoles]
  )

  return (
    <Menu
      render={props => (
        <IconButton {...props} className="MuiButton-contained">
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
            <Button
              fullWidth
              onClick={() => onClickDeleteMember(data)}
              disabled={isAuthor(data.uid)}
            >
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
            {data.uid === currentBoard.author ? (
              <Typography variant="body1">
                ボード作成者の権限は、管理者から変更できません。
              </Typography>
            ) : (
              <Typography variant="body1">権限の変更は管理者のみが行えます。</Typography>
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
      width: 250,
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
      },
      '& .AppUserIcon-root': {
        marginRight: theme.spacing(1)
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
