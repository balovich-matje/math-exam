import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { initTelegram } from './lib/telegram'
import Home from './screens/Home'
import Theory from './screens/Theory'
import Practice from './screens/Practice'
import Test from './screens/Test'

export default function App() {
  useEffect(() => {
    initTelegram()
    const dbg = document.getElementById('debug')
    if (dbg) dbg.style.display = 'none'
  }, [])

  return (
    <div className="min-h-screen bg-tg-bg text-tg-text">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/topic/:topicId/theory" element={<Theory />} />
        <Route path="/topic/:topicId/practice" element={<Practice />} />
        <Route path="/topic/:topicId/test" element={<Test />} />
      </Routes>
    </div>
  )
}
