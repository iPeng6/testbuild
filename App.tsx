import React from 'react'

import { Provider } from './src/store'
import Home from './src/Home'
const App = () => {
  return (
    <Provider>
      <Home />
    </Provider>
  )
}

export default App
