import { asyncActionCreator, actionCreator } from '~redux/action'
import { store } from '~redux/store'
import {
  Board,
  BoardState,
  // BoardVisibility,
  BoardRole
} from '~redux/state/board/reducer'
import { OPTION } from '@/option'
import { UserState } from '~redux/state/user/reducer'
import firebase from 'firebase'
import { addUser } from '~redux/state/users/actions'
import { Member } from './reducer'
import { callCloudFunctions } from '@/scripts/firebase'
const db = firebase.firestore

const PATH = {
  BOARDS_LIVE: 'boards_live',
  BOARDS_ARCHIVED: 'boards_archived'
} as const

/**
 * uid を渡して、サーバーからユーザーを取得する
 */
const fetchUser = (uid: string) => callCloudFunctions('getUser', { uid })

/**
 * 渡した members を元にユーザーを取得し、users state に登録する
 */
const fetchMembersAndDispatchAddUser = async (members: {
  [i: string]: Member
}) => {
  await Object.keys(members).forEach(async (uid: string) => {
    const response = await fetchUser(uid)

    if (response.result) {
      store.dispatch(addUser(response.result))
    }
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
 * ログインしていたら user をリターンする
 */
const getUserStateIfLogin = () => {
  const { user }: UserState = store.getState().user
  if (!user) {
    throw new Error(OPTION.MESSAGE.UNAUTHORIZED_OPERATION)
  } else {
    return user
  }
}

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
    const user = getUserStateIfLogin()

    const snapshot = await db()
      .collection(PATH.BOARDS_LIVE)
      .where(`members.${user.uid}.role`, 'in', ['owner', 'editor', 'reader'])
      .get()

    snapshot.forEach(async doc => {
      if (!doc.exists) return

      const board = getBoard(doc)
      fetchMembersAndDispatchAddUser(board.members)
      dispatch(setBoard(board))
    })
  }
)

export const fetchBoard = asyncActionCreator<string, void, Error>(
  'FETCH_BOARD',
  async (params, dispatch) => {
    getUserStateIfLogin()
    const boardState = store.getState().board

    /**
     * 存在していたらキャッシュを使う
     */
    if (params in boardState.boards) return

    const documentReference = await db()
      .collection(PATH.BOARDS_LIVE)
      .doc(params)
      .get()

    if (!documentReference.exists) return

    const board = getBoard(documentReference)
    fetchMembersAndDispatchAddUser(board.members)
    dispatch(setBoard(board))
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
  const user = getUserStateIfLogin()
  const members = { [user.uid]: { role: 'owner' as BoardRole } }

  const board = {
    title,
    backgroundImage,
    favorite: false,
    members,
    visibility,
    author: user.uid
  }
  const { id } = await firebase
    .firestore()
    .collection(PATH.BOARDS_LIVE)
    .add(board)

  dispatch(setBoard({ id, ...board }))
  return { id }
})

/**
 * ボードをアップデートする
 */
type PartiallyPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export const updateBoard = asyncActionCreator<
  PartiallyPartial<
    Board,
    | 'title'
    | 'backgroundImage'
    | 'favorite'
    | 'members'
    | 'visibility'
    | 'author'
  >,
  Board,
  Error
>('UPDATE_BOARD', async params => {
  getUserStateIfLogin()
  const { boards }: BoardState = store.getState().board
  const { id, ...target } = boards[params.id]
  const { id: paramsId, ...paramsWithoutId } = params

  const documentReference = await db()
    .collection(PATH.BOARDS_LIVE)
    .doc(paramsId)
  const query = { ...target, ...paramsWithoutId }
  await documentReference.set({ ...query }, { merge: true })
  const newBoard: Board = { id, ...query }
  return newBoard
})

/**
 * ボードを削除する
 */
export const deleteBoard = asyncActionCreator<Pick<Board, 'id'>, string, Error>(
  'DELETE_BOARD',
  async ({ id }) => {
    getUserStateIfLogin()

    await db()
      .collection(PATH.BOARDS_ARCHIVED)
      .doc(id)
      .delete()
    return id
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
  const user = getUserStateIfLogin()
  const documentReference = await db()
    .collection(PATH.BOARDS_LIVE)
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
      .collection(PATH.BOARDS_ARCHIVED)
      .doc(id)
      .set(archiveBoard)

    await t.delete(documentReference)
  })
  return { id }
})

/**
 * アーカイブしたボードを元に戻す
 */
export const restoreBoard = asyncActionCreator<
  Pick<Board, 'id'>,
  Pick<Board, 'id'>,
  Error
>('RESTORE_BOARD', async ({ id }) => {
  const user = getUserStateIfLogin()
  const documentReference = await db()
    .collection(PATH.BOARDS_ARCHIVED)
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
      .collection(PATH.BOARDS_LIVE)
      .doc(id)
      .set(archiveBoard)

    await t.delete(documentReference)
  })
  return { id }
})

/**
 * サーバーからアーカイブしたボードを取得する
 */
export const fetchArchivedBoards = asyncActionCreator<void, void, Error>(
  'FETCH_ARCHIVED_BOARDS',
  async (_, dispatch) => {
    const user = getUserStateIfLogin()

    const snapshot = await db()
      .collection(PATH.BOARDS_ARCHIVED)
      .where(`members.${user.uid}.role`, 'in', ['owner', 'editor', 'reader'])
      .get()

    snapshot.forEach(doc => {
      const board = getBoard(doc)
      fetchMembersAndDispatchAddUser(board.members)
      dispatch(setArchivedBoard(board))
    })
  }
)

export const setArchivedBoard = actionCreator<Board>('SET_ARCHIVED_BOARD')

/**
 * ボードメンバーを削除する
 */

export const deleteBoardMember = asyncActionCreator<
  { boardId: string; uid: string },
  Board,
  Error
>('DELETE_BOARD_MEMBER', async ({ boardId, uid }) => {
  getUserStateIfLogin()
  const { boards }: BoardState = store.getState().board
  const target = boards[boardId]
  // 他に良い方法が見つかるまで
  /* eslint-disable-next-line */
  const { [uid]: _, ...newMembers } = target.members
  const newBoard = { ...target, members: { ...newMembers } }

  const documentReference = await db()
    .collection(PATH.BOARDS_LIVE)
    .doc(boardId)

  await documentReference.set(
    {
      members: {
        [uid]: firebase.firestore.FieldValue.delete()
      }
    },
    { merge: true }
  )

  return newBoard
})

/**
 * ログアウト時など、stateを初期化する
 */
export const resetBoard = actionCreator('RESET_BOARD')
