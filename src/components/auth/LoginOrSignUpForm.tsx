import React from 'react'
import { makeStyles } from '@material-ui/core'
import { theme } from '@/styles'

const useStyles = makeStyles(() => ({
  form: {
    '& .MuiTextField-root': {
      marginBottom: theme.spacing(2)
    }
  }
}))

export const LoginOrSignUpForm: React.FC<any> = ({ children, onSubmit }) => {
  const muiStyles = useStyles()
  return (
    <form className={muiStyles['form']} onSubmit={onSubmit}>
      {children}
    </form>
  )
}
