import { useEffect } from 'react'
import firebase from 'firebase'
import { useMountedRef, useTypeSafeDispatch } from '@/scripts/hooks'
import {
  setLoginUser,
  setLoggingIn
} from '@/scripts/redux/state/currentUser/actions'
import { getUser, updateUser } from '@/scripts/redux/state/users/actions'
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
  const dispatch = useTypeSafeDispatch()
  const history = useHistory()

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async user => {
      dispatch(setLoggingIn(false))
      if (user) {
        if (!user.emailVerified) {
          history.push(OPTION.PATH.BEFORE_VERIFIED)
        }
        // if (!isMounted.current) return
        // 'user_detail_secure' ができた時は getUserSecure() になる予定
        dispatch(setLoginUser({ uid: user.uid }))
        const userDetailPublic = await dispatch(getUser(user.uid))

        // NOTE: 現時点(20/10/29)で firebase.auth().user().onUpdate はない
        if (user.email && user.email !== userDetailPublic.email) {
          dispatch(updateUser({ ...userDetailPublic, email: user.email }))
        }
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
