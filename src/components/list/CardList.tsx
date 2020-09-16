import React from 'react'
import { List } from '~redux/state/list/reducer'
import { css } from '@emotion/core'
import { Theme } from '@material-ui/core'

export const CardList: React.FC<Props> = ({ list }) => {
  return (
    <div css={styles['card-list']}>
      <div>{list.title}</div>
      <div>card を並べる</div>
    </div>
  )
}

const styles = {
  'card-list': (theme: Theme) => css`
    background: #ccc;
    padding: ${theme.spacing(1)}px;
    margin: 0 ${theme.spacing(1)}px;

    &:first-child {
      margin-left: 0;
    }
  `
}

type Props = {
  list: List
}
