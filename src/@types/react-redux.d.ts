import 'react-redux'
import * as I from '@/scripts/model/interface'
import { CurrentUserState } from '@/scripts/redux/state/currentUser/reducer'
import { UsersState } from '~redux/state/users/reducer'
import { BoardState } from '~redux/state/board/reducer'
import { ListState } from '~redux/state/list/reducer'
import { CardState } from '~redux/state/card/reducer'
import { Action, Dispatch } from 'redux'

declare module 'react-redux' {
  interface DefaultRootState {
    currentUser: CurrentUserState
    board: BoardState
    list: ListState
    card: CardState
    users: UsersState
  }

  export function useDispatch<T = ThunkDispatch<I.ReduxState, any, Action>>()
}
