import { withStyles, Button } from '@material-ui/core'
import { theme } from '@/styles'

export const SuccessButton = withStyles({
  root: {
    backgroundColor: theme.palette.success.main,
    marginRight: theme.spacing(1),
    fontWeight: 'bold',
    display: 'table',
    color: theme.palette.white,

    '&:hover': {
      backgroundColor: theme.palette.success.light
    },
    '&.Mui-disabled': {
      backgroundColor: theme.palette.grey[200]
    }
  }
})(Button)
