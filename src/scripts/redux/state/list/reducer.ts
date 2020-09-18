import {
  createList,
  fetchList,
  deleteList,
  archiveList,
  fetchArchivedList
} from './actions'
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
      archivedLists: List[]
    }
  }
}

const initialState: ListState = {
  isLoading: true,
  error: null,
  boards: {
    '': {
      lists: [],
      archivedLists: []
    }
  }
}

export const listReducer = reducerWithInitialState(initialState)
  .cases(
    [
      createList.async.started,
      fetchList.async.started,
      deleteList.async.started,
      archiveList.async.started,
      fetchArchivedList.async.started
    ],
    state => {
      return { ...state, isLoading: true }
    }
  )
  .cases(
    [
      createList.async.failed,
      fetchList.async.failed,
      deleteList.async.failed,
      archiveList.async.failed,
      fetchArchivedList.async.failed
    ],
    (state, { error }) => {
      return { ...state, isLoading: false, error }
    }
  )
  .cases([createList.async.done], (state, { params, result }) => {
    const { boardId } = params

    if (!(boardId in state.boards)) {
      state.boards[params.boardId] = { lists: [] }
    }

    const lists = state.boards[params.boardId].lists

    return {
      ...state,
      isLoading: false,
      boards: {
        [boardId]: { lists: lists.concat(result), archivedLists: [] }
      }
    }
  })
  .cases([fetchList.async.done], (state, { params, result }) => {
    const [lists, archivedLists] = result
    return {
      ...state,
      isLoading: false,
      boards: {
        [params.boardId]: {
          lists,
          archivedLists
        }
      }
    }
  })
  .case(archiveList.async.done, (state, { result }) => {
    const targetLists = state.boards[result.boardId].lists
    const archivedLists = state.boards[result.boardId].archivedLists
    const index = targetLists.findIndex(list => list.id === result.id)
    return {
      ...state,
      isLoading: false,
      boards: {
        [result.boardId]: {
          lists: [
            ...targetLists.slice(0, index),
            ...targetLists.slice(index + 1)
          ],
          archivedLists: [...archivedLists.concat(targetLists[index])]
        }
      }
    }
  })
  .case(deleteList.async.done, (state, { result }) => {
    const targetLists = state.boards[result.boardId].lists
    const index = targetLists.findIndex(list => list.id === result.id)
    return {
      ...state,
      isLoading: false,
      boards: {
        [result.boardId]: {
          lists: [
            ...targetLists.slice(0, index),
            ...targetLists.slice(index + 1)
          ]
        }
      }
    }
  })
  .case(fetchArchivedList.async.done, (state, { params, result }) => {
    const [archivedLists] = result
    const { lists } = state.boards[params.boardId]
    return {
      ...state,
      isLoading: false,
      boards: {
        [params.boardId]: {
          archivedLists,
          lists
        }
      }
    }
  })
