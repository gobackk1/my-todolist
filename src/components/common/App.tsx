import React from 'react'
import { AppHeader, Home, Board, Authentication } from '@/components'
import { Switch, Route, BrowserRouter } from 'react-router-dom'

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Authentication>
        <AppHeader />
        <Switch>
          <Route path="/board" component={Board} />
          <Route path="/" component={Home} exact />
        </Switch>
      </Authentication>
    </BrowserRouter>
  )
}
