import {
  createStore,
  combineReducers,
  applyMiddleware,
  AnyAction,
  Reducer,
  CombinedState
} from 'redux'
import thunk from 'redux-thunk'
import { boardReducer } from '~redux/state/board/reducer'
import { currentUserReducer } from '@/scripts/redux/state/currentUser/reducer'
import { usersReducer } from '~redux/state/users/reducer'
import { listReducer } from '~redux/state/list/reducer'
import { cardReducer } from '~redux/state/card/reducer'
import { composeWithDevTools } from 'redux-devtools-extension'
import { DefaultRootState } from 'react-redux'

const enhancer =
  process.env.NODE_ENV === 'development'
    ? composeWithDevTools(applyMiddleware(thunk))
    : applyMiddleware(thunk)

const reducers: Reducer<
  CombinedState<DefaultRootState>,
  AnyAction
> = combineReducers<DefaultRootState, AnyAction>({
  board: boardReducer,
  currentUser: currentUserReducer,
  list: listReducer,
  card: cardReducer,
  users: usersReducer
})

export const store = createStore(reducers, enhancer)
