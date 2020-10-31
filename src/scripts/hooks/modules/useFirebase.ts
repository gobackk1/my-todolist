import React from 'react'
import { useSnackbarContext } from '@/scripts/hooks'
import firebase from 'firebase'
import { OPTION } from '@/option'
import { SubmitHandler } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setLoggingIn } from '@/scripts/redux/state/currentUser/actions'
import { useMountedRef } from './useMountedRef'

type FormValue = {
  email: string
  password: string
  reset?: any
}

// NOTE: 連打防止のため
const disableResendEmailVerificationMilliseconds = 2000

export const useFirebase = () => {
  const { showSnackbar } = useSnackbarContext()
  const dispatch = useDispatch()
  const history = useHistory()
  const [isResendEmailDisabled, setIsResendEmailDisabled] = React.useState(
    false
  )
  const mounted = useMountedRef()

  const signUp: SubmitHandler<FormValue> = React.useCallback(
    async ({ email, password }) => {
      try {
        /**
         * ユーザーを登録する
         */
        const { user } = await firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)

        /**
         * 登録後、確認メールを送信する
         */
        if (user) {
          await user.sendEmailVerification({
            url: OPTION.URL_AFTER_EMAIL_CONFIRMATION
          })
          showSnackbar({
            message: OPTION.MESSAGE.AUTH.SEND_EMAIL_VERIFICATION,
            type: 'info'
          })
          dispatchEvent(new CustomEvent('onDispatchCloseModal'))
        }
      } catch (e) {
        console.log(e)
        if (e.code === 'auth/email-already-in-use') {
          showSnackbar({
            message: OPTION.MESSAGE.AUTH.EMAIL_ALREADY_IN_USE,
            type: 'info'
          })
        } else {
          showSnackbar({
            message: OPTION.MESSAGE.SERVER_CONNECTION_ERROR,
            type: 'error'
          })
        }
      }
    },
    []
  )

  const login: SubmitHandler<FormValue> = React.useCallback(
    async ({ email, password, reset }) => {
      dispatch(setLoggingIn(true))
      try {
        await firebase.auth().signInWithEmailAndPassword(email, password)
        showSnackbar({
          message: OPTION.MESSAGE.LOGIN.SUCCESS,
          type: 'success'
        })
        dispatch(setLoggingIn(false))
        dispatchEvent(new CustomEvent('onDispatchCloseModal'))
        if (reset) {
          reset()
        }
        history.push(OPTION.PATH.BOARD)
      } catch (e) {
        console.log(e)
        switch (e.code) {
          case 'auth/user-not-found':
            showSnackbar({
              message: OPTION.MESSAGE.AUTH.USER_NOT_FOUND,
              type: 'error'
            })
            break

          case 'auth/user-disabled':
            showSnackbar({
              message: OPTION.MESSAGE.AUTH.USER_DISABLED,
              type: 'error'
            })
            break

          case 'auth/wrong-password':
            showSnackbar({
              message: OPTION.MESSAGE.AUTH.WRONG_PASSWORD,
              type: 'error'
            })
            break

          default:
            showSnackbar({
              message: OPTION.MESSAGE.SERVER_CONNECTION_ERROR,
              type: 'error'
            })
            break
        }
        dispatch(setLoggingIn(false))
      }
    },
    []
  )

  const loginWithGoogleProvider = React.useCallback(async () => {
    dispatch(setLoggingIn(true))
    try {
      await firebase
        .auth()
        .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      showSnackbar({
        message: OPTION.MESSAGE.LOGIN.SUCCESS,
        type: 'success'
      })
      dispatch(setLoggingIn(false))
      history.push(OPTION.PATH.BOARD)
    } catch (e) {
      showSnackbar({
        message: OPTION.MESSAGE.LOGIN.ERROR,
        type: 'error'
      })
      dispatch(setLoggingIn(false))
    }
  }, [history, showSnackbar, dispatch])

  const resendEmailVerification = React.useCallback(
    action => {
      const user = firebase.auth().currentUser
      if (user) {
        setIsResendEmailDisabled(true)
        setTimeout(() => {
          user.sendEmailVerification({
            url: OPTION.URL_AFTER_EMAIL_CONFIRMATION
          })
          showSnackbar({
            message: OPTION.MESSAGE.AUTH.SEND_EMAIL_VERIFICATION,
            type: 'info',
            action
          })
          if (mounted) {
            setIsResendEmailDisabled(false)
          }
        }, disableResendEmailVerificationMilliseconds)
      }
    },
    [setIsResendEmailDisabled, mounted]
  )

  return {
    signUp,
    login,
    loginWithGoogleProvider,
    resendEmailVerification,
    isResendEmailDisabled
  }
}
