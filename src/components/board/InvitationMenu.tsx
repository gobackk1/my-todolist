import React from 'react'
import { Board } from '@/scripts/redux/state/board/reducer'
import { useDispatch, useSelector } from 'react-redux'
import { updateBoard } from '~redux/state/board/actions'
import { Menu, LoadingSpinner, EMailField, UserIcon } from '@/components'
import { Button, Typography } from '@material-ui/core'
import { callCloudFunctions } from '@/scripts/firebase'
import {
  useCustomEvent,
  useSnackbarContext,
  useBoardAuthority
} from '@/scripts/hooks'
import { makeStyles } from '@material-ui/styles'
import { theme } from '@/styles'
import { useForm } from 'react-hook-form'
import { getUser } from '~redux/state/users/actions'

const initialUser = {
  displayName: '',
  photoURL: '',
  uid: ''
}

export const InvitationMenu: React.FC<{ board: Board }> = ({ board }) => {
  const dispatch = useDispatch()
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
  const { users } = useSelector(state => state.users)
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
      if (!(state.user.uid in users)) {
        dispatch(getUser(state.user.uid))
      }
      dispatchCustomEvent('close_menu')
      showSnackbar({ message: 'ボードにメンバーを追加しました', type: 'info' })
    } catch ({ message }) {
      console.log('debug: InvitationMenu addMember', message)
      showSnackbar({ message, type: 'error' })
    }
  }, [dispatch, board, state, dispatchCustomEvent, showSnackbar, users])

  const searchUser = React.useCallback(
    async email => {
      // input value を元に、サーバーに問い合わせる
      setState(state => ({ ...state, isLoading: true }))
      const { result } = await callCloudFunctions('getUserByEmail', {
        email
      })

      if (result.error) {
        setState(state => ({
          ...state,
          isLoading: false,
          message: 'ユーザーが見つかりませんでした',
          user: initialUser
        }))
      } else {
        const message =
          result.data.uid in board.members ? 'すでにメンバーです' : ''

        setState(state => ({
          ...state,
          isLoading: false,
          message,
          user: result.data
        }))
      }
    },
    [setState, board.members]
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
        <Button
          variant="contained"
          {...props}
          disabled={isOneOfRoles(['reader', 'editor'])}
        >
          招待
        </Button>
      )}
      className={styles.root}
    >
      <section className="AppInvitationMenu-inner">
        <Typography variant="h4">招待するメンバーを探す</Typography>
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
                <div>{state.user.displayName}</div>
                <Button
                  variant="contained"
                  size="small"
                  onClick={addMember}
                  disabled={state.user.uid in board.members}
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
      padding: theme.spacing(2),
      width: 300
    },
    '& .MuiTypography-root': {
      marginBottom: theme.spacing(2),
      textAlign: 'center'
    },
    '& .AppEMailField-root': {
      marginBottom: theme.spacing(1)
    }
  },
  result: {
    display: 'flex',
    justifyContent: 'space-between',
    '& .MuiButtonBase-root': {},
    '& > div': {
      display: 'flex',
      flex: 1,
      alignItems: 'center',
      paddingLeft: theme.spacing(1)
    }
  }
})
