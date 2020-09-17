import { useContext } from 'react'
import * as Snackbar from '@/scripts/context'

/**
 * ポップアップ表示に使うメソッドを提供するカスタムフック
 * SnackbarContext を利用するシンタックスシュガー
 */
export const useSnackbarContext = (): Snackbar.ContextType => {
  const { showSnackbar, closeSnackbar } = useContext(Snackbar.Context)
  return { showSnackbar, closeSnackbar }
}
