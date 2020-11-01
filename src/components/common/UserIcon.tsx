import React from 'react'
import { Avatar } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { theme } from '@/styles'
import { User } from '@/scripts/model/interface'

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
    padding: 0,
    display: 'inline-block',
    border: `2px solid ${theme.palette.blueGrey[200]}`,
    cursor: 'pointer'
  }
})

type Props = {
  data: User
}
