import { useContext } from 'react'
import { SnackbarContext } from '@/scripts/context'

/**
 * ポップアップ表示に使うメソッドを提供するカスタムフック
 * SnackbarContext を利用するシンタックスシュガー
 */
export const useSnackbarContext = () => {
  const { showSnackbar, closeSnackbar } = useContext(SnackbarContext)
  return { showSnackbar, closeSnackbar }
}
