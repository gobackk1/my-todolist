import { initialState } from '~redux/state/board/reducer'

describe('testがかけるか確認', () => {
  test('check', () => {
    expect(initialState.isLoading).toBe(false)
  })
})
