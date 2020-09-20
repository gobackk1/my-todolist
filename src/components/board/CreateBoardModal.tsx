import React from 'react'
import { Modal } from '@/components'
import { Button, TextField, makeStyles, Theme } from '@material-ui/core'
import { useForm, SubmitHandler } from 'react-hook-form'
import { createBoard } from '~redux/state/board/actions'
import { useSnackbarContext } from '@/scripts/hooks'
import { useDispatch, useStore } from 'react-redux'
import { OPTION } from '@/option'
import { useHistory } from 'react-router-dom'

export const CreateBoardModal: React.FC = () => {
  const dispatch = useDispatch()
  const { showSnackbar } = useSnackbarContext()
  const muiStyles = useStyles()
  const {
    register,
    handleSubmit,
    errors,
    formState: { isDirty, isSubmitting, isValid },
    reset
  } = useForm({ mode: 'onChange' })
  const history = useHistory()
  const { user, board } = useStore().getState()

  const renderButton = React.useCallback(
    props => (
      <Button
        {...props}
        className={muiStyles.buttonCreate}
        onClick={() => {
          props.onClick()
        }}
        id="btn-create-board"
      >
        新しいボードを作成
      </Button>
    ),
    [muiStyles.buttonCreate]
  )

  const onSubmit: SubmitHandler<FormValue> = async ({ title }, e: any) => {
    if (!user || board.error) return

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
    <Modal render={renderButton} className={muiStyles['modal']}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={muiStyles.root}
        autoComplete="off"
        id="form-create-board"
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
          disabled={!isDirty || isSubmitting || !isValid}
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
  },
  modal: {
    zIndex: theme.zIndex.modal
  }
}))

type FormValue = {
  title: string
}
