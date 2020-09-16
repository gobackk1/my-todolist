import { Theme } from '@material-ui/core'

type AppTheme = {
  zIndex: {
    [i: string]: number
  }
}
export type GlobalTheme = Theme & AppTheme
