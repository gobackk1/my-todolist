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
  setArchivedBoard,
  fetchBoard
} from './actions'

export type BoardRole = 'owner' | 'editor' | 'reader'
export type BoardVisibility = 'public' | 'members'
export interface Member {
  // userRef: firebase.firestore.DocumentReference
  role: BoardRole
}

export interface Board {
  id: string
  title: string
  backgroundImage: string
  favorite: boolean
  visibility: BoardVisibility
  members: {
    [i: string]: Member
  }
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
  getBackgroundStyle: (id: string) => React.CSSProperties
}

export const initialState: BoardState = {
  init: false,
  isLoading: false,
  error: null,
  boards: {},
  archivedBoards: {},
  getBackgroundStyle(boardId) {
    const backgroundImage = this.boards[boardId]
      ? this.boards[boardId].backgroundImage
      : null
    if (!backgroundImage) return {} as React.CSSProperties
    const hexColorRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/
    return hexColorRegex.test(backgroundImage)
      ? { backgroundColor: backgroundImage }
      : { backgroundImage: `url(${backgroundImage})` }
  }
}
export const boardReducer = reducerWithInitialState(initialState)
  /**
   * async.started
   */
  .cases(
    [
      fetchBoards.async.started,
      fetchBoard.async.started,
      fetchArchivedBoards.async.started
    ],
    state => {
      return { ...state, isLoading: true }
    }
  )
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
    [
      fetchBoards.async.failed,
      fetchArchivedBoards.async.failed,
      fetchBoard.async.failed
    ],
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
  .cases(
    [
      fetchBoards.async.done,
      createBoard.async.done,
      fetchBoard.async.done,
      updateBoard.async.done
    ],
    state => {
      return { ...state, init: true, isLoading: false }
    }
  )
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
    const board = state.archivedBoards[result.id]
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
