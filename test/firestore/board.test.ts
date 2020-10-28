import * as firebase from '@firebase/rules-unit-testing'
import * as fs from 'fs'
import { Board, BoardRole } from '../../src/scripts/redux/state/board/reducer'
import {
  createRef,
  createAuthApp,
  createAdminApp,
  PROJECT_ID,
  RULES_PATH
} from './util'

type BoardOnFirestore = Omit<Board, 'id' | 'favorite'>
const BOARD: BoardOnFirestore = {
  author: 'userId',
  title: 'new board',
  backgroundImage: '#ffffff',
  visibility: 'members',
  members: {
    memberUserId: {
      role: 'owner'
    }
  }
}
const path = 'boards_live'
const createBoard = (
  board: Partial<BoardOnFirestore> = {}
): BoardOnFirestore => ({
  ...BOARD,
  ...board
})
const getBoardAs = (
  uid: string,
  role: BoardRole
): Partial<BoardOnFirestore> => ({
  author: uid,
  members: { [uid]: { role } }
})
const docId1 = 'BOARD1'
const docId2 = 'BOARD2'
const docId3 = 'BOARD3'
const userA = 'USER_A_ID'
const userB = 'USER_B_ID'
const userC = 'USER_C_ID'

describe('boards_live のセキュリティルール検証', () => {
  beforeAll(async () => {
    await firebase.loadFirestoreRules({
      projectId: PROJECT_ID,
      rules: fs.readFileSync(RULES_PATH, 'utf8')
    })
  })

  afterEach(async () => {
    await firebase.clearFirestoreData({ projectId: PROJECT_ID })
  })

  afterAll(async () => {
    await Promise.all(firebase.apps().map(app => app.delete()))
  })

  describe('認証の検証', () => {
    beforeEach(async () => {
      await createAdminApp()
        .collection(path)
        .doc(docId1)
        .set(
          createBoard({
            author: userA,
            members: {
              [userA]: {
                role: 'owner'
              },
              [userB]: {
                role: 'editor'
              }
              // [userC]: {
              //   role: 'reader'
              // }
            }
          })
        )
      await createAdminApp()
        .collection(path)
        .doc(docId2)
        .set(
          createBoard({
            author: userA,
            members: {
              [userA]: {
                role: 'owner'
              }
            },
            visibility: 'public'
          })
        )
    })
    describe('allow read の検証', () => {
      test('認証後かつボードメンバーの場合は read できること', async () => {
        const userARef = createRef({ uid: userA, path, docId: docId1 })
        const userCRef = createRef({ uid: userC, path, docId: docId1 })
        const unauthorizedRef = createRef({ path, docId: docId1 })

        // 期待動作が実現するか
        await firebase.assertSucceeds(userARef.get())
        // 認証前かつボードメンバーの場合に read できないこと
        await firebase.assertFails(unauthorizedRef.get())
        // 認証後かつ非ボードメンバーの場合に read できないこと
        await firebase.assertFails(userCRef.get())
      })
      test('認証後かつ visibility が public の場合は、メンバー以外も read できること', async () => {
        const isNotMemberRef = createRef({ uid: userC, path, docId: docId2 })
        const unauthorizedRef = createRef({ path, docId: docId2 })

        // 期待動作が実現するか
        await firebase.assertSucceeds(isNotMemberRef.get())
        // 認証前に read できないこと
        await firebase.assertFails(unauthorizedRef.get())
      })
    })
    describe('allow create の検証', () => {
      test('認証後かつ作成ユーザーが owner のボードメンバーが存在する場合に create できること', async () => {
        const authorizedRef = createRef({ uid: userA, path, docId: docId3 })
        const unauthorizedRef = createRef({ path, docId: docId3 })

        const validBoard = createBoard(getBoardAs(userA, 'owner'))
        const isNotAuthorInMembers = createBoard({
          author: userA,
          members: {
            [userB]: {
              role: 'owner'
            }
          }
        })
        const wrongAuthorBoard = createBoard({
          author: userA,
          members: {
            [userA]: {
              role: 'editor'
            }
          }
        })

        // 期待動作が実現するか
        await firebase.assertSucceeds(authorizedRef.set(validBoard))
        // 認証前に create できないこと
        await firebase.assertFails(unauthorizedRef.set(validBoard))
        // ボードメンバーに author の key が存在しない場合に create できないこと
        await firebase.assertFails(authorizedRef.set(isNotAuthorInMembers))
        // ボードメンバーの author の値が owner 以外の場合に create できないこと
        await firebase.assertFails(authorizedRef.set(wrongAuthorBoard))
      })
    })
    describe('allow update の検証', () => {
      test('認証後かつ owner の場合に update できること', async () => {
        const authorizedRef = createRef({ uid: userA, path, docId: docId1 })
        const unauthorizedRef = createRef({ path, docId: docId1 })
        const isNotOwnerRef = createRef({ uid: userB, path, docId: docId1 })

        // 期待動作が実現するか
        await firebase.assertSucceeds(authorizedRef.update({ title: 'update' }))
        // 認証前に update できないこと
        await firebase.assertFails(unauthorizedRef.update({ title: 'update' }))
        // owner 以外は update できないこと
        await firebase.assertFails(isNotOwnerRef.update({ title: 'update' }))
      })
    })
    describe('allow delete の検証', () => {
      test('認証後かつ author の場合に delete できること', async () => {
        const authorRef = createRef({ uid: userA, path, docId: docId1 })
        const unauthorizedRef = createRef({ path, docId: docId1 })
        const isNotAuthorRef = createRef({ uid: userC, path, docId: docId1 })

        // author 以外は delete できないこと
        await firebase.assertFails(isNotAuthorRef.delete())
        // 認証前に delete できないこと
        await firebase.assertFails(unauthorizedRef.delete())
        // 期待動作が実現するか
        await firebase.assertSucceeds(authorRef.delete())
      })
    })
  })

  describe('スキーマの検証', () => {
    test('正しくないスキーマでは、Create ができないこと', async () => {
      const ref = createRef({ uid: userA, path, docId: docId1 })

      const invalidSizeBoard1: BoardOnFirestore & { invalidField: null } = {
        ...createBoard(getBoardAs(userA, 'owner')),
        invalidField: null
      }
      const { visibility, ...invalidSizeBoard2 } = BOARD

      await firebase.assertFails(ref.set(invalidSizeBoard1))
      await firebase.assertFails(ref.set(invalidSizeBoard2))
      await firebase.assertFails(ref.set({ ...BOARD, author: 1 }))
      await firebase.assertFails(ref.set({ ...BOARD, title: 1 }))
      await firebase.assertFails(ref.set({ ...BOARD, backgroundImage: 1 }))
      await firebase.assertFails(ref.set({ ...BOARD, visibility: 1 }))
      await firebase.assertFails(ref.set({ ...BOARD, members: 1 }))
      await firebase.assertFails(
        ref.set(createBoard(getBoardAs(userA, 'editor')))
      )
    })

    test('正しくないスキーマでは、Update ができないこと', async () => {
      const ref = createAuthApp({ uid: userA })
        .collection(path)
        .doc(docId1)

      await ref.set(createBoard(getBoardAs(userA, 'owner')))

      const invalidSizeBoard1: BoardOnFirestore & { invalidField: null } = {
        ...createBoard(getBoardAs(userA, 'owner')),
        invalidField: null
      }

      await firebase.assertFails(ref.set(invalidSizeBoard1, { merge: true }))
      await firebase.assertFails(ref.update({ author: true }))
      await firebase.assertFails(ref.update({ title: true }))
      await firebase.assertFails(ref.update({ backgroundImage: true }))
      await firebase.assertFails(ref.update({ visibility: true }))
      await firebase.assertFails(ref.update({ members: true }))
    })
  })

  describe('データのバリデーション', () => {
    test('author は 100文字以内かつ変更不可能であること', async () => {
      const invalidAuthor = 'a'.repeat(100)
      const validAuthor = 'a'.repeat(99)
      const invalidAuthorBoard: BoardOnFirestore = {
        ...createBoard(getBoardAs(invalidAuthor, 'owner')),
        author: invalidAuthor
      }
      const validAuthorBoard: BoardOnFirestore = {
        ...createBoard(getBoardAs(validAuthor, 'owner')),
        author: validAuthor
      }

      const ref1 = createAuthApp({ uid: validAuthor })
        .collection(path)
        .doc(docId1)
      const ref2 = createAuthApp({ uid: invalidAuthorBoard })
        .collection(path)
        .doc(docId2)

      await firebase.assertSucceeds(ref1.set(validAuthorBoard))
      await firebase.assertFails(ref2.set(invalidAuthorBoard))
      await firebase.assertFails(ref1.set({ author: userB }))
      await firebase.assertSucceeds(
        ref1.set(
          {
            author: validAuthor,
            title: 'update title'
          },
          { merge: true }
        )
      )
    })
    test('title は 1~50文字であること', async () => {
      const invalidTitle1 = 'a'.repeat(51)
      const invalidTitle2 = ''
      const validTitle1 = 'a'.repeat(50)
      const validTitle2 = 'a'.repeat(1)

      const invalidTitleBoard1: BoardOnFirestore = {
        ...createBoard(getBoardAs(userA, 'owner')),
        title: invalidTitle1
      }
      const invalidTitleBoard2: BoardOnFirestore = {
        ...createBoard(getBoardAs(userA, 'owner')),
        title: invalidTitle2
      }
      const validTitleBoard1: BoardOnFirestore = {
        ...createBoard(getBoardAs(userA, 'owner')),
        title: validTitle1
      }
      const validTitleBoard2: BoardOnFirestore = {
        ...createBoard(getBoardAs(userA, 'owner')),
        title: validTitle2
      }

      const ref1 = createAuthApp({ uid: userA })
        .collection(path)
        .doc(docId1)

      await firebase.assertFails(ref1.set(invalidTitleBoard1))
      await firebase.assertFails(ref1.set(invalidTitleBoard2))
      await firebase.assertSucceeds(ref1.set(validTitleBoard1))
      await firebase.assertSucceeds(ref1.set(validTitleBoard2))
    })
    test('backgroundImageはHEXカラーコードかパスであること', async () => {
      const invalidValues = [
        'a',
        '#ffffffe',
        '#ff',
        '/bg_photo_2.c8699692.jpg',
        'asdf;lakjsfoiej',
        '/images/bg_photo_2.c8699692.png',
        '/images/photo_2.c8699692.jpg'
      ]
      const validValues = ['#ffffff', '#fff', '/images/bg_photo_2.c8699692.jpg']

      const addDocument = async (value: string): Promise<void> => {
        await createAuthApp({ uid: userA })
          .collection(path)
          .add({
            ...createBoard(getBoardAs(userA, 'owner')),
            backgroundImage: value
          })
      }

      await Promise.all(
        invalidValues.map(value => {
          return firebase.assertFails(addDocument(value))
        })
      )
      await Promise.all(
        validValues.map(value => {
          return firebase.assertSucceeds(addDocument(value))
        })
      )
    })

    test('visibilityは public か members であること', async () => {
      const publicVisibilityBoard: BoardOnFirestore = {
        ...createBoard(getBoardAs(userA, 'owner')),
        visibility: 'public'
      }
      const membersVisibilityBoard: BoardOnFirestore = {
        ...createBoard(getBoardAs(userA, 'owner')),
        visibility: 'members'
      }
      const invalidVisibilityBoard: Omit<BoardOnFirestore, 'visibility'> & {
        visibility: string
      } = {
        ...createBoard(getBoardAs(userA, 'owner')),
        visibility: 'member'
      }

      const ref1 = createAuthApp({ uid: userA })
        .collection(path)
        .doc(docId1)
      const ref2 = createAuthApp({ uid: userA })
        .collection(path)
        .doc(docId2)
      const ref3 = createAuthApp({ uid: userA })
        .collection(path)
        .doc(docId3)

      await firebase.assertSucceeds(ref1.set(publicVisibilityBoard))
      await firebase.assertSucceeds(ref2.set(membersVisibilityBoard))
      await firebase.assertFails(ref3.set(invalidVisibilityBoard))
    })
    // TODO: 可変長の map はバリデーションできないので、サブコレクションへ移動する
    // test('members の author は owner であること', () => {})
  })
})
