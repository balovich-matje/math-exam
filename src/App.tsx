import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { initTelegram } from './lib/telegram'
import Home from './screens/Home'
import Theory from './screens/Theory'
import Practice from './screens/Practice'
import Test from './screens/Test'

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: string | null }
> {
  state = { error: null as string | null }
  static getDerivedStateFromError(e: Error) {
    return { error: e.message + '\n' + e.stack }
  }
  render() {
    if (this.state.error)
      return <pre style={{ color: 'red', padding: 20, whiteSpace: 'pre-wrap' }}>{this.state.error}</pre>
    return this.props.children
  }
}

export default function App() {
  useEffect(() => {
    initTelegram()
  }, [])

  return (
    <div className="min-h-screen bg-tg-bg text-tg-text">
<ErrorBoundary>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/topic/:topicId/theory" element={<Theory />} />
          <Route path="/topic/:topicId/practice" element={<Practice />} />
          <Route path="/topic/:topicId/test" element={<Test />} />
        </Routes>
      </ErrorBoundary>
    </div>
  )
}
