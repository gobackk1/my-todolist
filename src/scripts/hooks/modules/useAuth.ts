import { useEffect } from 'react'
import firebase from 'firebase'
import { useMountedRef } from '@/scripts/hooks'
import { setLoginUser, setLoggingIn } from '@/scripts/redux/state/user/actions'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import { resetUsers } from '~redux/state/users/actions'
import { resetBoard } from '~redux/state/board/actions'
// import { resetList } from '~redux/state/list/actions'
// import { resetCard } from '~redux/state/card/actions'

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
        dispatch(resetUsers())
        dispatch(resetBoard())
        //todo: list card の reset
        // dispatch(resetList())
        // dispatch(resetCard())
        history.push('/')
      }
    })
  }, [isMounted, dispatch, history])
}
