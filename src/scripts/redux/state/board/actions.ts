import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import firebase from '@/scripts/firebase'

const SET_TITLE = 'SET_TITLE'

interface SetTitleAction {
  type: typeof SET_TITLE
  payload: string
}

type BoardActionTypes = SetTitleAction

export const setTitle = (newTitle: string): BoardActionTypes => {
  console.log('setTitle')
  return {
    type: SET_TITLE,
    payload: newTitle
  }
}

export const asyncSetTitle = (
  message: string
): ThunkAction<void, any, unknown, Action<string>> => async (
  dispatch,
  test,
  test1
) => {
  console.log(test, test1)
  // const response = await firebase.firestore().collection(`users/${}`)
  // dispatch(setTitle(response.data))
}

interface BoardState {
  title: string
}

const initialState: BoardState = {
  title: 'initial'
}

export const boardReducer = (
  state = initialState,
  action: BoardActionTypes
): BoardState => {
  console.log('boardReducer')
  switch (action.type) {
    case SET_TITLE:
      return { ...state, title: action.payload }
    default:
      return state
  }
}
