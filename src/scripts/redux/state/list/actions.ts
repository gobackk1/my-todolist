import { asyncActionCreator } from '~redux/action'
import { store } from '~redux/store'
import firebase from '@/scripts/firebase'
import { OPTION } from '@/option'
import { List } from './reducer'
import { UserState } from '~redux/state/user/reducer'

export const fetchList = asyncActionCreator<{ boardId: string }, any, Error>(
  'FETCH_LIST',
  async ({ boardId }) => {
    const { user }: UserState = store.getState().user
    let lists: any[] = []

    if (user && user.uid) {
      try {
        const listsReference = await firebase
          .firestore()
          .collection(`users/${user.uid}/lists`)

        const snapshot = await listsReference
          .where('boardId', '==', boardId)
          .get()

        if (snapshot.empty) lists = []

        snapshot.forEach(doc => {
          const { id } = doc
          const { title } = doc.data()

          lists.push({ boardId, id, title, cards: [] })
        })
      } catch (e) {
        throw new Error(OPTION.MESSAGE.SERVER_CONNECTION_ERROR)
      }

      return lists
    } else {
      throw new Error(OPTION.MESSAGE.UNAUTHORIZED_OPERATION)
    }
  }
)

export const createList = asyncActionCreator<
  Pick<List, 'title'> & { boardId: string },
  List,
  Error
>('CREATE_LIST', async params => {
  const { user }: UserState = store.getState().user

  if (user && user.uid) {
    try {
      const { id }: firebase.firestore.DocumentReference = await firebase
        .firestore()
        .collection(`users/${user.uid}/lists`)
        .add({ ...params })

      return { ...params, id, cards: [] }
    } catch (e) {
      throw new Error(OPTION.MESSAGE.SERVER_CONNECTION_ERROR)
    }
  } else {
    throw new Error(OPTION.MESSAGE.UNAUTHORIZED_OPERATION)
  }
})

export const deleteList = asyncActionCreator<
  Pick<List, 'id'> & { boardId: string },
  Pick<List, 'id'> & { boardId: string },
  Error
>('DELETE_LIST', async ({ id, boardId }) => {
  const { user }: UserState = store.getState().user

  if (user && user.uid) {
    try {
      await firebase
        .firestore()
        .collection(`users/${user.uid}/lists`)
        .doc(id)
        .delete()

      return { id, boardId }
    } catch (e) {
      throw new Error(OPTION.MESSAGE.SERVER_CONNECTION_ERROR)
    }
  } else {
    throw new Error(OPTION.MESSAGE.UNAUTHORIZED_OPERATION)
  }
})
