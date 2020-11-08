import { OPTION } from '@/option'
import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect, Route, RouteProps } from 'react-router-dom'

export const PrivateRoute: React.FC<RouteProps & { component: React.FC }> = ({
  component: Component,
  ...props
}) => {
  const { user } = useSelector(state => state.currentUser)
  return (
    <Route
      {...props}
      render={() => {
        // NOTE: ログインしていなかったら HOME へリダイレクト
        if (!user) {
          return <Redirect to={OPTION.PATH.HOME} />
        }
        // NOTE: メール認証が終わっていなければ、BEFORE_VERIFIED へリダイレクト
        if (!user.emailVerified) {
          return <Redirect to={OPTION.PATH.BEFORE_VERIFIED} />
        }

        return <Component />
      }}
    />
  )
}
