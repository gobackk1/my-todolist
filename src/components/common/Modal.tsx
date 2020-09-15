import React, { useState } from 'react'
import {
  Modal as MuiModal,
  Backdrop,
  Fade,
  IconButton
} from '@material-ui/core'
import { css } from '@emotion/core'
import { Close } from '@material-ui/icons'

export const Modal: React.FC<Props> = ({ children, render }) => {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = (e: any, reason: any) => {
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
      >
        <Fade in={open}>
          <div css={styles['modal-inner']}>
            <div css={styles['modal-inner-header']}>
              {/* HACK: <BoardListMenu> からノードウォーキングで参照されている */}
              <IconButton size="small" onClick={handleClose as any}>
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
}
