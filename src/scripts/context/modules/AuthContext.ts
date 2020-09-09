import { createContext, Dispatch, SetStateAction } from 'react'
import * as I from '@/scripts/interfaces'

type TAuthContext = [I.AuthContext, Dispatch<SetStateAction<I.AuthContext>>]

export const AuthContext = createContext<TAuthContext>([
  {} as I.AuthContext,
  () => {}
])
