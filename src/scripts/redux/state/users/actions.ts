import { actionCreator } from '~redux/action'
import firebase from 'firebase'

export const addUser = actionCreator<firebase.User>('ADD_USER')
