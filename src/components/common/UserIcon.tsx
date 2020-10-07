import React from 'react'
import { Avatar } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { User } from '@/scripts/redux/state/currentUser/reducer'

export const UserIcon: React.FC<Props> = ({ data }) => {
  const styles = useStyles()
  return (
    <Avatar
      src={data.avatarURL}
      alt={data.displayName}
      className={`AppUserIcon-root ${styles.root}`}
    />
  )
}

const useStyles = makeStyles({
  root: {
    padding: 0
  }
})

type Props = {
  data: any
}
