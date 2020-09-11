import firebase from '@/scripts/firebase'
import { asyncActionCreator, actionCreator } from '~redux/action'
// import * as I from '@/scripts/interfaces'
import { store } from '~redux/store'
import { Board } from '~redux/state/board/reducer'
import { OPTION } from '@/option'

export const fetchBoards = asyncActionCreator<void, void, Error>(
  'FETCH_BOARDS',
  async (params, dispatch) => {
    const { user } = store.getState().user

    if (user && user.uid) {
      const snapshot = await firebase
        .firestore()
        .collection(`users/${user.uid}/boards`)
        .get()

      snapshot.forEach(doc => {
        dispatch(addBoard(doc.data() as Board))
      })
    } else {
      throw new Error(OPTION.MESSAGE.UNAUTHORIZED_OPERATION)
    }
  }
)

// create
// update
// delete

export const addBoard = actionCreator<Board>('ADD_BOARD')
