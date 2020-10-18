import { useDispatch } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import { DefaultRootState } from 'react-redux'

type ReduxDispatch = ThunkDispatch<DefaultRootState, any, AnyAction>

export const useTypeSafeDispatch = (): ReduxDispatch => {
  return useDispatch<ReduxDispatch>()
}
