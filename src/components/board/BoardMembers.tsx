import React from 'react'
import { MemberButton, InvitationMenu } from '@/components'
import { useSelector } from 'react-redux'
import { Board } from '@/scripts/redux/state/board/reducer'
import { makeStyles } from '@material-ui/core'
import { AvatarGroup } from '@material-ui/lab'
import { theme } from '@/styles'

export const BoardMembers: React.FC<{ data: Board }> = ({ data }) => {
  const { users } = useSelector(state => state.users)
  const styles = useStyles()
  const boardState = useSelector(state => state.board)

  const boardMembers = React.useMemo(() => {
    return boardState.init
      ? Object.keys(data.members)
          .map(uid => users[uid])
          .filter(Boolean)
      : []
  }, [boardState, data.members, users])

  return (
    <div className={`AppBoardMembers-root ${styles.root}`}>
      <AvatarGroup max={3}>
        {boardMembers.map((member, i) => {
          return (
            <span key={i}>
              <MemberButton data={member} />
            </span>
          )
        })}
      </AvatarGroup>
      <InvitationMenu board={data} />
    </div>
  )
}

const useStyles = makeStyles({
  root: {
    display: 'inline-flex',
    alignItems: 'center',
    '& .MuiAvatarGroup-avatar': {
      border: 'none',
      '&:not(:first-child)': {
        marginLeft: -theme.spacing(2)
      }
    },
    '& .MuiButtonBase-root': {
      marginRight: 0
    },
    '& .AppUserIcon-root': {
      width: 36,
      height: 36
    }
  }
})
