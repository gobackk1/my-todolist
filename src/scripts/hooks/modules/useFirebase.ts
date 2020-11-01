import React from 'react'
import { useSnackbarContext, useTypeSafeDispatch } from '@/scripts/hooks'
import firebase from 'firebase'
import { OPTION } from '@/option'
import { SubmitHandler } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import { setLoggingIn } from '@/scripts/redux/state/currentUser/actions'
import { useMountedRef } from './useMountedRef'
import { getUser, updateUser } from '~redux/state/users/actions'

type SignUpFormValue = {
  displayName: string
} & LoginFormValue

type LoginFormValue = {
  email: string
  password: string
  reset?: any
}

type UseFirebaseReturnType = {
  signUp: SubmitHandler<SignUpFormValue>
  login: SubmitHandler<LoginFormValue>
  loginWithGoogleProvider: () => Promise<void>
  resendEmailVerification: (action?: JSX.Element | null) => void
  isResendEmailDisabled: boolean
}

// NOTE: 連打防止のため
const disableResendEmailVerificationMilliseconds = 2000

export const useFirebase = (): UseFirebaseReturnType => {
  const { showSnackbar } = useSnackbarContext()
  const dispatch = useTypeSafeDispatch()
  const history = useHistory()
  const [isResendEmailDisabled, setIsResendEmailDisabled] = React.useState(
    false
  )
  const mounted = useMountedRef()

  const signUp: SubmitHandler<SignUpFormValue> = React.useCallback(
    async ({ email, password, displayName }) => {
      try {
        const { user } = await firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)

        if (!user) return

        await user.sendEmailVerification({
          url: OPTION.URL_AFTER_EMAIL_CONFIRMATION
        })

        /**
         * NOTE: createUserWithEmailAndPassword は emailとpassword しか渡せないので、
         * onCreateUser で作成した user_detail_public の displayName は
         * 別途 update で更新する
         *
         * onCreateUser で作成しないで、クライアントサイドから user_detail_public を作成しても良いかも
         */
        const userDetailPublic = await dispatch(getUser(user.uid))
        await dispatch(updateUser({ ...userDetailPublic, displayName }))

        showSnackbar({
          message: OPTION.MESSAGE.AUTH.SEND_EMAIL_VERIFICATION,
          type: 'info'
        })
        dispatchEvent(new CustomEvent('onDispatchCloseModal'))
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
    [showSnackbar, dispatch]
  )

  const login: SubmitHandler<LoginFormValue> = React.useCallback(
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
    [showSnackbar, history, dispatch]
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
    [setIsResendEmailDisabled, mounted, showSnackbar]
  )

  return {
    signUp,
    login,
    loginWithGoogleProvider,
    resendEmailVerification,
    isResendEmailDisabled
  }
}
