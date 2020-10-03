import { createContext } from 'react'

export type ContextType = {
  openCreateBoardModal: () => void
}

export const Context = createContext<ContextType>({
  openCreateBoardModal: () => undefined
})
