import {
  createList,
  fetchList,
  deleteList,
  archiveList,
  fetchArchivedList,
  restoreList,
  // moveToArchivedList,
  // moveToList,
  updateList,
  changeListSortOrder
} from './actions'
import { reducerWithInitialState } from 'typescript-fsa-reducers'

export interface List {
  boardId: string
  id: string
  title: string
  sortOrder: number
}

export interface ListState {
  isLoading: boolean
  error: Error | null
  history: List[][]
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
  history: [],
  boards: {
    '': {
      lists: [],
      archivedLists: []
    }
  }
}

export const listReducer = reducerWithInitialState(initialState)
  .case(createList.async.started, state => {
    return { ...state, isLoading: true }
  })
  .case(deleteList.async.started, state => {
    return { ...state, isLoading: true }
  })
  .case(archiveList.async.started, state => {
    return { ...state, isLoading: true }
  })
  .case(createList.async.started, state => {
    return { ...state, isLoading: true }
  })
  .cases(
    [
      fetchList.async.started,
      fetchArchivedList.async.started,
      restoreList.async.started,
      updateList.async.started
    ],
    state => {
      return { ...state, isLoading: true }
    }
  )
  .case(createList.async.failed, (state, { error }) => {
    return { ...state, isLoading: false, error }
  })
  .case(archiveList.async.failed, (state, { error }) => {
    return { ...state, isLoading: false, error }
  })
  .case(deleteList.async.failed, (state, { error }) => {
    return { ...state, isLoading: false, error }
  })
  .cases(
    [
      fetchList.async.failed,
      fetchArchivedList.async.failed,
      restoreList.async.failed,
      updateList.async.failed
    ],
    (state, { error }) => {
      return { ...state, isLoading: false, error }
    }
  )
  .cases([createList.async.done], (state, { params, result }) => {
    const { boardId } = params

    if (!(boardId in state.boards)) {
      state.boards[params.boardId] = { lists: [], archivedLists: [] }
    }

    const lists = state.boards[params.boardId].lists

    return {
      ...state,
      isLoading: false,
      boards: {
        ...state.boards,
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
        ...state.boards,
        [params.boardId]: {
          lists,
          archivedLists
        }
      }
    }
  })
  .case(archiveList.async.done, (state, { result }) => {
    const [targetList, rerunedLists] = result
    const archivedLists = state.boards[targetList.boardId].archivedLists
    return {
      ...state,
      isLoading: false,
      boards: {
        ...state.boards,
        [targetList.boardId]: {
          archivedLists: [...archivedLists.concat(targetList)],
          lists: rerunedLists
        }
      }
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
        ...state.boards,
        [result.boardId]: {
          archivedLists: [...targetLists.slice(0, index), ...targetLists.slice(index + 1)],
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
        ...state.boards,
        [params.boardId]: {
          archivedLists,
          lists
        }
      }
    }
  })

  .case(restoreList.async.done, (state, { result }) => {
    const [targetList, resortOrderLists] = result
    const archivedLists = state.boards[targetList.boardId].archivedLists
    const index = archivedLists.findIndex(list => list.id === targetList.id)
    return {
      ...state,
      isLoading: false,
      boards: {
        ...state.boards,
        [targetList.boardId]: {
          lists: resortOrderLists,
          archivedLists: [...archivedLists.slice(0, index), ...archivedLists.slice(index + 1)]
        }
      }
    }
  })
  /**
   * NOTE: UX確保のため、started の時点で並び替えを変更する
   * トランザクションが失敗したら、state をロールバックする
   */
  .case(changeListSortOrder.async.started, (state, params) => {
    const { removedIndex, addedIndex, boardId } = params
    const lists = state.boards[boardId].lists
    const isLargeToSmallOrders = removedIndex > addedIndex
    const maxIndex = isLargeToSmallOrders ? removedIndex : addedIndex
    const minIndex = isLargeToSmallOrders ? addedIndex : removedIndex
    const check = list => {
      return isLargeToSmallOrders
        ? minIndex <= list.sortOrder && list.sortOrder < maxIndex
        : minIndex < list.sortOrder && list.sortOrder <= maxIndex
    }
    const add = isLargeToSmallOrders ? 1 : -1

    const resortedLists = lists.map(list => {
      if (list.sortOrder === removedIndex) {
        return { ...list, sortOrder: addedIndex }
      } else if (check(list)) {
        return { ...list, sortOrder: list.sortOrder + add }
      } else {
        return list
      }
    })
    return {
      ...state,
      isLoading: true,
      history: state.history.concat([lists]),
      boards: {
        ...state.boards,
        [boardId]: {
          ...state.boards[boardId],
          lists: resortedLists
        }
      }
    }
  })
  .case(changeListSortOrder.async.failed, (state, { error, params }) => {
    return {
      ...state,
      isLoading: false,
      error,
      history: state.history.slice(0, state.history.length - 1),
      boards: {
        ...state.boards,
        [params.boardId]: {
          ...state.boards[params.boardId],
          lists: state.history.slice(state.history.length - 1)[0]
        }
      }
    }
  })
  .case(changeListSortOrder.async.done, state => {
    return {
      ...state,
      isLoading: false
    }
  })
  // .case(moveToList, (state, params) => {
  //   const { archivedLists, lists } = state.boards[params.boardId]
  //   const index = archivedLists.findIndex(list => list.id === params.id)
  //   return {
  //     ...state,
  //     boards: {
  //       [params.boardId]: {
  //         lists: lists.concat(params),
  //         archivedLists: [
  //           ...archivedLists.slice(0, index),
  //           ...archivedLists.slice(index + 1)
  //         ]
  //       }
  //     }
  //   }
  // })
  // .case(moveToArchivedList, (state, params) => {
  //   const { archivedLists, lists } = state.boards[params.boardId]
  //   const index = lists.findIndex(list => list.id === params.id)
  //   return {
  //     ...state,
  //     boards: {
  //       [params.boardId]: {
  //         archivedLists: archivedLists.concat(params),
  //         lists: [...lists.slice(0, index), ...lists.slice(index + 1)]
  //       }
  //     }
  //   }
  // })
  .case(updateList.async.done, (state, { result }) => {
    const { archivedLists, lists } = state.boards[result.boardId]
    const index = lists.findIndex(list => list.id === result.id)
    return {
      ...state,
      isLoading: false,
      boards: {
        [result.boardId]: {
          archivedLists,
          lists: [...lists.slice(0, index), result, ...lists.slice(index + 1)]
        }
      }
    }
  })
