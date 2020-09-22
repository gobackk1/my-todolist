import React from 'react'
import { List } from '~redux/state/list/reducer'
import { css } from '@emotion/core'
import { IconButton, Button, Typography, Paper } from '@material-ui/core'
import { withStyles, makeStyles } from '@material-ui/styles'
import { MoreHoriz } from '@material-ui/icons'
import { Menu, ChangeableTitle } from '@/components'
import * as T from '@/scripts/model/type'
import * as I from '@/scripts/model/interface'
import { useDispatch, useStore } from 'react-redux'
import { archiveList } from '~redux/state/list/actions'
import { useSnackbarContext } from '@/scripts/hooks'
import { OPTION } from '@/option'
import { updateList } from '~redux/state/list/actions'
import { useParams } from 'react-router-dom'

export const CardList: React.FC<Props> = ({ list }) => {
  const muiStyles = useStyles()
  const dispatch = useDispatch()
  const { boardId } = useParams<I.UrlParams>()
  const { showSnackbar } = useSnackbarContext()
  const { user, list: listState } = useStore().getState()

  const onClickArchive = async () => {
    if (!user || listState.error) return

    try {
      await dispatch(archiveList(list))
      dispatchEvent(new CustomEvent('onMenuArchived'))
    } catch ({ message }) {
      showSnackbar({ message, type: 'error' })
    }
  }

  const updateTitle = React.useCallback(
    async (
      e: React.FocusEvent<any> | React.KeyboardEvent<any>,
      setEditing: React.Dispatch<any>
    ) => {
      if (!user || listState.error) return

      const title = e.currentTarget.value
      setEditing(false)

      if (title === list.title) return

      if (title.length > 50) {
        // TODO: リストタイトルのバリデーション
        // showSnackbar({
        //   message: OPTION.MESSAGE.BOARD.TITLE.MAX_LENGTH_ERROR,
        //   type: 'error'
        // })
        // return
      } else if (!title.length) {
        showSnackbar({
          message: OPTION.MESSAGE.BOARD.TITLE.REQUIRED_ERROR,
          type: 'error'
        })
        return
      }

      try {
        await dispatch(updateList({ title, id: list.id, boardId }))
      } catch (e) {
        showSnackbar({
          message: OPTION.MESSAGE.SERVER_CONNECTION_ERROR,
          type: 'error'
        })
      }
    },
    [
      boardId,
      dispatch,
      list.id,
      list.title,
      listState.error,
      showSnackbar,
      user
    ]
  )

  return (
    <Paper elevation={1} className={muiStyles['paper']}>
      <div css={styles['card-list']}>
        <div css={styles['card-list-header']}>
          <div css={styles['card-list-title']}>
            <ChangeableTitle
              title={list.title}
              updateTitle={updateTitle}
              component="textarea"
              width={200}
            />
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
              <Button onClick={onClickArchive} fullWidth>
                リストをアーカイブする
              </Button>
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
    width: 200px;
  `,
  'card-list-menu': (theme: T.GlobalTheme) => css`
    background: #ffffff;
    padding: ${theme.spacing(1)}px;
    width: 200px;
    border-radius: ${theme.borderRadius(1)}px;
  `,
  'card-list-footer': css``
}

type Props = {
  list: List
}
const BoardTitleButton = withStyles({
  root: {
    backgroundColor: '#dedede'
  }
})(Button)
const useStyles = makeStyles((theme: T.GlobalTheme) => ({
  root: {
    '& .MuiButton-root': {
      minWidth: 150,
      width: 'auto',
      maxWidth: 'none',
      textAlign: 'left',
      textTransform: 'none',
      borderWidth: 2
    }
  },
  button: {
    '&.MuiButton-root': {
      padding: '4px 8px',
      border: '2px solid transparent',
      fontWeight: 'bold'
    }
  },
  input: {
    '&.MuiButton-outlined': {
      padding: '4px 8px',
      fontWeight: 'bold'
    }
  },
  'card-list-menu-button': {
    padding: 5,
    borderRadius: 0
  },
  paper: {
    // margin: `0 ${theme.spacing(1)}px`,
    // '&:first-child': {
    //   marginLeft: 0
    // }
  }
}))
