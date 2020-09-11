import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { fetchBoards, addBoard } from './actions'

export interface Board {
  id: number
  title: string
  lists: any[]
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
    return { ...state, isLoading: true }
  })
  .case(fetchBoards.async.failed, (state, { error }) => {
    return { ...state, isLoading: false, error }
  })
  .case(fetchBoards.async.done, state => {
    return { ...state, isLoading: false }
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
