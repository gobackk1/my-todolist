import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { boardReducer } from '~redux/state/board/reducer'
import { userReducer } from '~redux/state/user/reducer'
import { usersReducer } from '~redux/state/users/reducer'
import { listReducer } from '~redux/state/list/reducer'
import { cardReducer } from '~redux/state/card/reducer'
import { composeWithDevTools } from 'redux-devtools-extension'

const enhancer =
  process.env.NODE_ENV === 'development'
    ? composeWithDevTools(applyMiddleware(thunk))
    : applyMiddleware(thunk)

const reducers = combineReducers({
  board: boardReducer,
  user: userReducer,
  list: listReducer,
  card: cardReducer,
  users: usersReducer
})

export const store = createStore(reducers, enhancer)
