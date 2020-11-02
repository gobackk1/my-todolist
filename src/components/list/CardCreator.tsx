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
          <Button
            onClick={() => {
              onClickAdd(data.id)
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
            // 両エレメントはアンマウントしないので
            /* eslint-disable-next-line */
            inputRef.current!.querySelector('button')!.click()
          }}
          fullWidth
          startIcon={<Add />}
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
    marginBlock: theme.spacing(1),
    '& .MuiButton-outlined': {
      fontWeight: 'normal'
    }
  }
})
