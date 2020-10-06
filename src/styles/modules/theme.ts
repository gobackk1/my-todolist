import { createMuiTheme } from '@material-ui/core/styles'
import { yellow, grey } from '@material-ui/core/colors'

/**
 * Material-UI のグローバルに適用するスタイル
 */
export const theme = createMuiTheme({
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
    },
    body1: {
      fontSize: 14
    },
    body2: {
      fontSize: 14
    }
  },
  palette: {
    favorite: {
      on: yellow[500],
      off: grey[300]
    }
  },
  zIndex: {
    snackbar: 40,
    appHeader: 10,
    boardDrawer: 10,
    menu: 5,
    modal: 30
  },
  borderRadius: (value: number) => value * 8
})
