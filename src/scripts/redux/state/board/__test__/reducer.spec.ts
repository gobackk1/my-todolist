import { initialState } from '~redux/state/board/reducer'
import { test, describe, beforeAll, afterAll, expect } from '@jest/globals'

describe('testがかけるか確認', () => {
  test('check', () => {
    expect(initialState.isLoading).toBe(false)
  })
})
