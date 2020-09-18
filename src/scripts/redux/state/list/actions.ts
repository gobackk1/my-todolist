import { asyncActionCreator } from '~redux/action'
import { store } from '~redux/store'
import firebase from '@/scripts/firebase'
import { OPTION } from '@/option'
import { List } from './reducer'
import { UserState } from '~redux/state/user/reducer'

export const fetchList = asyncActionCreator<
  Pick<List, 'boardId'>,
  List[][],
  Error
>('FETCH_LIST', async ({ boardId }) => {
  const { user }: UserState = store.getState().user
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
        const { title } = doc.data()
        archivedLists.push({ boardId, id, title })
      })
    } catch (e) {
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
  const { user }: UserState = store.getState().user
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
  const { user }: UserState = store.getState().user

  if (user && user.uid) {
    try {
      const { id }: firebase.firestore.DocumentReference = await firebase
        .firestore()
        .collection(`users/${user.uid}/lists`)
        .add({ ...params })

      return { ...params, id }
    } catch (e) {
      throw new Error(OPTION.MESSAGE.SERVER_CONNECTION_ERROR)
    }
  } else {
    throw new Error(OPTION.MESSAGE.UNAUTHORIZED_OPERATION)
  }
})

export const archiveList = asyncActionCreator<
  Pick<List, 'id'> & { boardId: string },
  Pick<List, 'id'> & { boardId: string },
  Error
>('ARCHIVE_LIST', async ({ id, boardId }) => {
  const { user }: UserState = store.getState().user

  if (user && user.uid) {
    let documentReference: firebase.firestore.DocumentReference

    // NOTE: まずリファレンスを取得する
    try {
      documentReference = await firebase
        .firestore()
        .collection(`users/${user.uid}/lists/`)
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
          .collection(`users/${user.uid}/archivedLists/`)
          .add(archivedList)

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

export const restoreList = asyncActionCreator<
  Pick<List, 'id'> & { boardId: string },
  Pick<List, 'id'> & { boardId: string },
  Error
>('RESTORE_LIST', async ({ id, boardId }) => {
  const { user }: UserState = store.getState().user

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
          .add(archivedList)

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
