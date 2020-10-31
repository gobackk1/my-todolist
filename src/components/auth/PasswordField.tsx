import React from 'react'
import { IconButton, InputAdornment, TextField } from '@material-ui/core'
import { DeepMap, FieldError } from 'react-hook-form'
import { Visibility, VisibilityOff } from '@material-ui/icons'

type Props = {
  errors?: DeepMap<Record<string, any>, FieldError>
  register: any
}

export const PasswordField: React.FC<Props> = props => {
  const [showPassword, setShowPassword] = React.useState<boolean>(false)
  const handleClickShowPassword = React.useCallback(
    () => setShowPassword(!showPassword),
    [setShowPassword, showPassword]
  )
  const handleMouseDownPassword = React.useCallback(
    () => setShowPassword(!showPassword),
    [setShowPassword, showPassword]
  )

  return (
    <TextField
      error={props.errors ? !!props.errors.password : false}
      name="password"
      inputRef={props.register({
        required: 'パスワードは必須です',
        maxLength: {
          value: 20,
          message: 'パスワードは6~20文字の英数小文字で入力してください'
        },
        minLength: {
          value: 6,
          message: 'パスワードは6~20文字の英数小文字で入力してください'
        },
        pattern: {
          value: /^[a-z0-9]+$/,
          message: 'パスワードは6~20文字の英数小文字で入力してください'
        }
      })}
      label="パスワード"
      helperText={
        props.errors
          ? props.errors.password && props.errors.password.message
          : false
      }
      variant="filled"
      size="small"
      required={true}
      defaultValue=""
      fullWidth
      className="AppPasswordField-root"
      type={showPassword ? 'test' : 'password'}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  )
}
