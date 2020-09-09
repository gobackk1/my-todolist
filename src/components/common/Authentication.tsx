import React from 'react'
import { AuthContext } from '@/scripts/context'
import { useAuth } from '@/scripts/hooks'

export const Authentication: React.FC = ({ children }) => {
  const { auth, setAuth } = useAuth()

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  )
}
