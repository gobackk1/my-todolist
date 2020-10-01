import React from 'react'
import { makeStyles, IconButton } from '@material-ui/core'
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined'
import IndeterminateCheckBoxOutlinedIcon from '@material-ui/icons/IndeterminateCheckBoxOutlined'
import { theme } from '@/styles'

export const ToggleList: React.FC<{ component: any }> = ({
  component,
  children
}) => {
  const muiStyles = useStyles()
  const [isOpen, setOpen] = React.useState(true)

  const onClick = React.useCallback(() => setOpen(!isOpen), [setOpen, isOpen])

  return (
    <div className={`AppToggleList-root ${muiStyles.root}`}>
      <div className="AppToggleList-head">
        {component}
        <IconButton onClick={onClick}>
          {isOpen ? (
            <IndeterminateCheckBoxOutlinedIcon />
          ) : (
            <AddBoxOutlinedIcon />
          )}
        </IconButton>
      </div>
      {isOpen ? children : null}
    </div>
  )
}

const useStyles = makeStyles({
  root: {
    '& .AppToggleList-head': {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: theme.spacing(1),
      '& .MuiButtonBase-root': {
        padding: 0
      }
    },
    '& svg': {
      // NOTE: メニューが閉じるため
      pointerEvents: 'none'
    }
  }
})
