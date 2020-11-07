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
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'

const db = firebase.firestore
const { COLLECTION_PATH } = OPTION

const mixin = (() => {
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
   * ドキュメントをクライアントサイドジョインする
   */
  const joinBoard = (doc: firebase.firestore.DocumentData, favorites: string[]): Board => {
    return {
      ...doc.data(),
      id: doc.id,
      favorite: favorites.includes(doc.id) ? true : false
    } as Board
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

  const queryWithJunctionTable = async (
    callback: Promise<firebase.firestore.QuerySnapshot | firebase.firestore.DocumentSnapshot>,
    uid: string
  ): Promise<[any, any]> => {
    return await Promise.all([callback, getFavorites(uid)])
  }

  return {
    fetchMembersAndDispatchAddUser,
    joinBoard,
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
    const { user } = store.getState().currentUser

    if (!user) throw new Error(OPTION.MESSAGE.UNAUTHORIZED_OPERATION)

    const [snapshot, favorites] = await mixin.queryWithJunctionTable(
      db()
        .collection(COLLECTION_PATH.BOARDS_LIVE)
        .where(`members.${user.uid}.role`, 'in', ['owner', 'editor', 'reader'])
        .get(),
      user.uid
    )

    snapshot.forEach(async doc => {
      const board = mixin.joinBoard(doc, favorites)
      mixin.fetchMembersAndDispatchAddUser(board.members, dispatch)
      dispatch(setBoard(board))
    })
  }
)

/**
 * サーバーからアーカイブしたボードを取得する
 */
export const fetchArchivedBoards = asyncActionCreator<void, void, Error>(
  'FETCH_ARCHIVED_BOARDS',
  async (_, dispatch) => {
    const { user } = store.getState().currentUser

    if (!user) throw new Error(OPTION.MESSAGE.UNAUTHORIZED_OPERATION)

    const [snapshot, favorites] = await mixin.queryWithJunctionTable(
      db()
        .collection(COLLECTION_PATH.BOARDS_ARCHIVED)
        .where(`members.${user.uid}.role`, 'in', ['owner', 'editor', 'reader'])
        .get(),
      user.uid
    )

    snapshot.forEach(doc => {
      const board = mixin.joinBoard(doc, favorites)
      mixin.fetchMembersAndDispatchAddUser(board.members, dispatch)
      dispatch(setArchivedBoard(board))
    })
  }
)

export const fetchBoard = asyncActionCreator<ValueOf<Board, 'id'>, void, Error>(
  'FETCH_BOARD',
  async (boardId, dispatch) => {
    const { user } = store.getState().currentUser

    if (!user) throw new Error(OPTION.MESSAGE.UNAUTHORIZED_OPERATION)

    const boardState = store.getState().board

    /**
     * 存在していたらキャッシュを使う
     */
    if (boardId in boardState.boards) return

    const [documentReference, favorites] = await mixin.queryWithJunctionTable(
      db()
        .collection(COLLECTION_PATH.BOARDS_LIVE)
        .doc(boardId)
        .get(),
      user.uid
    )

    const board = mixin.joinBoard(documentReference, favorites)
    mixin.fetchMembersAndDispatchAddUser(board.members, dispatch)
    dispatch(setBoard(board))
  }
)

/**
 * ボードを新規作成する
 */
export const createBoard = asyncActionCreator<
  Pick<Board, 'title' | 'backgroundImage' | 'visibility'>,
  void,
  Error
>('CREATE_BOARD', async ({ title, backgroundImage, visibility }, dispatch) => {
  const { user } = store.getState().currentUser

  if (!user) throw new Error(OPTION.MESSAGE.UNAUTHORIZED_OPERATION)

  const members = { [user.uid]: { role: 'owner' as BoardRole } }

  const board: Omit<Board, 'id'> = {
    title,
    backgroundImage,
    members,
    visibility,
    author: user.uid,
    favorite: false
  }

  const { id }: Pick<Board, 'id'> = await db()
    .collection(COLLECTION_PATH.BOARDS_LIVE)
    .add(board)

  dispatch(setBoard({ id, ...board }))
})

/**
 * ボードをアップデートする
 */
export const updateBoard = asyncActionCreator<Board, void, Error>('UPDATE_BOARD', async board => {
  const { id, ...paramsWithoutId } = board

  const ref = await db()
    .collection(COLLECTION_PATH.BOARDS_LIVE)
    .doc(id)
  await ref.set({ ...paramsWithoutId }, { merge: true })
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

    if (!user) throw new Error(OPTION.MESSAGE.UNAUTHORIZED_OPERATION)

    const documentReference = await db()
      .collection(COLLECTION_PATH.BOARDS_LIVE)
      .doc(id)

    await db().runTransaction(async t => {
      /**
       * ドキュメントを live から archived へ移動する
       */
      const doc = await t.get(documentReference)

      if (!doc.exists) return

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

/**
 * ボードメンバーを削除する
 */
export const deleteBoardMember = asyncActionCreator<{ boardId: string; uid: string }, void, Error>(
  'DELETE_BOARD_MEMBER',
  async ({ boardId, uid }, dispatch) => {
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
          [uid]: db.FieldValue.delete()
        }
      },
      { merge: true }
    )
    dispatch(setBoard(newBoard))
  }
)

/**
 * ログアウト時など、stateを初期化する
 */
export const setBoard = actionCreator<Board>('SET_BOARD')
export const setArchivedBoard = actionCreator<Board>('SET_ARCHIVED_BOARD')
export const resetBoard = actionCreator('RESET_BOARD')

/**
 * お気に入りを変更する
 */
export const changeFavoriteRelations = asyncActionCreator<
  { favorite: boolean; boardId: string },
  void,
  Error
>('CHANGE_FAVORITE_RELATIONS', async ({ favorite, boardId }, dispatch) => {
  const { user } = store.getState().currentUser

  if (!user) throw new Error(OPTION.MESSAGE.UNAUTHORIZED_OPERATION)

  const { boards }: BoardState = store.getState().board

  /**
   * NOTE: お気に入りしていたら、お気に入りを解除
   * お気に入りにしていなかったら、お気に入りに登録
   */
  if (favorite) {
    await db()
      .collection(COLLECTION_PATH.RELATIONSHIPS_FAVORITE)
      .doc(`${user.uid}_${boardId}`)
      .delete()

    dispatch(
      setBoard({
        ...boards[boardId],
        favorite: false
      })
    )
  } else {
    const createdAt = db.FieldValue.serverTimestamp()
    await db()
      .collection(COLLECTION_PATH.RELATIONSHIPS_FAVORITE)
      .doc(`${user.uid}_${boardId}`)
      .set({
        uid: user.uid,
        boardId,
        createdAt
      })

    dispatch(
      setBoard({
        ...boards[boardId],
        favorite: true
      })
    )
  }
})
