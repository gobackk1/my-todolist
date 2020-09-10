import { UserState } from '~redux/state/user/reducer'
import { BoardState } from '~redux/state/board/reducer'

export interface ReduxState {
  user: UserState
  board: BoardState
}
