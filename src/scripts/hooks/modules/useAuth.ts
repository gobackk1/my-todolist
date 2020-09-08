import { useState, useEffect } from 'react'
import firebase from '@/scripts/firebase'
import * as I from '@/scripts/interfaces'
import { useMountedRef } from '@/scripts/hooks'

/**
 * ログイン状態の保持・監視
 */
export const useAuth = () => {
  const isMounted = useMountedRef()
  const [auth, setAuth] = useState<I.AuthContext>({
    isLoggingIn: true,
    user: {
      uid: '',
      displayName: ''
    }
  })

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log('debug: Login User', user)
        if (!isMounted.current) return
        setAuth({
          isLoggingIn: false,
          user: {
            uid: user.uid!,
            displayName: user.displayName!
          }
        })
      } else {
        console.log('debug: Logout User', user)
        if (!isMounted.current) return
        setAuth({ isLoggingIn: false, user: null })
      }
    })
  }, [setAuth, isMounted])

  return auth
}
