import React, { useState } from 'react'
import {
  Modal as MuiModal,
  Backdrop,
  Fade,
  IconButton,
  ModalProps
} from '@material-ui/core'
import { Close } from '@material-ui/icons'
import { useEventListener } from '@/scripts/hooks'
import { theme } from '@/styles'
import { makeStyles } from '@material-ui/styles'

type Props = {
  render: ({ onClick }: RenderProps) => JSX.Element
  className?: string
}

type RenderProps = {
  onClick: () => void
}

/**
 * 開いたモーダルを全て閉じるとき
 * dispatchEvent(new CustomEvent('onDispatchCloseModal'))
 */
export const Modal: React.FC<Props> = ({ children, render, className }) => {
  const [open, setOpen] = useState(false)
  const styles = useStyles()

  const handleClose = () => {
    window.dispatchEvent(new CustomEvent('onModalClose'))
    setOpen(false)
  }
  const onClick = React.useCallback(() => {
    setOpen(true)
  }, [])

  useEventListener('onDispatchCloseModal', () => {
    //NOTE: Modalを閉じるため
    const backdrops = document.querySelectorAll('.MuiBackdrop-root')
    if (backdrops)
      [].forEach.call(backdrops, (backdrop: HTMLElement) => {
        if (backdrop) backdrop.click()
      })
  })

  const modalProps: Omit<ModalProps, 'children'> = React.useMemo(
    () => ({
      open,
      onClose: handleClose,
      closeAfterTransition: true,
      BackdropComponent: Backdrop,
      BackdropProps: {
        timeout: 500
      },
      keepMounted: true
    }),
    [open, handleClose, Backdrop]
  )

  return (
    <div>
      {render({ onClick })}
      <MuiModal
        {...modalProps}
        className={`${styles.modal} ${className ? className : ''}`}
      >
        <Fade in={open}>
          <div className={styles.modalInner}>
            <IconButton
              size="small"
              onClick={handleClose}
              className={`${styles.modalClose}`}
            >
              <Close />
            </IconButton>
            {children}
          </div>
        </Fade>
      </MuiModal>
    </div>
  )
}

const useStyles = makeStyles({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius(1)
  },
  modalInner: {
    position: 'relative',
    background: '#fff',
    borderRadius: theme.borderRadius(1)
  },
  modalInnerHeader: {
    textAlign: 'right'
  },
  modalClose: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1
  }
})
