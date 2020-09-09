import * as I from '@/scripts/interfaces'

export interface AuthContext {
  isLoggingIn: boolean
  isLoggedIn: boolean
  user: I.User | null
}
