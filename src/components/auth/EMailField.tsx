import React from 'react'
import { TextField } from '@material-ui/core'
import { DeepMap, FieldError } from 'react-hook-form'

type Props = {
  errors: DeepMap<Record<string, any>, FieldError>
  register: any
  onChange?: (e: React.ChangeEvent) => void
}

export const EMailField: React.FC<Props> = ({
  errors,
  register,
  onChange = () => undefined
}) => {
  return (
    <TextField
      error={!!errors.email}
      name="email"
      inputRef={register({
        required: 'メールアドレスは必須です',
        maxLength: {
          value: 30,
          message: 'メールアドレスは30'
        },
        pattern: {
          /**
           * https://qiita.com/sakuro/items/1eaa307609ceaaf51123
           */
          value: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, // eslint-disable-line
          message: 'メールアドレスの例/ example@exam.com'
        }
      })}
      type="email"
      label="メールアドレス"
      helperText={errors.email && errors.email.message}
      variant="filled"
      size="small"
      autoFocus={true}
      required={true}
      defaultValue=""
      onChange={onChange}
      fullWidth
    />
  )
}
