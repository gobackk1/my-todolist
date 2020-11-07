import { asyncActionCreator, actionCreator } from '~redux/action'
import { store } from '~redux/store'
import {
  Board,
  BoardState,
  // BoardVisibility,
  BoardRole
} from '~redux/state/board/reducer'
import { OPTION } from '@/option'
import firebase from 'firebase'
import { getUser } from '~redux/state/users/actions'
import { Member } from './reducer'
import { callCloudFunctions } from '@/scripts/firebase'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'

const db = firebase.firestore
const { COLLECTION_PATH } = OPTION

const mixin = (() => {
  /**
   * uid を渡して、サーバーからユーザーを取得する
   */
  const fetchUser = (uid: string) => callCloudFunctions('getUser', { uid })

  /**
   * 渡した members を元にユーザーを取得し、users state に登録する
   */
  const fetchMembersAndDispatchAddUser = async (
    members: {
      [i: string]: Member
    },
    dispatch: ThunkDispatch<unknown, any, AnyAction>
  ) => {
    await Object.keys(members).forEach(async (uid: string) => {
      await dispatch(getUser(uid))
    })
  }

  /**
   * ドキュメントを渡して Board に整形する
   */
  const getBoard = (doc: firebase.firestore.DocumentData): Board => {
    const data = doc.data()
    return { id: doc.id, ...data } as Board
  }

  /**
   * favorite 中間テーブルをクエリし、
   * ユーザーがお気に入りにしているボードのIDを格納した配列をリターンする
   */
  const getFavorites = async (uid: string): Promise<string[]> => {
    const relationshipSnapshot = await db()
      .collection(COLLECTION_PATH.RELATIONSHIPS_FAVORITE)
      .where('uid', '==', uid)
      .get()

    const favorites: string[] = []
    relationshipSnapshot.forEach(doc => {
      const { boardId } = doc.data()
      favorites.push(boardId)
    })

    return favorites
  }

  /**
   * Board の favorite をクライアントサイドジョインする
   */
  const setFavorite = (board: Board, favorites: string[]): Board => ({
    ...board,
    favorite: favorites.includes(board.id) ? true : false
  })

  /**
   *
   */
  const queryWithJunctionTable = async (
    callback: Promise<firebase.firestore.QuerySnapshot | firebase.firestore.DocumentSnapshot>,
    uid: string
  ): Promise<[any, any]> => {
    return await Promise.all([callback, getFavorites(uid)])
  }

  return {
    fetchUser,
    fetchMembersAndDispatchAddUser,
    getBoard,
    setFavorite,
    queryWithJunctionTable
  }
})()

/**
 * TODO: board visibility ごとに api コールを作る
 */

/**
 * サーバーからボードを取得する
 * state.boards をクリアしてから、新しく取得したボードを state.boards 割り当てる
 */
export const fetchBoards = asyncActionCreator<void, void, Error>(
  'FETCH_BOARDS',
  async (_, dispatch) => {
    const { uid } = store.getState().currentUser.user!

    const [snapshot, favorites] = await mixin.queryWithJunctionTable(
      db()
        .collection(COLLECTION_PATH.BOARDS_LIVE)
        .where(`members.${uid}.role`, 'in', ['owner', 'editor', 'reader'])
        .get(),
      uid
    )

    snapshot.forEach(async doc => {
      if (!doc.exists) return

      const board = mixin.getBoard(doc)
      mixin.fetchMembersAndDispatchAddUser(board.members, dispatch)
      dispatch(setBoard(mixin.setFavorite(board, favorites)))
    })
  }
)

/**
 * サーバーからアーカイブしたボードを取得する
 */
export const fetchArchivedBoards = asyncActionCreator<void, void, Error>(
  'FETCH_ARCHIVED_BOARDS',
  async (_, dispatch) => {
    const { uid } = store.getState().currentUser.user!

    const [snapshot, favorites] = await mixin.queryWithJunctionTable(
      db()
        .collection(COLLECTION_PATH.BOARDS_ARCHIVED)
        .where(`members.${uid}.role`, 'in', ['owner', 'editor', 'reader'])
        .get(),
      uid
    )

    snapshot.forEach(doc => {
      const board = mixin.getBoard(doc)
      mixin.fetchMembersAndDispatchAddUser(board.members, dispatch)
      dispatch(setArchivedBoard(mixin.setFavorite(board, favorites)))
    })
  }
)

export const fetchBoard = asyncActionCreator<string, void, Error>(
  'FETCH_BOARD',
  async (params, dispatch) => {
    const { uid } = store.getState().currentUser.user!
    const boardState = store.getState().board

    /**
     * 存在していたらキャッシュを使う
     */
    if (params in boardState.boards) return

    const [documentReference, favorites] = await mixin.queryWithJunctionTable(
      db()
        .collection(COLLECTION_PATH.BOARDS_LIVE)
        .doc(params)
        .get(),
      uid
    )

    if (!documentReference.exists) return

    const board = mixin.getBoard(documentReference)
    mixin.fetchMembersAndDispatchAddUser(board.members, dispatch)
    dispatch(setBoard(mixin.setFavorite(board, favorites)))
  }
)

export const setBoard = actionCreator<Board>('SET_BOARD')

/**
 * ボードを新規作成する
 */
export const createBoard = asyncActionCreator<
  Pick<Board, 'title' | 'backgroundImage' | 'visibility'>,
  Pick<Board, 'id'>,
  Error
