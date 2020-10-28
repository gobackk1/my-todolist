import React from 'react'
import { Header } from '@/components'
import { css } from '@emotion/core'
import { useAuth } from '@/scripts/hooks'

export const PageLayout: React.FC = ({ children }) => {
  useAuth()

  return (
    <>
      <Header />
      <div css={style}>{children}</div>
    </>
  )
}

const style = css`
  position: relative;
  height: calc(100vh - 64px);
`
