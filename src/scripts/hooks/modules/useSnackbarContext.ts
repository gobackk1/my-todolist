import { useContext } from 'react'
import * as Snackbar from '@/scripts/context/SnackbarContext'

/**
 * ポップアップ表示に使うメソッドを提供するカスタムフック
 * SnackbarContext を利用するシンタックスシュガー
 */
export const useSnackbarContext = (): Snackbar.ContextType =>
  useContext(Snackbar.Context)
