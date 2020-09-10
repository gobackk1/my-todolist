import React, { useContext } from 'react'
import { Redirect } from 'react-router-dom'
import { AuthContext } from '@/scripts/context'

export const Board: React.FC = () => {
  const [{ isLoggedIn }] = useContext(AuthContext)

  return isLoggedIn ? <div>Board</div> : <Redirect to="/" />
}
