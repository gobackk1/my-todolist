import React from 'react'
import { Menu, Modal } from '@/components'
import {
  Button,
  TextField,
  makeStyles,
  createStyles,
  Theme
} from '@material-ui/core'
import { useSelector, useDispatch } from 'react-redux'
import * as I from '@/scripts/interfaces'
import { Link, useHistory } from 'react-router-dom'
import { OPTION } from '@/option'
import { useForm, SubmitHandler } from 'react-hook-form'
import { createBoard } from '~redux/state/board/actions'
import { useSnackbarContext } from '@/scripts/hooks'
import { Board } from '~redux/state/board/reducer'
import { css } from 'emotion/macro'

export const BoardListMenu: React.FC = () => {
  const boardState = useSelector((state: I.ReduxState) => state.board)
  const {
    register,
    handleSubmit,
    errors,
    formState: { isDirty, isSubmitting },
    reset
  } = useForm()
  const dispatch = useDispatch()
  const styles = useStyles()
  const { showSnackbar } = useSnackbarContext()
  const history = useHistory()

  const onSubmit: SubmitHandler<FormValue> = async ({ title }, e: any) => {
    e.target.previousSibling.children[0].click()

    try {
      const newBoard = await dispatch(createBoard({ title }))
      reset()
      //@ts-ignore
      history.push(`/boards/${newBoard.id}`)
    } catch (e) {
      showSnackbar({
        message: OPTION.MESSAGE.SERVER_CONNECTION_ERROR,
        type: 'error'
      })
    }
  }

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

  return (
    <Menu
      render={props => (
        <Button
          {...props}
          color="inherit"
          variant="contained"
          className={styles.buttonOpen}
        >
          ボード一覧
        </Button>
      )}
    >
      <div className={CSS['menu-content']}>
        {boardState.boards &&
          boardState.boards.map((board, i) => {
            return (
              <div className={CSS['menu-content-item']} key={i}>
                <Button
                  to={`${OPTION.PATH.BOARD}/${board.id}`}
                  component={Link}
                  fullWidth={true}
                  variant="contained"
                  className={styles.buttonBoard}
                >
                  {board.title}
                </Button>
              </div>
            )
          })}
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
                required: 'タイトルは必須です',
                maxLength: {
                  value: 50,
                  message: 'タイトルは50字以内で指定してください'
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
      </div>
    </Menu>
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
  buttonOpen: {
    padding: 0,
    backgroundColor: '#000',
    '&:hover': {
      backgroundColor: '#000'
    },
    '& .MuiButton-label': {
      padding: 5
    }
  },
  buttonBoard: {
    fontWeight: 'bold'
  }
}))

const CSS = {
  'menu-content': css`
    background: #fff;
    padding: 20px;
    width: 250px;
    box-shadow: 2px 2px 13px 0px #6f6f6f;
  `,
  'menu-content-item': css`
    margin-bottom: 15px;
  `
}

type FormValue = {
  title: string
}
