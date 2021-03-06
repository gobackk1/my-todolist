import React from 'react'
import { TextField } from '@material-ui/core'
import { DeepMap, FieldError } from 'react-hook-form'

type Props = {
  errors?: DeepMap<Record<string, any>, FieldError>
  register: any
}

export const PasswordField: React.FC<Props> = ({ errors, register }) => {
  return (
    <TextField
      error={errors ? !!errors.password : false}
      name="password"
      inputRef={register({
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
      type="password"
      label="パスワード"
      helperText={errors ? errors.password && errors.password.message : false}
      variant="filled"
      size="small"
      required={true}
      defaultValue=""
      fullWidth
    />
  )
}
