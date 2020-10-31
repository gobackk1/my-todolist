import { actionCreator } from '~redux/action'

export const setLoginUser = actionCreator<{
  uid: string
  emailVerified: boolean
} | null>('SET_LOGIN_USER')
export const setLoggingIn = actionCreator<boolean>('SET_LOGGING_IN')
