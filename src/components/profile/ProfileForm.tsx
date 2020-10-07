import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { TextField, Button } from '@material-ui/core'
import { useCurrentUser, useSnackbarContext } from '@/scripts/hooks'
import { makeStyles } from '@material-ui/styles'
import { theme } from '@/styles'
import { updateUser } from '~redux/state/users/actions'
import { useDispatch } from 'react-redux'

export const ProfileForm: React.FC = () => {
  const currentUser = useCurrentUser()
  const {
    register,
    handleSubmit,
    // errors,
    setValue,
    watch,
    formState: {
      // isDirty,
      isSubmitting,
      isValid
    }
  } = useForm({
    mode: 'onChange',
    defaultValues: { displayName: '', email: '', profile: '' }
  })
  const styles = useStyles()
  const { showSnackbar } = useSnackbarContext()
  const dispatch = useDispatch()

  React.useEffect(() => {
    register({ name: 'displayName' })
    register({ name: 'email' })
    register({ name: 'profile' })
  }, [register])

  React.useEffect(() => {
    if (!currentUser) return
    setValue('displayName', currentUser.displayName)
    setValue('email', currentUser.email)
    setValue('profile', currentUser.profile)
  }, [currentUser, setValue])

  const handleChange = React.useCallback(
    (name, e) => {
      e.persist()
      setValue(name, e.target.value)
    },
    [setValue]
  )

  const onSubmit: SubmitHandler<FormValue> = React.useCallback(
    async params => {
      if (!currentUser) return

      try {
        const user = { ...currentUser, ...params }
        dispatch(updateUser(user))
      } catch ({ message }) {
        console.log(message)
        showSnackbar({ message, type: 'error' })
      }
    },
    [currentUser, showSnackbar, dispatch]
  )

  const { displayName, email, profile } = watch()
  // バリデーションする
  // バリデーションは切り出すかも
  // email pass は input 別にする
  // アバター表示・変更機能
  // Header のアバターも同期する
  // アドレス・パスワード変更実装
  return (
    <div className={`AppProfileForm-root ${styles.root}`}>
      <form className="AppProfileForm-form" onSubmit={handleSubmit(onSubmit)}>
        <TextField
          size="small"
          label="ユーザー名"
          type="text"
          value={displayName}
          onChange={e => handleChange('displayName', e)}
          variant="outlined"
          fullWidth
        />
        <br />
        <TextField
          size="small"
          label="メールアドレス"
          type="email"
          value={email}
          onChange={e => handleChange('email', e)}
          variant="outlined"
          fullWidth
          disabled={true}
        />
        <br />
        <Button
          disabled={true}
          variant="contained"
          className={styles.changeAddress}
        >
          メールアドレスを変更する(実装予定)
        </Button>
        <TextField
          size="small"
          type="text"
          label="自己紹介"
          value={profile}
          onChange={e => handleChange('profile', e)}
          multiline={true}
          rows={3}
          rowsMax={5}
          variant="outlined"
          fullWidth
        />
        <br />
        <Button
          variant="contained"
          type="submit"
          disabled={isSubmitting || !isValid}
        >
          保存
        </Button>
      </form>
    </div>
  )
}

const useStyles = makeStyles({
  root: {
    '& .AppProfileForm-form': {
      maxWidth: 450
    },
    '& .MuiFormControl-root': {
      marginBottom: theme.spacing(3)
    }
  },
  changeAddress: {
    marginTop: -theme.spacing(2),
    marginBottom: theme.spacing(3)
  }
})

interface FormValue {
  displayName: string
  email: string
  profile: string
}
