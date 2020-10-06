import React from 'react'
import { makeStyles } from '@material-ui/core'

export const UserIcon: React.FC<Props> = ({ data }) => {
  const styles = useStyles()
  return (
    <img
      src={data.photoURL as string}
      alt={data.displayName as string}
      width="40"
      className={`AppUserIcon-root ${styles.root}`}
    />
  )
}

type Props = {
  data: any
}

const useStyles = makeStyles({
  root: {
    borderRadius: '50%'
  }
})
