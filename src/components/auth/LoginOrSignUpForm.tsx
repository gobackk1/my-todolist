import React from 'react'
import { makeStyles } from '@material-ui/core'
import { theme } from '@/styles'

const useStyles = makeStyles(() => ({
  root: {
    '& .MuiTextField-root': {
      marginBottom: theme.spacing(2)
    }
  }
}))

export const LoginOrSignUpForm: React.FC<any> = ({ children, onSubmit }) => {
  const styles = useStyles()
  return (
    <form className={styles.root} onSubmit={onSubmit}>
      {children}
    </form>
  )
}
