import React from 'react'
import { withStyles, makeStyles } from '@material-ui/styles'
import { useEventListener } from '@/scripts/hooks'
import { Button } from '@material-ui/core'

// ネーミングと幅をリファクタ

type TitleElement = HTMLInputElement | HTMLTextAreaElement

export const VariableInput: React.FC<Props> = ({
  label,
  onUpdate,
  component,
  width
}) => {
  // NOTE: titleRef はアンマウントしないので
  /* eslint @typescript-eslint/no-non-null-assertion: off */
  const labelRef = React.useRef<TitleElement>(null)
  const styles = useStyles()
  const [isEditing, setEditing] = React.useState(false)

  React.useEffect(() => {
    labelRef.current!.value = label
  }, [label, isEditing])

  /**
   * ボードタイトル変更 input 以外をクリックしたら、編集終了してタイトルを表示
   */
  useEventListener(
    'click',
    (e: React.MouseEvent<HTMLElement>) => {
      if ((e.target as HTMLElement).closest('.js-title-area')) return
      if (isEditing) setEditing(false)
    },
    labelRef.current ? labelRef.current : undefined
  )

  const onBlurTitle = async (e: React.FocusEvent<TitleElement>) => {
    await onUpdate(e, () => setEditing(false))
  }

  const onKeyDownTitle = async (e: React.KeyboardEvent<TitleElement>) => {
    // NOTE: EnterKey以外はリターン
    if (e.keyCode !== 13) return
    await onUpdate(e, () => setEditing(false))
  }

  const onClickTitle = () => {
    resize()
    setEditing(true)

    // HACK: 非同期しないとテキストが選択状態にならない
    setTimeout(() => {
      labelRef.current!.focus()
      labelRef.current!.select()
    }, 0)
  }

  /**
   * input: 横にリサイズ
   * textarea: 縦にリサイズ
   */
  const resize = () => {
    const inputStyles = getComputedStyle(labelRef.current!)
    if (!inputStyles) return

    if (component === 'input') {
      const span = document.createElement('span')
      span.innerHTML = labelRef.current!.value
      span.style.padding = inputStyles.padding
      span.style.fontFamily = inputStyles.fontFamily
      span.style.fontSize = inputStyles.fontSize
      span.style.fontWeight = inputStyles.fontWeight
      span.style.letterSpacing = inputStyles.letterSpacing
      span.style.boxSizing = inputStyles.boxSizing
      span.style.whiteSpace = 'nowrap'
      span.style.visibility = 'hidden'
      span.style.border = inputStyles.border

      document.body.appendChild(span)
      const spanWidth = span.offsetWidth
      document.body.removeChild(span)
      labelRef.current!.style.width = `${spanWidth + 4}px`
    } else {
      const span = document.createElement('span')
      span.innerHTML = labelRef.current!.value
      span.style.padding = inputStyles.padding
      span.style.fontFamily = inputStyles.fontFamily
      span.style.fontSize = inputStyles.fontSize
      span.style.fontWeight = inputStyles.fontWeight
      span.style.letterSpacing = inputStyles.letterSpacing
      span.style.lineHeight = inputStyles.lineHeight
      span.style.width = inputStyles.width
      span.style.boxSizing = inputStyles.boxSizing
      span.style.border = inputStyles.border
      span.style.visibility = 'hidden'
      span.style.whiteSpace = 'break-spaces'
      span.style.wordBreak = 'break-all'
      span.style.background = '#f3f3f3'
      span.style.display = 'block'
      document.body.appendChild(span)
      const spanHeight = span.offsetHeight
      document.body.removeChild(span)
      labelRef.current!.style.height = `${spanHeight}px`
    }
  }

  return (
    <div className={`AppVariableInput-root ${styles.root}`}>
      <BoardTitleButton
        onClick={onClickTitle}
        style={{
          display: isEditing ? 'none' : 'block'
        }}
        className={
          component === 'input' ? styles['button'] : styles['button-textarea']
        }
      >
        {label}
      </BoardTitleButton>
      {component === 'input' ? (
        <input
          name="title"
          type="text"
          ref={labelRef as React.RefObject<HTMLInputElement>}
          onBlur={onBlurTitle}
          onKeyDown={onKeyDownTitle}
          onChange={resize}
          className={`MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-outlined ${styles['input']}`}
          style={{
            display: isEditing ? 'block' : 'none'
          }}
        />
      ) : (
        <textarea
          name="title"
          ref={labelRef as React.RefObject<HTMLTextAreaElement>}
          onBlur={onBlurTitle}
          onKeyDown={onKeyDownTitle}
          onChange={resize}
          className={`MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-outlined ${styles['input']}`}
          style={{
            display: isEditing ? 'block' : 'none',
            width: width || 'auto'
          }}
        />
      )}
    </div>
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

const BoardTitleButton = withStyles({
  root: {
    backgroundColor: '#dedede'
  }
})(Button)

type Props = {
  label: string
  onUpdate: (
    e: React.FocusEvent<TitleElement> | React.KeyboardEvent<TitleElement>,
    close: () => void
  ) => void
  component: 'input' | 'textarea'
  width?: number
}
