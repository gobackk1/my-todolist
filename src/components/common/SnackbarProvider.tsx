import React, { useState, useEffect, SyntheticEvent, useCallback } from 'react'
import {
  Snackbar,
  SnackbarCloseReason,
  SnackbarOrigin
  // Slide
} from '@material-ui/core'
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert'
import { SnackbarContext } from '@/scripts/context'
import * as I from '@/scripts/interfaces'
// import { TransitionProps } from '@material-ui/core/transitions'

export const SnackbarProvider: React.FC<Props> = ({
  autoHideDuration,
  children,
  position
}) => {
  const [snackPack, setSnackPack] = useState<I.SnackPack[]>([] as I.SnackPack[])
  const [open, setOpen] = useState(false)
  const [messageInfo, setMessageInfo] = useState<I.SnackPack | undefined>(
    undefined
  )

  useEffect(() => {
    if (snackPack.length && !messageInfo) {
      setMessageInfo({ ...snackPack[0] })
      setSnackPack(prev => prev.slice(1))
      setOpen(true)
    } else if (snackPack.length && messageInfo && open) {
      setOpen(false)
    }
  }, [snackPack, messageInfo, open])

  // const SlideTransition = React.forwardRef(
  //   (props: TransitionProps, ref: React.Ref<unknown>) => (
  //     <Slide {...props} direction="down" ref={ref} />
  //   )
  // )

  const Alert = useCallback(
    (props: AlertProps) => (
      <MuiAlert elevation={6} variant="filled" {...props} />
    ),
    []
  )

  const showSnackbar = ({ message, type }: I.SnackPack) => {
    setSnackPack(prev => [
      ...prev,
      { message, type, key: new Date().getTime() }
    ])
  }

  const closeSnackbar = (
    event: SyntheticEvent<any, Event>,
    reason: SnackbarCloseReason
  ) => {
    if (reason === 'clickaway') return
    setOpen(false)
  }

  const handleExited = () => {
    setMessageInfo(undefined)
  }

  return (
    <>
      <Snackbar
        key={messageInfo ? messageInfo.key : undefined}
        anchorOrigin={position}
        open={open}
        autoHideDuration={autoHideDuration}
        onExited={handleExited}
        onClose={closeSnackbar}
        // message={messageInfo ? messageInfo.message : undefined}
        // TODO: スライド化検討 (コメントインだけでは動かない)
        // TransitionComponent={SlideTransition}
      >
        <Alert severity={messageInfo ? messageInfo.type : undefined}>
          {messageInfo ? messageInfo.message : undefined}
        </Alert>
      </Snackbar>
      <SnackbarContext.Provider value={{ showSnackbar, closeSnackbar }}>
        {children}
      </SnackbarContext.Provider>
    </>
  )
}

type Props = {
  autoHideDuration: number
  position: SnackbarOrigin
}
