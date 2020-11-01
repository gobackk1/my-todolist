import React from 'react'
import { Header } from '@/components'
import { css } from '@emotion/core'
import { useAuth } from '@/scripts/hooks'
import { useSelector } from 'react-redux'
import { BeforeVerified } from '../views'
import { Home } from '@/components'

export const PageLayout: React.FC = ({ children }) => {
  useAuth()
  const { user } = useSelector(state => state.currentUser)

  return (
    <>
      <Header />
      {user ? (
        <>
          {user.emailVerified ? (
            <div css={style}>{children}</div>
          ) : (
            <BeforeVerified />
          )}
        </>
      ) : (
        <Home />
      )}
    </>
  )
}

const style = css`
  position: relative;
  height: calc(100vh - 64px);
`
