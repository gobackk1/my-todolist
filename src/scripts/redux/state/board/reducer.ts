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
  fetchBoard,
  deleteBoardMember,
  resetBoard,
  changeFavoriteRelations,
  updateBoardInState
} from './actions'

export type BoardRole = 'owner' | 'editor' | 'reader'
export type BoardVisibility = 'public' | 'members'
export interface Member {
  // userRef: firebase.firestore.DocumentReference
  role: BoardRole
}

export interface Board {
  id: string
  author: string
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
  snapshots: BoardState[]
}

function getBackgroundStyle(this: BoardState, boardId: ValueOf<Board, 'id'>): React.CSSProperties {
  const backgroundImage = this.boards[boardId] ? this.boards[boardId].backgroundImage : null
  if (!backgroundImage) return {} as React.CSSProperties
  const hexColorRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/
  return hexColorRegex.test(backgroundImage)
    ? { backgroundColor: backgroundImage }
    : { backgroundImage: `url(${backgroundImage})` }
}

export const initialState: BoardState = {
  init: false,
  isLoading: false,
  error: null,
  boards: {},
  archivedBoards: {},
  getBackgroundStyle,
  snapshots: []
}

export const boardReducer = reducerWithInitialState(initialState)
  /**
   * async.started
   */
  .cases(
    [
      fetchBoards.async.started,
      fetchBoard.async.started,
      fetchArchivedBoards.async.started,
      changeFavoriteRelations.async.started
    ],
    state => ({ ...state, isLoading: true })
  )
  .cases([restoreBoard.async.started, createBoard.async.started], state => ({
    ...state,
    isLoading: true
  }))
  .cases(
    [
      updateBoard.async.started,
      deleteBoard.async.started,
      archiveBoard.async.started,
      deleteBoardMember.async.started
    ],
    state => ({ ...state, isLoading: true })
  )

  .case(updateBoard.async.started, (state, params) => {
    return {
      ...state,
      isLoading: true,
      boards: {
        ...state.boards,
        [params.id]: params
      },
      snapshots: state.snapshots.concat(state)
    }
  })
  .case(updateBoard.async.failed, state => {
    return { ...state.snapshots[0] }
  })
  .case(updateBoard.async.done, state => ({ ...state, init: true, isLoading: false }))

  /**
   * async.failed
   */
  .cases(
    [
      fetchBoards.async.failed,
      fetchArchivedBoards.async.failed,
      fetchBoard.async.failed,
      deleteBoardMember.async.failed
    ],
    (state, { error }) => ({ ...state, isLoading: false, error })
  )
  .cases(
    [
      createBoard.async.failed,
      updateBoard.async.failed,
      deleteBoard.async.failed,
      archiveBoard.async.failed
    ],
    (state, { error }) => ({ ...state, isLoading: false, error })
  )
  .cases([restoreBoard.async.failed, changeFavoriteRelations.async.failed], (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  }))

  /**
   * async.done
   */
  .cases([fetchBoards.async.done, fetchBoard.async.done, deleteBoardMember.async.done], state => ({
    ...state,
    init: true,
    isLoading: false
  }))
  .cases([createBoard.async.done, changeFavoriteRelations.async.done], state => ({
    ...state,
    init: true,
    isLoading: false
  }))
  .case(fetchArchivedBoards.async.done, state => ({
    ...state,
    init: true,
    isLoading: false
  }))
  .case(setArchivedBoard, (state, params) => ({
    ...state,
    archivedBoards: {
      ...state.archivedBoards,
      [params.id]: params
    }
  }))
  .cases([archiveBoard.async.done], (state, { result }) => {
    const board = state.boards[result.id]
    /* eslint-disable-next-line */
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
    /* eslint-disable-next-line */
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
    /* eslint-disable-next-line */
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

  .case(setBoard, (state, params) => ({
    ...state,
    boards: {
      ...state.boards,
      [params.id]: params
    }
  }))
  .case(resetBoard, () => ({ ...initialState }))
  .case(updateBoardInState, (state, params) => ({
    ...state,
    init: true,
    isLoading: false,
    boards: {
      ...state.boards,
      [params.id]: params
    }
  }))
