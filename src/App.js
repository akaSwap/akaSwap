import React, { useEffect, useState } from 'react'
import { Switch, Route } from 'react-router-dom'
import AkaSwapContextProvider from './context/AkaSwapContext'
import { getInitialData } from './data/api'
import { Header } from './components/header'
import { Loading as Preloading } from './components/loading'
import { routes } from './routes'

import { track } from './Tracker'

const App = () => {
  const [loading, setLoading] = useState(true)

  // 1st time loading the site
  useEffect(() => {
    getInitialData().then(() => {
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <Preloading />
  }

  return (
    <AkaSwapContextProvider>
      <Header />
      <Switch>
        {routes.map(({ exact, path, component: Comp }) => (
          // <Route path={path} exact={exact} key={path} component={Comp} />
          <Route path={path} exact={exact} key={path} component={track(Comp)} />
        ))}
      </Switch>
    </AkaSwapContextProvider>
  )
}

export default App
