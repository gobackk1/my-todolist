import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { boardReducer } from '~redux/state/board/reducer'
import { userReducer } from '~redux/state/user/reducer'
import { composeWithDevTools } from 'redux-devtools-extension'
import * as I from '@/scripts/interfaces'

const enhancer =
  process.env.NODE_ENV === 'development'
    ? composeWithDevTools(applyMiddleware(thunk))
    : applyMiddleware(thunk)

const reducers = combineReducers<I.ReduxState>({
  board: boardReducer,
  user: userReducer
})

export const store = createStore(reducers, enhancer)
