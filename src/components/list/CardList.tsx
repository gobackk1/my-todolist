import React from 'react'
import { List } from '~redux/state/list/reducer'
import { css } from '@emotion/core'
import {
  Theme,
  IconButton,
  makeStyles,
  Button,
  Typography
} from '@material-ui/core'
import { MoreHoriz } from '@material-ui/icons'

export const CardList: React.FC<Props> = ({ list }) => {
  const muiStyles = useStyles()
  return (
    <div css={styles['card-list']}>
      <div css={styles['card-list-header']}>
        <div css={styles['card-list-title']}>
          <Typography variant="subtitle1">{list.title}</Typography>
        </div>
        <IconButton className={muiStyles['card-list-menu']}>
          <MoreHoriz />
        </IconButton>
      </div>
      <div>card を並べる</div>
      <div css={styles['card-list-footer']}>
        <Button>新しいカードを追加する</Button>
      </div>
    </div>
  )
}

const styles = {
  'card-list': (theme: Theme) => css`
    width: 250px;
    background: #ccc;
    padding: ${theme.spacing(1)}px;
    margin: 0 ${theme.spacing(1)}px;
    border-radius: 5px;
    &:first-child {
      margin-left: 0;
    }
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
  'card-list-footer': css``
}

const useStyles = makeStyles({
  'card-list-menu': {
    padding: 5,
    borderRadius: 0
  }
})

type Props = {
  list: List
}
