import React from 'react'
import { List } from '~redux/state/list/reducer'
import { css } from '@emotion/core'
import {
  IconButton,
  makeStyles,
  Button,
  Typography,
  Paper
} from '@material-ui/core'
import { MoreHoriz } from '@material-ui/icons'
import { Menu } from '@/components'
import * as T from '@/scripts/model/type'
import * as I from '@/scripts/model/interface'
import { useDispatch } from 'react-redux'
import { deleteList } from '~redux/state/list/actions'
import { useParams } from 'react-router'
import { useSnackbarContext } from '@/scripts/hooks'

export const CardList: React.FC<Props> = ({ list }) => {
  const muiStyles = useStyles()
  const dispatch = useDispatch()
  const { boardId } = useParams<I.UrlParams>()
  const { showSnackbar } = useSnackbarContext()

  const onClickDelete = async () => {
    try {
      dispatch(deleteList({ id: list.id, boardId }))
    } catch ({ message }) {
      showSnackbar({ message, type: 'error' })
    }
  }

  return (
    <Paper elevation={1} className={muiStyles['paper']}>
      <div css={styles['card-list']}>
        <div css={styles['card-list-header']}>
          <div css={styles['card-list-title']}>
            <Typography variant="subtitle1">{list.title}</Typography>
          </div>
          <Menu
            render={props => (
              <IconButton
                className={muiStyles['card-list-menu-button']}
                {...props}
              >
                <MoreHoriz />
              </IconButton>
            )}
          >
            <div css={styles['card-list-menu']}>
              <Button onClick={onClickDelete}>リストを削除する</Button>
            </div>
          </Menu>
        </div>
        <div>card を並べる</div>
        <div css={styles['card-list-footer']}>
          <Button>新しいカードを追加する</Button>
        </div>
      </div>
    </Paper>
  )
}

const styles = {
  'card-list': (theme: T.GlobalTheme) => css`
    width: 250px;
    background: #ccc;
    padding: ${theme.spacing(1)}px;
    border-radius: ${theme.borderRadius(1)}px;
  `,
  'card-list-header': css`
    display: flex;
  `,
  'card-list-title': css`
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 18px;
  `,
  'card-list-menu': (theme: T.GlobalTheme) => css`
    background: #ffffff;
    padding: ${theme.spacing(1)}px;
    width: 200px;
    border-radius: ${theme.borderRadius(1)}px;
  `,
  'card-list-footer': css``
}

const useStyles = makeStyles(theme => ({
  'card-list-menu-button': {
    padding: 5,
    borderRadius: 0
  },
  paper: {
    margin: `0 ${theme.spacing(1)}px`,
    '&:first-child': {
      marginLeft: 0
    }
  }
}))

type Props = {
  list: List
}
