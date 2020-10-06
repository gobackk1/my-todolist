import { actionCreator, asyncActionCreator } from '~redux/action'
import { User } from '@/scripts/redux/state/currentUser/reducer'
import { addUser } from '~redux/state/users/actions'
import firebase from 'firebase/app'
import { OPTION } from '@/option'

const { COLLECTION_PATH } = OPTION
const db = firebase.firestore

export const setLoginUser = actionCreator<User | null>('SET_LOGIN_USER')
export const setLoggingIn = actionCreator<boolean>('SET_LOGGING_IN')

export const getUser = asyncActionCreator<string, void, Error>(
  'GET_USER',
  async (uid, dispatch) => {
    const snapshot = await db()
      .collection(COLLECTION_PATH.USER_DETAIL_PUBLIC)
      .doc(uid)
      .get()

    const user = snapshot.data() as User
    dispatch(setLoginUser(user))
    dispatch(addUser(user))
  }
)
