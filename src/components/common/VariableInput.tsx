import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { useResize } from '@/scripts/hooks'
import { BoardButton } from '@/components'
import { ClickAwayListener } from '@material-ui/core'

type TitleElement = HTMLInputElement | HTMLTextAreaElement

export const VariableInput: React.FC<Props> = ({ label, onUpdate, component, width }) => {
  const labelRef = React.useRef<TitleElement>(null)
  const styles = useStyles()
  const [isEditing, setEditing] = React.useState(false)
  const { resize } = useResize(component, labelRef)

  React.useEffect(() => {
    if (labelRef.current) labelRef.current.value = label
  }, [label, isEditing])

  React.useEffect(() => {
    if (isEditing) {
      labelRef.current?.focus()
      labelRef.current?.select()
    }
  }, [isEditing])

  const handleClose = React.useCallback(() => {
    setEditing(false)
  }, [])

  const handleBlur = React.useCallback(
    async (e: React.FocusEvent<TitleElement>) => {
      await onUpdate(e, handleClose)
    },
    [onUpdate, handleClose]
  )

  const handleKeyDown = React.useCallback(
    async (e: React.KeyboardEvent<TitleElement>) => {
      if (e.keyCode !== 13) return
      await onUpdate(e, handleClose)
    },
    [onUpdate, handleClose]
  )

  const handleClick = React.useCallback(() => {
    resize()
    setEditing(true)
  }, [resize])

  const handleClickAway = React.useCallback(() => {
    setEditing(false)
  }, [])

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div className={`AppVariableInput-root ${styles.root}`}>
        <BoardButton
          onClick={handleClick}
          style={{
            display: isEditing ? 'none' : 'block'
          }}
          className={component === 'input' ? styles['button'] : styles['button-textarea']}
          variant="contained"
        >
          {label}
        </BoardButton>
        {component === 'input' ? (
          <input
            type="text"
            ref={labelRef as React.RefObject<HTMLInputElement>}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onChange={resize}
            className={`MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-outlined ${styles['input']}`}
            style={{
              display: isEditing ? 'block' : 'none'
            }}
          />
        ) : (
          <textarea
            ref={labelRef as React.RefObject<HTMLTextAreaElement>}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onChange={resize}
            className={`MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-outlined ${styles['input']}`}
            style={{
              display: isEditing ? 'block' : 'none',
              width: width || 'auto'
            }}
          />
        )}
      </div>
    </ClickAwayListener>
  )
}

const useStyles = makeStyles({
  root: {
    width: '100%',

    '& .MuiButton-root': {
      minWidth: 150,
      maxWidth: 'none',
      textAlign: 'left',
      textTransform: 'none',
      borderWidth: 2
    }
  },
  button: {
    '&.MuiButton-root': {
      padding: '4px 8px',
      border: '2px solid transparent',
      fontWeight: 'bold'
    }
  },
  'button-textarea': {
    '&.MuiButton-root': {
      padding: '4px 8px',
      border: '2px solid transparent',
      fontWeight: 'bold',
      width: '100%',
      wordBreak: 'break-all',
      minHeight: 36
    }
  },
  input: {
    '&.MuiButton-outlined': {
      padding: '4px 8px',
      fontWeight: 'bold',
      resize: 'none',
      minHeight: 36,
      wordBreak: 'break-all'
    }
  }
})

type Props = {
  label: string
  onUpdate: (
    e: React.FocusEvent<TitleElement> | React.KeyboardEvent<TitleElement>,
    close: () => void
  ) => void
  component: 'input' | 'textarea'
  width?: number
}
