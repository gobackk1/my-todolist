import React from 'react'
import { List } from '~redux/state/list/reducer'
import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { Add } from '@material-ui/icons'
import { VariableInput } from '@/components'
// import * as T from '@/scripts/model/type'
// import * as I from '@/scripts/model/interface'
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
  const [cardTitle, setCardTitle] = React.useState('')
  const inputRef = React.useRef<HTMLDivElement | null>(null)
  const dispatch = useDispatch()
  const { showSnackbar } = useSnackbarContext()
  const styles = useStyles()
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
      await dispatch(
        createCard({
          listId,
          title: cardTitle
        })
      )
    } catch ({ message }) {
      showSnackbar({
        message: OPTION.MESSAGE.SERVER_CONNECTION_ERROR,
        type: 'error'
      })
    }
  }

  // NOTE: 新しいカードを追加するボタンをクリックしたら、インプットにフォーカスさせる
  React.useEffect(() => {
    if (!isCreating) return
    inputRef.current?.querySelector('button')?.click()
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
            <VariableInput
              label={cardTitle}
              onUpdate={(e, close) => {
                setCardTitle(e.currentTarget.value)
                close()
              }}
              component="textarea"
              width={234}
            />
          </div>
          <div className={styles.buttons}>
            <SuccessButton
              onClick={() => {
                onClickAdd(data.id)
              }}
              variant="contained"
              size="small"
            >
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
    marginBottom: theme.spacing(1),
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
  }
})
