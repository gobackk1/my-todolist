import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { addUser } from './actions'

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

export const usersReducer = reducerWithInitialState(initialState).case(
  addUser,
  (state, params) => {
    return {
      ...state,
      users: {
        ...state.users,
        [params.uid]: params
      }
    }
  }
)
