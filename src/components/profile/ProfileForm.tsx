import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { TextField, Button } from '@material-ui/core'
import { useCurrentUser } from '@/scripts/hooks'

export const ProfileForm = () => {
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
  }, [currentUser])

  const handleChange = React.useCallback(
    (name, e) => {
      e.persist()
      setValue(name, e.target.value)
    },
    [setValue]
  )

  const onSubmit: SubmitHandler<any> = React.useCallback(async params => {
    console.log(params)
    try {
      // dispatch(updateUser())
    } catch ({ message }) {
      console.log(message)
    }
  }, [])

  const { displayName, email, profile } = watch()

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        size="small"
        variant="filled"
        label="ユーザー名"
        type="text"
        value={displayName}
        onChange={e => handleChange('displayName', e)}
      />
      <br />
      <TextField
        size="small"
        variant="filled"
        label="メールアドレス"
        type="email"
        value={email}
        onChange={e => handleChange('email', e)}
      />
      <TextField
        size="small"
        type="text"
        label="自己紹介"
        value={profile}
        onChange={e => handleChange('profile', e)}
        multiline={true}
        rows={3}
        rowsMax={5}
      />
      <Button type="submit" disabled={isSubmitting || !isValid}>
        保存
      </Button>
    </form>
  )
}
