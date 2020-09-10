import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { setLoginUser, setLoggingIn } from './actions'
import firebase from '@/scripts/firebase'

export interface UserState {
  isLoggingIn: boolean
  user: firebase.User | null
}

const initialState: UserState = {
  isLoggingIn: true,
  user: null
}

export const userReducer = reducerWithInitialState(initialState)
  .case(setLoginUser, (state, params) => {
    return { ...state, user: params }
  })
  .case(setLoggingIn, (state, params) => {
    return { ...state, isLoggingIn: params }
  })
