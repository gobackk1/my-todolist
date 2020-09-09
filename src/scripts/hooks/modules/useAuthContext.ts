import { useContext } from 'react'
import { AuthContext } from '@/scripts/context'

export const useAuthContext = () => {
  const [auth, setAuth] = useContext(AuthContext)
  return { auth, setAuth }
}
