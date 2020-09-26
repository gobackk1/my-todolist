import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { boardReducer } from '~redux/state/board/reducer';
import { userReducer } from '~redux/state/user/reducer';
import { listReducer } from '~redux/state/list/reducer';
import { cardReducer } from '~redux/state/card/reducer';
import { composeWithDevTools } from 'redux-devtools-extension';
var enhancer = process.env.NODE_ENV === 'development'
    ? composeWithDevTools(applyMiddleware(thunk))
    : applyMiddleware(thunk);
var reducers = combineReducers({
    board: boardReducer,
    user: userReducer,
    list: listReducer,
    card: cardReducer
});
export var store = createStore(reducers, enhancer);
