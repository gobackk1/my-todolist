import React from 'react'
import { LoginFormModal } from '@/components'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '~redux/store'
import sinon from 'sinon'
import * as hooks from 'react-redux'
import { CurrentUserState } from '~redux/state/currentUser/reducer'
import { setUser } from '~redux/state/users/actions'

describe('ヘッダとログインの integration test', () => {
  describe('フォームの検証', () => {
    test('有効なメールアドレス、パスワードが入力されるまで、ログインボタンが非活性であること', () => {})
    test('「新規登録へ」ボタンを押した時、新規登録画面に遷移すること', () => {})
    test('「Googleアカウントでログイン」ボタンを押した時、', () => {})
    test('「ログインへ」ボタンを押した時、ログイン画面に遷移すること', () => {})
    test('「登録」ボタンを押した時、アドレスが送信されたフィードバックが表示されること', () => {})
    test('「ログイン」ボタンを押した時、ログインしたフィードバックが表示されること', () => {})
    test('メールアドレスのバリデーション', () => {})
    test('パスワードのバリデーション', () => {})
  })

  describe('ログイン状態に応じたヘッダー出しわけの検証', () => {
    describe('ログイン前', () => {
      test('ログインボタンが表示されること', () => {
        sinon.stub(hooks, 'useSelector').returns({
          isLoggingIn: false,
          user: null
        } as CurrentUserState)
        const { debug, getByText } = render(
          <Provider store={store}>
            <LoginFormModal />
          </Provider>
        )
        expect(getByText('ログインへ').textContent).toContain('ログインへ')
      })
    })
    describe('ログイン中', () => {
      test('ログイン中はスピナーが表示されること', () => {})
    })
    describe('ログイン後', () => {
      const mockUser = {
        uid: 'mock',
        displayName: 'mockUser',
        avatarURL: 'default',
        email: 'string',
        profile: 'string'
      }
      test.only('「ボード一覧」ボタンが表示されること', () => {
        // sinon.stub(hooks, 'useSelector').returns({
        //   isLoggingIn: false,
        //   user: { uid: 'testUser' }
        // } as CurrentUserState)
        const { debug, getByText } = render(
          <Provider store={store}>
            <LoginFormModal />
          </Provider>
        )
        store.dispatch(setUser(mockUser))
        expect(getByText('ボード一覧').textContent).toContain('ログインへ')
      })
      test('アバター画像が表示されること', () => {})
      test('ホームボタンが表示されること', () => {})
    })
  })
})
