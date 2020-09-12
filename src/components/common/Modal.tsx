import React, { useState } from 'react'
import {
  Modal as MaterialModal,
  Backdrop,
  Fade,
  IconButton
} from '@material-ui/core'
import { css } from 'emotion/macro'
import { Close } from '@material-ui/icons'

export const Modal: React.FC<Props> = React.memo(({ children, render }) => {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = (e: any, reason: any) => {
    setOpen(false)
  }
  const onClick = () => handleOpen()

  return (
    <div>
      {render({ onClick })}
      <MaterialModal
        open={open}
        className={styles['modal']}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
        keepMounted={true}
      >
        <Fade in={open}>
          <div className={styles['modal-inner']}>
            <div className={styles['modal-inner-header']}>
              {/* HACK: <BoardListMenu> からノードウォーキングで参照されている */}
              <IconButton size="small" onClick={handleClose as any}>
                <Close />
              </IconButton>
            </div>
            {children}
          </div>
        </Fade>
      </MaterialModal>
    </div>
  )
})

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
