import React from 'react'
import { MemberButton, InvitationMenu } from '@/components'
import { useSelector } from 'react-redux'
import { Board } from '@/scripts/redux/state/board/reducer'
import { makeStyles } from '@material-ui/core'
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
    <ul className={`AppBoardMembers-root ${styles.root}`}>
      {boardMembers.map((member, i) => {
        return (
          <li key={i}>
            <MemberButton data={member} />
          </li>
        )
      })}
      <li>
        <InvitationMenu board={data} />
      </li>
    </ul>
  )
}

const useStyles = makeStyles({
  root: {
    display: 'inline-flex',
    '& > li': {
      marginRight: theme.spacing(1)
    }
  }
})
