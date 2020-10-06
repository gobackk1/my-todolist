import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { setLoginUser, setLoggingIn } from './actions'

export interface User {
  uid: string
  displayName: string
  email: string
  profile: string
  avatarURL: 'default'
}

export interface CurrentUserState {
  isLoggingIn: boolean
  user: User | null
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
