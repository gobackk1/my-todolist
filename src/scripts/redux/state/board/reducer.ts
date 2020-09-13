import { reducerWithInitialState } from 'typescript-fsa-reducers'
import {
  fetchBoards,
  createBoard,
  updateBoard,
  deleteBoard,
  archiveBoard
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
}

const initialState: BoardState = {
  isLoading: false,
  error: null,
  boards: [] as Board[]
}

export const boardReducer = reducerWithInitialState(initialState)
  /**
   * async.started
   */
  .case(fetchBoards.async.started, state => {
    return { ...state, isLoading: true, boards: [] }
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
  .case(fetchBoards.async.failed, (state, { error }) => {
    return { ...state, isLoading: false, error }
  })
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

  /**
   * async.done
   */
  .case(fetchBoards.async.done, (state, { result }) => {
    return { ...state, isLoading: false, boards: result }
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
  .cases(
    [deleteBoard.async.done, archiveBoard.async.done],
    (state, { result }) => {
      const index = state.boards.findIndex(board => board.id === result)
      return {
        ...state,
        isLoading: false,
        boards: [
          ...state.boards.slice(0, index),
          ...state.boards.slice(index + 1)
        ]
      }
    }
  )
