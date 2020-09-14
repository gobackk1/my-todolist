import { createList, fetchList } from './actions'
import { reducerWithInitialState } from 'typescript-fsa-reducers'

export interface Card {
  title: string
}

export interface List {
  boardId: string
  id: string
  title: string
}

export interface ListState {
  isLoading: boolean
  error: Error | null
  boards: {
    [i: string]: {
      lists: List[]
    }
  }
}

const initialState: ListState = {
  isLoading: true,
  error: null,
  boards: {
    '': {
      lists: []
    }
  }
}

export const listReducer = reducerWithInitialState(initialState)
  .cases([createList.async.started, fetchList.async.started], state => {
    return { ...state, isLoading: true }
  })
  .cases(
    [createList.async.failed, fetchList.async.failed],
    (state, { error }) => {
      return { ...state, isLoading: false, error }
    }
  )
  .cases([createList.async.done], (state, { params, result }) => {
    const { boardId } = params

    if (!(boardId in state.boards)) {
      state.boards[boardId] = { lists: [] }
    }

    const lists = state.boards[params.boardId].lists

    return {
      ...state,
      isLoading: false,
      boards: { [boardId]: { lists: lists.concat(result) } }
    }
  })
  .cases([fetchList.async.done], (state, { params, result }) => {
    const { boardId } = params
    return {
      ...state,
      isLoading: false,
      boards: { [boardId]: { lists: result } }
    }
  })
