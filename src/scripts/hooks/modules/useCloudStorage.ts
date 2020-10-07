import React from 'react'
import firebase from 'firebase/app'

interface CloudStorageHooks {
  uploadFile: (fileOrBlob: File | Blob, fullPath: string) => Promise<string>
}

export const useCloudStorage = (): CloudStorageHooks => {
  const uploadFile = React.useCallback(
    async (fileOrBlob: File | Blob, fullPath: string): Promise<string> => {
      const storageRef = firebase
        .storage()
        .ref()
        .child(fullPath)
      await storageRef.put(fileOrBlob)

      return await storageRef.getDownloadURL()
    },
    []
  )

  return { uploadFile }
}
