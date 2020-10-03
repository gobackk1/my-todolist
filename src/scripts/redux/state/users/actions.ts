import { actionCreator } from '~redux/action'
import { User } from './reducer'

export const addUser = actionCreator<User>('ADD_USER')
