import React from 'react'
import { List } from '~redux/state/list/reducer'
import { Button, TextareaAutosize } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { Add } from '@material-ui/icons'
import { useDispatch } from 'react-redux'
import { useSnackbarContext } from '@/scripts/hooks'
import { OPTION } from '@/option'
import { createCard } from '~redux/state/card/actions'
import { theme } from '@/styles'
import { SuccessButton } from '../button'

type Props = {
  data: List
}

export const CardCreator: React.FC<Props> = ({ data }) => {
  const [isCreating, setCreating] = React.useState(false)
  const inputRef = React.useRef<HTMLDivElement | null>(null)
  const dispatch = useDispatch()
  const { showSnackbar } = useSnackbarContext()
  const styles = useStyles()
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const onClickAdd = React.useCallback(async () => {
    const title = textareaRef.current?.value
    if (!title) {
      showSnackbar({
        message: 'カード名を入力してください',
        type: 'warning'
      })
      textareaRef.current?.focus()
      return
    }
    setCreating(false)
    try {
      await dispatch(
        createCard({
          listId: data.id,
          title
        })
      )
    } catch ({ message }) {
      showSnackbar({
        message: OPTION.MESSAGE.SERVER_CONNECTION_ERROR,
        type: 'error'
      })
    }
  }, [data.id, dispatch, showSnackbar])

  // NOTE: 新しいカードを追加するボタンをクリックしたら、インプットにフォーカスさせる
  React.useEffect(() => {
    if (isCreating) textareaRef.current?.focus()
  }, [isCreating])

  return (
    <div className="AppCardCreator-root">
      {isCreating ? (
        <>
          <div
            className={styles.input}
            style={{ display: isCreating ? 'block' : 'none' }}
            ref={inputRef}
          >
            <TextareaAutosize
              className={`${styles.textarea} MuiButton-contained`}
              ref={textareaRef}
            />
          </div>
          <div className={styles.buttons}>
            <SuccessButton onClick={onClickAdd} variant="contained" size="small">
              追加
            </SuccessButton>
            <Button onClick={() => setCreating(false)} variant="contained" size="small">
              閉じる
            </Button>
          </div>
        </>
      ) : (
        <Button
          onClick={() => setCreating(true)}
          fullWidth
          startIcon={<Add />}
          className={styles.buttonAdd}
        >
          新しいカードを追加する
        </Button>
      )}
    </div>
  )
}

const useStyles = makeStyles({
  root: {},
  input: {
    '& .MuiButton-outlined': {
      fontWeight: 'normal'
    }
  },
  buttonAdd: {
    justifyContent: 'flex-start'
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    '& button': {
      marginLeft: theme.spacing(1)
    }
  },
  textarea: {
    width: '100%',
    resize: 'none',
    height: 'auto',
    border: 'none',
    borderRadius: theme.borderRadius(0.5),
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    '&:focus': {
      outlineColor: theme.palette.primary.main
    }
  }
})
