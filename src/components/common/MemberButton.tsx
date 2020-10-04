import React from 'react'
import { IconButton } from '@material-ui/core'
import { UserIcon, Menu } from '@/components'
import { User } from '@/scripts/redux/state/users/reducer'
import { makeStyles } from '@material-ui/styles'
import { theme } from '@/styles'

export const MemberButton: React.FC<{ data: User }> = ({ data }) => {
  const styles = useStyles()
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
      <button>メンバーの削除</button>
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
