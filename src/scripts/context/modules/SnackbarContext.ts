import { createContext, SyntheticEvent } from 'react'
import { SnackbarCloseReason } from '@material-ui/core'
import * as I from '@/scripts/model/interface'

export type ContextType = {
  showSnackbar: ({ message, type }: I.SnackPack) => void
  closeSnackbar: (
    event: SyntheticEvent<any, Event>,
    reason: SnackbarCloseReason
  ) => void
}

export const Context = createContext<ContextType>({
  showSnackbar: () => undefined,
  closeSnackbar: () => undefined
})
