import React from 'react'
import { Header, Authentication } from '@/components'
import { css } from '@emotion/core'

export const PageLayout: React.FC = ({ children }) => {
  return (
    <>
      <Header />
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
