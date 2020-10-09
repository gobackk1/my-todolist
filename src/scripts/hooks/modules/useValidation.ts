import React from 'react'

interface UserValidation {
  isValidDisplayName: (name: string) => boolean
  isValidProfile: (name: string) => boolean
}

type ValidationMethods = UserValidation

/* eslint-disable-next-line */
export const useValidation = (): ValidationMethods => {
  const isValidDisplayName = React.useCallback(displayName => {
    return displayName.length >= 6 && displayName.length < 31
  }, [])

  const isValidProfile = React.useCallback(profile => {
    return profile.length < 140
  }, [])

  return {
    isValidDisplayName,
    isValidProfile
  }
}
