import { reducerWithInitialState } from 'typescript-fsa-reducers'
import {
  fetchBoards,
  createBoard,
  updateBoard,
  deleteBoard,
  archiveBoard,
  fetchArchivedBoards,
  restoreBoard
} from './actions'

export interface Board {
  id: string
  title: string
  list: any[]
}
export interface BoardState {
  isLoading: boolean
  error: Error | null
  boards: Board[]
  archivedBoards: Board[]
}

const initialState: BoardState = {
  isLoading: false,
  error: null,
  boards: [] as Board[],
  archivedBoards: [] as Board[]
}

export const boardReducer = reducerWithInitialState(initialState)
  /**
   * async.started
   */
  .case(fetchBoards.async.started, state => {
    return { ...state, isLoading: true, boards: [] }
  })
  .case(fetchArchivedBoards.async.started, state => {
    return { ...state, isLoading: true, archivedBoards: [] }
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
  .case(fetchBoards.async.done, (state, { result }) => {
    return { ...state, isLoading: false, boards: result }
  })
  .case(fetchArchivedBoards.async.done, (state, { result }) => {
    return { ...state, isLoading: false, archivedBoards: result }
  })
  .cases([createBoard.async.done], (state, { result }) => {
    return {
      ...state,
      isLoading: false,
      boards: state.boards.concat(result)
    }
  })
  .case(updateBoard.async.done, (state, { result }) => {
    const index = state.boards.findIndex(board => board.id === result.id)
    return {
      ...state,
      isLoading: false,
      boards: [
        ...state.boards.slice(0, index),
        result,
        ...state.boards.slice(index + 1)
      ]
    }
  })
  .cases([archiveBoard.async.done], (state, { result }) => {
    const index = state.boards.findIndex(board => board.id === result)
    return {
      ...state,
      isLoading: false,
      boards: [
        ...state.boards.slice(0, index),
        ...state.boards.slice(index + 1)
      ],
      archivedBoards: [...state.archivedBoards.concat(state.boards[index])]
    }
  })
  .cases([restoreBoard.async.done], (state, { result }) => {
    const index = state.archivedBoards.findIndex(board => board.id === result)
    return {
      ...state,
      isLoading: false,
      boards: [...state.boards.concat(state.archivedBoards[index])],
      archivedBoards: [
        ...state.archivedBoards.slice(0, index),
        ...state.archivedBoards.slice(index + 1)
      ]
    }
  })
  .case(deleteBoard.async.done, (state, { result }) => {
    const index = state.archivedBoards.findIndex(board => board.id === result)
    return {
      ...state,
      isLoading: false,
      archivedBoards: [
        ...state.archivedBoards.slice(0, index),
        ...state.archivedBoards.slice(index + 1)
      ]
    }
  })
