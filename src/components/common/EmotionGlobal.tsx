import React from 'react'
import { Global, css } from '@emotion/core'
import { reset, global } from '@/styles'

/**
 * このプロダクトのグローバルに適用するスタイル
 */
export const globalStyle = css`
  ${reset}
  ${global}
`
export const EmotionGlobal: React.FC = () => {
  return <Global styles={globalStyle} />
}
