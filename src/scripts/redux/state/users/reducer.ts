import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { setUser, getUser, resetUsers, updateUser } from './actions'
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
  .case(setUser, (state, params) => ({
    ...state,
    users: {
      ...state.users,
      [params.uid]: params
    }
  }))
  .case(resetUsers, () => ({ ...initialState }))
  .cases([getUser.async.started, updateUser.async.started], state => ({
    ...state,
    isLoading: true
  }))
  //todo: エラーハンドリング
  .cases(
    [
      getUser.async.failed,
      getUser.async.done,
      updateUser.async.failed,
      updateUser.async.done
    ],
    state => ({
      ...state,
      isLoading: true
    })
  )
