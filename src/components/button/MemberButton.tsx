import React from 'react'
import { IconButton } from '@material-ui/core'
import { UserIcon, Menu } from '@/components'
import { User } from '@/scripts/redux/state/users/reducer'
import { makeStyles } from '@material-ui/styles'
import { theme } from '@/styles'
import { deleteBoardMember } from '@/scripts/redux/state/board/actions'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import * as I from '@/scripts/model/interface'
import { useSnackbarContext, useCustomEvent } from '@/scripts/hooks'

export const MemberButton: React.FC<{ data: User }> = ({ data }) => {
  const styles = useStyles()
  const dispatch = useDispatch()
  const { boardId } = useParams<I.UrlParams>()
  const { showSnackbar } = useSnackbarContext()
  const dispatchCustomEvent = useCustomEvent()

  const onClickDeleteMember = React.useCallback(
    ({ uid }) => {
      if (!confirm('このボードからメンバーを削除しても良いですか？')) return
      try {
        dispatch(deleteBoardMember({ boardId, uid }))
        showSnackbar({
          message: 'ボードからメンバーを削除しました',
          type: 'info'
        })
        dispatchCustomEvent('close_menu')
      } catch ({ message }) {
        console.log('debug: MemberButton onClickDeleteMember', message)
        showSnackbar({ message, type: 'error' })
      }
    },
    [dispatch, showSnackbar, dispatchCustomEvent, boardId]
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
      <button>メンバーのロール変更</button>
      <button onClick={() => onClickDeleteMember(data)}>メンバーの削除</button>
    </Menu>
  )
}

const useStyles = makeStyles({
  root: {
    '& .AppMemberButton-inner': {
      padding: theme.spacing(1)
    },
    '& .MuiButtonBase-root': {
      padding: 0
    }
  }
})
