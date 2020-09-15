import React from 'react'
import { Home } from '@/components/'
import { shallow } from 'enzyme'

describe('<Home />のテスト', () => {
  test('test', () => {
    const wrapper = shallow(<Home />)
    expect(wrapper.text()).toBe('HAme')
  })
})
