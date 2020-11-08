import React from 'react'
import { useSelector } from 'react-redux'
import { User } from '@/scripts/model/interface'

export const useCurrentUser = (): User | null => {
  const { user } = useSelector(state => state.currentUser)
  const { users } = useSelector(state => state.users)

  const currentUser = React.useMemo(() => {
    return user && Object.keys(users).length ? users[user.uid] : null
  }, [user, users])

  return currentUser
}
