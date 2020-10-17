import { withStyles, Button } from '@material-ui/core'
import { fade } from '@material-ui/core/styles/colorManipulator'
import { theme } from '@/styles'

export const BoardButton = withStyles({
  root: {
    backgroundColor: fade(theme.palette.white, 0.6),
    marginRight: theme.spacing(1),
    '&:hover': {
      backgroundColor: fade(theme.palette.white, 0.5)
    }
  }
})(Button)
