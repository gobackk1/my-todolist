import React from 'react'
import { TextField } from '@material-ui/core'
import { DeepMap, FieldError } from 'react-hook-form'

type Props = {
  errors: DeepMap<Record<string, any>, FieldError>
  register: any
  onChange?: (e: React.ChangeEvent) => void
}

export const DisplayNameField: React.FC<Props> = ({
  errors,
  register,
  onChange = () => undefined
}) => {
  return (
    <TextField
      error={!!errors.displayName}
      name="displayName"
      inputRef={register({
        required: 'ユーザー名は必須です',
        minLength: {
          value: 6,
          message: 'ユーザー名は6~30文字で入力してください'
        },
        maxLength: {
          value: 30,
          message: 'ユーザー名は6~30文字で入力してください'
        }
      })}
      type="text"
      label="ユーザー名"
      helperText={errors.displayName && errors.displayName.message}
      variant="filled"
      size="small"
      required
      defaultValue=""
      onChange={onChange}
      fullWidth
      className="AppDisplayNameField-root"
    />
  )
}