>('CREATE_BOARD', async ({ title, backgroundImage, visibility }, dispatch) => {
  const user = store.getState().currentUser.user!
  const members = { [user.uid]: { role: 'owner' as BoardRole } }

  const board: Omit<Board, 'id'> = {
    title,
    backgroundImage,
    members,
    visibility,
    author: user.uid,
    favorite: false
  }
  const { id }: Pick<Board, 'id'> = await firebase
    .firestore()
    .collection(COLLECTION_PATH.BOARDS_LIVE)
    .add(board)

  dispatch(setBoard({ id, ...board }))
  return { id }
})

/**
 * ボードをアップデートする
 */
export const updateBoard = asyncActionCreator<Board, Board, Error>('UPDATE_BOARD', async board => {
  const { id, ...paramsWithoutId } = board

  const ref = await firebase
    .firestore()
    .collection(COLLECTION_PATH.BOARDS_LIVE)
    .doc(id)
  await ref.set({ ...paramsWithoutId }, { merge: true })
  return board
})

/**
 * ボードを削除する
 */
export const deleteBoard = asyncActionCreator<Pick<Board, 'id'>, string, Error>(
  'DELETE_BOARD',
  async ({ id }) => {
    store.getState().currentUser.user

    await db()
      .collection(COLLECTION_PATH.BOARDS_ARCHIVED)
      .doc(id)
      .delete()

    return id
  }
)

/**
 * ボードをアーカイブする
 */
export const archiveBoard = asyncActionCreator<Pick<Board, 'id'>, Pick<Board, 'id'>, Error>(
  'ARCHIVE_BOARD',
  async ({ id }) => {
    const user = store.getState().currentUser.user
    const documentReference = await db()
      .collection(COLLECTION_PATH.BOARDS_LIVE)
      .doc(id)

    await db().runTransaction(async t => {
      /**
       * ドキュメントを live から archived へ移動する
       */
      const doc = await t.get(documentReference)

      if (!doc.exists || !user) return
      // existsで見てるので
      /* eslint-disable-next-line */
      const archiveBoard = doc.data()!
      await db()
        .collection(COLLECTION_PATH.BOARDS_ARCHIVED)
        .doc(id)
        .set(archiveBoard)

      await t.delete(documentReference)
    })
    return { id }
  }
)

/**
 * アーカイブしたボードを元に戻す
 */
export const restoreBoard = asyncActionCreator<Pick<Board, 'id'>, Pick<Board, 'id'>, Error>(
  'RESTORE_BOARD',
  async ({ id }) => {
    const user = store.getState().currentUser.user
    const documentReference = await db()
      .collection(COLLECTION_PATH.BOARDS_ARCHIVED)
      .doc(id)

    await db().runTransaction(async t => {
      /**
       * ドキュメントを archived から live へ移動する
       */
      const doc = await t.get(documentReference)

      if (!doc.exists || !user) return
      // existsで見てるので
      /* eslint-disable-next-line */
      const archiveBoard = doc.data()!
      await db()
        .collection(COLLECTION_PATH.BOARDS_LIVE)
        .doc(id)
        .set(archiveBoard)

      await t.delete(documentReference)
    })
    return { id }
  }
)

export const setArchivedBoard = actionCreator<Board>('SET_ARCHIVED_BOARD')

/**
 * ボードメンバーを削除する
 */

export const deleteBoardMember = asyncActionCreator<{ boardId: string; uid: string }, void, Error>(
  'DELETE_BOARD_MEMBER',
  async ({ boardId, uid }, dispatch) => {
    store.getState().currentUser.user
    const { boards }: BoardState = store.getState().board
    const target = boards[boardId]
    // 他に良い方法が見つかるまで
    /* eslint-disable-next-line */
    const { [uid]: _, ...newMembers } = target.members
    const newBoard = {
      ...target,
      members: {
        ...newMembers
      }
    }

    const documentReference = await db()
      .collection(COLLECTION_PATH.BOARDS_LIVE)
      .doc(boardId)

    await documentReference.set(
      {
        members: {
          [uid]: firebase.firestore.FieldValue.delete()
        }
      },
      { merge: true }
    )
    dispatch(updateBoardInState(newBoard))
  }
)

/**
 * ログアウト時など、stateを初期化する
 */
export const resetBoard = actionCreator('RESET_BOARD')

/**
 * お気に入りを変更する
 */
export const changeFavoriteRelations = asyncActionCreator<
  { favorite: boolean; boardId: string },
  void,
  Error
>('CHANGE_FAVORITE_RELATIONS', async ({ favorite, boardId }, dispatch) => {
  const { uid } = store.getState().currentUser.user!
  const { boards }: BoardState = store.getState().board

  if (favorite) {
    await db()
      .collection(COLLECTION_PATH.RELATIONSHIPS_FAVORITE)
      .doc(`${uid}_${boardId}`)
      .delete()
    const newBoard = { ...boards[boardId], favorite: false }
    dispatch(updateBoardInState(newBoard))
  } else {
    const createdAt = db.FieldValue.serverTimestamp()

    await db()
      .collection(COLLECTION_PATH.RELATIONSHIPS_FAVORITE)
      .doc(`${uid}_${boardId}`)
      .set({ uid, boardId, createdAt })
    const newBoard = { ...boards[boardId], favorite: true }
    dispatch(updateBoardInState(newBoard))
  }
})

export const updateBoardInState = actionCreator<Board>('UPDATE_BOARD_IN_STATE')
