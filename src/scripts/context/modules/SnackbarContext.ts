import { createContext, SyntheticEvent } from 'react'
import { SnackbarCloseReason } from '@material-ui/core'
import * as I from '@/scripts/model/interface'

type TSnackbarContext = {
  showSnackbar: ({ message, type }: I.SnackPack) => void
  closeSnackbar: (
    event: SyntheticEvent<any, Event>,
    reason: SnackbarCloseReason
  ) => void
}

export const SnackbarContext = createContext<TSnackbarContext>({
  showSnackbar: () => {},
  closeSnackbar: () => {}
})
