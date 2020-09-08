import * as I from '@/scripts/interfaces'

export interface AuthContext {
  isLoggingIn: boolean
  user: I.User | null
}
