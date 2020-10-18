import { actionCreator, asyncActionCreator } from '~redux/action'
import { User } from '@/scripts/model/interface'
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

    dispatch(setUser(user))
  }
)

export const updateUser = asyncActionCreator<User, void, Error>(
  'UPDATE_USER',
  async (user, dispatch) => {
    await db()
      .collection(COLLECTION_PATH.USER_DETAIL_PUBLIC)
      .doc(user.uid)
      .set({ ...user }, { merge: true })

    dispatch(setUser(user))
  }
)

export const setUser = actionCreator<User>('SET_USER')
export const resetUsers = actionCreator('RESET_USERS')
