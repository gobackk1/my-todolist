import { createMuiTheme } from '@material-ui/core/styles'

/**
 * Material-UI のグローバルに適用するスタイル
 */
const muiTheme = createMuiTheme({
  typography: {
    button: {
      textTransform: 'none'
    },
    h2: {
      fontSize: 24
    },
    h3: {
      fontSize: 20
    },
    h4: {
      fontSize: 17
    },
    h5: {
      fontSize: 14
    },
    h6: {
      fontSize: 11
    }
  }
})

/**
 * Material-UI の Theme とマージする
 */
export type AppTheme = {
  zIndex: {
    [i: string]: number
  }
  borderRadius: (value: number) => number
}

const appTheme: AppTheme = {
  zIndex: {
    snackbar: 20,
    appHeader: 10,
    boardDrawer: 10,
    menu: 5,
    modal: 30
  },
  borderRadius: (value: number) => value * 5
}

export const theme = { ...muiTheme, ...appTheme }
