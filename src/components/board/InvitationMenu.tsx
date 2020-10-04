import React from 'react'
import { Board } from '@/scripts/redux/state/board/reducer'
import { useDispatch } from 'react-redux'
import { updateBoard } from '~redux/state/board/actions'
import { Menu, LoadingSpinner, EMailField } from '@/components'
import { Button, Typography, TextField } from '@material-ui/core'
import { callCloudFunctions } from '@/scripts/firebase'
import { useCustomEvent } from '@/scripts/hooks'
import { makeStyles } from '@material-ui/styles'
import { theme } from '@/styles'
import { useForm, SubmitHandler } from 'react-hook-form'

const initialUser = {
  displayName: '',
  photoURL: '',
  uid: ''
}

export const InvitationMenu: React.FC<{ board: Board }> = ({ board }) => {
  const dispatch = useDispatch()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [result, setResult] = React.useState({
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

  const addMember = React.useCallback(() => {
    try {
      dispatch(
        updateBoard({
          ...board,
          members: { ...board.members, [result.user.uid]: { role: 'reader' } }
        })
      )
      dispatchCustomEvent('close_menu')
    } catch ({ message }) {
      console.log('debug: InvitationMenu addMember', message)
    }
  }, [dispatch, board, result, dispatchCustomEvent])

  const searchUser = React.useCallback(
    async email => {
      // input value を元に、サーバーに問い合わせる
      setResult(state => ({ ...state, isLoading: true }))
      const { result } = await callCloudFunctions('getUserByEmail', {
        email
      })
      console.log(result, email)

      if (result.error) {
        setResult(state => ({
          ...state,
          isLoading: false,
          message: 'ユーザーが見つかりませんでした',
          user: initialUser
        }))
      } else {
        setResult(state => ({
          ...state,
          isLoading: false,
          message: '',
          user: result.data
        }))
      }
    },
    [inputRef.current, setResult]
  )

  const timer = React.useRef(0)
  const onChange = e => {
    e.persist()
    clearTimeout(timer.current)
    if (e.target.value === '' || !isValid) return
    timer.current = window.setTimeout(() => {
      searchUser(e.target.value)
    }, 1000)
  }

  return (
    <Menu
      render={props => <Button {...props}>招待</Button>}
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
        {result.isLoading && <LoadingSpinner />}
        {!result.isLoading && (
          <div>
            <div>{result.message}</div>
            <div>{result.user.displayName}</div>
            <div>{result.user.photoURL}</div>
            <div>{result.user.uid}</div>
            {result.user.uid && (
              <button onClick={addMember}>ユーザーを追加</button>
            )}
          </div>
        )}
      </section>
    </Menu>
  )
}

const useStyles = makeStyles({
  root: {
    '& .AppInvitationMenu-inner': {
      padding: theme.spacing(2)
    }
  }
})
