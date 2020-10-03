import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { addUser } from './actions'
import firebase from 'firebase'

export interface UsersState {
  isLoading: boolean
  users: {
    [i: string]: firebase.User
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
