import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { TextField, Button } from '@material-ui/core'
import {
  useCurrentUser,
  useSnackbarContext,
  useValidation
} from '@/scripts/hooks'
import { makeStyles } from '@material-ui/styles'
import { theme } from '@/styles'
import { updateUser } from '~redux/state/users/actions'
import { useDispatch, useSelector } from 'react-redux'
import { LoadingSpinner } from '../common'

export const ProfileForm: React.FC = () => {
  const currentUser = useCurrentUser()
  const {
    register,
    handleSubmit,
    errors,
    setValue,
    setError,
    watch,
    clearErrors,
    formState: { isSubmitting, isValid }
  } = useForm({
    mode: 'onChange',
    defaultValues: { displayName: '', email: '', profile: '' }
  })
  const styles = useStyles()
  const { showSnackbar } = useSnackbarContext()
  const dispatch = useDispatch()
  const { isValidDisplayName, isValidProfile } = useValidation('User')
  const { isLoading } = useSelector(state => state.users)

  React.useEffect(() => {
    register({ name: 'displayName' })
    register({ name: 'profile' })
  }, [register])

  React.useEffect(() => {
    if (!currentUser) return
    setValue('displayName', currentUser.displayName)
    setValue('profile', currentUser.profile)
  }, [currentUser, setValue])

  const handleChange = React.useCallback(
    (name, e) => {
      e.persist()
      if (name === 'displayName') {
        if (isValidDisplayName(e.target.value)) {
          clearErrors('displayName')
        } else {
          setError('displayName', {
            type: 'manual',
            message: 'ユーザー名は6文字以上、30字以内で入力してください'
          })
        }
      }

      if (name === 'profile') {
        if (isValidProfile(e.target.value)) {
          clearErrors('profile')
        } else {
          setError('profile', {
            type: 'manual',
            message: '自己紹介は140字以内で入力してください'
          })
        }
      }

      setValue(name, e.target.value)
    },
    [setValue, setError, clearErrors, isValidDisplayName, isValidProfile]
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

  const { displayName, profile } = watch()

  return (
    <div className={`AppProfileForm-root ${styles.root}`}>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <form className="AppProfileForm-form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            size="small"
            label="ユーザー名"
            type="text"
            value={displayName}
            onChange={e => handleChange('displayName', e)}
            variant="outlined"
            fullWidth
            error={!!errors.displayName}
            helperText={errors.displayName && errors.displayName.message}
          />
          <br />
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
            error={!!errors.profile}
            helperText={errors.profile && errors.profile.message}
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
      )}
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
