import { useContext } from 'react'
import { SnackbarContext } from '@/scripts/context'

export const useSnackbarContext = () => {
  const { showSnackbar, closeSnackbar } = useContext(SnackbarContext)
  return { showSnackbar, closeSnackbar }
}
