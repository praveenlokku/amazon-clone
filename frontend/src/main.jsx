import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { StateProvider, initialState, reducer } from './StateProvider.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StateProvider initialState={initialState} reducer={reducer}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StateProvider>
  </React.StrictMode>,
)
