import { ThunkDispatch } from 'redux-thunk'
import { Action } from 'redux'
import { useDispatch, DefaultRootState } from 'react-redux'

export type ReduxDispatch = ThunkDispatch<DefaultRootState, any, Action>
export const useReduxDispatch = (): ReduxDispatch =>
  useDispatch<ReduxDispatch>()
