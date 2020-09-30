import { reducerWithInitialState } from 'typescript-fsa-reducers'
import {
  fetchBoards,
  createBoard,
  updateBoard,
  deleteBoard,
  archiveBoard,
  fetchArchivedBoards,
  restoreBoard,
  setBoard,
  setArchivedBoard
} from './actions'

export interface Board {
  id: string
  title: string
  backgroundImage: string
  favorite: boolean
}
export interface BoardState {
  init: boolean
  isLoading: boolean
  error: Error | null
  boards: {
    [i: string]: Board
  }
  archivedBoards: {
    [i: string]: Board
  }
}

export const initialState: BoardState = {
  init: false,
  isLoading: false,
  error: null,
  boards: {},
  archivedBoards: {}
}

export const boardReducer = reducerWithInitialState(initialState)
  /**
   * async.started
   */
  .case(fetchBoards.async.started, state => {
    return { ...state, isLoading: true }
  })
  .case(fetchArchivedBoards.async.started, state => {
    return { ...state, isLoading: true }
  })
  .case(restoreBoard.async.started, state => {
    return { ...state, isLoading: true }
  })
  .cases(
    [
      createBoard.async.started,
      updateBoard.async.started,
      deleteBoard.async.started,
      archiveBoard.async.started
    ],
    state => {
      return { ...state, isLoading: true }
    }
  )

  /**
   * async.failed
   */
  .cases(
    [fetchBoards.async.failed, fetchArchivedBoards.async.failed],
    (state, { error }) => {
      return { ...state, isLoading: false, error }
    }
  )
  .cases(
    [
      createBoard.async.failed,
      updateBoard.async.failed,
      deleteBoard.async.failed,
      archiveBoard.async.failed
    ],
    (state, { error }) => {
      return { ...state, isLoading: false, error }
    }
  )
  .case(restoreBoard.async.failed, (state, { error }) => {
    return { ...state, isLoading: false, error }
  })

  /**
   * async.done
   */
  .case(fetchBoards.async.done, state => {
    return { ...state, init: true, isLoading: false }
  })
  .case(setBoard, (state, params) => {
    return {
      ...state,
      boards: {
        ...state.boards,
        [params.id]: params
      }
    }
  })
  .case(fetchArchivedBoards.async.done, state => {
    return { ...state, init: true, isLoading: false }
  })
  .case(setArchivedBoard, (state, params) => {
    return {
      ...state,
      archivedBoards: {
        ...state.archivedBoards,
        [params.id]: params
      }
    }
  })
  .cases([createBoard.async.done], (state, { result }) => {
    return {
      ...state,
      init: true,
      isLoading: false,
      boards: {
        ...state.boards,
        [result.id]: result
      }
    }
  })
  .case(updateBoard.async.done, (state, { result }) => {
    return {
      ...state,
      init: true,
      isLoading: false,
      boards: {
        ...state.boards,
        [result.id]: result
      }
    }
  })
  .cases([archiveBoard.async.done], (state, { result }) => {
    const board = state.boards[result.id]
    const { [result.id]: _, ...newBoards } = state.boards

    return {
      ...state,
      init: true,
      isLoading: false,
      boards: {
        ...newBoards
      },
      archivedBoards: {
        ...state.archivedBoards,
        [result.id]: board
      }
    }
  })
  .cases([restoreBoard.async.done], (state, { result }) => {
    const board = state.boards[result.id]
    const { [result.id]: _, ...newArchivedBoards } = state.archivedBoards

    return {
      ...state,
      init: true,
      isLoading: false,
      boards: {
        ...state.boards,
        [result.id]: board
      },
      archivedBoards: {
        ...newArchivedBoards
      }
    }
  })
  .case(deleteBoard.async.done, (state, { result }) => {
    const { [result]: _, ...newArchivedBoards } = state.archivedBoards

    return {
      ...state,
      init: true,
      isLoading: false,
      archivedBoards: {
        ...newArchivedBoards
      }
    }
  })
