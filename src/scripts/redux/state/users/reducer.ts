import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { addUser, getUser, resetUsers } from './actions'
import { User } from '@/scripts/redux/state/currentUser/reducer'

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
  .case(addUser, (state, params) => ({
    ...state,
    users: {
      ...state.users,
      [params.uid]: params
    }
  }))
  .case(resetUsers, () => ({ ...initialState }))
  .case(getUser.async.started, state => ({ ...state, isLoading: true }))
  //todo: エラーハンドリング
  .cases([getUser.async.failed, getUser.async.done], state => ({
    ...state,
    isLoading: true
  }))
