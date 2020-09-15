import { initialState } from '../reducer'

describe('testがかけるか確認', () => {
  test('check', () => {
    expect(initialState.isLoading).toBe(false)
  })
})
