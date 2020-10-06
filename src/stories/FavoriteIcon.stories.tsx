import React from 'react'
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'

import { FavoriteIcon } from '../components'

export default {
  title: 'Example/FavoriteIcon',
  component: FavoriteIcon
} as Meta

const Template: any = args => <FavoriteIcon {...args} />

export const on = Template.bind({})
on.args = {
  favorite: true
}

export const off = Template.bind({})
on.args = {
  favorite: false
}
