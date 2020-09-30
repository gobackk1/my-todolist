import React from 'react'
import { AppHeader, Authentication } from '@/components'
import { css } from '@emotion/core'

export const PageLayout: React.FC = ({ children }) => {
  return (
    <>
      <AppHeader />
      <Authentication>
        <div css={style}>{children}</div>
      </Authentication>
    </>
  )
}

const style = css`
  position: relative;
  height: calc(100vh - 64px);
`
