import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { setLoginUser, setLoggingIn } from './actions'

export interface User {
  uid: string
  displayName: string
  profile: string
  avatarURL: string
}

export interface CurrentUserState {
  isLoggingIn: boolean
  user: { uid: string } | null
}

const initialState: CurrentUserState = {
  isLoggingIn: true,
  user: null
}

export const currentUserReducer = reducerWithInitialState(initialState)
  .case(setLoginUser, (state, params) => {
    return { ...state, user: params }
  })
  .case(setLoggingIn, (state, params) => {
    return { ...state, isLoggingIn: params }
  })
