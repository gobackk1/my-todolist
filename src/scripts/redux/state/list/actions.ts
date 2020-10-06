import { asyncActionCreator, actionCreator } from '~redux/action'
import { store } from '~redux/store'
import firebase from 'firebase/app'
import { OPTION } from '@/option'
import { List } from './reducer'
import { CurrentUserState } from '@/scripts/redux/state/currentUser/reducer'
import { setCards } from '~redux/state/card/actions'

export const fetchList = asyncActionCreator<
  Pick<List, 'boardId'>,
  List[][],
  Error
>('FETCH_LIST', async ({ boardId }, dispatch) => {
  const { user }: CurrentUserState = store.getState().currentUser
  let lists: List[] = []
  let archivedLists: List[] = []

  if (user && user.uid) {
    try {
      const [listsReference, archivedListsReference] = await Promise.all([
        firebase.firestore().collection(`users/${user.uid}/lists`),
        firebase.firestore().collection(`users/${user.uid}/archivedLists`)
      ])

      const [snapshot, archivedSnapshot] = await Promise.all([
        listsReference.where('boardId', '==', boardId).get(),
        archivedListsReference.where('boardId', '==', boardId).get()
      ])

      if (snapshot.empty) lists = []
      if (archivedSnapshot.empty) archivedLists = []
      snapshot.forEach(doc => {
        const { id } = doc
        const { title } = doc.data()
        lists.push({ boardId, id, title })
      })
      archivedSnapshot.forEach(doc => {
        const { id } = doc
        const { title, cards } = doc.data()
        dispatch(setCards({ listId: id, cards }))
        archivedLists.push({ boardId, id, title })
      })

      const results = await Promise.all(
        (() => {
          const cardQueries = lists.map(list => {
            return firebase
              .firestore()
              .collection(`users/${user.uid}/lists/${list.id}/cards`)
              .get()
          })
          return cardQueries
        })()
      )
      results.forEach(snapshot => {
        snapshot.forEach(doc => {
          const { id } = doc
          const { listId, title } = doc.data()
          dispatch(setCards({ listId, card: { title, id } }))
        })
      })

      // アーカイブリストのカードはどうする？
    } catch (e) {
      console.log('FETCH_LIST', e)
      throw new Error(OPTION.MESSAGE.SERVER_CONNECTION_ERROR)
    }

    return [lists, archivedLists]
  } else {
    throw new Error(OPTION.MESSAGE.UNAUTHORIZED_OPERATION)
  }
})

export const fetchArchivedList = asyncActionCreator<
  Pick<List, 'boardId'>,
  List[][],
  Error
>('FETCH_ARCHIVED_LIST', async ({ boardId }) => {
  const { user }: CurrentUserState = store.getState().currentUser
  let lists: List[] = []

  if (user && user.uid) {
    try {
      const listsReference = await firebase
        .firestore()
        .collection(`users/${user.uid}/archivedLists`)

      const snapshot = await listsReference
        .where('boardId', '==', boardId)
        .get()

      if (snapshot.empty) lists = []

      snapshot.forEach(doc => {
        const { id } = doc
        const { title, boardId } = doc.data()
        lists.push({ id, title, boardId })
      })
    } catch (e) {
      throw new Error(OPTION.MESSAGE.SERVER_CONNECTION_ERROR)
    }

    return [lists]
  } else {
    throw new Error(OPTION.MESSAGE.UNAUTHORIZED_OPERATION)
  }
})

export const createList = asyncActionCreator<
  Pick<List, 'title'> & { boardId: string },
  List,
  Error
>('CREATE_LIST', async params => {
  const { user }: CurrentUserState = store.getState().currentUser

  if (user && user.uid) {
    try {
      const { id }: firebase.firestore.DocumentReference = await firebase
        .firestore()
        .collection(`users/${user.uid}/lists`)
        .add({ ...params })
      // dispatch(setCardList(id))
      return { ...params, id }
    } catch (e) {
      console.log('CREATE_LIST', e)
      throw new Error(OPTION.MESSAGE.SERVER_CONNECTION_ERROR)
    }
  } else {
    throw new Error(OPTION.MESSAGE.UNAUTHORIZED_OPERATION)
  }
})

export const archiveList = asyncActionCreator<List, List | undefined, Error>(
  'ARCHIVE_LIST',
  async list => {
    const { user }: CurrentUserState = store.getState().currentUser

    if (!(user && user.uid)) {
      throw new Error(OPTION.MESSAGE.UNAUTHORIZED_OPERATION)
    }

    try {
      const documentReference = await firebase
        .firestore()
        .collection(`users/${user.uid}/lists/`)
        .doc(list.id)
      const doc = await documentReference.get()
      const archivedList = doc.data()
      if (!archivedList || !user) return

      await Promise.all([
        firebase
          .firestore()
          .collection(`users/${user.uid}/archivedLists/`)
          .doc(list.id)
          .set(archivedList),
        await documentReference.delete()
      ])
    } catch (e) {
      throw new Error(OPTION.MESSAGE.SERVER_CONNECTION_ERROR)
    }

    return list
  }
)

export const restoreList = asyncActionCreator<
  Pick<List, 'id' | 'boardId'>,
  Pick<List, 'id' | 'boardId'>,
  Error
>('RESTORE_LIST', async ({ id, boardId }) => {
  const { user }: CurrentUserState = store.getState().currentUser

  if (user && user.uid) {
    let documentReference: firebase.firestore.DocumentReference

    // NOTE: まずリファレンスを取得する
    try {
      documentReference = await firebase
        .firestore()
        .collection(`users/${user.uid}/archivedLists/`)
        .doc(id)
    } catch (e) {
      throw new Error(OPTION.MESSAGE.SERVER_CONNECTION_ERROR)
    }

    /**
     * リファレンス取得後、
     * 1. document 読み取り
     * 2. archivedBoards collection に追加
     * 3. boards から削除
     */
    try {
      await firebase.firestore().runTransaction(async t => {
        const doc = await t.get(documentReference)
        const archivedList = doc.data()
        if (!archivedList || !user) return

        await firebase
          .firestore()
          .collection(`users/${user.uid}/lists/`)
          .doc(id)
          .set(archivedList)

        await documentReference.delete()
      })

      return { id, boardId }
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
  const { user }: CurrentUserState = store.getState().currentUser

  if (user && user.uid) {
    try {
      await firebase
        .firestore()
        .collection(`users/${user.uid}/archivedLists`)
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

export const updateList = asyncActionCreator<
  Pick<List, 'title' | 'id' | 'boardId'>,
  Pick<List, 'title' | 'id' | 'boardId'>,
  Error
>('UPDATE_LIST', async ({ id, title, boardId }) => {
  const { user }: CurrentUserState = store.getState().currentUser

  if (user && user.uid) {
    try {
      const documentReference = await firebase
        .firestore()
        .collection(`users/${user.uid}/lists`)
        .doc(id)

      documentReference.set({ title }, { merge: true })
      return { id, title, boardId }
    } catch (e) {
      throw new Error(OPTION.MESSAGE.SERVER_CONNECTION_ERROR)
    }
  } else {
    throw new Error(OPTION.MESSAGE.UNAUTHORIZED_OPERATION)
  }
})

export const moveToList = actionCreator<List>('MOVE_TO_LIST')
export const moveToArchivedList = actionCreator<List>('MOVE_TO_ARCHIVED_LIST')
