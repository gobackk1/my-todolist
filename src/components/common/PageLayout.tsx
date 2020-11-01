import React from 'react'
import { Header, BeforeVerified, LoadingSpinner } from '@/components'
import { useAuth } from '@/scripts/hooks'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core'
import { theme } from '@/styles'

export const PageLayout: React.FC = ({ children }) => {
  useAuth()
  const { user, isLoggingIn } = useSelector(state => state.currentUser)
  const styles = useStyles()
  return (
    <div className="AppPageLayout-root">
      <Header />
      {isLoggingIn ? (
        <div className={styles.spinner}>
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {user?.emailVerified ? (
            <div className={styles.child}>{children}</div>
          ) : (
            <BeforeVerified />
          )}
        </>
      )}
    </div>
  )
}

const useStyles = makeStyles({
  spinner: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: theme.spacing(5)
  },
  child: {
    position: 'relative',
    height: 'calc(100vh - 64px)'
  }
})
