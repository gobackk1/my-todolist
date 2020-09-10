import { actionCreatorFactory } from 'typescript-fsa'
import { asyncFactory } from 'typescript-fsa-redux-thunk'

export const actionCreator = actionCreatorFactory()
export const asyncActionCreator = asyncFactory(actionCreator)
