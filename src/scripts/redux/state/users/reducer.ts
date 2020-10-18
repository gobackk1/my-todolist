import { reducerWithInitialState } from 'typescript-fsa-reducers'
import {
  setUser,
  getUser,
  resetUsers,
  updateUser,
  getUserByEmail
} from './actions'
import { User } from '@/scripts/model/interface'

export interface UsersState {
  isLoading: boolean
  init: boolean
  users: {
    [i: string]: User
  }
  getUserByEmail: (email: string) => User | undefined
}

const initialState: UsersState = {
  isLoading: true,
  init: false,
  users: {},
  getUserByEmail(email: string) {
    return Object.values(this.users).find(user => user.email === email)
  }
}

export const usersReducer = reducerWithInitialState(initialState)
  .case(setUser, (state, params) => ({
    ...state,
    users: {
      ...state.users,
      [params.uid]: params
    }
  }))
  .case(resetUsers, () => ({ ...initialState }))
  .cases(
    [
      getUser.async.started,
      updateUser.async.started,
      getUserByEmail.async.started
    ],
    state => ({
      ...state,
      isLoading: true
    })
  )
  .cases(
    [
      getUser.async.failed,
      getUser.async.done,
      updateUser.async.failed,
      updateUser.async.done
    ],
    state => ({
      ...state,
      isLoading: false,
      init: true
    })
  )
  .cases([getUserByEmail.async.failed, getUserByEmail.async.done], state => ({
    ...state,
    isLoading: false,
    init: true
  }))
