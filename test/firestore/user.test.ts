import * as firebase from '@firebase/rules-unit-testing'
import * as fs from 'fs'
import { createRef, createAdminApp, PROJECT_ID, RULES_PATH } from './util'
import * as I from '../../src/scripts/model/interface'

const USER: I.User = {
  uid: 'user_id',
  displayName: 'test user',
  profile: 'this is test data',
  avatarURL:
    'https://firebasestorage.googleapis.com/v0/b/todolist-b51fb.appspot.com/o/images%2Fdefault.jpg?alt=media&token=580f70eb-6b3f-406e-8a76-4261851ddf41',
  email: 'test@test.com'
}
const path = 'user_detail_public'
const createUser = (params: Partial<I.User> = {}): I.User => ({
  ...USER,
  ...params
})

const docId1 = 'USER_DETAIL1'
const userA = 'USER_A_ID'
const userB = 'USER_B_ID'
const userC = 'USER_C_ID'

describe(`${path} のセキュリティルール検証`, () => {
  beforeAll(async () => {
    await firebase.loadFirestoreRules({
      projectId: PROJECT_ID,
      rules: fs.readFileSync(RULES_PATH, 'utf8')
    })
  })

  afterEach(async () => {
    await firebase.clearFirestoreData({ projectId: PROJECT_ID })
    /**
     * NOTE: ドキュメントIDは uid とする
     */
    await createAdminApp()
      .collection(path)
      .doc(userB)
      .set(createUser({ uid: userB }))
  })

  afterAll(async () => {
    await Promise.all(firebase.apps().map(app => app.delete()))
  })

  describe('認証の検証', () => {
    describe('allow read の検証', () => {
      test('認証後のユーザーは read できること', async () => {
        const authorizedRef = createRef({ uid: userA, path, docId: userA })
        const unauthorizedRef = createRef({ path, docId: docId1 })

        // 期待動作が実現するか
        await firebase.assertSucceeds(authorizedRef.get())
        // 認証後のユーザーが read できないこと
        await firebase.assertFails(unauthorizedRef.get())
      })
    })
    describe('allow create の検証', () => {
      test('ユーザーは create できないこと', async () => {
        const authorizedRef = createRef({
          uid: userA,
          path,
          docId: userA
        })
        const validUser = createUser({ uid: userA })

        // 期待動作が実現するか
        await firebase.assertFails(authorizedRef.set(validUser))
      })
    })
    describe('allow update の検証', () => {
      test('自身のドキュメントを update できること', async () => {
        const ref = createRef({ uid: userB, path, docId: userB })
        const anotherRef = createRef({ uid: userC, path, docId: userC })

        // 期待動作が実現するか
        await firebase.assertSucceeds(ref.update({ displayName: 'update' }))
        // 他人のドキュメントを update できないこと
        await firebase.assertFails(anotherRef.update({ displayName: 'update' }))
      })
    })
    describe('allow delete の検証', () => {
      test('ユーザーは delete できないこと', async () => {
        const ref = createRef({ uid: userB, path, docId: userB })

        // 期待動作が実現するか
        await firebase.assertFails(ref.delete())
      })
    })
  })

  describe('スキーマの検証', () => {
    test('正しくないスキーマでは update できないこと', async () => {
      const ref = createRef({ uid: userB, path, docId: userB })
      const invalidSchemaUser1: I.User & { foo: string } = {
        ...USER,
        foo: 'bar'
      }
      await firebase.assertFails(ref.set(invalidSchemaUser1, { merge: true }))
      await firebase.assertFails(ref.update({ displayName: 1 }))
      await firebase.assertFails(ref.update({ profile: 1 }))
      await firebase.assertFails(ref.update({ avatarURL: 1 }))
      await firebase.assertFails(ref.update({ displayName: true }))
      await firebase.assertFails(ref.update({ profile: true }))
      await firebase.assertFails(ref.update({ avatarURL: true }))
      await firebase.assertFails(ref.update({ displayName: { foo: 'bar' } }))
      await firebase.assertFails(ref.update({ profile: { foo: 'bar' } }))
      await firebase.assertFails(ref.update({ avatarURL: { foo: 'bar' } }))
    })
  })

  describe('データのバリデーション', () => {
    test('uid,email は変更不可であること', async () => {
      const ref = createRef({ uid: userB, path, docId: userB })

      // 期待動作が実現するか
      await firebase.assertFails(ref.update({ uid: 'update' }))
      await firebase.assertFails(ref.update({ email: 'update@update.com' }))
    })
    test('displayName は 6 ~ 30 文字であること', async () => {
      const ref = createRef({ uid: userB, path, docId: userB })
      const validDisplayName = ['a'.repeat(6), 'a'.repeat(30)]
      const invalidDisplayName = ['a'.repeat(5), 'a'.repeat(31)]

      await Promise.all(
        validDisplayName.map(displayName =>
          firebase.assertSucceeds(ref.update({ displayName }))
        )
      )
      await Promise.all(
        invalidDisplayName.map(displayName =>
          firebase.assertFails(ref.update({ displayName }))
        )
      )
    })
    test('profile は 140文字以下であること', async () => {
      const ref = createRef({ uid: userB, path, docId: userB })
      const validProfile = 'a'.repeat(140)
      const invalidProfile = 'a'.repeat(141)

      await firebase.assertSucceeds(ref.update({ profile: validProfile }))
      await firebase.assertFails(ref.update({ profile: invalidProfile }))
    })
    test('avatarURL は jpg画像パスであること', async () => {
      const ref = createRef({ uid: userB, path, docId: userB })
      const validAvatarURL = [
        'https://firebasestorage.googleapis.com/v0/b/todolist-b51fb.appspot.com/o/images%2Favatars%2FdNXcqKe.jpg?alt=media&token=5dbd6201',
        'https://firebasestorage.googleapis.com/v0/b/todolist-b51fb.appspot.com/o/images%2Favatars%2FdNXcqKe.jpg'
      ]
      const invalidAvatarURL = [
        'foobar',
        'https://anotherhost/image.jpg',
        'https://firebasestorage.googleapis.com/v0/b/todolist-b51fb.appspot.com/o/XcqKe.png?alt=media&token=5d1',
        'http://firebasestorage.googleapis.com/foobar.jpg'
      ]

      await Promise.all(
        validAvatarURL.map(avatarURL =>
          firebase.assertSucceeds(ref.update({ avatarURL }))
        )
      )
      await Promise.all(
        invalidAvatarURL.map(avatarURL =>
          firebase.assertFails(ref.update({ avatarURL }))
        )
      )
    })
  })
})
