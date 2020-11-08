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
  changeFavoriteRelations
} from './actions'
import { User } from '@/scripts/model/interface'
import { store } from '~redux/store'

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
  snapshots: BoardState[]
  getBackgroundStyle: (id: string) => React.CSSProperties
  getBoardsByUid: (uid: ValueOf<User, 'uid'> | null) => Board[]
}

function getBackgroundStyle(this: BoardState, boardId: ValueOf<Board, 'id'>): React.CSSProperties {
  const backgroundImage = this.boards[boardId] ? this.boards[boardId].backgroundImage : null
  if (!backgroundImage) return {} as React.CSSProperties
  const hexColorRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/
  return hexColorRegex.test(backgroundImage)
    ? { backgroundColor: backgroundImage }
    : { backgroundImage: `url(${backgroundImage})` }
}

function getBoardsByUid(this: BoardState, uid: ValueOf<User, 'uid'> | null): Board[] {
  const boards = this.boards
  if (uid === null) {
    const { user } = store.getState().currentUser
    return (user && Object.values(boards).filter(board => board.author !== user.uid)) || []
  }
  return Object.values(boards).filter(board => board.author === uid)
}

export const initialState: BoardState = {
  init: false,
  isLoading: false,
  error: null,
  boards: {},
  archivedBoards: {},
  snapshots: [],
  getBackgroundStyle,
  getBoardsByUid
}

export const boardReducer = reducerWithInitialState(initialState)
  .case(fetchBoards.async.started, state => ({ ...state, isLoading: true }))
  .case(fetchBoards.async.failed, state => ({ ...state, isLoading: false }))
  .case(fetchBoards.async.done, state => ({ ...state, init: true, isLoading: false }))
  .case(fetchArchivedBoards.async.started, state => ({ ...state, isLoading: true }))
  .case(fetchArchivedBoards.async.failed, state => ({ ...state, isLoading: false }))
  .case(fetchArchivedBoards.async.done, state => ({
    ...state,
    init: true,
    isLoading: false
  }))
  .case(fetchBoard.async.started, state => ({ ...state, isLoading: true }))
  .case(fetchBoard.async.failed, state => ({ ...state, isLoading: false }))
  .case(fetchBoard.async.done, state => ({ ...state, init: true, isLoading: false }))
  .case(createBoard.async.started, state => ({ ...state, isLoading: true }))
  .case(createBoard.async.failed, state => ({ ...state, isLoading: false }))
  .case(createBoard.async.done, state => ({ ...state, isLoading: false }))
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
    return { ...state.snapshots.slice(-1)[0] }
  })
  .case(updateBoard.async.done, state => ({ ...state, init: true, isLoading: false }))
  .case(deleteBoard.async.started, state => ({ ...state, isLoading: true }))
  .case(deleteBoard.async.failed, state => ({ ...state, isLoading: false }))
  .case(deleteBoard.async.done, (state, { result }) => {
    // TODO: より良い方法があれば
    /* eslint-disable-next-line */
    const { [result]: _, ...withoutResult } = state.archivedBoards
    return {
      ...state,
      init: true,
      isLoading: false,
      archivedBoards: {
        ...withoutResult
      }
    }
  })
  .case(archiveBoard.async.started, state => ({ ...state, isLoading: true }))
  .case(archiveBoard.async.failed, state => ({ ...state, isLoading: false }))
  .case(archiveBoard.async.done, (state, { result }) => {
    const board = state.boards[result.id]
    // TODO: より良い方法があれば
    /* eslint-disable-next-line */
    const { [result.id]: _, ...withoutResult } = state.boards
    return {
      ...state,
      init: true,
      isLoading: false,
      boards: {
        ...withoutResult
      },
      archivedBoards: {
        ...state.archivedBoards,
        [result.id]: board
      }
    }
  })
  .case(restoreBoard.async.started, state => ({ ...state, isLoading: true }))
  .case(restoreBoard.async.failed, state => ({ ...state, isLoading: false }))
  .case(restoreBoard.async.done, (state, { result }) => {
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
  .case(deleteBoardMember.async.started, state => ({ ...state, isLoading: true }))
  .case(deleteBoardMember.async.failed, state => ({ ...state, isLoading: false }))
  .case(deleteBoardMember.async.done, state => ({ ...state, isLoading: false }))
  .case(changeFavoriteRelations.async.started, state => ({ ...state, isLoading: true }))
  .case(changeFavoriteRelations.async.failed, state => ({ ...state, isLoading: false }))
  .case(changeFavoriteRelations.async.done, state => ({ ...state, isLoading: false }))
  .case(setBoard, (state, params) => ({
    ...state,
    boards: {
      ...state.boards,
      [params.id]: params
    }
  }))
  .case(setArchivedBoard, (state, params) => ({
    ...state,
    archivedBoards: {
      ...state.archivedBoards,
      [params.id]: params
    }
  }))
  .case(resetBoard, () => ({ ...initialState }))
