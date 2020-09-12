import React, { useState } from 'react'
import { Modal as MaterialModal, Backdrop, Fade } from '@material-ui/core'
import { css } from 'emotion/macro'

export const Modal: React.FC<Props> = ({ children, render }) => {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

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
      >
        <Fade in={open}>
          <div className={styles['modal-inner']}>{children}</div>
        </Fade>
      </MaterialModal>
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
  `
}

type Props = {
  render: (props: any) => JSX.Element
}
