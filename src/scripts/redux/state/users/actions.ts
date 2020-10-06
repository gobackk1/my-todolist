import { actionCreator, asyncActionCreator } from '~redux/action'
import { User } from '~redux/state/currentUser/reducer'
import { callCloudFunctions } from '@/scripts/firebase'

/**
 * uid を渡して、サーバーからユーザーを取得する
 */
const fetchUser = (uid: string) => callCloudFunctions('getUser', { uid })

export const getUser = asyncActionCreator<string, void, Error>(
  'GET_USER',
  async (uid, dispatch) => {
    const response = await fetchUser(uid)

    if (response.result) {
      dispatch(addUser(response.result))
    }
  }
)

export const addUser = actionCreator<User>('ADD_USER')
export const resetUsers = actionCreator('RESET_USERS')
