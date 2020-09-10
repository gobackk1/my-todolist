import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { asyncSetTitle } from './actions'

export interface BoardState {
  title: string
}

const initialState: BoardState = {
  title: 'initial'
}

export const boardReducer = reducerWithInitialState(initialState)
  .case(asyncSetTitle.async.started, (state, params) => {
    return { ...state }
  })
  .case(asyncSetTitle.async.done, (state, params) => {
    return { ...state }
  })
