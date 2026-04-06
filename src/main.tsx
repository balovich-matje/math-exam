import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// Telegram puts auth data in the hash (e.g. #tgWebAppData=...).
// Strip it before HashRouter initializes so routing works correctly.
if (window.location.hash && !window.location.hash.startsWith('#/')) {
  window.location.hash = '/'
}

try {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <HashRouter>
        <App />
      </HashRouter>
    </React.StrictMode>,
  )
} catch (e) {
  document.body.innerText = String(e)
}
