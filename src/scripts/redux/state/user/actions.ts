import { actionCreator } from '~redux/action'
import firebase from '@/scripts/firebase'

export const setLoginUser = actionCreator<firebase.User | null>(
  'SET_LOGIN_USER'
)

export const setLoggingIn = actionCreator<boolean>('SET_LOGGING_IN')
