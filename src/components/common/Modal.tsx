import React, { useState } from 'react'
import {
  Modal as MuiModal,
  Backdrop,
  Fade,
  IconButton
} from '@material-ui/core'
import { css } from '@emotion/core'
import { Close } from '@material-ui/icons'
import { useEventListener } from '@/scripts/hooks'
import { theme } from '@/styles'

const styles = {
  modal: css`
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: ${theme.borderRadius(1)}px;
  `,
  'modal-inner': css`
    position: relative;
    background: #fff;
    border-radius: ${theme.borderRadius(1)}px;
  `,
  'modal-inner-header': css`
    text-align: right;
  `,
  'modal-close': css`
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
  `
}

type Props = {
  render: (props: any) => JSX.Element
  className?: string
}

/**
 * 開いたモーダルを全て閉じるとき
 * dispatchEvent(new CustomEvent('onDispatchCloseModal'))
 */
export const Modal: React.FC<Props> = ({ children, render, className }) => {
  const [open, setOpen] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    window.dispatchEvent(new CustomEvent('onModalClose'))
    setOpen(false)
  }
  const onClick = () => handleOpen()

  useEventListener('onDispatchCloseModal', () => {
    //NOTE: Modalを閉じるため
    const backdrops = document.querySelectorAll('.MuiBackdrop-root')
    if (backdrops)
      [].forEach.call(backdrops, (backdrop: HTMLElement) => {
        if (backdrop) backdrop.click()
      })
  })

  return (
    <div>
      {render({ onClick })}
      <MuiModal
        open={open}
        css={styles['modal']}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
        keepMounted
        className={className ? className : ''}
        data-test="Modal"
      >
        <Fade in={open}>
          <div css={styles['modal-inner']}>
            <IconButton
              size="small"
              onClick={handleClose as any}
              // TODO: まとめる
              className="btn-modal-close Modal-buttonClose"
              css={styles['modal-close']}
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
