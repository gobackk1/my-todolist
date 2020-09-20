import React, { useState } from 'react'
import {
  Modal as MuiModal,
  Backdrop,
  Fade,
  IconButton
} from '@material-ui/core'
import { css } from '@emotion/core'
import { Close } from '@material-ui/icons'

const styles = {
  modal: css`
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  'modal-inner': css`
    background: #fff;
    padding: 20px;
  `,
  'modal-inner-header': css`
    text-align: right;
  `
}

type Props = {
  render: (props: any) => JSX.Element
  className?: string
}

export const Modal: React.FC<Props> = ({ children, render, className }) => {
  const [open, setOpen] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
  }
  const onClick = () => handleOpen()

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
      >
        <Fade in={open}>
          <div css={styles['modal-inner']}>
            <div css={styles['modal-inner-header']}>
              {/* HACK: <BoardListMenu> からノードウォーキングで参照されている */}
              <IconButton
                size="small"
                onClick={handleClose as any}
                className="btn-modal-close"
              >
                <Close />
              </IconButton>
            </div>
            {children}
          </div>
        </Fade>
      </MuiModal>
    </div>
  )
}
