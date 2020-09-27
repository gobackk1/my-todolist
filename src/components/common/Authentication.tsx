import React from 'react'
import { useAuth } from '@/scripts/hooks'
import { useSelector } from 'react-redux'
import { BeforeVerified } from '@/components'
import * as I from '@/scripts/model/interface'

export const Authentication: React.FC = ({ children }) => {
  const userState = useSelector((state: I.ReduxState) => state.user)
  useAuth()

  if (userState.user) {
    return userState.user.emailVerified ? <>{children}</> : <BeforeVerified />
  } else {
    return <>{children}</>
  }
}
