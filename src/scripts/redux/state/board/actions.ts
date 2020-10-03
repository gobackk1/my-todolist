import { asyncActionCreator, actionCreator } from '~redux/action'
import { store } from '~redux/store'
import { Board, BoardState, BoardVisibility } from '~redux/state/board/reducer'
import { OPTION } from '@/option'
import { UserState } from '~redux/state/user/reducer'
import firebase from 'firebase'

/**
 * サーバーからボードを取得する
 * state.boards をクリアしてから、新しく取得したボードを state.boards 割り当てる
 */
export const fetchBoards = asyncActionCreator<void, void, Error>(
  'FETCH_BOARDS',
  async (_, dispatch) => {
    const { user }: UserState = store.getState().user

    if (user && user.uid) {
      try {
        const snapshot = await firebase
          .firestore()
          .collection(`boards_live`)
          .where(`members.${user.uid}`, 'in', ['owner', 'editor', 'reader'])
          .get()

        snapshot.forEach(doc => {
          const { id } = doc
          const {
            title,
            backgroundImage,
            favorite,
            members,
            visibility
          } = doc.data()

          dispatch(
            setBoard({
              id,
              title,
              backgroundImage,
              favorite,
              members,
              visibility
            })
          )
        })
      } catch (e) {
        console.log(e)
        throw new Error(OPTION.MESSAGE.SERVER_CONNECTION_ERROR)
      }
    } else {
      console.log('FETCH_BOARDS')
      throw new Error(OPTION.MESSAGE.UNAUTHORIZED_OPERATION)
    }

    return
  }
)

export const fetchBoard = asyncActionCreator<string, void, Error>(
  'FETCH_BOARD',
  async (params, dispatch) => {
    const { user }: UserState = store.getState().user
    const boardState = store.getState().board

    /**
     * 存在していたらキャッシュを使う
     */
    if (params in boardState.boards) return

    if (user && user.uid) {
      try {
        const documentReference = await firebase
          .firestore()
          .collection(`users/${user.uid}/boards`)
          .doc(params)
          .get()

        // if (!documentReference.exists) {
        //   const documentReference = await firebase
        //     .firestore()
        //     .collection(`/public/`)
        //     .where(
        //       'members',
        //       'array-contains',
        //       'ここにユーザーのリファレンスID'
        //     )
        //     .doc(params)
        //     .get()
        // }
        const { id } = documentReference
        const board = { id, ...documentReference.data() } as Board
        dispatch(setBoard(board))
      } catch (e) {
        console.log(e)
        throw new Error(OPTION.MESSAGE.SERVER_CONNECTION_ERROR)
      }
    } else {
      console.log('debug: FETCH_BOARDS error')
      throw new Error(OPTION.MESSAGE.UNAUTHORIZED_OPERATION)
    }
  }
)

export const setBoard = actionCreator<Board>('SET_BOARD')

/**
 * ボードを新規作成する
 */
export const createBoard = asyncActionCreator<
  Pick<Board, 'title' | 'backgroundImage'>,
  Board,
  Error
>('CREATE_BOARD', async ({ title, backgroundImage }) => {
  const { user }: UserState = store.getState().user

  if (user && user.uid) {
    const members = {
      [user.uid]: 'owner'
    }

    //todo: 選択できるようにする
    const visibility: BoardVisibility = 'members'

    try {
      const { id }: firebase.firestore.DocumentReference = await firebase
        .firestore()
        .collection(`boards_live`)
        .add({ title, backgroundImage, favorite: false, members, visibility })

      return {
        title,
        id,
        backgroundImage,
        favorite: false,
        members,
        visibility
      }
    } catch (e) {
      console.log('debug: CREATE_BOARD', e)
      throw new Error(OPTION.MESSAGE.SERVER_CONNECTION_ERROR)
    }
  } else {
    throw new Error(OPTION.MESSAGE.UNAUTHORIZED_OPERATION)
  }
})

/**
 * ボードをアップデートする
 */
type PartiallyPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export const updateBoard = asyncActionCreator<
  PartiallyPartial<
    Board,
    'title' | 'backgroundImage' | 'favorite' | 'members' | 'visibility'
  >,
  Board,
  Error
>('UPDATE_BOARD', async params => {
  const { user }: UserState = store.getState().user
  const { boards }: BoardState = store.getState().board

  if (user && user.uid) {
    const { id, ...target } = boards[params.id]
    const { id: paramsId, ...paramsWithoutId } = params

    try {
      const documentReference = await firebase
        .firestore()
        .collection(`users/${user.uid}/boards`)
        .doc(paramsId)

      const query = { ...target, ...paramsWithoutId }
      documentReference.set({ ...query }, { merge: true })

      const newBoard: Board = { id, ...query }
      return newBoard
    } catch (e) {
      console.log(e)
      throw new Error(OPTION.MESSAGE.SERVER_CONNECTION_ERROR)
    }
  } else {
    throw new Error(OPTION.MESSAGE.UNAUTHORIZED_OPERATION)
  }
})

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
  Pick<Board, 'id'>,
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
          .doc(id)
          .set(archiveBoard)

        await documentReference.delete()
      })
      return { id }
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
  Pick<Board, 'id'>,
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
          .doc(id)
          .set(archiveBoard)

        await documentReference.delete()
      })
      return { id }
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
export const fetchArchivedBoards = asyncActionCreator<void, void, Error>(
  'FETCH_ARCHIVED_BOARDS',
  async (_, dispatch) => {
    const { user }: UserState = store.getState().user

    if (user && user.uid) {
      try {
        const snapshot = await firebase
          .firestore()
          .collection(`users/${user.uid}/archivedBoards`)
          .get()

        snapshot.forEach(doc => {
          const { id } = doc
          const {
            title,
            backgroundImage,
            favorite,
            members,
            visibility
          } = doc.data()
          dispatch(
            setArchivedBoard({
              id,
              title,
              backgroundImage,
              favorite,
              members,
              visibility
            })
          )
        })
      } catch (e) {
        throw new Error(OPTION.MESSAGE.SERVER_CONNECTION_ERROR)
      }
    } else {
      throw new Error(OPTION.MESSAGE.UNAUTHORIZED_OPERATION)
    }
  }
)

export const setArchivedBoard = actionCreator<Board>('SET_ARCHIVED_BOARD')
