import React from 'react'
import {
  Button,
  TextField,
  makeStyles,
  Radio,
  RadioGroup,
  Select,
  MenuItem
} from '@material-ui/core'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { createBoard } from '~redux/state/board/actions'
import { useSnackbarContext } from '@/scripts/hooks'
import { useDispatch, useStore } from 'react-redux'
import { OPTION } from '@/option'
import { useHistory } from 'react-router-dom'
import DoneOutlineRoundedIcon from '@material-ui/icons/DoneOutlineRounded'
import { theme } from '@/styles'

export const CreateBoardForm: React.FC = () => {
  const dispatch = useDispatch()
  const { showSnackbar } = useSnackbarContext()
  const styles = useStyles()
  const {
    register,
    handleSubmit,
    errors,
    formState: { isDirty, isSubmitting, isValid },
    reset,
    control
  } = useForm({ mode: 'onChange' })
  const history = useHistory()
  const { currentUser, board } = useStore().getState()
  const defaultBg = OPTION.BOARD.BG.PHOTO[0].src
  const [bg, setBg] = React.useState(defaultBg)

  const onSubmit: SubmitHandler<FormValue> = async (
    { title, backgroundImage, visibility },
    e: any
  ) => {
    if (!currentUser || board.error) return
    e.target.previousSibling.children[0].click()

    try {
      const { id } = await dispatch(
        createBoard({ title, backgroundImage, visibility })
      )
      reset()
      history.push(`/boards/${id}`)
    } catch (e) {
      console.log('debug: CreateBoardForm onSubmit', e)
      showSnackbar({
        message: OPTION.MESSAGE.SERVER_CONNECTION_ERROR,
        type: 'error'
      })
    }
  }

  const style = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(bg)
    ? { backgroundColor: bg }
    : { backgroundImage: `url(${bg})` }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={styles.root}
      autoComplete="off"
      id="form-create-board"
      style={style}
    >
      <div className="AppCreateBoardForm-input">
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
          fullWidth
        />
      </div>
      <div className="AppCreateBoardForm-input">
        <RadioGroup
          name="backgroundImage"
          className={styles['radio-group']}
          defaultValue={defaultBg}
        >
          {OPTION.BOARD.BG.PHOTO.map(({ src }, i) => {
            return (
              <Radio
                checkedIcon={<DoneOutlineRoundedIcon />}
                onChange={() => setBg(src)}
                value={src}
                style={{
                  backgroundImage: `url(${OPTION.BOARD.BG.PHOTO[i].src})`
                }}
                key={i}
                inputRef={register}
              />
            )
          })}
          {OPTION.BOARD.BG.COLORS.map((color, i) => {
            return (
              <Radio
                checkedIcon={<DoneOutlineRoundedIcon />}
                onChange={() => setBg(color)}
                value={color}
                style={{
                  backgroundColor: color
                }}
                key={i}
                inputRef={register}
              />
            )
          })}
        </RadioGroup>
      </div>
      <div className="AppCreateBoardForm-input">
        <Controller
          as={
            <Select fullWidth label="公開範囲" variant="filled">
              <MenuItem value="members">メンバーのみ</MenuItem>
              <MenuItem value="public">公開</MenuItem>
            </Select>
          }
          control={control}
          name="visibility"
          defaultValue="members"
        />
      </div>
      <Button
        type="submit"
        variant="contained"
        disabled={!isDirty || isSubmitting || !isValid}
        className={styles.create}
      >
        ボードを作成
      </Button>
    </form>
  )
}

const useStyles = makeStyles({
  root: {
    width: 284,
    padding: `${theme.spacing(5)}px ${theme.spacing(2)}px ${theme.spacing(
      2
    )}px`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    borderRadius: theme.borderRadius(1),
    '& .AppCreateBoardForm-input': {
      marginBottom: theme.spacing(2)
    },
    '& .MuiSelect-root': {
      padding: `${theme.spacing(2)}px ${theme.spacing(1)}px`
    },
    '&::before': {
      background: 'rgba(0,0,0,.1)',
      position: 'absolute',
      bottom: 0,
      top: 0,
      left: 0,
      right: 0,
      display: 'block',
      content: '""',
      borderRadius: theme.borderRadius(1),
      zIndex: 0
    },
    '& .MuiFilledInput-root': {
      backgroundColor: 'rgba(255,255,255,.8)',
      '&.Mui-focused': {
        backgroundColor: 'rgba(255,255,255,.8)'
      }
    }
  },
  'radio-group': {
    flexDirection: 'row',
    marginBottom: theme.spacing(1),
    '& .MuiButtonBase-root': {
      width: 42
    },
    '& .MuiRadio-root': {
      backgroundSize: 'cover',
      borderRadius: 0,
      '& [class^="PrivateRadioButtonIcon"]': {
        opacity: 0
      },
      '& svg': {
        color: '#fff'
      }
    }
  },
  create: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.white,
    fontWeight: 'bold',
    display: 'table',
    margin: '0 0 0 auto',
    '&:hover': {
      backgroundColor: theme.palette.success.light
    },
    '&.Mui-disabled': {
      backgroundColor: theme.palette.grey[200]
    }
  }
})

type FormValue = {
  title: string
  backgroundImage: string
  visibility: string
}
