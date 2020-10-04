import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as I from '@/scripts/model/interface'
import { Modal, LoginView, SignUpView, UserIcon } from '@/components'
import { Button } from '@material-ui/core'
import firebase from 'firebase'
import { useHistory } from 'react-router-dom'
import { useSnackbarContext, useEventListener } from '@/scripts/hooks'
import { OPTION } from '@/option'
import { setLoggingIn } from '@/scripts/redux/state/user/actions'
import { css } from '@emotion/core'
import { theme } from '@/styles'

export const LoginFormModal: React.FC = () => {
  const userState = useSelector((state: I.ReduxState) => state.user)
  const dispatch = useDispatch()
  const history = useHistory()
  const { showSnackbar } = useSnackbarContext()
  const [view, setView] = React.useState<'login' | 'signup'>('login')

  useEventListener('onModalClose', () => {
    setTimeout(() => {
      setView('login')
    }, 500)
  })

  const onClickLogout = React.useCallback(async () => {
    dispatch(setLoggingIn(true))
    try {
      await firebase.auth().signOut()
      showSnackbar({
        message: OPTION.MESSAGE.LOGOUT.SUCCESS,
        type: 'success'
      })
      dispatch(setLoggingIn(false))
      history.push('/')
    } catch (e) {
      showSnackbar({
        message: OPTION.MESSAGE.LOGOUT.ERROR,
        type: 'error'
      })
      dispatch(setLoggingIn(false))
    }
  }, [history, showSnackbar, dispatch])

  return (
    <>
      {userState.user === null ? (
        <Modal
          render={props => (
            <Button color="inherit" {...props} id="btn-login">
              ログイン
            </Button>
          )}
        >
          <div css={styles['modal-login']}>
            {view === 'login' ? (
              <LoginView setView={setView} />
            ) : (
              <SignUpView setView={setView} />
            )}
          </div>
        </Modal>
      ) : (
        <>
          <Button color="inherit" onClick={onClickLogout} id="btn-logout">
            ログアウト
          </Button>
          <UserIcon data={userState.user} />
        </>
      )}
    </>
  )
}

const styles = {
  'modal-login': css`
    padding: ${theme.spacing(5)}px ${theme.spacing(3)}px ${theme.spacing(3)}px;
  `
}
