import { Palette, PaletteOptions } from '@material-ui/core/styles/createPalette'
import { ZIndex } from '@material-ui/core/styles/zIndex'
import { Theme, ThemeOptions } from '@material-ui/core/styles/createMuiTheme'

declare module '@material-ui/core/styles/createPalette' {
  export interface Palette {
    favorite: {
      on: string
      off: string
    }
    white: string
    blueGrey: {
      [i: string | number]: string
    }
  }

  export interface PaletteOptions {
    favorite: {
      on: string
      off: string
    }
    white: string
    blueGrey: {
      [i: string | number]: string
    }
  }
}

declare module '@material-ui/core/styles/zIndex' {
  export interface ZIndex {
    boardDrawer: number
    snackbar: number
    appHeader: number
    menu: number
  }
}

declare module '@material-ui/core/styles/createMuiTheme' {
  export interface Theme {
    borderRadius: (n: number) => number
  }

  export interface ThemeOptions {
    borderRadius: (n: number) => number
  }
}
