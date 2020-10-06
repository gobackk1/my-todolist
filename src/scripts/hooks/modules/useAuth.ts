import { useEffect } from 'react'
import firebase from 'firebase'
import { useMountedRef } from '@/scripts/hooks'
import {
  setLoginUser,
  setLoggingIn,
  getUser
} from '@/scripts/redux/state/currentUser/actions'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import { resetUsers } from '~redux/state/users/actions'
import { resetBoard } from '~redux/state/board/actions'
import { OPTION } from '@/option'
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
        if (user.emailVerified) {
          history.push(OPTION.PATH.BEFORE_VERIFIED)
        }
        // if (!isMounted.current) return
        dispatch(getUser(user.uid))
      } else {
        // if (!isMounted.current) return
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
