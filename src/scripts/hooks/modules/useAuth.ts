import { useEffect } from 'react'
import firebase from 'firebase'
import { useMountedRef } from '@/scripts/hooks'
import { setLoginUser, setLoggingIn } from '@/scripts/redux/state/user/actions'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router'

/**
 * ログイン状態の保持・監視
 */
export const useAuth = (): void => {
  const isMounted = useMountedRef()
  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      dispatch(setLoggingIn(false))
      if (user) {
        console.log('debug: Login User', user)
        if (!isMounted.current) return
        dispatch(setLoginUser(user))
      } else {
        console.log('debug: Logout User', user)
        if (!isMounted.current) return
        dispatch(setLoginUser(null))
        history.push('/')
      }
    })
  }, [isMounted, dispatch, history])
}
