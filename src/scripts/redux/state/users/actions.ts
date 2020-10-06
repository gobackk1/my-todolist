import { actionCreator, asyncActionCreator } from '~redux/action'
import { User } from '~redux/state/currentUser/reducer'
import firebase from 'firebase/app'
import { OPTION } from '@/option'

const { COLLECTION_PATH } = OPTION
const db = firebase.firestore

export const getUser = asyncActionCreator<string, void, Error>(
  'GET_USER',
  async (uid, dispatch) => {
    const snapshot = await db()
      .collection(COLLECTION_PATH.USER_DETAIL_PUBLIC)
      .doc(uid)
      .get()

    const user = snapshot.data() as User
    user.uid = uid

    dispatch(addUser(user))
  }
)

export const addUser = actionCreator<User>('ADD_USER')
export const resetUsers = actionCreator('RESET_USERS')
