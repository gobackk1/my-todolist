import React from 'react'
import { makeStyles } from '@material-ui/core'
import StarRoundedIcon from '@material-ui/icons/StarRounded'
import StarBorderRoundedIcon from '@material-ui/icons/StarBorderRounded'
import { theme } from '@/styles'

export const FavoriteIcon: React.FC<{ favorite: boolean }> = ({ favorite }) => {
  const muiStyles = useStyles()

  return favorite ? (
    <StarRoundedIcon className={muiStyles['on']} />
  ) : (
    <StarBorderRoundedIcon className={muiStyles['off']} />
  )
}

const useStyles = makeStyles({
  on: {
    color: theme.palette.favorite.on
  },
  off: {
    color: theme.palette.favorite.off
  }
})
