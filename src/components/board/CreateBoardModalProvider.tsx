import React from 'react'
import { CreateBoardForm } from '@/components'
import {
  makeStyles,
  Modal as MuiModal,
  Fade,
  Backdrop,
  IconButton
} from '@material-ui/core'
import { useEventListener } from '@/scripts/hooks'
import { Close } from '@material-ui/icons'
import * as CreateBoardModal from '@/scripts/context/CreateBoardModalContext'
import { theme } from '@/styles'

/**
 * 「新しいボードを作成」モーダルを開く関数を提供する
 */
export const CreateBoardModalProvider: React.FC = ({ children }) => {
  const [open, setOpen] = React.useState(false)
  const styles = useStyles()
  const handleClose = () => {
    window.dispatchEvent(new CustomEvent('onModalClose'))
    setOpen(false)
  }
  const openCreateBoardModal = () => setOpen(true)

  useEventListener('onDispatchCloseModal', () => {
    //NOTE: Modalを閉じるため
    const backdrops = document.querySelectorAll('.MuiBackdrop-root')
    if (backdrops)
      [].forEach.call(backdrops, (backdrop: HTMLElement) => {
        if (backdrop) backdrop.click()
      })
  })

  return (
    <>
      <MuiModal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
        keepMounted
        className={styles.root}
      >
        <Fade in={open}>
          <div className="AppCreateBoardModalContextProvider-inner">
            <IconButton
              size="small"
              onClick={handleClose}
              className="AppCreateBoardModalContextProvider-button-close"
            >
              <Close />
            </IconButton>
            <CreateBoardForm />
          </div>
        </Fade>
      </MuiModal>
      <CreateBoardModal.Context.Provider value={{ openCreateBoardModal }}>
        {children}
      </CreateBoardModal.Context.Provider>
    </>
  )
}

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.spacing(1),
    '& .AppCreateBoardModalContextProvider-inner': {
      position: 'relative'
    },
    '& .AppCreateBoardModalContextProvider-button-close': {
      position: 'absolute',
      top: 0,
      right: 0,
      zIndex: 1
    }
  }
})
