import React from 'react'
import { Modal, LoginView, SignUpView, UserIcon } from '@/components'
import { Button, IconButton } from '@material-ui/core'
import { useEventListener, useCurrentUser } from '@/scripts/hooks'
import { OPTION } from '@/option'
import { theme } from '@/styles'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/styles'

export const LoginFormModal: React.FC = () => {
  const currentUser = useCurrentUser()
  const [view, setView] = React.useState<'login' | 'signup'>('login')
  const styles = useStyles()

  useEventListener('onModalClose', () => {
    setTimeout(() => {
      setView('login')
    }, 500)
  })

  return (
    <div className={`AppLoginFormModal-root ${styles.root}`}>
      {currentUser === null ? (
        <Modal
          render={props => (
            <Button color="inherit" {...props} id="btn-login">
              ログイン
            </Button>
          )}
        >
          <div className={styles.modalInner}>
            {view === 'login' ? (
              <LoginView setView={setView} />
            ) : (
              <SignUpView setView={setView} />
            )}
          </div>
        </Modal>
      ) : (
        <>
          <IconButton
            component={Link}
            to={OPTION.PATH.USER_PROFILE}
            className="AppLoginFormModal-profileLink"
          >
            <UserIcon data={currentUser} />
          </IconButton>
        </>
      )}
    </div>
  )
}

const useStyles = makeStyles({
  root: {
    '& .AppLoginFormModal-profileLink': {
      padding: 0
    }
  },
  modalInner: {
    padding: `${theme.spacing(5)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`
  }
})
