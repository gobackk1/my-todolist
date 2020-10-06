import { ThunkDispatch } from 'redux-thunk'
import { Action } from 'redux'
import { useDispatch } from 'react-redux'
import * as I from '@/scripts/model/interface'

export type ReduxDispatch = ThunkDispatch<I.ReduxState, any, Action>
export const useReduxDispatch = (): ReduxDispatch =>
  useDispatch<ReduxDispatch>()
