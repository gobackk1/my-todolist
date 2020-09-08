import { createContext } from 'react'
import * as I from '@/scripts/interfaces'

export const AuthenticationContext = createContext<I.AuthContext>(
  {} as I.AuthContext
)
