import React, { useEffect } from 'react'
import { Routes, Route, useParams } from 'react-router-dom'
import { initTelegram } from './lib/telegram'
import { getTopicById, isBlockTopic } from './data/topics'
import Home from './screens/Home'
import Theory from './screens/Theory'
import Practice from './screens/Practice'
import Test from './screens/Test'
import BlockTheory from './screens/BlockTheory'
import BlockPractice from './screens/BlockPractice'
import BlockTest from './screens/BlockTest'

function TheoryRouter() {
  const { topicId } = useParams<{ topicId: string }>()
  const topic = getTopicById(topicId!)
  return topic && isBlockTopic(topic) ? <BlockTheory /> : <Theory />
}
function PracticeRouter() {
  const { topicId } = useParams<{ topicId: string }>()
  const topic = getTopicById(topicId!)
  return topic && isBlockTopic(topic) ? <BlockPractice /> : <Practice />
}
function TestRouter() {
  const { topicId } = useParams<{ topicId: string }>()
  const topic = getTopicById(topicId!)
  return topic && isBlockTopic(topic) ? <BlockTest /> : <Test />
}

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
          <Route path="/topic/:topicId/theory" element={<TheoryRouter />} />
          <Route path="/topic/:topicId/practice" element={<PracticeRouter />} />
          <Route path="/topic/:topicId/test" element={<TestRouter />} />
        </Routes>
      </ErrorBoundary>
    </div>
  )
}
