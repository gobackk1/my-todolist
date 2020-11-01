import React from 'react'
import { Board } from '@/scripts/redux/state/board/reducer'
import { useSelector } from 'react-redux'
import { updateBoard } from '~redux/state/board/actions'
import {
  Menu,
  LoadingSpinner,
  EMailField,
  UserIcon,
  BoardButton
} from '@/components'
import { Button, Typography, Divider } from '@material-ui/core'
import {
  useCustomEvent,
  useSnackbarContext,
  useBoardAuthority
} from '@/scripts/hooks'
import { makeStyles } from '@material-ui/styles'
import { theme } from '@/styles'
import { useForm } from 'react-hook-form'
import { getUser, getUserByEmail } from '~redux/state/users/actions'
import { User } from '@/scripts/model/interface'
import { useTypeSafeDispatch } from '@/scripts/hooks'
import { Add } from '@material-ui/icons'

const initialUser: User = {
  displayName: '',
  avatarURL: '',
  uid: '',
  profile: '',
  email: ''
}

export const InvitationMenu: React.FC<{ board: Board }> = ({ board }) => {
  const dispatch = useTypeSafeDispatch()
  // const inputRef = React.useRef<HTMLInputElement>(null)
  const timer = React.useRef(0)
  const [state, setState] = React.useState({
    isLoading: false,
    message: '',
    user: initialUser
  })
  const dispatchCustomEvent = useCustomEvent()
  const styles = useStyles()
  const {
    register,
    errors,
    formState: { isValid }
  } = useForm({ mode: 'onChange' })
  const { showSnackbar } = useSnackbarContext()
  const usersState = useSelector(state => state.users)
  const { isOneOfRoles } = useBoardAuthority(board.id)

  const addMember = React.useCallback(() => {
    try {
      dispatch(
        updateBoard({
          ...board,
          members: {
            ...board.members,
            [state.user.uid]: { role: 'reader' }
          }
        })
      )
      if (!(state.user.uid in usersState.users)) {
        dispatch(getUser(state.user.uid))
      }
      dispatchCustomEvent('close_menu')
      showSnackbar({ message: 'ボードにメンバーを追加しました', type: 'info' })
    } catch ({ message }) {
      console.log('debug: InvitationMenu addMember', message)
      showSnackbar({ message, type: 'error' })
    }
  }, [
    dispatch,
    board,
    state,
    dispatchCustomEvent,
    showSnackbar,
    usersState.users
  ])

  const searchUser = React.useCallback(
    async email => {
      setState(state => ({ ...state, isLoading: true }))
      try {
        const target = await dispatch(getUserByEmail(email))
        const message = target.uid in board.members ? 'すでにメンバーです' : ''
        setState(state => ({
          ...state,
          isLoading: false,
          message,
          user: target
        }))
      } catch ({ message }) {
        if (message === 'NO_USER_FOUND') {
          setState(state => ({
            ...state,
            isLoading: false,
            message: 'ユーザーが見つかりませんでした',
            user: initialUser
          }))
        }
      }
    },
    [setState, board.members, dispatch]
  )

  const onChange = e => {
    e.persist()
    clearTimeout(timer.current)
    if (e.target.value === '' || !isValid) return

    timer.current = window.setTimeout(() => {
      searchUser(e.target.value)
    }, 300)
  }

  return (
    <Menu
      render={props => (
        <BoardButton
          variant="contained"
          {...props}
          disabled={isOneOfRoles(['reader', 'editor'])}
          startIcon={<Add />}
        >
          招待
        </BoardButton>
      )}
      className={styles.root}
    >
      <section className="AppInvitationMenu-inner">
        <Typography variant="h5">招待するメンバーを探す</Typography>
        <Divider />
        <EMailField
          errors={errors}
          register={register}
          onChange={e => {
            onChange(e)
          }}
        />
        {state.isLoading && <LoadingSpinner />}
        {!state.isLoading && (
          <div>
            {state.user.uid && (
              <div className={styles.result}>
                <UserIcon data={state.user} />
                <div className={styles.resultName}>
                  {state.user.displayName}
                </div>
                <Button
                  variant="contained"
                  size="small"
                  onClick={addMember}
                  disabled={state.user.uid in board.members}
                  className={styles.resultButton}
                >
                  追加
                </Button>
              </div>
            )}
            <Typography>{state.message}</Typography>
          </div>
        )}
      </section>
    </Menu>
  )
}

const useStyles = makeStyles({
  root: {
    '& .AppInvitationMenu-inner': {
      padding: theme.spacing(1),
      width: 250,
      '& .MuiDivider-root': {
        marginBottom: theme.spacing(2)
      }
    },
    '& .MuiTypography-root': {
      marginBottom: theme.spacing(1),
      textAlign: 'center'
    },
    '& .AppEMailField-root': {
      marginBottom: theme.spacing(1)
    },
    '& .MuiAppEMailField-root': {
      '& .MuiFormLabel-root': {
        transform: 'translate(12px, 14px) scale(1);'
      },
      '& .MuiInputBase-root': {
        paddingTop: 19,
        paddingBottom: 4
      }
    }
  },
  result: {
    display: 'flex',
    justifyContent: 'space-between',
    '& .MuiButtonBase-root': {}
  },
  resultName: {
    transform: 'translateY(2px)',
    flex: 1,
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  },
  resultButton: {
    alignSelf: 'center'
  }
})
