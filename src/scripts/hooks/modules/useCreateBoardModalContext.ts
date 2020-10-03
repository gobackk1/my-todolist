import { useContext } from 'react'
import * as CreateBoardModal from '@/scripts/context/CreateBoardModalContext'

/**
 * 「新しいボードを作成」モーダルを表示するメソッドを提供するカスタムフック
 * CreateBoardModalContext を利用するシンタックスシュガー
 */
export const useCreateBoardModalContext = (): CreateBoardModal.ContextType =>
  useContext(CreateBoardModal.Context)
