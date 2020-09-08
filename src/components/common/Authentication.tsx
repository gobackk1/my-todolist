import React from 'react'
import { AuthenticationContext } from '@/scripts/context'
import { useAuth } from '@/scripts/hooks'

export const Authentication: React.FC = ({ children }) => {
  const auth = useAuth()

  return (
    <AuthenticationContext.Provider value={auth}>
      {!auth.isLoggingIn && children}
    </AuthenticationContext.Provider>
  )
}
