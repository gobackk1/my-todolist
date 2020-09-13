import React from 'react'
import { useAuth } from '@/scripts/hooks'

export const Authentication: React.FC = ({ children }) => {
  useAuth()
  return <>{children}</>
}
