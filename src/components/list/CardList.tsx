import React from 'react'
import { List } from '~redux/state/list/reducer'
import { css } from '@emotion/core'
import { IconButton, Button, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { MoreHoriz, Add } from '@material-ui/icons'
import { Menu, VariableInput } from '@/components'
import * as T from '@/scripts/model/type'
import * as I from '@/scripts/model/interface'
import { useDispatch, useSelector } from 'react-redux'
import { archiveList } from '~redux/state/list/actions'
import { useSnackbarContext } from '@/scripts/hooks'
import { OPTION } from '@/option'
import { updateList } from '~redux/state/list/actions'
import { useParams } from 'react-router-dom'
import { createCard, updateCard, deleteCard } from '~redux/state/card/actions'
import { theme } from '@/styles'

export const CardList: React.FC<Props> = ({ list }) => {
  const muiStyles = useStyles()
  const dispatch = useDispatch()
  const { boardId } = useParams<I.UrlParams>()
  const { showSnackbar } = useSnackbarContext()
  const user = useSelector((state: I.ReduxState) => state.user)
  const listState = useSelector((state: I.ReduxState) => state.list)
  const card = useSelector((state: I.ReduxState) => state.card)
  const [isCreating, setCreating] = React.useState(false)
  const [cardTitle, setCardTitle] = React.useState('')
  const inputRef = React.useRef<HTMLLIElement | null>(null)

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

  // 追加ボタン以外をクリックした時も発火させる
  const onClickAdd = async listId => {
    if (!cardTitle) {
      showSnackbar({
        message: 'カードタイトルを入力してください',
        type: 'error'
      })
      return
    }
    setCardTitle('')
    setCreating(false)
    try {
      await dispatch(createCard({ listId, title: cardTitle }))
    } catch ({ message }) {
      showSnackbar({
        message: OPTION.MESSAGE.SERVER_CONNECTION_ERROR,
        type: 'error'
      })
    }
  }

  const onClickUpdate = async id => {
    const title = prompt('更新')
    if (!title) return

    try {
      await dispatch(updateCard({ title, listId: list.id, id }))
    } catch ({ message }) {
      showSnackbar({
        message: OPTION.MESSAGE.SERVER_CONNECTION_ERROR,
        type: 'error'
      })
    }
  }

  const onClickDelete = async id => {
    if (!confirm('削除して良いですか')) return

    try {
      console.log(id, list.id)
      await dispatch(deleteCard({ listId: list.id, id }))
    } catch ({ message }) {
      showSnackbar({
        message: OPTION.MESSAGE.SERVER_CONNECTION_ERROR,
        type: 'error'
      })
    }
  }

  return (
    <Paper elevation={1} className={muiStyles['paper']}>
      <div css={styles['card-list']}>
        <div css={styles['card-list-header']}>
          <div css={styles['card-list-title']}>
            <VariableInput
              label={list.title}
              onUpdate={updateTitle}
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
        <ul>
          {card.lists[list.id] &&
            card.lists[list.id].cards &&
            card.lists[list.id].cards.map((card, i) => {
              return (
                <li key={i} css={styles['card-list-item']}>
                  <Button
                    fullWidth
                    variant="contained"
                    className={muiStyles['button-card']}
                    onClick={() => {
                      onClickUpdate(card.id)
                    }}
                    onContextMenu={() => {
                      onClickDelete(card.id)
                    }}
                  >
                    {card.title}
                  </Button>
                </li>
              )
            })}
          <li
            css={styles['card-list-input']}
            style={{ display: isCreating ? 'block' : 'none' }}
            ref={inputRef}
          >
            <VariableInput
              label={cardTitle}
              onUpdate={(e, close) => {
                setCardTitle(e.currentTarget.value)
                close()
              }}
              component="textarea"
              width={234}
            />
          </li>
        </ul>
        <div css={styles['card-list-footer']}>
          {isCreating ? (
            <>
              <Button
                onClick={() => {
                  onClickAdd(list.id)
                }}
                variant="contained"
              >
                追加
              </Button>
              <Button onClick={() => setCreating(false)} variant="contained">
                閉じる
              </Button>
            </>
          ) : (
            <Button
              onClick={() => {
                setCreating(true)
                inputRef.current!.querySelector('button')!.click()
              }}
              fullWidth
              startIcon={<Add />}
            >
              新しいカードを追加する
            </Button>
          )}
        </div>
      </div>
    </Paper>
  )
}

const common = {
  'card-list-item': css`
    margin-bottom: ${theme.spacing(1)}px;
  `
}

const styles = {
  'card-list': css`
    width: 250px;
    background: #ccc;
    padding: ${theme.spacing(1)}px;
    border-radius: ${theme.borderRadius(1)}px;
  `,
  'card-list-item': css`
    ${common['card-list-item']};
  `,
  'card-list-header': css`
    display: flex;
    margin-bottom: ${theme.spacing(2)}px;
  `,
  'card-list-title': css`
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 18px;
    width: 200px;
  `,
  'card-list-menu': css`
    background: #ffffff;
    padding: ${theme.spacing(1)}px;
    width: 200px;
    border-radius: ${theme.borderRadius(1)}px;
  `,
  'card-list-footer': css``,
  'card-list-input': css`
    ${common['card-list-item']};
    .MuiButton-outlined {
      font-weight: normal;
    }
  `
}

type Props = {
  list: List
}

const useStyles = makeStyles({
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
  'button-card': {
    wordBreak: 'break-all',
    '& .MuiButton-label': {
      justifyContent: 'left',
      textAlign: 'left'
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
})
