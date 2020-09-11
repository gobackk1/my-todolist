import firebase from '@/scripts/firebase'
import { asyncActionCreator, actionCreator } from '~redux/action'
// import * as I from '@/scripts/interfaces'
import { store } from '~redux/store'
import { Board } from '~redux/state/board/reducer'
import { OPTION } from '@/option'

/**
 * サーバーからボードを取得する
 * state.boards をクリアしてから、新しく取得したボードを state.boards 割り当てる
 */
export const fetchBoards = asyncActionCreator<void, void, Error>(
  'FETCH_BOARDS',
  async (params, dispatch) => {
    const { user } = store.getState().user

    if (user && user.uid) {
      try {
        const snapshot = await firebase
          .firestore()
          .collection(`users/${user.uid}/boards`)
          .get()

        snapshot.forEach(doc => {
          const { id } = doc
          const { title } = doc.data()

          dispatch(addBoard({ id, title, list: [] }))
        })
      } catch (e) {
        throw new Error(OPTION.MESSAGE.SERVER_CONNECTION_ERROR)
      }
    } else {
      throw new Error(OPTION.MESSAGE.UNAUTHORIZED_OPERATION)
    }
  }
)

/**
 * ボードを新規作成する
 */
export const createBoard = asyncActionCreator<Pick<Board, 'title'>, any, Error>(
  'CREATE_BOARD',
  async ({ title }, dispatch) => {
    const { user } = store.getState().user

    if (user && user.uid) {
      try {
        const { id } = await firebase
          .firestore()
          .collection(`users/${user.uid}/boards`)
          .add({ title })

        dispatch(addBoard({ title, id, list: [] }))
      } catch (e) {
        throw new Error(OPTION.MESSAGE.SERVER_CONNECTION_ERROR)
      }
    } else {
      throw new Error(OPTION.MESSAGE.UNAUTHORIZED_OPERATION)
    }
  }
)

/**
 * ボードをアップデートする
 */
export const updateBoard = asyncActionCreator<
  Pick<Board, 'title' | 'id'>,
  any,
  Error
>('UPDATE_BOARD', async ({ id, title }, dispatch) => {
  const { user } = store.getState().user
  if (user && user.uid) {
    let board
    try {
      const documentReference: any = await firebase
        .firestore()
        .collection(`users/${user.uid}/boards`)
        .doc(id)

      documentReference.set({ title }, { merge: true })
      board = await documentReference.get()
      //リストは board.data().list で
      console.log(board.data(), 'board')
      return { id, title }
    } catch (e) {
      throw new Error(OPTION.MESSAGE.SERVER_CONNECTION_ERROR)
    }
  } else {
    throw new Error(OPTION.MESSAGE.UNAUTHORIZED_OPERATION)
  }
})
// delete

export const addBoard = actionCreator<Board>('ADD_BOARD')
