import React from 'react'
import { makeStyles } from '@material-ui/core'

export const PageContainer: React.FC<{ className?: string }> = ({
  children,
  className
}) => {
  const style = useStyles()
  return <div className={style.root + ' ' + className}>{children}</div>
}

const useStyles = makeStyles({
  root: {
    width: 1000,
    maxWidth: '98%',
    margin: '0 auto'
  }
})
