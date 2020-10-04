import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { addUser, getUser } from './actions'

export interface User {
  displayName: string
  photoURL: string
  uid: string
}
export interface UsersState {
  isLoading: boolean
  users: {
    [i: string]: User
  }
}

const initialState: UsersState = {
  isLoading: true,
  users: {}
}

export const usersReducer = reducerWithInitialState(initialState)
  .case(addUser, (state, params) => {
    //todo: すでにユーザーがいた時
    return {
      ...state,
      users: {
        ...state.users,
        [params.uid]: params
      }
    }
  })
  .case(getUser.async.started, state => {
    return { ...state, isLoading: true }
  })
  //todo: エラーハンドリング
  .cases([getUser.async.failed, getUser.async.done], state => {
    return { ...state, isLoading: true }
  })
