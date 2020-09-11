import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { fetchBoards, addBoard, createBoard, updateBoard } from './actions'

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
  .case(fetchBoards.async.started, state => {
    return { ...state, boards: [] }
  })
  .cases([createBoard.async.started, updateBoard.async.started], state => {
    return { ...state, isLoading: true }
  })
  .cases(
    [
      fetchBoards.async.failed,
      createBoard.async.failed,
      updateBoard.async.failed
    ],
    (state, { error }) => {
      return { ...state, isLoading: false, error }
    }
  )
  .cases([fetchBoards.async.done, createBoard.async.done], state => {
    return { ...state, isLoading: false }
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
  .case(addBoard, (state, params) => {
    return { ...state, boards: state.boards.concat(params) }
  })
//これはmemo
interface board {
  id: number
  title: string
  lists: [
    {
      boardId: number
      id: number
      title: string
      cards: [
        {
          listId: number
          id: number
          title: string
        }
      ]
    }
  ]
}
