import { UserState } from '~redux/state/user/reducer'
import { BoardState } from '~redux/state/board/reducer'
import { ListState } from '~redux/state/list/reducer'

export interface ReduxState {
  user: UserState
  board: BoardState
  list: ListState
}
