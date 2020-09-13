import { actionCreatorFactory } from 'typescript-fsa'
import { asyncFactory } from 'typescript-fsa-redux-thunk'

/**
 * 各アクションで利用するファクトリメソッド
 */
export const actionCreator = actionCreatorFactory()
export const asyncActionCreator = asyncFactory(actionCreator)
