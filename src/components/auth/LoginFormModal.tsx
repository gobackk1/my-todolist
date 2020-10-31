import React from 'react'
import { Modal, LoginView, SignUpView } from '@/components'
import { Button } from '@material-ui/core'
import { useEventListener } from '@/scripts/hooks'
import { theme } from '@/styles'
import { makeStyles } from '@material-ui/styles'

export const LoginFormModal: React.FC = () => {
  const [view, setView] = React.useState<'login' | 'signup'>('login')
  const styles = useStyles()

  useEventListener('onModalClose', () => {
    setTimeout(() => {
      setView('login')
    }, 500)
  })

  return (
    <div className={`AppLoginFormModal-root ${styles.root}`}>
      <Modal
        render={props => (
          <Button
            color="inherit"
            {...props}
            className="AppLoginFormModal-buttonLogin"
          >
            ログインへ
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
