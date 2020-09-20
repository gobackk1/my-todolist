import { asyncActionCreator } from '~redux/action'
import { store } from '~redux/store'
import { Board } from '~redux/state/board/reducer'
import { OPTION } from '@/option'
import { UserState } from '~redux/state/user/reducer'
import firebase from 'firebase'

/**
 * サーバーからボードを取得する
 * state.boards をクリアしてから、新しく取得したボードを state.boards 割り当てる
 */
export const fetchBoards = asyncActionCreator<any, Board[], Error>(
  'FETCH_BOARDS',
  async () => {
    const { user }: UserState = store.getState().user
    const boards: Board[] = [] as Board[]

    if (user && user.uid) {
      try {
        const snapshot = await firebase
          .firestore()
          .collection(`users/${user.uid}/boards`)
          .get()

        snapshot.forEach(doc => {
          const { id } = doc
          const { title } = doc.data()

          boards.push({ id, title })
        })
      } catch (e) {
        throw new Error(OPTION.MESSAGE.SERVER_CONNECTION_ERROR)
      }
    } else {
      throw new Error(OPTION.MESSAGE.UNAUTHORIZED_OPERATION)
    }

    return boards
  }
)

/**
 * ボードを新規作成する
 */
export const createBoard = asyncActionCreator<
  Pick<Board, 'title'>,
  Pick<Board, 'title' | 'id'>,
  Error
>('CREATE_BOARD', async ({ title }) => {
  const { user }: UserState = store.getState().user

  if (user && user.uid) {
    try {
      const { id }: firebase.firestore.DocumentReference = await firebase
        .firestore()
        .collection(`users/${user.uid}/boards`)
        .add({ title })

      return { title, id }
    } catch (e) {
      throw new Error(OPTION.MESSAGE.SERVER_CONNECTION_ERROR)
    }
  } else {
    throw new Error(OPTION.MESSAGE.UNAUTHORIZED_OPERATION)
  }
})

/**
 * ボードをアップデートする
 */
export const updateBoard = asyncActionCreator<Board, Board, Error>(
  'UPDATE_BOARD',
  async ({ id, title }) => {
    const { user }: UserState = store.getState().user

    if (user && user.uid) {
      try {
        const documentReference: any = await firebase
          .firestore()
          .collection(`users/${user.uid}/boards`)
          .doc(id)

        documentReference.set({ title }, { merge: true })
        //リストは board.data().list で
        return { id, title }
      } catch (e) {
        throw new Error(OPTION.MESSAGE.SERVER_CONNECTION_ERROR)
      }
    } else {
      throw new Error(OPTION.MESSAGE.UNAUTHORIZED_OPERATION)
    }
  }
)

/**
 * ボードを削除する
 */
export const deleteBoard = asyncActionCreator<Pick<Board, 'id'>, string, Error>(
  'DELETE_BOARD',
  async ({ id }) => {
    const { user }: UserState = store.getState().user

    if (user && user.uid) {
      try {
        await firebase
          .firestore()
          .collection(`users/${user.uid}/archivedBoards/`)
          .doc(id)
          .delete()
        return id
      } catch (e) {
        throw new Error(OPTION.MESSAGE.SERVER_CONNECTION_ERROR)
      }
    } else {
      throw new Error(OPTION.MESSAGE.UNAUTHORIZED_OPERATION)
    }
  }
)

/**
 * ボードをアーカイブする
 */
export const archiveBoard = asyncActionCreator<
  Pick<Board, 'id'>,
  string,
  Error
>('ARCHIVE_BOARD', async ({ id }) => {
  const { user }: UserState = store.getState().user
  if (user && user.uid) {
    let documentReference: firebase.firestore.DocumentReference

    // NOTE: まずリファレンスを取得する
    try {
      documentReference = await firebase
        .firestore()
        .collection(`users/${user.uid}/boards/`)
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
        const archiveBoard = doc.data()
        if (!archiveBoard || !user) return

        await firebase
          .firestore()
          .collection(`users/${user.uid}/archivedBoards/`)
          .add(archiveBoard)

        await documentReference.delete()
      })
      return id
    } catch (e) {
      throw new Error(OPTION.MESSAGE.SERVER_CONNECTION_ERROR)
    }
  } else {
    throw new Error(OPTION.MESSAGE.UNAUTHORIZED_OPERATION)
  }
})

/**
 * アーカイブしたボードを元に戻す
 */
export const restoreBoard = asyncActionCreator<
  Pick<Board, 'id'>,
  string,
  Error
>('RESTORE_BOARD', async ({ id }) => {
  const { user }: UserState = store.getState().user
  if (user && user.uid) {
    let documentReference: firebase.firestore.DocumentReference

    // NOTE: まずリファレンスを取得する
    try {
      documentReference = await firebase
        .firestore()
        .collection(`users/${user.uid}/archivedBoards/`)
        .doc(id)
    } catch (e) {
      throw new Error(OPTION.MESSAGE.SERVER_CONNECTION_ERROR)
    }

    /**
     * リファレンス取得後、
     * 1. document 読み取り
     * 2. boards collection に追加
     * 3. archivedBoards からを削除
     */
    try {
      await firebase.firestore().runTransaction(async t => {
        const doc = await t.get(documentReference)
        const archiveBoard = doc.data()
        if (!archiveBoard || !user) return

        await firebase
          .firestore()
          .collection(`users/${user.uid}/boards/`)
          .add(archiveBoard)

        await documentReference.delete()
      })
      return id
    } catch (e) {
      throw new Error(OPTION.MESSAGE.SERVER_CONNECTION_ERROR)
    }
  } else {
    throw new Error(OPTION.MESSAGE.UNAUTHORIZED_OPERATION)
  }
})

/**
 * サーバーからアーカイブしたボードを取得する
 */
export const fetchArchivedBoards = asyncActionCreator<void, Board[], Error>(
  'FETCH_ARCHIVED_BOARDS',
  async () => {
    const { user }: UserState = store.getState().user
    const boards: Board[] = []
    if (user && user.uid) {
      try {
        const snapshot = await firebase
          .firestore()
          .collection(`users/${user.uid}/archivedBoards`)
          .get()

        snapshot.forEach(doc => {
          const { id } = doc
          const { title } = doc.data()
          boards.push({ id, title })
        })
      } catch (e) {
        throw new Error(OPTION.MESSAGE.SERVER_CONNECTION_ERROR)
      }

      return boards
    } else {
      throw new Error(OPTION.MESSAGE.UNAUTHORIZED_OPERATION)
    }
  }
)
