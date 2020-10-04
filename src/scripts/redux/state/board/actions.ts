import { asyncActionCreator, actionCreator } from '~redux/action'
import { store } from '~redux/store'
import {
  Board,
  BoardState,
  BoardVisibility,
  BoardRole
} from '~redux/state/board/reducer'
import { OPTION } from '@/option'
import { UserState } from '~redux/state/user/reducer'
import firebase from 'firebase'
import { addUser } from '~redux/state/users/actions'
import { User } from '~redux/state/users/reducer'
import { Member } from './reducer'

const db = firebase.firestore

const PATH = {
  BOARDS_LIVE: 'boards_live',
  BOARDS_ARCHIVED: 'boards_archived'
} as const

interface getUserResponse {
  result: User
}

/**
 * uid を渡して、サーバーからユーザーを取得する
 */
const fetchUser = async (uid: string): Promise<getUserResponse> => {
  const initRequest = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      data: JSON.stringify({
        uid
      })
    })
  }

  return new Promise((resolve, reject) => {
    fetch(
      ' https://asia-northeast1-todolist-b51fb.cloudfunctions.net/getUser',
      initRequest
    )
      .then(response => response.body!.getReader())
      .then(reader => reader!.read())
      .then(({ done, value }) => {
        const result = new TextDecoder().decode(value)
        resolve(JSON.parse(result))
      })
      .catch(e => resolve())
  })
}

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

    try {
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
    } catch (e) {
      console.log('debug: FETCH_BOARDS', e)
      throw new Error(OPTION.MESSAGE.SERVER_CONNECTION_ERROR)
    }
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

    try {
      const documentReference = await db()
        .collection(PATH.BOARDS_LIVE)
        .doc(params)
        .get()

      if (!documentReference.exists) return

      const board = getBoard(documentReference)
      fetchMembersAndDispatchAddUser(board.members)
      dispatch(setBoard(board))
    } catch (e) {
      console.log('debug: FETCH_BOARD', e)
      throw new Error(OPTION.MESSAGE.SERVER_CONNECTION_ERROR)
    }
  }
)

export const setBoard = actionCreator<Board>('SET_BOARD')

/**
 * ボードを新規作成する
 */
export const createBoard = asyncActionCreator<
  Pick<Board, 'title' | 'backgroundImage'>,
  Pick<Board, 'id'>,
  Error
>('CREATE_BOARD', async ({ title, backgroundImage }, dispatch) => {
  const user = getUserStateIfLogin()
  const members = { [user.uid]: { role: 'owner' as BoardRole } }
  //todo: 選択できるようにする
  const visibility: BoardVisibility = 'members'

  try {
    const board = {
      title,
      backgroundImage,
      favorite: false,
      members,
      visibility
    }
    const { id } = await firebase
      .firestore()
      .collection(PATH.BOARDS_LIVE)
      .add(board)

    dispatch(setBoard({ id, ...board }))
    return { id }
  } catch (e) {
    console.log('debug: CREATE_BOARD', e)
    throw new Error(OPTION.MESSAGE.SERVER_CONNECTION_ERROR)
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
  void,
  Error
>('UPDATE_BOARD', async (params, dispatch) => {
  getUserStateIfLogin()
  const { boards }: BoardState = store.getState().board
  const { id, ...target } = boards[params.id]
  const { id: paramsId, ...paramsWithoutId } = params

  try {
    const documentReference = await db()
      .collection(PATH.BOARDS_LIVE)
      .doc(paramsId)
    const query = { ...target, ...paramsWithoutId }
    documentReference.set({ ...query }, { merge: true })
    dispatch(setBoard({ id, ...query }))
  } catch (e) {
    console.log('debug: UPDATE_BOARD', e)
    throw new Error(OPTION.MESSAGE.SERVER_CONNECTION_ERROR)
  }
})

/**
 * ボードを削除する
 */
export const deleteBoard = asyncActionCreator<Pick<Board, 'id'>, string, Error>(
  'DELETE_BOARD',
  async ({ id }) => {
    getUserStateIfLogin()

    try {
      await db()
        .collection(PATH.BOARDS_ARCHIVED)
        .doc(id)
        .delete()
      return id
    } catch (e) {
      console.log('debug: DELETE_BOARD', e)
      throw new Error(OPTION.MESSAGE.SERVER_CONNECTION_ERROR)
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
  const user = getUserStateIfLogin()
  const documentReference = await db()
    .collection(PATH.BOARDS_LIVE)
    .doc(id)

  try {
    await db().runTransaction(async t => {
      /**
       * ドキュメントを live から archived へ移動する
       */
      const doc = await t.get(documentReference)

      if (!doc.exists || !user) return
      const archiveBoard = doc.data()!
      await db()
        .collection(PATH.BOARDS_ARCHIVED)
        .doc(id)
        .set(archiveBoard)

      await t.delete(documentReference)
    })
    return { id }
  } catch (e) {
    console.log('debug: ARCHIVE_BOARD', e)
    throw new Error(OPTION.MESSAGE.SERVER_CONNECTION_ERROR)
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
  const user = getUserStateIfLogin()
  const documentReference = await db()
    .collection(PATH.BOARDS_ARCHIVED)
    .doc(id)

  try {
    await db().runTransaction(async t => {
      /**
       * ドキュメントを archived から live へ移動する
       */
      const doc = await t.get(documentReference)

      if (!doc.exists || !user) return
      const archiveBoard = doc.data()!
      await db()
        .collection(PATH.BOARDS_LIVE)
        .doc(id)
        .set(archiveBoard)

      await t.delete(documentReference)
    })
    return { id }
  } catch (e) {
    console.log('debug: RESTORE_BOARD', e)
    throw new Error(OPTION.MESSAGE.SERVER_CONNECTION_ERROR)
  }
})

/**
 * サーバーからアーカイブしたボードを取得する
 */
export const fetchArchivedBoards = asyncActionCreator<void, void, Error>(
  'FETCH_ARCHIVED_BOARDS',
  async (_, dispatch) => {
    const user = getUserStateIfLogin()

    try {
      const snapshot = await db()
        .collection(PATH.BOARDS_ARCHIVED)
        .where(`members.${user.uid}.role`, 'in', ['owner', 'editor', 'reader'])
        .get()

      snapshot.forEach(doc => {
        const board = getBoard(doc)
        fetchMembersAndDispatchAddUser(board.members)
        dispatch(setArchivedBoard(board))
      })
    } catch (e) {
      console.log('debug: FETCH_ARCHIVED_BOARDS', e)
      throw new Error(OPTION.MESSAGE.SERVER_CONNECTION_ERROR)
    }
  }
)

export const setArchivedBoard = actionCreator<Board>('SET_ARCHIVED_BOARD')
