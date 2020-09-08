import React from 'react'
import { AppHeader, Login, Board, Authentication } from '@/components'
import { Switch, Route, BrowserRouter } from 'react-router-dom'

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Authentication>
        <AppHeader />
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/board" component={Board} />
        </Switch>
      </Authentication>
    </BrowserRouter>
  )
}
