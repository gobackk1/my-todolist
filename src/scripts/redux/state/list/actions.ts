import { asyncActionCreator, actionCreator } from '~redux/action'
import { store } from '~redux/store'
import firebase from 'firebase/app'
import { OPTION } from '@/option'
import { List } from './reducer'
import { CurrentUserState } from '@/scripts/redux/state/currentUser/reducer'
import { setCards } from '~redux/state/card/actions'

export const fetchList = asyncActionCreator<Pick<List, 'boardId'>, List[][], Error>(
  'FETCH_LIST',
  async ({ boardId }, dispatch) => {
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
          const list = doc.data() as Omit<List, 'id'>
          lists.push({ id, ...list })
        })
        archivedSnapshot.forEach(doc => {
          const { id } = doc
          const list = doc.data() as Omit<List, 'id'>
          // dispatch(setCards({ listId: id, cards }))
          archivedLists.push({ id, ...list })
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
            dispatch(setCards({ listId, card: { title, id, listId } }))
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
  }
)

export const fetchArchivedList = asyncActionCreator<Pick<List, 'boardId'>, List[][], Error>(
  'FETCH_ARCHIVED_LIST',
  async ({ boardId }) => {
    const { user }: CurrentUserState = store.getState().currentUser
    let lists: List[] = []

    if (user && user.uid) {
      try {
        const listsReference = await firebase
          .firestore()
          .collection(`users/${user.uid}/archivedLists`)

        const snapshot = await listsReference.where('boardId', '==', boardId).get()

        if (snapshot.empty) lists = []

        snapshot.forEach(doc => {
          const { id } = doc
          const list = doc.data() as Omit<List, 'id'>
          lists.push({ id, ...list })
        })
      } catch (e) {
        throw new Error(OPTION.MESSAGE.SERVER_CONNECTION_ERROR)
      }

      return [lists]
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
  const { user }: CurrentUserState = store.getState().currentUser
  const boards = store.getState().list.boards[params.boardId]
  const sortOrder: number = boards.lists.length

  if (!user) throw new Error(OPTION.MESSAGE.UNAUTHORIZED_OPERATION)

  try {
    const ref: firebase.firestore.DocumentReference = await firebase
      .firestore()
      .collection(`users/${user.uid}/lists`)
      .add({ ...params, sortOrder })
    // dispatch(setCardList(id))
    return { ...params, id: ref.id, sortOrder }
  } catch (e) {
    console.log('CREATE_LIST', e)
    throw new Error(OPTION.MESSAGE.SERVER_CONNECTION_ERROR)
  }
})

export const archiveList = asyncActionCreator<List, [List, List[]], Error>(
  'ARCHIVE_LIST',
  async targetList => {
    const { user }: CurrentUserState = store.getState().currentUser
    const { lists } = store.getState().list.boards[targetList.boardId]

    if (!user) throw new Error(OPTION.MESSAGE.UNAUTHORIZED_OPERATION)

    /**
     * NOTE: アーカイブによって発生するsortOrderの隙間を埋める
     * 0,2,3,4 → 0,1,2,3
     */
    const resortOrderLists: List[] = lists
      .filter(list => list.id !== targetList.id)
      .map((l, i) => {
        l.sortOrder = i
        return l
      })

    const fromRef = await firebase
      .firestore()
      .collection(`users/${user.uid}/lists/`)
      .doc(targetList.id)

    const toRef = await firebase
      .firestore()
      .collection(`users/${user.uid}/archivedLists/`)
      .doc(targetList.id)

    /**
     * FIXME: トランザクション内でクエリができないので、
     * 1.トランザクション外でクエリ
     * 2.トランザクション内で querySnapshot 内の ref を再び t.get() する
     * この方法は読み取りが余分に発生してしまうし、これが正しいやり方かは分からない
     */
    const querySnapshot = await firebase
      .firestore()
      .collection(`users/${user.uid}/lists/`)
      .where('boardId', '==', targetList.boardId)
      .get()

    await firebase.firestore().runTransaction(async t => {
      const operations: Promise<void>[] = []

      querySnapshot.forEach(async doc => {
        if (doc.id === targetList.id) return

        const operation = t.get(doc.ref).then(snapshot => {
          // NOTE: トランザクションのチェック
          // if (i === 1) throw 'check'
          const list = resortOrderLists.find(list => list.id === snapshot.id)
          if (!list) return
          t.update(doc.ref, {
            sortOrder: list.sortOrder
          })
        })
        operations.push(operation)
      })

      await Promise.all(operations)
      await t.set(toRef, targetList)
      await t.delete(fromRef)
    })

    return [targetList, resortOrderLists]
  }
)

type RestoreParams = Pick<List, 'id' | 'boardId'>
export const restoreList = asyncActionCreator<RestoreParams, [List, List[]], Error>(
  'RESTORE_LIST',
  async ({ id, boardId }) => {
    const { user }: CurrentUserState = store.getState().currentUser
    const { lists, archivedLists } = store.getState().list.boards[boardId]
    const targetList = archivedLists.find(list => list.id === id)

    if (!user || !targetList) throw new Error(OPTION.MESSAGE.UNAUTHORIZED_OPERATION)

    /**
     * NOTE: レストアによって発生するsortOrderの重複を調整する
     * 0,1,1,2 → 0,1,2,3
     */
    const restoreLists = [
      ...lists.slice(0, targetList.sortOrder),
      targetList,
      ...lists.slice(targetList.sortOrder)
    ]
    const resortOrderLists: List[] = restoreLists.map((list, i) => {
      list.sortOrder = i
      return list
    })

    const fromRef = await firebase
      .firestore()
      .collection(`users/${user.uid}/archivedLists/`)
      .doc(targetList.id)

    const toRef = await firebase
      .firestore()
      .collection(`users/${user.uid}/lists/`)
      .doc(targetList.id)

    /**
     * FIXME: トランザクション内でクエリができないので、
     * 1.トランザクション外でクエリして sortOrder を変更する ref の配列を作る
     * 2.トランザクション内で再び t.get() する
     * 読み取りが余分に発生してしまうし、これが正しいやり方かは分からない
     *
     * また、sortOrder を変更しなくて良い対象もクエリしている
     */
    const querySnapshot = await firebase
      .firestore()
      .collection(`users/${user.uid}/lists/`)
      .where('boardId', '==', boardId)
      .get()

    await firebase.firestore().runTransaction(async t => {
      const operations: Promise<void>[] = []

      querySnapshot.forEach(async doc => {
        const operation = t.get(doc.ref).then(snapshot => {
          const list = resortOrderLists.find(list => list.id === snapshot.id)
          if (!list) return
          // NOTE: トランザクションのチェック
          // if (i === 1) throw 'check'
          t.update(doc.ref, {
            sortOrder: list.sortOrder
          })
        })
        operations.push(operation)
      })

      await Promise.all(operations)
      t.set(toRef, targetList)
      t.delete(fromRef)
    })

    return [targetList, resortOrderLists]
  }
)

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

export const updateList = asyncActionCreator<List, List, Error>('UPDATE_LIST', async list => {
  const { user }: CurrentUserState = store.getState().currentUser

  if (user && user.uid) {
    try {
      const ref: firebase.firestore.DocumentReference = await firebase
        .firestore()
        .collection(`users/${user.uid}/lists`)
        .doc(list.id)

      ref.set(list, { merge: true })
      return list
    } catch (e) {
      throw new Error(OPTION.MESSAGE.SERVER_CONNECTION_ERROR)
    }
  } else {
    throw new Error(OPTION.MESSAGE.UNAUTHORIZED_OPERATION)
  }
})

type changeSortOrderParam = { removedIndex: number; addedIndex: number } & Pick<List, 'boardId'>
export const changeListSortOrder = asyncActionCreator<changeSortOrderParam, void, Error>(
  'CHANGE_SORT_ORDER',
  async param => {
    const { removedIndex, addedIndex, boardId } = param
    const { user } = store.getState().currentUser
    const { boards } = store.getState().list
    /**
     * NOTE: UXのため、async.started で state を変更している
     * ここは変更後の state を参照している
     */
    const from = boards[boardId].lists.find(list => list.sortOrder === addedIndex)

    if (!user || !from) throw new Error(OPTION.MESSAGE.UNAUTHORIZED_OPERATION)

    const isLargeToSmallOrders = removedIndex > addedIndex
    const maxOrder = isLargeToSmallOrders ? removedIndex : addedIndex
    const minOrder = isLargeToSmallOrders ? addedIndex : removedIndex

    const fromToSnapshot = await firebase
      .firestore()
      .collection(`users/${user.uid}/lists`)
      .where('boardId', '==', boardId)
      .where('sortOrder', '<=', maxOrder)
      .where('sortOrder', '>=', minOrder)
      .get()

    await firebase.firestore().runTransaction(async t => {
      const add = isLargeToSmallOrders ? 1 : -1
      const oparations: Promise<void>[] = []

      fromToSnapshot.forEach(async doc => {
        const operation = t.get(doc.ref).then(() => {
          if (doc.id === from.id) {
            // NOTE: トランザクションのチェック
            // throw new Error('トランザクションに失敗しました')
            t.update(doc.ref, {
              sortOrder: addedIndex
            })
          } else {
            const sortOrder = doc.data().sortOrder + add
            t.update(doc.ref, { sortOrder })
          }
        })
        oparations.push(operation)
      })

      await Promise.all(oparations)
    })

    return
  }
)

export const moveToList = actionCreator<List>('MOVE_TO_LIST')
export const moveToArchivedList = actionCreator<List>('MOVE_TO_ARCHIVED_LIST')
