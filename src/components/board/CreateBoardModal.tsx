import React from 'react'
import { Modal } from '@/components'
import { Button, TextField, makeStyles, Theme } from '@material-ui/core'
import { useForm, SubmitHandler } from 'react-hook-form'
import { createBoard } from '~redux/state/board/actions'
import { useSnackbarContext } from '@/scripts/hooks'
import { useDispatch } from 'react-redux'
import { OPTION } from '@/option'
import { useHistory } from 'react-router-dom'

export const CreateBoardModal: React.FC = () => {
  const dispatch = useDispatch()
  const { showSnackbar } = useSnackbarContext()

  const styles = useStyles()
  const {
    register,
    handleSubmit,
    errors,
    formState: { isDirty, isSubmitting },
    reset
  } = useForm()
  const history = useHistory()

  const renderButton = React.useCallback(
    props => (
      <Button
        {...props}
        className={styles.buttonCreate}
        onClick={() => {
          props.onClick()
        }}
      >
        新しいボードを作成
      </Button>
    ),
    []
  )

  const onSubmit: SubmitHandler<FormValue> = async ({ title }, e: any) => {
    e.target.previousSibling.children[0].click()

    try {
      const newBoard = await dispatch(createBoard({ title }))
      reset()
      history.push(`/boards/${(newBoard as any).id}`)
    } catch (e) {
      showSnackbar({
        message: OPTION.MESSAGE.SERVER_CONNECTION_ERROR,
        type: 'error'
      })
    }
  }

  return (
    <Modal render={renderButton}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles.root}
        autoComplete="off"
      >
        <TextField
          error={!!errors.title}
          id="test"
          name="title"
          inputRef={register({
            required: OPTION.MESSAGE.BOARD.TITLE.REQUIRED_ERROR,
            maxLength: {
              value: OPTION.BOARD.TITLE.MAX_LENGTH,
              message: OPTION.MESSAGE.BOARD.TITLE.MAX_LENGTH_ERROR
            }
          })}
          type="text"
          label="ボートタイトルを追加"
          helperText={errors.title && errors.title.message}
          variant="filled"
          size="small"
          autoFocus={true}
          required={true}
          defaultValue=""
        />
        <br />
        <Button
          type="submit"
          variant="outlined"
          disabled={!isDirty || isSubmitting}
        >
          ボードを作成
        </Button>
      </form>
    </Modal>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    '& .MuiTextField-root': {
      marginBottom: theme.spacing(1),
      width: 200
    }
  },
  buttonCreate: {
    '& .MuiButton-label': {
      textDecoration: 'underline'
    }
  }
}))

type FormValue = {
  title: string
}
