import firebase from 'firebase/app'
import { OPTION } from '@/option'
import { useSnackbarContext } from './useSnackbarContext'
import { useEventListener } from './useEventListener'

export const useErrorReport = (): void => {
  const { showSnackbar } = useSnackbarContext()

  const reportHandler = async e => {
    const { message, filename, lineno } = e
    try {
      firebase
        .firestore()
        .collection(OPTION.COLLECTION_PATH.RUNTIME_ERROR_REPORTS)
        .add({
          message,
          filename,
          lineno,
          url: location.href,
          ua: navigator.userAgent
        })
    } catch (e) {
      showSnackbar({
        message: OPTION.MESSAGE.SERVER_CONNECTION_ERROR,
        type: 'error'
      })
    }
  }

  useEventListener('error', reportHandler)
}
