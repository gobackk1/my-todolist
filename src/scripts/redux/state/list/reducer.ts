import {
  createList,
  fetchList,
  deleteList,
  archiveList,
  fetchArchivedList,
  restoreList,
  moveToArchivedList,
  moveToList
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
      fetchArchivedList.async.started,
      restoreList.async.started
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
      fetchArchivedList.async.failed,
      restoreList.async.failed
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
  .case(archiveList.async.done, state => {
    return {
      ...state,
      isLoading: false
    }
  })
  .case(deleteList.async.done, (state, { result }) => {
    const targetLists = state.boards[result.boardId].archivedLists
    const lists = state.boards[result.boardId].lists
    const index = targetLists.findIndex(list => list.id === result.id)
    return {
      ...state,
      isLoading: false,
      boards: {
        [result.boardId]: {
          archivedLists: [
            ...targetLists.slice(0, index),
            ...targetLists.slice(index + 1)
          ],
          lists
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
  .case(restoreList.async.done, (state, { params, result }) => {
    const targetLists = state.boards[result.boardId].archivedLists
    const lists = state.boards[result.boardId].lists
    const index = targetLists.findIndex(list => list.id === result.id)
    return {
      ...state,
      isLoading: false,
      boards: {
        [result.boardId]: {
          lists: [...lists.concat(targetLists[index])],
          archivedLists: [
            ...targetLists.slice(0, index),
            ...targetLists.slice(index + 1)
          ]
        }
      }
    }
  })
  .case(moveToList, (state, params) => {
    const { archivedLists, lists } = state.boards[params.boardId]
    const index = archivedLists.findIndex(list => list.id === params.id)

    return {
      ...state,
      boards: {
        [params.boardId]: {
          lists: lists.concat(params),
          archivedLists: [
            ...archivedLists.slice(0, index),
            ...archivedLists.slice(index + 1)
          ]
        }
      }
    }
  })
  .case(moveToArchivedList, (state, params) => {
    const { archivedLists, lists } = state.boards[params.boardId]
    const index = lists.findIndex(list => list.id === params.id)

    return {
      ...state,
      boards: {
        [params.boardId]: {
          archivedLists: archivedLists.concat(params),
          lists: [...lists.slice(0, index), ...lists.slice(index + 1)]
        }
      }
    }
  })
