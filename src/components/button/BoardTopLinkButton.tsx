import React from 'react'
import HomeRoundedIcon from '@material-ui/icons/HomeRounded'
import { IconButton } from '@material-ui/core'
import { OPTION } from '@/option'
import { useHistory } from 'react-router'

export const BoardTopLinkButton: React.FC = () => {
  const history = useHistory()

  const onClick = React.useCallback(() => {
    history.push(OPTION.PATH.BOARD)
  }, [history])

  return (
    <IconButton onClick={onClick} color="inherit">
      <HomeRoundedIcon />
    </IconButton>
  )
}
